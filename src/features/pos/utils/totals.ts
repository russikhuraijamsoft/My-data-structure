import type { OrderItem, DiscountType } from '../models/pos';

export const money = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function calculateTotals(items: OrderItem[], discount: { type: DiscountType; value: number } | null = null) {
  for (const item of items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.price) || item.price < 0) {
      throw new Error('Items must have a positive whole quantity and a valid price.');
    }
  }
  const subtotal = money(items.reduce((sum, item) => sum + money(item.price * item.quantity), 0));
  if (discount && (!Number.isFinite(discount.value) || discount.value < 0 || (discount.type === 'PERCENTAGE' && discount.value > 100))) {
    throw new Error('Enter a valid discount (0–100 for a percentage).');
  }
  const discountAmount = discount
    ? money(Math.min(subtotal, discount.type === 'PERCENTAGE' ? subtotal * discount.value / 100 : discount.value)) : 0;
  const discountedSubtotal = money(subtotal - discountAmount);
  // Preserve the existing configured 5% rate; confirm applicability before rollout.
  const cgst = money(discountedSubtotal * 0.025);
  const sgst = money(discountedSubtotal * 0.025);
  const tax = money(cgst + sgst);
  return { subtotal, discountAmount, cgst, sgst, tax, total: money(discountedSubtotal + tax) };
}
