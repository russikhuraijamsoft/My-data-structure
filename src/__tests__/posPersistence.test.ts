import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ setDoc: vi.fn(), getDocs: vi.fn(), updateDoc: vi.fn(), commit: vi.fn(), batchSet: vi.fn() }));
vi.mock('../core/firebase/firebaseConfig', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  ...mocks,
  writeBatch: () => ({ set: mocks.batchSet, commit: mocks.commit }),
  doc: (...parts: unknown[]) => parts,
  collection: (...parts: unknown[]) => parts,
  query: (value: unknown) => value,
}));
import { posService } from '../features/pos/services/posService';
import { usePosStore } from '../features/pos/store/posStore';
import type { Order } from '../features/pos/models/pos';

const order: Omit<Order, 'id' | 'createdAt' | 'orderNumber'> = {
  items: [{ productId: 'rice', name: 'Rice', quantity: 1, price: 100, notes: undefined }],
  subtotal: 100, tax: 5, total: 105, status: 'PAID', customerName: undefined,
};

beforeEach(() => { vi.resetAllMocks(); usePosStore.setState({ loading: false, error: null }); });
describe('Order persistence', () => {
  it('propagates failed saves instead of issuing a successful receipt', async () => {
    mocks.commit.mockRejectedValue(new Error('Permission denied'));
    await expect(posService.createOrder(order)).rejects.toThrow('Permission denied');
  });
  it('removes undefined optional fields before sending to Firestore', async () => {
    mocks.commit.mockResolvedValue(undefined);
    await posService.createOrder(order);
    const saved = mocks.batchSet.mock.calls[0][1];
    expect(saved).not.toHaveProperty('customerName');
    expect(saved.items[0]).not.toHaveProperty('notes');
    expect(saved.total).toBe(105);
    expect(mocks.batchSet).toHaveBeenCalledTimes(2);
    expect(mocks.batchSet.mock.calls[1][1].orderId).toBe(saved.id);
    expect(mocks.commit).toHaveBeenCalledTimes(1);
  });
  it('does not seed or overwrite the menu during a read', async () => {
    mocks.getDocs.mockResolvedValue({ empty: false, docs: [{ id: 'rice', data: () => ({ name: 'Custom Rice', price: 150 }) }] });
    const products = await posService.getProducts();
    expect(products[0].price).toBe(150);
    expect(mocks.setDoc).not.toHaveBeenCalled();
  });
  it('keeps the cart and shows an error when checkout cannot save', async () => {
    mocks.commit.mockRejectedValue(new Error('Permission denied'));
    usePosStore.setState({ cart: order.items, lastCompletedOrder: null, discount: null });
    await expect(usePosStore.getState().completeCheckout({ method: 'CASH', details: { method: 'CASH', cashTendered: 105 } })).rejects.toThrow();
    expect(usePosStore.getState().cart).toHaveLength(1);
    expect(usePosStore.getState().lastCompletedOrder).toBeNull();
    expect(usePosStore.getState().error).toBe('Permission denied');
  });
});

it('blocks a second checkout while the first batch is pending', async () => {
  let resolve!: () => void;
  mocks.commit.mockImplementation(() => new Promise<void>(done => { resolve = done; }));
  usePosStore.setState({ cart: order.items, lastCompletedOrder: null, discount: null, orderType: 'TAKEAWAY' });
  const payment = { method: 'CASH' as const, details: { method: 'CASH' as const, cashTendered: 105 } };
  const first = usePosStore.getState().completeCheckout(payment);
  await expect(usePosStore.getState().completeCheckout(payment)).rejects.toThrow('already in progress');
  resolve();
  await first;
  expect(mocks.commit).toHaveBeenCalledTimes(1);
});
