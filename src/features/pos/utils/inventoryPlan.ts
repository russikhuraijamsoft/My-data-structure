import type { Recipe } from '../../manufacturing/models/manufacturing';
import type { InventoryDeductionPlanItem, OrderItem, Product } from '../models/pos';

export interface InventoryPlanResult {
  plan: InventoryDeductionPlanItem[];
  unresolved: string[];
}

function makeKey(parts: string[]): string {
  return `pos-${encodeURIComponent(JSON.stringify(parts))}`;
}

export function buildInventoryPlan(
  orderId: string,
  items: OrderItem[],
  products: Product[],
  recipes: Recipe[],
): InventoryPlanResult {
  const productById = new Map(products.map(product => [product.id, product]));
  const recipeById = new Map(recipes.map(recipe => [recipe.id, recipe]));
  const plan: InventoryDeductionPlanItem[] = [];
  const unresolved = new Set<string>();

  const addProductMovements = (
    product: Product | OrderItem,
    quantity: number,
    sourceKey: string,
    displayName: string,
  ) => {
    if (product.inventoryItemId) {
      plan.push({
        idempotencyKey: makeKey([orderId, sourceKey, product.inventoryItemId, 'unit']),
        itemId: product.inventoryItemId,
        quantity,
        referenceId: orderId,
        notes: `POS sale ${orderId}: ${displayName}`,
        unitCost: product.unitCost || ('costPrice' in product ? product.costPrice : 0) || 0,
        totalCost: quantity * (product.unitCost || ('costPrice' in product ? product.costPrice : 0) || 0),
        performedBy: 'System',
      });
      return;
    }

    const size = 'size' in product ? product.size : undefined;
    const isMultiSize = Boolean('sizes' in product && product.sizes.length > 1);
    const sizeRecipeId = size ? product.sizeRecipeIds?.[size] : undefined;
    const recipeId = sizeRecipeId || (!isMultiSize ? product.recipeId : undefined);
    if (!recipeId) {
      unresolved.add(`${displayName}${isMultiSize ? ` (${size || 'size not set'})` : ''}: link an inventory item or recipe${isMultiSize ? ' for this size' : ''}.`);
      return;
    }

    const recipe = recipeById.get(recipeId);
    if (!recipe) {
      unresolved.add(`${displayName}: recipe “${recipeId}” was not found.`);
      return;
    }
    if (!Number.isFinite(recipe.yieldQuantity) || recipe.yieldQuantity <= 0) {
      unresolved.add(`${displayName}: recipe “${recipe.name}” has an invalid yield.`);
      return;
    }

    const servings = quantity / recipe.yieldQuantity;
    recipe.ingredients.forEach(ingredient => {
      if (!ingredient.inventoryItemId) {
        if (!ingredient.isOptional) unresolved.add(`${displayName}: ingredient “${ingredient.itemName}” has no inventory item linked.`);
        return;
      }
      const used = ingredient.quantity * servings;
      if (!Number.isFinite(used) || used <= 0) {
        unresolved.add(`${displayName}: ingredient “${ingredient.itemName}” has an invalid quantity.`);
        return;
      }
      plan.push({
        idempotencyKey: makeKey([orderId, sourceKey, recipe.id, ingredient.id, ingredient.inventoryItemId]),
        itemId: ingredient.inventoryItemId,
        quantity: used,
        referenceId: orderId,
        notes: `POS sale ${orderId}: ${displayName} → ${ingredient.itemName}`,
        unitCost: ingredient.costPerUnit || 0,
        totalCost: used * (ingredient.costPerUnit || 0),
        performedBy: 'System',
      });
    });
  };

  items.forEach((item, itemIndex) => {
    const cartKey = item.cartItemId || item.id || `${item.productId}_${itemIndex}`;
    const product = productById.get(item.productId);
    const orderItem: OrderItem = {
      ...product,
      ...item,
      recipeId: item.recipeId || product?.recipeId,
      inventoryItemId: item.inventoryItemId || product?.inventoryItemId,
      sizeRecipeIds: item.sizeRecipeIds || product?.sizeRecipeIds,
    };

    if (!item.isCombo || !item.comboComponents?.length) {
      addProductMovements(orderItem, item.quantity, cartKey, item.name);
      return;
    }

    if (orderItem.recipeId) {
      addProductMovements(orderItem, item.quantity, `${cartKey}_combo_recipe`, item.name);
      return;
    }

    item.comboComponents.forEach((component, componentIndex) => {
      const selected = component.isChoice
        ? component.options?.find(option => option.name === item.selectedOption)
        : component;
      if (!selected) {
        unresolved.add(`${item.name}: choose a valid option for “${component.name}”.`);
        return;
      }
      const componentProduct = productById.get(selected.itemId);
      if (!componentProduct) {
        unresolved.add(`${item.name}: component “${selected.name}” has no menu/inventory mapping.`);
        return;
      }
      const componentItem: OrderItem = {
        ...componentProduct,
        productId: componentProduct.id,
        name: selected.name,
        size: selected.size || 'Standard',
        quantity: item.quantity * component.quantity,
        recipeId: componentProduct.sizeRecipeIds?.[selected.size || 'Standard'] || componentProduct.recipeId,
        inventoryItemId: componentProduct.inventoryItemId,
        sizeRecipeIds: componentProduct.sizeRecipeIds,
      };
      addProductMovements(
        componentItem,
        componentItem.quantity,
        `${cartKey}_component_${componentIndex}_${selected.itemId}`,
        `${item.name} / ${selected.name}`,
      );
    });
  });

  return { plan, unresolved: [...unresolved] };
}
