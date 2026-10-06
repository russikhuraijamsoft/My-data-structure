import { create } from 'zustand';
import { 
  Product, 
  OrderItem, 
  Order, 
  ItemSize, 
  OrderType, 
  PaymentMethod, 
  PaymentDetails, 
  DiscountType,
  ParkedOrder,
  InventorySyncStatus,
} from '../models/pos';
import { posService } from '../services/posService';
import { inventoryService } from '../../inventory/services/inventoryService';
import { manufacturingService } from '../../manufacturing/services/manufacturingService';
import { calculateTotals } from '../utils/totals';
import { buildInventoryPlan } from '../utils/inventoryPlan';

interface PosState {
  products: Product[];
  cart: OrderItem[];
  loading: boolean;
  error: string | null;
  lastCompletedOrder: Order | null;

  orderType: OrderType;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  orderNotes: string;
  discount: { type: DiscountType; value: number; reason?: string } | null;

  parkedOrders: ParkedOrder[];
  ordersHistory: Order[];
  inventoryAttentionOrders: Order[];
  inventoryAttentionError: string | null;
  ordersLoading: boolean;

  loadProducts: () => Promise<void>;
  setOrderType: (orderType: OrderType) => void;
  setTableNumber: (tableNumber: string) => void;
  setCustomerName: (customerName: string) => void;
  setCustomerPhone: (customerPhone: string) => void;
  setOrderNotes: (notes: string) => void;
  applyDiscount: (type: DiscountType, value: number, reason?: string) => void;
  removeDiscount: () => void;
  addToCart: (
    product: Product, 
    sizeOrQuantity?: ItemSize | number, 
    selectedOption?: string, 
    quantity?: number,
    notes?: string
  ) => void;
  updateQuantity: (cartItemIdOrProductId: string, quantity: number) => void;
  updateItemNotes: (cartItemIdOrProductId: string, notes: string) => void;
  removeFromCart: (cartItemIdOrProductId: string) => void;
  clearCart: () => void;
  
  parkCurrentOrder: (customLabel?: string) => void;
  recallParkedOrder: (parkedOrderId: string) => void;
  deleteParkedOrder: (parkedOrderId: string) => void;
  
  completeCheckout: (payment: { method: PaymentMethod; details: PaymentDetails }) => Promise<Order>;
  retryInventorySync: (order: Order) => Promise<Order>;
  checkout: () => Promise<Order | void>;
  clearCompletedOrder: () => void;
  
  loadOrdersHistory: () => Promise<void>;
  loadInventoryAttentionOrders: () => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
}

async function applyInventoryPlan(plan: NonNullable<Order['inventoryPlan']>): Promise<string[]> {
  const errors: string[] = [];
  for (const movement of plan) {
    const { idempotencyKey, ...transactionData } = movement;
    try {
      await inventoryService.recordTransaction({ ...transactionData, type: 'STOCK_OUT' }, idempotencyKey);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return errors;
}

export const usePosStore = create<PosState>((set, get) => ({
  products: [],
  cart: [],
  loading: false,
  error: null,
  lastCompletedOrder: null,
  orderType: 'DINE_IN',
  tableNumber: 'Table 1',
  customerName: '',
  customerPhone: '',
  orderNotes: '',
  discount: null,
  parkedOrders: [],
  ordersHistory: [],
  inventoryAttentionOrders: [],
  inventoryAttentionError: null,
  ordersLoading: false,

  setOrderType: (orderType) => set({ orderType }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerPhone: (customerPhone) => set({ customerPhone }),
  setOrderNotes: (orderNotes) => set({ orderNotes }),
  applyDiscount: (type, value, reason) => set({ discount: { type, value, reason } }),
  removeDiscount: () => set({ discount: null }),

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await posService.getProducts();
      set({ products, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addToCart: (product, sizeOrQuantity, selectedOption, quantityParam, notesParam) => {
    if (get().loading) return;
    const { cart } = get();
    let chosenSize: ItemSize = 'Standard';
    let qty = 1;

    if (typeof sizeOrQuantity === 'number') {
      qty = sizeOrQuantity;
      if (product.sizes && product.sizes.length > 0) {
        chosenSize = product.sizes[0].size;
      }
    } else if (typeof sizeOrQuantity === 'string') {
      chosenSize = sizeOrQuantity as ItemSize;
      qty = quantityParam !== undefined ? quantityParam : 1;
    } else {
      qty = quantityParam !== undefined ? quantityParam : 1;
      if (product.sizes && product.sizes.length === 1) {
        chosenSize = product.sizes[0].size;
      } else if (product.sizes && product.sizes.length > 1) {
        chosenSize = 'Small';
      }
    }

    let itemPrice = product.price;
    let itemCost = product.unitCost || product.costPrice || 0;
    if (product.sizes && product.sizes.length > 0) {
      const matchedSize = product.sizes.find(s => s.size === chosenSize);
      if (matchedSize) {
        itemPrice = matchedSize.price;
        if (matchedSize.cost_price) {
          itemCost = matchedSize.cost_price;
        }
      }
    }

    const cartItemId = `${product.id}_${chosenSize}_${selectedOption || 'default'}`;
    const existingIndex = cart.findIndex(
      item => (item.cartItemId === cartItemId) || (!item.cartItemId && item.productId === product.id && item.size === chosenSize)
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + qty,
        notes: notesParam || updatedCart[existingIndex].notes
      };
      set({ cart: updatedCart });
    } else {
      const newItem: OrderItem = {
        id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cartItemId,
        productId: product.id,
        name: product.name,
        size: chosenSize,
        selectedOption,
        price: itemPrice,
        quantity: qty,
        notes: notesParam,
        unitCost: itemCost,
        recipeId: product.recipeId,
        inventoryItemId: product.inventoryItemId,
        sizeRecipeIds: product.sizeRecipeIds,
        isCombo: product.isCombo,
        comboComponents: product.comboComponents
      };
      set({ cart: [...cart, newItem] });
    }
  },

  updateQuantity: (cartItemIdOrProductId, newQuantity) => {
    if (get().loading) return;
    const { cart } = get();
    if (newQuantity <= 0) {
      get().removeFromCart(cartItemIdOrProductId);
      return;
    }
    set({
      cart: cart.map(item => 
        (item.cartItemId === cartItemIdOrProductId || item.id === cartItemIdOrProductId || item.productId === cartItemIdOrProductId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    });
  },

  updateItemNotes: (cartItemIdOrProductId, notes) => {
    const { cart } = get();
    set({
      cart: cart.map(item =>
        (item.cartItemId === cartItemIdOrProductId || item.id === cartItemIdOrProductId || item.productId === cartItemIdOrProductId)
          ? { ...item, notes }
          : item
      )
    });
  },

  removeFromCart: (cartItemIdOrProductId) => {
    if (get().loading) return;
    set({
      cart: get().cart.filter(item => 
        item.cartItemId !== cartItemIdOrProductId &&
        item.id !== cartItemIdOrProductId &&
        item.productId !== cartItemIdOrProductId
      )
    });
  },

  clearCart: () => {
    if (get().loading) return;
    set({ 
      cart: [],
      discount: null,
      orderNotes: '',
      customerName: '',
      customerPhone: ''
    });
  },

  clearCompletedOrder: () => {
    set({ lastCompletedOrder: null });
  },

  parkCurrentOrder: (customLabel) => {
    const { cart, orderType, tableNumber, customerName, customerPhone, orderNotes, parkedOrders } = get();
    if (cart.length === 0) return;

    const label = customLabel || (orderType === 'DINE_IN' ? tableNumber : (customerName ? `${customerName} (${orderType})` : `Order #${parkedOrders.length + 1}`));
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newParked: ParkedOrder = {
      id: `park_${Date.now()}`,
      label,
      orderType,
      tableNumber,
      customerName,
      customerPhone,
      items: [...cart],
      subtotal,
      orderNotes,
      parkedAt: new Date().toISOString()
    };

    set({
      parkedOrders: [newParked, ...parkedOrders],
      cart: [],
      orderNotes: '',
      customerName: '',
      customerPhone: '',
      discount: null
    });
  },

  recallParkedOrder: (parkedOrderId) => {
    const { parkedOrders } = get();
    const orderToResume = parkedOrders.find(p => p.id === parkedOrderId);
    if (!orderToResume) return;

    set({
      cart: orderToResume.items,
      orderType: orderToResume.orderType,
      tableNumber: orderToResume.tableNumber || 'Table 1',
      customerName: orderToResume.customerName || '',
      customerPhone: orderToResume.customerPhone || '',
      orderNotes: orderToResume.orderNotes || '',
      parkedOrders: parkedOrders.filter(p => p.id !== parkedOrderId)
    });
  },

  deleteParkedOrder: (parkedOrderId) => {
    set({
      parkedOrders: get().parkedOrders.filter(p => p.id !== parkedOrderId)
    });
  },

  completeCheckout: async ({ method, details }) => {
    const { cart, products, orderType, tableNumber, customerName, customerPhone, orderNotes, discount } = get();
    if (get().loading) throw new Error('A checkout is already in progress.');
    if (cart.length === 0) throw new Error("Cannot checkout empty cart");

    set({ loading: true, error: null });
    try {
      if (orderType === 'DINE_IN' && !tableNumber.trim()) throw new Error('Enter the table for this order.');
      const { subtotal, discountAmount, cgst, sgst, tax, total } = calculateTotals(cart, discount);
      const totalCost = cart.reduce((sum, item) => sum + ((item.unitCost || 0) * item.quantity), 0);
      if (method === 'CASH' && (!Number.isFinite(details.cashTendered) || details.cashTendered! < total)) {
        throw new Error('Cash received must cover the bill total.');
      }

      const orderId = `ord_${crypto.randomUUID()}`;
      let recipes: Awaited<ReturnType<typeof manufacturingService.getRecipes>> = [];
      let recipeLoadError = '';
      try {
        recipes = await manufacturingService.getRecipes();
      } catch (error) {
        recipeLoadError = error instanceof Error ? error.message : 'Could not load recipes.';
      }
      const builtPlan = buildInventoryPlan(orderId, cart, products, recipes);
      const unresolved = [...builtPlan.unresolved];
      if (recipeLoadError) unresolved.push(`Recipe data unavailable: ${recipeLoadError}`);
      const inventoryReady = unresolved.length === 0 && builtPlan.plan.length > 0;
      const inventorySyncStatus: InventorySyncStatus = inventoryReady ? 'PENDING' : 'NOT_CONFIGURED';
      const inventorySyncError = inventoryReady ? '' : (unresolved.join(' ') || 'No inventory recipe or stock-item mapping is configured.');
      let order = await posService.createOrder({
        items: cart,
        orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        orderNotes: orderNotes.trim() || undefined,
        subtotal,
        discountAmount,
        discountType: discount?.type,
        discountValue: discount?.value,
        discountReason: discount?.reason,
        tax,
        cgst,
        sgst,
        total,
        totalCost,
        paymentMethod: method,
        paymentDetails: details,
        cashierName: 'Talk of the Town Counter',
        status: 'PAID',
        inventorySyncStatus,
        inventorySyncError,
        inventoryPlan: inventoryReady ? builtPlan.plan : [],
      }, orderId);

      if (inventoryReady) {
        const movementErrors = await applyInventoryPlan(builtPlan.plan);
        let finalStatus: InventorySyncStatus = movementErrors.length ? 'PENDING' : 'SYNCED';
        let finalError = movementErrors.join(' ');
        try {
          await posService.updateInventorySyncStatus(order.id, finalStatus, finalError);
        } catch (error) {
          finalStatus = 'PENDING';
          finalError = [finalError, error instanceof Error ? error.message : String(error)].filter(Boolean).join(' ');
        }
        order = { ...order, inventorySyncStatus: finalStatus, inventorySyncError: finalError };
      }

      const updatedHistory = [order, ...get().ordersHistory];
      set({
        cart: [],
        orderNotes: '',
        customerName: '',
        customerPhone: '',
        discount: null,
        loading: false,
        error: order.inventorySyncStatus === 'SYNCED' ? null : order.inventorySyncError || 'Inventory needs attention.',
        lastCompletedOrder: order,
        ordersHistory: updatedHistory,
        inventoryAttentionOrders: order.inventorySyncStatus === 'SYNCED'
          ? get().inventoryAttentionOrders.filter(existing => existing.id !== order.id)
          : [order, ...get().inventoryAttentionOrders.filter(existing => existing.id !== order.id)],
      });
      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
      throw err;
    }
  },

  retryInventorySync: async (order) => {
    if (get().loading) throw new Error('Another operation is already in progress.');
    if (order.inventorySyncStatus !== 'PENDING' || !order.inventoryPlan?.length) {
      throw new Error('This order has no retryable inventory plan.');
    }
    set({ loading: true, error: null });
    const movementErrors = await applyInventoryPlan(order.inventoryPlan);
    let status: InventorySyncStatus = movementErrors.length ? 'PENDING' : 'SYNCED';
    let message = movementErrors.join(' ');
    try {
      await posService.updateInventorySyncStatus(order.id, status, message);
    } catch (error) {
      status = 'PENDING';
      message = [message, error instanceof Error ? error.message : String(error)].filter(Boolean).join(' ');
    }
    const updatedOrder = { ...order, inventorySyncStatus: status, inventorySyncError: message };
    set({
      loading: false,
      error: status === 'SYNCED' ? null : message || 'Inventory sync is still pending.',
      lastCompletedOrder: get().lastCompletedOrder?.id === order.id ? updatedOrder : get().lastCompletedOrder,
      ordersHistory: get().ordersHistory.map(existing => existing.id === order.id ? updatedOrder : existing),
      inventoryAttentionOrders: status === 'SYNCED'
        ? get().inventoryAttentionOrders.filter(existing => existing.id !== order.id)
        : [updatedOrder, ...get().inventoryAttentionOrders.filter(existing => existing.id !== order.id)],
    });
    if (status !== 'SYNCED') throw new Error(message || 'Inventory sync is still pending.');
    return updatedOrder;
  },

  checkout: async () => {
    const { cart } = get();
    if (cart.length === 0) return;
    const { total } = calculateTotals(cart, get().discount);

    return get().completeCheckout({
      method: 'CASH',
      details: {
        method: 'CASH',
        cashTendered: total,
        changeDue: 0
      }
    });
  },

  loadOrdersHistory: async () => {
    set({ ordersLoading: true });
    try {
      const orders = await posService.getOrders();
      set({ ordersHistory: orders, ordersLoading: false });
    } catch (err: any) {
      set({ ordersLoading: false, error: err.message });
    }
  },

  loadInventoryAttentionOrders: async () => {
    try {
      const inventoryAttentionOrders = await posService.getInventoryAttentionOrders();
      set({ inventoryAttentionOrders, inventoryAttentionError: null });
    } catch (error) {
      set({ inventoryAttentionError: error instanceof Error ? error.message : String(error) });
    }
  },

  cancelOrder: async (orderId: string, reason: string) => {
    try {
      await posService.updateOrderStatus(orderId, 'CANCELLED', reason);
      const updated = get().ordersHistory.map(o => 
        o.id === orderId ? { ...o, status: 'CANCELLED' as const, voidReason: reason } : o
      );
      set({ ordersHistory: updated });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
