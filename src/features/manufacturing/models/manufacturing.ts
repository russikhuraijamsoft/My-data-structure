export type RecipeStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface RecipeIngredient {
  id: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  alternativeItemIds?: string[];
  costPerUnit: number;
  wastagePercentage?: number;
  yieldPercentage?: number;
}

export interface RecipeInstruction {
  step: number;
  description: string;
  timeMinutes?: number;
}

export interface RecipeCosting {
  ingredientsCost: number;
  gasCost: number;
  electricityCost: number;
  waterCost: number;
  labourCost: number;
  packagingCost: number;
  overheadCost: number;
  totalCost: number;
  sellingPrice: number;
  costPerPortion: number;
  grossProfit: number;
  marginPercentage: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  targetInventoryItemId?: string;
  version: string;
  status: RecipeStatus;
  yieldQuantity: number;
  yieldUnit: string;
  servingSize: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  shelfLifeDays: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  costing: RecipeCosting;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ProductionOrder {
  id: string;
  recipeId: string;
  recipeName: string;
  batchNumber: string;
  plannedQuantity: number;
  actualQuantity?: number;
  unit: string;
  plannedDate: string;
  status: ProductionStatus;
  wasteQuantity?: number;
  wasteReason?: string;
  qcStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  qcNotes?: string;
  totalCost?: number;
  unitCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BillOfMaterial {
  id: string;
  recipeId: string;
  version: string;
  effectiveDate: string;
  endDate?: string;
  yieldPercentage: number;
  wastePercentage: number;
  isActive: boolean;
}
