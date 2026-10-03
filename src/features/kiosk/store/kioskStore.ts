import { create } from 'zustand';
import { Product, OrderItem, Order, ItemSize, KioskAddon } from '../../pos/models/pos';
import { posService } from '../../pos/services/posService';
import { kdsService } from '../../kds/services/kdsService';
import { kioskAudio } from '../utils/kioskAudio';

export type KioskStep = 'ATTRACT' | 'MENU' | 'CART' | 'PAYMENT' | 'SUCCESS';
export type DiningMode = 'DINE_IN' | 'TAKEAWAY';
export type DietaryFilter = 'ALL' | 'VEG' | 'NON_VEG';
export type KioskPaymentType = 'UPI_QR' | 'CARD_PINELABS' | 'CASH_COUNTER';

interface KioskState {
  step: KioskStep;
  diningMode: DiningMode;
  tableNumber: string;
  selectedCategory: string;
  dietaryFilter: DietaryFilter;
  searchQuery: string;
  soundEnabled: boolean;
  simulatorHardwareMode: boolean; // Shows physical kiosk cabinet with Pine Labs reader
  
  cart: OrderItem[];
  modalProduct: Product | null;
  specialInstructions: string;

  // Checkout & Terminal
  paymentType: KioskPaymentType;
  terminalStep: 'IDLE' | 'WAITING_CARD' | 'PIN_ENTRY' | 'PROCESSING' | 'APPROVED' | 'DECLINED';
  terminalPin: string;
  isProcessingPayment: boolean;
  lastOrder: Order | null;
  tokenNumber: string;

  // Actions
  setStep: (step: KioskStep) => void;
  startOrder: (mode: DiningMode) => void;
  cancelOrder: () => void;
  setDiningMode: (mode: DiningMode) => void;
  setTableNumber: (num: string) => void;
  setSelectedCategory: (cat: string) => void;
  setDietaryFilter: (filter: DietaryFilter) => void;
  setSearchQuery: (query: string) => void;
  toggleSound: () => void;
  toggleSimulatorHardwareMode: () => void;
  setModalProduct: (prod: Product | null) => void;
  setSpecialInstructions: (notes: string) => void;

  // Cart actions
  addKioskItem: (
    product: Product,
    size?: ItemSize,
    drink?: string,
    addons?: KioskAddon[],
    quantity?: number,
    notes?: string
  ) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Payment & Terminal actions
  setPaymentType: (type: KioskPaymentType) => void;
  setTerminalStep: (step: 'IDLE' | 'WAITING_CARD' | 'PIN_ENTRY' | 'PROCESSING' | 'APPROVED' | 'DECLINED') => void;
  enterTerminalPin: (digit: string) => void;
  clearTerminalPin: () => void;
  submitTerminalPin: () => Promise<void>;
  simulateUpiPayment: () => Promise<void>;
  processCashPayment: () => Promise<void>;
  _finalizeKioskOrder: (paymentMethod: 'UPI' | 'CARD' | 'CASH') => Promise<void>;
  resetToAttract: () => void;
}

let tokenCounter = 101;

export const useKioskStore = create<KioskState>((set, get) => ({
  step: 'ATTRACT',
  diningMode: 'DINE_IN',
  tableNumber: 'Table 1',
  selectedCategory: 'Group & Buckets',
  dietaryFilter: 'ALL',
  searchQuery: '',
  soundEnabled: true,
  simulatorHardwareMode: false,

  cart: [],
  modalProduct: null,
  specialInstructions: '',

  paymentType: 'UPI_QR',
  terminalStep: 'IDLE',
  terminalPin: '',
  isProcessingPayment: false,
  lastOrder: null,
  tokenNumber: 'K-101',

  setStep: (step: KioskStep) => set({ step }),

  startOrder: (mode: DiningMode) => {
    kioskAudio.playTouch();
    set({
      step: 'MENU',
      diningMode: mode,
      cart: [],
      specialInstructions: '',
      modalProduct: null,
      lastOrder: null
    });
  },

  cancelOrder: () => {
    kioskAudio.playTouch();
    set({
      step: 'ATTRACT',
      cart: [],
      specialInstructions: '',
      modalProduct: null,
      terminalStep: 'IDLE',
      terminalPin: '',
      lastOrder: null
    });
  },

  setDiningMode: (diningMode: DiningMode) => {
    kioskAudio.playTouch();
    set({ diningMode });
  },

  setTableNumber: (tableNumber: string) => set({ tableNumber }),

  setSelectedCategory: (selectedCategory: string) => {
    kioskAudio.playTouch();
    set({ selectedCategory });
  },

  setDietaryFilter: (dietaryFilter: DietaryFilter) => {
    kioskAudio.playTouch();
    set({ dietaryFilter });
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  toggleSound: () => {
    const next = !get().soundEnabled;
    kioskAudio.enabled = next;
    set({ soundEnabled: next });
    if (next) kioskAudio.playTouch();
  },

  toggleSimulatorHardwareMode: () => {
    kioskAudio.playTouch();
    set((state) => ({ simulatorHardwareMode: !state.simulatorHardwareMode }));
  },

  setModalProduct: (modalProduct: Product | null) => {
    if (modalProduct) kioskAudio.playTouch();
    set({ modalProduct });
  },

  setSpecialInstructions: (specialInstructions: string) => set({ specialInstructions }),

  addKioskItem: (
    product: Product, 
    size: ItemSize = 'Standard', 
    drink?: string, 
    addons: KioskAddon[] = [], 
    quantity: number = 1, 
    notes: string = ''
  ) => {
    kioskAudio.playAdd();
    const { cart } = get();

    // calculate unit price with size and addons
    let basePrice = product.price;
    if (product.sizes && product.sizes.length > 0) {
      const match = product.sizes.find(s => s.size === size);
      if (match) basePrice = match.price;
    }
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + addonsTotal;

    const addonsKey = addons.map(a => a.id).sort().join('_');
    const cartItemId = `${product.id}_${size}_${drink || 'nodrink'}_${addonsKey}`;

    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
        notes: notes ? `${updated[existingIndex].notes ? updated[existingIndex].notes + '; ' : ''}${notes}` : updated[existingIndex].notes
      };
      set({ cart: updated, modalProduct: null });
    } else {
      const selectedOptionParts: string[] = [];
      if (drink) selectedOptionParts.push(drink);
      if (addons.length > 0) selectedOptionParts.push(addons.map(a => a.name).join(', '));
      const selectedOption = selectedOptionParts.length > 0 ? selectedOptionParts.join(' + ') : undefined;

      const newItem: OrderItem = {
        id: `kiosk_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cartItemId,
        productId: product.id,
        name: product.name,
        size,
        price: unitPrice,
        quantity,
        notes: notes || undefined,
        selectedOption,
        selectedDrink: drink,
        selectedAddons: addons,
        isVeg: product.isVeg,
        unitCost: product.costPrice || 0,
        recipeId: product.recipeId,
        isCombo: product.isCombo,
        comboComponents: product.comboComponents
      };
      set({ cart: [...cart, newItem], modalProduct: null });
    }
  },

  updateQuantity: (cartItemId: string, qty: number) => {
    kioskAudio.playTouch();
    if (qty <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    set({
      cart: get().cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity: qty } : item)
    });
  },

  removeFromCart: (cartItemId: string) => {
    kioskAudio.playTouch();
    set({
      cart: get().cart.filter(item => item.cartItemId !== cartItemId)
    });
  },

  clearCart: () => {
    kioskAudio.playTouch();
    set({ cart: [], specialInstructions: '' });
  },

  setPaymentType: (paymentType: KioskPaymentType) => {
    kioskAudio.playTouch();
    set({ paymentType, terminalStep: paymentType === 'CARD_PINELABS' ? 'WAITING_CARD' : 'IDLE', terminalPin: '' });
  },

  setTerminalStep: (terminalStep: 'IDLE' | 'WAITING_CARD' | 'PIN_ENTRY' | 'PROCESSING' | 'APPROVED' | 'DECLINED') => set({ terminalStep }),

  enterTerminalPin: (digit: string) => {
    kioskAudio.playPineLabsBeep('pin');
    const { terminalPin } = get();
    if (terminalPin.length < 4) {
      set({ terminalPin: terminalPin + digit });
    }
  },

  clearTerminalPin: () => {
    kioskAudio.playTouch();
    set({ terminalPin: '' });
  },

  submitTerminalPin: async () => {
    const { terminalPin } = get();
    if (terminalPin.length !== 4) return;
    set({ terminalStep: 'PROCESSING', isProcessingPayment: true });
    
    // Simulate Pine Labs transaction authorization
    await new Promise(r => setTimeout(r, 1400));
    kioskAudio.playPineLabsBeep('approved');
    set({ terminalStep: 'APPROVED' });

    // Complete order creation
    await get()._finalizeKioskOrder('CARD');
  },

  simulateUpiPayment: async () => {
    set({ isProcessingPayment: true });
    kioskAudio.playPineLabsBeep('pin');
    await new Promise(r => setTimeout(r, 1500));
    kioskAudio.playPineLabsBeep('approved');
    await get()._finalizeKioskOrder('UPI');
  },

  processCashPayment: async () => {
    set({ isProcessingPayment: true });
    kioskAudio.playTouch();
    await new Promise(r => setTimeout(r, 800));
    await get()._finalizeKioskOrder('CASH');
  },

  _finalizeKioskOrder: async (paymentMethod: 'UPI' | 'CARD' | 'CASH') => {
    const { cart, diningMode, tableNumber, specialInstructions } = get();
    if (cart.length === 0) return;

    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const cgst = subtotal * 0.025;
      const sgst = subtotal * 0.025;
      const tax = cgst + sgst;
      const total = Math.round((subtotal + tax) * 100) / 100;

      const currentToken = `K-${tokenCounter++}`;

      const order = await posService.createOrder({
        items: cart,
        orderType: diningMode,
        tableNumber: diningMode === 'DINE_IN' ? tableNumber : undefined,
        customerName: `Kiosk Guest (${currentToken})`,
        orderNotes: specialInstructions.trim() || undefined,
        subtotal,
        tax,
        cgst,
        sgst,
        total,
        paymentMethod,
        paymentDetails: {
          method: paymentMethod,
          cardType: paymentMethod === 'CARD' ? 'Pine Labs Visa/RuPay Contactless' : undefined,
          upiReference: paymentMethod === 'UPI' ? `UPI_${Date.now().toString().slice(-8)}` : undefined
        },
        cashierName: 'Self-Service Kiosk #01',
        status: 'PAID'
      });

      // Push instantly to Kitchen Display System (KDS)
      try {
        await kdsService.createTicket({
          orderId: order.id,
          orderNumber: `${currentToken} (${order.orderNumber})`,
          type: diningMode,
          tableNumber: diningMode === 'DINE_IN' ? tableNumber : 'Takeaway Counter',
          customerName: `Kiosk Order ${currentToken}`,
          status: 'NEW',
          priority: 'NORMAL',
          targetTime: new Date(Date.now() + 15 * 60000).toISOString(),
          items: cart.map((item, idx) => ({
            id: `kiosk_ti_${order.id}_${idx}`,
            productId: item.productId,
            productName: item.selectedOption 
              ? `${item.name} (${item.selectedOption})`
              : (item.size && item.size !== 'Standard' ? `${item.name} • ${item.size}` : item.name),
            size: item.size,
            quantity: item.quantity,
            modifiers: [
              ...(item.selectedOption ? [item.selectedOption] : []),
              ...(item.selectedDrink ? [`Drink: ${item.selectedDrink}`] : []),
              ...(item.selectedAddons ? item.selectedAddons.map(a => a.name) : [])
            ],
            notes: item.notes || specialInstructions || undefined,
            stationId: 'st_1',
            status: 'PENDING'
          }))
        });
      } catch (kdsErr) {
        console.warn('Could not dispatch kiosk ticket to KDS:', kdsErr);
      }

      kioskAudio.playOrderSuccess();

      set({
        step: 'SUCCESS',
        lastOrder: order,
        tokenNumber: currentToken,
        isProcessingPayment: false,
        terminalStep: 'IDLE',
        terminalPin: ''
      });
    } catch (err: unknown) {
      console.error('Error in kiosk checkout:', err);
      set({ isProcessingPayment: false, terminalStep: 'DECLINED' });
    }
  },

  resetToAttract: () => {
    kioskAudio.playTouch();
    set({
      step: 'ATTRACT',
      cart: [],
      modalProduct: null,
      specialInstructions: '',
      terminalStep: 'IDLE',
      terminalPin: '',
      isProcessingPayment: false,
      lastOrder: null
    });
  }
}));
