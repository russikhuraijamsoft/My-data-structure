import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '../features/pos/models/pos';

const mocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
  updateInventorySyncStatus: vi.fn(),
  recordTransaction: vi.fn(),
  getRecipes: vi.fn(),
}));

vi.mock('../features/pos/services/posService', () => ({
  posService: {
    createOrder: mocks.createOrder,
    updateInventorySyncStatus: mocks.updateInventorySyncStatus,
  },
}));
vi.mock('../features/inventory/services/inventoryService', () => ({
  inventoryService: { recordTransaction: mocks.recordTransaction },
}));
vi.mock('../features/manufacturing/services/manufacturingService', () => ({
  manufacturingService: { getRecipes: mocks.getRecipes },
}));

import { usePosStore } from '../features/pos/store/posStore';

const trackedProduct: Product = {
  id: 'tea-can',
  name: 'Iced Tea',
  price: 50,
  category: 'Drinks',
  isAvailable: true,
  inventoryItemId: 'stock-tea-can',
  sizes: [{ item_id: 'tea-can', size: 'Standard', price: 50, active: true }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getRecipes.mockResolvedValue([]);
  mocks.recordTransaction.mockResolvedValue({ id: 'txn_1' });
  mocks.updateInventorySyncStatus.mockResolvedValue(undefined);
  mocks.createOrder.mockImplementation(async (data, id) => ({
    ...data,
    id,
    orderNumber: 'ORD-12345',
    createdAt: '2026-10-05T00:00:00.000Z',
  }));
  usePosStore.setState({
    products: [trackedProduct],
    cart: [],
    loading: false,
    error: null,
    lastCompletedOrder: null,
    ordersHistory: [],
    orderType: 'TAKEAWAY',
    tableNumber: '',
    customerName: '',
    customerPhone: '',
    orderNotes: '',
    discount: null,
  });
});

describe('POS checkout inventory recovery', () => {
  it('saves the paid order and records stock sync status without keeping the cart', async () => {
    usePosStore.getState().addToCart(trackedProduct, 'Standard', undefined, 2);
    const order = await usePosStore.getState().completeCheckout({
      method: 'CASH',
      details: { method: 'CASH', cashTendered: 200, changeDue: 0 },
    });

    expect(order.status).toBe('PAID');
    expect(order.inventorySyncStatus).toBe('SYNCED');
    expect(order.inventoryPlan).toHaveLength(1);
    expect(mocks.createOrder).toHaveBeenCalledOnce();
    expect(mocks.recordTransaction).toHaveBeenCalledOnce();
    expect(mocks.recordTransaction.mock.calls[0][0]).toMatchObject({ itemId: 'stock-tea-can', quantity: 2, type: 'STOCK_OUT' });
    expect(mocks.recordTransaction.mock.calls[0][1]).toContain(order.id);
    expect(usePosStore.getState().cart).toEqual([]);
    expect(usePosStore.getState().lastCompletedOrder?.inventorySyncStatus).toBe('SYNCED');
  });

  it('keeps a committed sale pending after a stock error and allows an idempotent retry', async () => {
    usePosStore.getState().addToCart(trackedProduct, 'Standard', undefined, 1);
    mocks.recordTransaction.mockRejectedValueOnce(new Error('network unavailable'));
    const order = await usePosStore.getState().completeCheckout({
      method: 'CASH',
      details: { method: 'CASH', cashTendered: 100, changeDue: 0 },
    });

    expect(order.status).toBe('PAID');
    expect(order.inventorySyncStatus).toBe('PENDING');
    expect(order.inventoryPlan).toHaveLength(1);
    expect(usePosStore.getState().cart).toEqual([]);
    expect(mocks.updateInventorySyncStatus).toHaveBeenLastCalledWith(order.id, 'PENDING', 'network unavailable');

    mocks.recordTransaction.mockResolvedValue({ id: 'txn_1' });
    const retried = await usePosStore.getState().retryInventorySync(order);
    expect(retried.inventorySyncStatus).toBe('SYNCED');
    expect(mocks.recordTransaction).toHaveBeenCalledTimes(2);
    expect(mocks.recordTransaction.mock.calls[0][1]).toBe(mocks.recordTransaction.mock.calls[1][1]);
    expect(usePosStore.getState().lastCompletedOrder?.inventorySyncStatus).toBe('SYNCED');
  });

  it('does not claim inventory is synced when a menu item has no stock or recipe mapping', async () => {
    const untrackedProduct: Product = {
      ...trackedProduct,
      inventoryItemId: undefined,
    };
    usePosStore.setState({ products: [untrackedProduct] });
    usePosStore.getState().addToCart(untrackedProduct, 'Standard');
    const order = await usePosStore.getState().completeCheckout({
      method: 'CASH',
      details: { method: 'CASH', cashTendered: 100, changeDue: 0 },
    });

    expect(order.status).toBe('PAID');
    expect(order.inventorySyncStatus).toBe('NOT_CONFIGURED');
    expect(order.inventorySyncError).toContain('link an inventory item or recipe');
    expect(mocks.recordTransaction).not.toHaveBeenCalled();
    expect(usePosStore.getState().cart).toEqual([]);
  });
});
