import { InventoryItem } from '../../inventory/models/inventory';
import { Recipe, RecipeIngredient, RecipeCosting } from '../models/manufacturing';

export const COST_ASSUMPTIONS = {
  lpgCylinderPrice: 1800.00,
  lpgCylinderWeight: 19.00,
  burnerConsumptionRate: 0.40,
  gasCostPerKg: 94.7368,
  gasCostPerMinute: 0.6316,
  electricityRate: 8.00,
  waterCostPerDish: 0.50,
  waterCostPerBeverage: 0.30,
  flatElectricityCostPerDish: 1.00,
  vegSeasoningAllowance: 5.00,

  chicken: 250.00,
  pork: 420.00,
  egg: 6.00,
  noodles: 90.00,
  rice: 55.00,
  macaroni: 85.00,
  momoDough: 40.00,
  teaLeaves: 250.00,
  coffeePowder: 900.00,
  milk: 60.00,
  cookingOil: 160.00,
  sugarIceMisc: 2.00,
  fruitCrush: 180.00,
};

export function calculateIngredientCost(
  ingredient: { itemName: string; quantity: number; unit: string; costPerUnit?: number },
  inventoryItems?: InventoryItem[]
): number {
  const name = ingredient.itemName.toLowerCase();
  const qty = ingredient.quantity;

  if (ingredient.costPerUnit !== undefined && ingredient.costPerUnit > 0) {
    return ingredient.costPerUnit * qty;
  }

  let cost = 0;
  if (name.includes('chicken')) cost = (COST_ASSUMPTIONS.chicken / 1000) * qty;
  else if (name.includes('pork')) cost = (COST_ASSUMPTIONS.pork / 1000) * qty;
  else if (name.includes('egg')) cost = COST_ASSUMPTIONS.egg * qty;
  else if (name.includes('noodle')) cost = (COST_ASSUMPTIONS.noodles / 1000) * qty;
  else if (name.includes('rice')) cost = (COST_ASSUMPTIONS.rice / 1000) * qty;
  else if (name.includes('macaroni')) cost = (COST_ASSUMPTIONS.macaroni / 1000) * qty;
  else if (name.includes('momo dough')) cost = (COST_ASSUMPTIONS.momoDough / 1000) * qty;
  else if (name.includes('oil')) cost = (COST_ASSUMPTIONS.cookingOil / 1000) * qty;
  else if (name.includes('milk')) cost = (COST_ASSUMPTIONS.milk / 1000) * qty;
  else if (name.includes('tea')) cost = (COST_ASSUMPTIONS.teaLeaves / 1000) * qty;
  else if (name.includes('coffee')) cost = (COST_ASSUMPTIONS.coffeePowder / 1000) * qty;
  else if (name.includes('crush')) cost = (COST_ASSUMPTIONS.fruitCrush / 700) * qty;

  return cost;
}

export function calculateRecipeCosting(
  ingredients: RecipeIngredient[],
  cookTimeMinutes: number,
  prepTimeMinutes: number,
  sellingPrice: number,
  yieldQuantity: number = 1,
  inventoryItems?: InventoryItem[]
): RecipeCosting {
  let ingredientsCost = 0;
  ingredients.forEach(ing => {
    let ingCost = calculateIngredientCost(ing, inventoryItems);
    if (ing.wastagePercentage) {
      ingCost = ingCost / (1 - (ing.wastagePercentage / 100));
    }
    if (ing.yieldPercentage && ing.yieldPercentage > 0) {
      ingCost = ingCost / (ing.yieldPercentage / 100);
    }
    ingredientsCost += ingCost;
  });

  ingredientsCost += COST_ASSUMPTIONS.vegSeasoningAllowance;

  const gasCost = cookTimeMinutes * COST_ASSUMPTIONS.gasCostPerMinute;
  const electricityCost = COST_ASSUMPTIONS.flatElectricityCostPerDish;
  const waterCost = COST_ASSUMPTIONS.waterCostPerDish;
  const labourCost = (prepTimeMinutes + cookTimeMinutes) * 1.5;
  const packagingCost = 5.0;
  const overheadCost = 2.0;

  const totalCost = ingredientsCost + gasCost + electricityCost + waterCost + labourCost + packagingCost + overheadCost;
  const grossProfit = sellingPrice - totalCost;
  const marginPercentage = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const costPerPortion = yieldQuantity > 0 ? totalCost / yieldQuantity : totalCost;

  return {
    ingredientsCost,
    gasCost,
    electricityCost,
    waterCost,
    labourCost,
    packagingCost,
    overheadCost,
    totalCost,
    sellingPrice,
    costPerPortion,
    grossProfit,
    marginPercentage
  };
}

export function calculateBatchCost(
  recipe: Recipe,
  plannedQuantity: number
): { totalBatchCost: number; unitCost: number } {
  const baseYield = recipe.yieldQuantity || 1;
  const multiplier = plannedQuantity / baseYield;
  const baseTotalCost = recipe.costing.totalCost;
  const totalBatchCost = baseTotalCost * multiplier;
  const unitCost = totalBatchCost / plannedQuantity;
  return { totalBatchCost, unitCost };
}

export function calculatePortionCost(recipe: Recipe): number {
  if (recipe.yieldQuantity <= 0) return recipe.costing.totalCost;
  return recipe.costing.totalCost / recipe.yieldQuantity;
}

export function calculateSellingPriceRecommendation(totalCost: number, targetFoodCostPercent: number = 30): number {
  if (targetFoodCostPercent <= 0) return totalCost;
  return totalCost / (targetFoodCostPercent / 100);
}

export function calculateCostVariance(plannedCost: number, actualCost: number): { variance: number; variancePercentage: number; isFavorable: boolean } {
  const variance = plannedCost - actualCost;
  const variancePercentage = plannedCost > 0 ? (variance / plannedCost) * 100 : 0;
  return {
    variance,
    variancePercentage,
    isFavorable: variance >= 0
  };
}

export function calculateProfitAnalysis(
  unitsSold: number,
  sellingPrice: number,
  unitCost: number
) {
  const totalRevenue = unitsSold * sellingPrice;
  const totalCost = unitsSold * unitCost;
  const totalGrossProfit = totalRevenue - totalCost;
  const marginPercent = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;
  return {
    totalRevenue,
    totalCost,
    totalGrossProfit,
    marginPercent
  };
}
