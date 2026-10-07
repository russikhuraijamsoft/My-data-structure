import { describe, expect, it } from 'vitest';
import { calculateTotals } from '../features/pos/utils/totals';
import { summarizeSales } from '../features/reports/utils/sales';
import type { Order } from '../features/pos/models/pos';
const item = { productId: 'rice', name: 'Rice', price: 45, quantity: 1 };
const order = (createdAt: string, status: Order['status'] = 'PAID'): Order => ({ id: createdAt, orderNumber: 'test', createdAt, status, items: [item], subtotal: 100, tax: 5, total: 105 });
describe('Counter totals', () => {
  it('rounds both tax components so the receipt adds up', () => {
    const totals = calculateTotals([item]);
    expect(totals).toEqual({ subtotal: 45, discountAmount: 0, cgst: 1.13, sgst: 1.13, tax: 2.26, total: 47.26 });
  });
  it('applies discount before tax', () => {
    expect(calculateTotals([{ ...item, price: 100 }], { type: 'PERCENTAGE', value: 10 }).total).toBe(94.5);
  });
  it.each([NaN, -1, 101])('rejects invalid percentage %s', value => {
    expect(() => calculateTotals([item], { type: 'PERCENTAGE', value })).toThrow();
  });
  it.each([0, -1, 1.5, Infinity])('rejects invalid quantity %s', quantity => {
    expect(() => calculateTotals([{ ...item, quantity }])).toThrow();
  });
});
describe('Saved order reports', () => {
  it('uses the India midnight boundary and excludes cancelled/refunded orders', () => {
    const report = summarizeSales([
      order('2026-10-03T18:29:59Z'), order('2026-10-03T18:30:00Z'),
      order('2026-10-04T01:00:00Z', 'CANCELLED'), order('2026-10-04T02:00:00Z', 'REFUNDED')
    ], new Date('2026-10-04T12:00:00Z'));
    expect(report.today.totalOrders).toBe(1);
    expect(report.today.grossRevenue).toBe(105);
    expect(report.today.netRevenue).toBe(100);
    expect(report.weeklySales).toBe(210);
  });
  it('shows zero sales for a fresh restaurant', () => {
    const report = summarizeSales([], new Date('2026-10-04T12:00:00Z'));
    expect(report.today.totalOrders).toBe(0);
    expect(report.monthlySales).toBe(0);
    expect(report.salesTrend).toHaveLength(7);
  });
});
