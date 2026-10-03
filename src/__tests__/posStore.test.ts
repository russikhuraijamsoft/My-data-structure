import { describe, it, expect, beforeEach } from 'vitest';
import { usePosStore } from '../features/pos/store/posStore';
import { Product } from '../features/pos/models/pos';

describe('POS Store and Cart Management', () => {
  beforeEach(() => {
    usePosStore.setState({
      products: [],
      cart: [],
      loading: false,
      error: null,
      lastCompletedOrder: null
    });
  });

  it('adds items to cart and updates quantities for existing items', () => {
    const product: Product = {
      id: 'prod_chilly_dry',
      name: 'Chicken Chilly Dry',
      price: 250,
      costPrice: 105,
      category: 'Specials',
      isAvailable: true,
      sizes: [
        { item_id: 'prod_chilly_dry', size: 'Standard', price: 250, active: true }
      ]
    };

    usePosStore.getState().addToCart(product, 1);
    expect(usePosStore.getState().cart).toHaveLength(1);
    expect(usePosStore.getState().cart[0].quantity).toBe(1);
    expect(usePosStore.getState().cart[0].name).toBe('Chicken Chilly Dry');
    expect(usePosStore.getState().cart[0].size).toBe('Standard');
    expect(usePosStore.getState().cart[0].price).toBe(250);

    // Add again
    usePosStore.getState().addToCart(product, 2);
    expect(usePosStore.getState().cart).toHaveLength(1);
    expect(usePosStore.getState().cart[0].quantity).toBe(3);
  });

  it('handles multi-size products (Small, Medium, Large) correctly with accurate pricing', () => {
    const chowmein: Product = {
      id: 'prod_chow_chicken',
      name: 'Chicken Chowmein',
      price: 45,
      category: 'Chowmein',
      isAvailable: true,
      sizes: [
        { item_id: 'prod_chow_chicken', size: 'Small', price: 45, active: true },
        { item_id: 'prod_chow_chicken', size: 'Medium', price: 70, active: true },
        { item_id: 'prod_chow_chicken', size: 'Large', price: 105, active: true }
      ]
    };

    // Add Small (₹45)
    usePosStore.getState().addToCart(chowmein, 'Small', undefined, 1);
    // Add Medium (₹70)
    usePosStore.getState().addToCart(chowmein, 'Medium', undefined, 2);
    // Add Large (₹105)
    usePosStore.getState().addToCart(chowmein, 'Large', undefined, 1);

    const cart = usePosStore.getState().cart;
    expect(cart).toHaveLength(3);

    const smallItem = cart.find(i => i.size === 'Small');
    const mediumItem = cart.find(i => i.size === 'Medium');
    const largeItem = cart.find(i => i.size === 'Large');

    expect(smallItem?.price).toBe(45);
    expect(smallItem?.quantity).toBe(1);
    expect(mediumItem?.price).toBe(70);
    expect(mediumItem?.quantity).toBe(2);
    expect(largeItem?.price).toBe(105);
    expect(largeItem?.quantity).toBe(1);
  });

  it('bills combo meals as a single line item at combo price', () => {
    const signatureCombo: Product = {
      id: 'prod_combo_signature',
      name: 'Signature Combo',
      price: 110,
      category: 'Combo Meals',
      isAvailable: true,
      isCombo: true,
      comboDescription: 'Medium Chowmein OR Fried Rice (Chicken) + Chilly Chicken Bites',
      sizes: [
        { item_id: 'prod_combo_signature', size: 'Standard', price: 110, active: true }
      ],
      comboComponents: [
        {
          itemId: 'choice_sig_base',
          name: 'Medium Chicken Chowmein or Fried Rice',
          quantity: 1,
          isChoice: true,
          options: [
            { itemId: 'prod_chow_chicken', name: 'Medium Chicken Chowmein', size: 'Medium' },
            { itemId: 'prod_fr_chicken', name: 'Medium Chicken Fried Rice', size: 'Medium' }
          ]
        },
        { itemId: 'prod_chilly_bites', name: 'Chilly Chicken Bites', size: 'Standard', quantity: 1 }
      ]
    };

    usePosStore.getState().addToCart(signatureCombo, 'Standard', 'Medium Chicken Chowmein', 1);

    const cart = usePosStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].name).toBe('Signature Combo');
    expect(cart[0].price).toBe(110);
    expect(cart[0].selectedOption).toBe('Medium Chicken Chowmein');
    expect(cart[0].isCombo).toBe(true);
    expect(cart[0].comboComponents).toHaveLength(2);
  });

  it('removes item from cart and clears cart', () => {
    const product1: Product = { 
      id: 'p1', 
      name: 'Item 1', 
      price: 100, 
      category: 'Food', 
      isAvailable: true,
      sizes: [{ item_id: 'p1', size: 'Standard', price: 100, active: true }]
    };
    const product2: Product = { 
      id: 'p2', 
      name: 'Item 2', 
      price: 200, 
      category: 'Food', 
      isAvailable: true,
      sizes: [{ item_id: 'p2', size: 'Standard', price: 200, active: true }]
    };

    usePosStore.getState().addToCart(product1, 1);
    usePosStore.getState().addToCart(product2, 1);
    expect(usePosStore.getState().cart).toHaveLength(2);

    const item1 = usePosStore.getState().cart[0];
    usePosStore.getState().removeFromCart(item1.cartItemId || item1.productId);
    expect(usePosStore.getState().cart).toHaveLength(1);
    expect(usePosStore.getState().cart[0].productId).toBe('p2');

    usePosStore.getState().clearCart();
    expect(usePosStore.getState().cart).toHaveLength(0);
  });
});
