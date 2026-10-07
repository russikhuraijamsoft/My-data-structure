import { beforeEach, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ runTransaction: vi.fn(), update: vi.fn(), get: vi.fn() }));
vi.mock('../core/firebase/firebaseConfig', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  runTransaction: mock.runTransaction, doc: (...args: unknown[]) => args,
}));
import { kdsService } from '../features/kds/services/kdsService';
import { useKdsStore } from '../features/kds/store/kdsStore';
beforeEach(() => {
  vi.resetAllMocks();
  mock.runTransaction.mockImplementation(async (_db, callback) => callback({ get: mock.get, update: mock.update }));
});
it('marks all items ready when the whole kitchen ticket is ready', async () => {
  mock.get.mockResolvedValue({ exists: () => true, data: () => ({ status: 'PREPARING', items: [{ id: 'i1', status: 'PENDING' }] }) });
  await kdsService.updateTicketStatus('t1', 'READY');
  expect(mock.update.mock.calls[0][1].items[0].status).toBe('READY');
});
it('rejects a stale attempt to reopen a served ticket', async () => {
  mock.get.mockResolvedValue({ exists: () => true, data: () => ({ status: 'SERVED', items: [] }) });
  await expect(kdsService.updateTicketStatus('t1', 'PREPARING')).rejects.toThrow('ticket changed');
  expect(mock.update).not.toHaveBeenCalled();
});
it('surfaces failed writes without changing the displayed ticket state', async () => {
  mock.runTransaction.mockRejectedValue(new Error('Permission denied'));
  useKdsStore.setState({ tickets: [{ id: 't1', status: 'NEW' } as any], error: null });
  await useKdsStore.getState().updateTicketStatus('t1', 'ACCEPTED');
  expect(useKdsStore.getState().tickets[0].status).toBe('NEW');
  expect(useKdsStore.getState().error).toBe('Permission denied');
});
