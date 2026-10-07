import { describe, expect, it } from 'vitest';
import type { Recipe } from '../features/manufacturing/models/manufacturing';
import type { OrderItem, Product } from '../features/pos/models/pos';
import { buildInventoryPlan } from '../features/pos/utils/inventoryPlan';

const recipe: Recipe = {
  id: 'recipe-noodles-medium',
  name: 'Chicken Chowmein Medium',
  description: '',
  categoryId: 'chowmein',
  version: '1',
  status: 'ACTIVE',
  yieldQuantity: 2,
  yieldUnit: 'portions',
  servingSize: '1 portion',
  prepTimeMinutes: 1,
  cookTimeMinutes: 1,
  shelfLifeDays: 1,
  ingredients: [{ id: 'ingredient-noodles', inventoryItemId: 'stock-noodles', itemName: 'Noodles', quantity: 1.5, unit: 'kg', isOptional: false, costPerUnit: 40 }],
  instructions: [],
  costing: { ingredientsCost: 60, gasCost: 0, electricityCost: 0, waterCost: 0, labourCost: 0, packagingCost: 0, overheadCost: 0, totalCost: 60, sellingPrice: 120, costPerPortion: 60, grossProfit: 60, marginPercentage: 50 },
  createdAt: '',
  updatedAt: '',
};

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-noodles',
  name: 'Chicken Chowmein',
  price: 70,
  category: 'Chowmein',
  isAvailable: true,
  sizes: [{ item_id: 'product-noodles', size: 'Medium', price: 70, active: true }],
  sizeRecipeIds: { Medium: recipe.id },
  ...overrides,
});

const cartItem = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  id: 'cart-line-1',
  cartItemId: 'product-noodles_Medium',
  productId: 'product-noodles',
  name: 'Chicken Chowmein',
  price: 70,
  quantity: 3,
  size: 'Medium',
  ...overrides,
});

describe('POS inventory plan builder', () => {
  it('scales recipe ingredients by sold quantity and recipe yield', () => {
    const result = buildInventoryPlan('order-a', [cartItem()], [product()], [recipe]);
    expect(result.unresolved).toEqual([]);
    expect(result.plan).toHaveLength(1);
    expect(result.plan[0].itemId).toBe('stock-noodles');
    expect(result.plan[0].quantity).toBe(2.25);
    expect(result.plan[0].referenceId).toBe('order-a');
    expect(result.plan[0].idempotencyKey).toContain('order-a');
  });

  it('requires size-specific recipes for multi-size menu items', () => {
    const item = cartItem({ size: 'Large' });
    const multiSize = product({
      recipeId: recipe.id,
      sizeRecipeIds: {},
      sizes: ['Small', 'Medium', 'Large'].map(size => ({ item_id: 'product-noodles', size: size as 'Small' | 'Medium' | 'Large', price: 70, active: true })),
    });
    const result = buildInventoryPlan('order-b', [item], [multiSize], [recipe]);
    expect(result.plan).toEqual([]);
    expect(result.unresolved.join(' ')).toContain('recipe for this size');
  });

  it('expands combo components through their product recipes and honors the chosen option', () => {
    const base = product({ id: 'product-rice', name: 'Chicken Fried Rice' });
    const chilly = product({ id: 'product-chilly', name: 'Chilly Chicken', sizes: [{ item_id: 'product-chilly', size: 'Standard', price: 50, active: true }], sizeRecipeIds: { Standard: 'recipe-chilly' } });
    const chillyRecipe = { ...recipe, id: 'recipe-chilly', ingredients: [{ ...recipe.ingredients[0], id: 'chicken', inventoryItemId: 'stock-chicken', itemName: 'Chicken', quantity: 0.2 }] };
    const combo: OrderItem = {
      ...cartItem({ productId: 'combo-signature', name: 'Signature Combo', quantity: 2, isCombo: true, selectedOption: 'Chicken Fried Rice' }),
      comboComponents: [
        {
          itemId: 'choice-base', name: 'Choose a base', quantity: 1, isChoice: true,
          options: [
            { itemId: 'product-noodles', name: 'Chicken Chowmein', size: 'Medium' },
            { itemId: 'product-rice', name: 'Chicken Fried Rice', size: 'Medium' },
          ],
        },
        { itemId: 'product-chilly', name: 'Chilly Chicken', size: 'Standard', quantity: 1 },
      ],
    };
    const result = buildInventoryPlan('order-c', [combo], [product(), base, chilly], [recipe, chillyRecipe]);
    expect(result.unresolved).toEqual([]);
    expect(result.plan).toHaveLength(2);
    expect(result.plan.map(entry => entry.itemId).sort()).toEqual(['stock-chicken', 'stock-noodles']);
    expect(result.plan.find(entry => entry.itemId === 'stock-noodles')?.quantity).toBe(1.5);
    expect(result.plan.find(entry => entry.itemId === 'stock-chicken')?.quantity).toBe(0.2);
  });
});
