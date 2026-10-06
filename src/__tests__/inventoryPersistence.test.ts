import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  items: new Map<string, Record<string, unknown>>(),
  movements: new Map<string, Record<string, unknown>>(),
  shouldFail: false,
}));

vi.mock('../core/firebase/firebaseConfig', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  doc: (_db: unknown, collectionName: string, id: string) => ({ collectionName, id }),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  runTransaction: async (_db: unknown, callback: (transaction: any) => Promise<unknown>) => {
    if (state.shouldFail) throw new Error('network unavailable');
    const writes: Array<{ kind: 'update' | 'set'; ref: { collectionName: string; id: string }; data: Record<string, unknown> }> = [];
    const transaction = {
      get: async (ref: { collectionName: string; id: string }) => {
        const source = ref.collectionName === 'inventory_items' ? state.items : state.movements;
        const value = source.get(ref.id);
        return { exists: () => Boolean(value), data: () => value };
      },
      update: (ref: { collectionName: string; id: string }, data: Record<string, unknown>) => writes.push({ kind: 'update', ref, data }),
      set: (ref: { collectionName: string; id: string }, data: Record<string, unknown>) => writes.push({ kind: 'set', ref, data }),
    };
    const result = await callback(transaction);
    for (const write of writes) {
      const target = write.ref.collectionName === 'inventory_items' ? state.items : state.movements;
      const previous = target.get(write.ref.id) || {};
      target.set(write.ref.id, write.kind === 'update' ? { ...previous, ...write.data } : write.data);
    }
    return result;
  },
}));

import { inventoryService } from '../features/inventory/services/inventoryService';

const movement = (quantity = 2) => ({
  itemId: 'flour',
  type: 'STOCK_OUT' as const,
  quantity,
  referenceId: 'order_1',
  notes: 'POS sale',
  unitCost: 10,
  totalCost: quantity * 10,
  performedBy: 'System',
});

beforeEach(() => {
  state.items.clear();
  state.movements.clear();
  state.shouldFail = false;
});

describe('POS inventory ledger', () => {
  it('records a stock deduction and its movement atomically', async () => {
    state.items.set('flour', { currentStock: 5 });
    const saved = await inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour');
    expect(state.items.get('flour')?.currentStock).toBe(3);
    expect(state.movements.get(saved.id)?.quantity).toBe(2);
    expect(saved.id).toContain('sale-1-line-1-flour');
  });

  it('replaying the same idempotency key does not deduct stock twice', async () => {
    state.items.set('flour', { currentStock: 5 });
    const first = await inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour');
    const replay = await inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour');
    expect(state.items.get('flour')?.currentStock).toBe(3);
    expect(state.movements.size).toBe(1);
    expect(replay.id).toBe(first.id);
  });

  it('rejects reusing a key for a different movement', async () => {
    state.items.set('flour', { currentStock: 5 });
    await inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour');
    await expect(inventoryService.recordTransaction(movement(3), 'sale-1-line-1-flour'))
      .rejects.toThrow('reused for a different stock movement');
    expect(state.items.get('flour')?.currentStock).toBe(3);
  });

  it('fails visibly for missing inventory records instead of logging phantom movements', async () => {
    await expect(inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour'))
      .rejects.toThrow('does not exist');
    expect(state.movements.size).toBe(0);
  });

  it('preserves stock shortages as a negative balance instead of silently clamping the deduction', async () => {
    state.items.set('flour', { currentStock: 1 });
    await inventoryService.recordTransaction(movement(3), 'sale-1-line-1-flour');
    expect(state.items.get('flour')?.currentStock).toBe(-2);
  });

  it('propagates Firestore failures', async () => {
    state.items.set('flour', { currentStock: 5 });
    state.shouldFail = true;
    await expect(inventoryService.recordTransaction(movement(), 'sale-1-line-1-flour'))
      .rejects.toThrow('network unavailable');
  });
});
