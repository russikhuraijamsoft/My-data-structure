export type ItemSize = 'Small' | 'Medium' | 'Large' | 'Standard';

export interface MenuItemSize {
  id?: string;
  item_id: string;
  size: ItemSize;
  price: number;
  cost_price?: number;
  active: boolean;
}

export interface ComboComponentChoice {
  itemId: string;
  name: string;
  size?: ItemSize;
}

export interface ComboComponent {
  itemId: string;
  name: string;
  size?: ItemSize;
  quantity: number;
  isChoice?: boolean;
  options?: ComboComponentChoice[];
}

export interface KioskAddon {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
  inventoryItemId?: string;
  sizeRecipeIds?: Partial<Record<ItemSize, string>>;
  isAvailable: boolean;
  active?: boolean;
  recipeId?: string;
  unitCost?: number;
  costPrice?: number;
  sizes: MenuItemSize[];
  isCombo?: boolean;
  comboDescription?: string;
  comboComponents?: ComboComponent[];
  isSubItem?: boolean;
  // Kiosk & Fast Food specials
  originalPrice?: number;
  savingsAmount?: number;
  isVeg?: boolean;
  calories?: string;
  badge?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Peri Peri';
  availableAddons?: KioskAddon[];
  drinkOptions?: string[];
}

export interface OrderItem {
  id?: string;
  cartItemId?: string;
  productId: string;
  name: string;
  size?: ItemSize;
  selectedOption?: string;
  price: number;
  quantity: number;
  notes?: string;
  unitCost?: number;
  recipeId?: string;
  inventoryItemId?: string;
  sizeRecipeIds?: Partial<Record<ItemSize, string>>;
  isCombo?: boolean;
  comboComponents?: ComboComponent[];
  isVeg?: boolean;
  selectedAddons?: KioskAddon[];
  selectedDrink?: string;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'SPLIT';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface PaymentDetails {
  method: PaymentMethod;
  cashTendered?: number;
  changeDue?: number;
  upiReference?: string;
  cardLast4?: string;
  cardType?: string;
  splitBreakdown?: {
    cash: number;
    upi?: number;
    card?: number;
  };
}

export interface InventoryDeductionPlanItem {
  idempotencyKey: string;
  itemId: string;
  quantity: number;
  referenceId: string;
  notes: string;
  unitCost: number;
  totalCost: number;
  performedBy: string;
}

export type InventorySyncStatus = 'NOT_CONFIGURED' | 'PENDING' | 'SYNCED';

export interface Order {
  id: string;
  orderNumber: string;
  orderType?: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountType?: DiscountType;
  discountValue?: number;
  discountReason?: string;
  tax: number;
  cgst?: number;
  sgst?: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentDetails?: PaymentDetails;
  orderNotes?: string;
  cashierName?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  voidReason?: string;
  createdAt: string;
  totalCost?: number;
  inventorySyncStatus?: InventorySyncStatus;
  inventorySyncError?: string;
  inventoryPlan?: InventoryDeductionPlanItem[];
}

export interface ParkedOrder {
  id: string;
  label: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  orderNotes?: string;
  parkedAt: string;
}
