import { create } from 'zustand';
import { Product, OrderItem, Order, ItemSize, KioskAddon } from '../../pos/models/pos';
import { posService } from '../../pos/services/posService';
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

  submitTerminalPin: async () => { set({ terminalStep: 'DECLINED', terminalPin: '', isProcessingPayment: false }); },
  simulateUpiPayment: async () => { set({ terminalStep: 'DECLINED', isProcessingPayment: false }); },
  processCashPayment: async () => { set({ terminalStep: 'DECLINED', isProcessingPayment: false }); },

  _finalizeKioskOrder: async (paymentMethod: 'UPI' | 'CARD' | 'CASH') => {
    set({ isProcessingPayment: false, terminalStep: 'DECLINED' });
    throw new Error('Kiosk payment integration is not configured. Please order at the staffed POS.');
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
