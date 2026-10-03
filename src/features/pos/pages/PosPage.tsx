import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosStore } from '../store/posStore';
import { Product, ItemSize } from '../models/pos';
import { Loader2, Plus, Minus, Trash2, ShoppingCart, Sparkles, UtensilsCrossed, Monitor } from 'lucide-react';
import { SizeSelectorModal } from '../components/SizeSelectorModal';
import { ReceiptModal } from '../components/ReceiptModal';

export function PosPage() {
  const { 
    products, 
    cart, 
    loading, 
    error, 
    lastCompletedOrder,
    loadProducts, 
    addToCart, 
    updateQuantity,
    removeFromCart, 
    checkout,
    clearCompletedOrder
  } = usePosStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const activeProducts = products.filter(
    p => p.active !== false && p.isAvailable !== false && !p.isSubItem
  );

  const categories = ['All', 'Chowmein', 'Fried Rice', 'Specials', 'Combo Meals'];

  const filteredProducts = activeProducts.filter(p => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Specials') return p.category === 'Specials' || p.category === 'Chilly';
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleProductClick = (product: Product) => {
    const activeSizes = (product.sizes || []).filter(s => s.active !== false);
    const hasMultipleSizes = activeSizes.length > 1;
    const hasComboChoice = product.comboComponents?.some(c => c.isChoice);

    if (hasMultipleSizes || hasComboChoice) {
      setModalProduct(product);
    } else {
      const singleSize = activeSizes[0]?.size || 'Standard';
      addToCart(product, singleSize);
    }
  };

  const handleConfirmSize = (
    product: Product, 
    size: ItemSize, 
    selectedOption?: string, 
    quantity?: number
  ) => {
    addToCart(product, size, selectedOption, quantity);
    setModalProduct(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white text-[#800000]">
      {/* Products Catalog Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        {/* Header & Categories */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-[#800000] tracking-tight">
                Talk of the Town POS
              </h1>
              <p className="text-xs text-[#800000]/80 font-bold uppercase tracking-wider mt-0.5">
                Quick Service & Kitchen Order System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/kiosk"
                className="flex items-center gap-1.5 bg-[#800000] text-white px-3.5 py-1.5 rounded-xl text-xs font-black hover:bg-[#680016] transition-colors shadow-xs"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Launch Kiosk Mode</span>
              </Link>
              <div className="bg-[#fdf5f6] border border-[#ebd5da] px-3 py-1.5 rounded-xl text-xs font-black text-[#800000]">
                {activeProducts.length} Active Items
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#800000] text-white shadow-xs' 
                      : 'bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] hover:bg-[#fee8eb]'
                  }`}
                >
                  {cat === 'Combo Meals' && <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-[#800000] bg-[#fee8eb] border border-[#ebd5da] p-3 rounded-lg font-bold text-sm">
            {error}
          </div>
        )}

        {/* Catalog Grid */}
        {loading && activeProducts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#800000]" />
          </div>
        ) : (
          <div className="space-y-6 flex-1">
            {/* Combo Meals Section */}
            {selectedCategory === 'All' && (
              <div className="bg-[#fdf5f6] border-2 border-[#ebd5da] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#800000]" />
                    <h2 className="text-lg font-black text-[#800000]">Combo Meals</h2>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#800000] text-white uppercase tracking-wider">
                    Best Value
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeProducts.filter(p => p.category === 'Combo Meals').map(product => (
                    <div 
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="bg-white p-4 rounded-xl border-2 border-[#ebd5da] hover:border-[#800000] cursor-pointer shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-[#800000] text-base group-hover:underline">
                            {product.name}
                          </h3>
                          <span className="text-base font-black text-[#800000]">
                            ₹{product.price}
                          </span>
                        </div>
                        {product.comboDescription && (
                          <p className="text-xs text-[#800000]/70 mt-1.5 leading-relaxed font-semibold">
                            {product.comboDescription}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#ebd5da] flex items-center justify-between text-xs font-black text-[#800000]">
                        <span>{product.comboComponents?.some(c => c.isChoice) ? 'Choose Base' : 'Quick Add'}</span>
                        <span className="text-[#800000] font-black group-hover:translate-x-0.5 transition-transform">
                          Add →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Grid */}
            <div>
              {selectedCategory === 'All' && (
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-4 h-4 text-[#800000]" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#800000]">
                    A La Carte Menu
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(selectedCategory === 'All' 
                  ? filteredProducts.filter(p => p.category !== 'Combo Meals')
                  : filteredProducts
                ).map(product => {
                  const activeSizes = (product.sizes || []).filter(s => s.active !== false);
                  const isMultiSize = activeSizes.length > 1;

                  return (
                    <div 
                      key={product.id} 
                      className="bg-white p-4 rounded-xl border border-[#ebd5da] shadow-xs cursor-pointer hover:border-[#800000] hover:shadow-sm transition-all group flex flex-col justify-between"
                      onClick={() => handleProductClick(product)}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] uppercase font-black tracking-widest text-[#800000]/70">
                            {product.category}
                          </span>
                          {isMultiSize ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#fee8eb] text-[#800000] border border-[#ebd5da]">
                              3 Sizes
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf5f6] text-[#800000]/80">
                              Standard
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-[#800000] text-sm md:text-base line-clamp-2 group-hover:underline">
                          {product.name}
                        </h3>
                        {product.comboDescription && (
                          <p className="text-xs text-[#800000]/70 mt-1 line-clamp-2">
                            {product.comboDescription}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#ebd5da] flex items-center justify-between">
                        <div>
                          {isMultiSize ? (
                            <span className="text-xs font-bold text-[#800000]/80">
                              From <strong className="text-base text-[#800000] font-black">₹{product.price}</strong>
                            </span>
                          ) : (
                            <span className="text-base font-black text-[#800000]">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                        <span className="w-7 h-7 rounded-lg bg-[#fdf5f6] group-hover:bg-[#800000] group-hover:text-white text-[#800000] border border-[#ebd5da] flex items-center justify-center font-bold text-xs transition-colors">
                          +
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && !loading && (
                  <div className="col-span-full text-center text-[#800000]/70 py-12 font-bold">
                    No active items found in this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white border-l-2 border-[#ebd5da] flex flex-col shadow-xs">
        <div className="p-4 border-b border-[#ebd5da] bg-[#fdf5f6] flex items-center justify-between">
          <h2 className="text-base font-black text-[#800000] flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-[#800000]" /> Current Order
          </h2>
          <span className="text-xs font-black bg-[#800000] text-white px-2.5 py-1 rounded-full">
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#800000]/60 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6 text-[#800000]/40" />
              </div>
              <p className="font-bold text-sm text-[#800000]">Order is currently empty</p>
              <p className="text-xs text-[#800000]/70 mt-1">Tap any menu item to start adding to ticket</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, idx) => {
                const itemKey = item.cartItemId || item.id || `${item.productId}_${idx}`;
                return (
                  <div 
                    key={itemKey} 
                    className="p-3.5 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h4 className="font-black text-sm text-[#800000] leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {item.size && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#800000] text-white">
                              {item.size}
                            </span>
                          )}
                          {item.selectedOption && (
                            <span className="text-[11px] font-bold text-[#800000]/80">
                              • {item.selectedOption}
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId || item.productId)} 
                        className="text-[#800000]/60 hover:text-[#800000] p-1 hover:bg-[#fee8eb] rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#ebd5da]/60">
                      <div className="flex items-center space-x-2 bg-white border border-[#ebd5da] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId || item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-[#800000]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId || item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-[#800000]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-[#800000]/70 font-bold">
                          ₹{item.price.toFixed(2)} ea
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Total & Checkout Footer */}
        <div className="p-4 border-t-2 border-[#ebd5da] bg-[#fdf5f6]">
          <div className="space-y-2 mb-4 text-sm font-semibold">
            <div className="flex justify-between text-[#800000]/80">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#800000]/80">
              <span>GST (5%)</span>
              <span className="font-bold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-[#800000] pt-2 border-t border-[#ebd5da]">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => checkout()}
            disabled={cart.length === 0 || loading}
            className="w-full bg-[#800000] hover:bg-[#680016] text-white font-black py-3.5 rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors shadow-xs cursor-pointer text-base"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Charge ₹{total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Size Selection Modal */}
      {modalProduct && (
        <SizeSelectorModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onConfirm={handleConfirmSize}
        />
      )}

      {/* Completed Order Receipt & KOT Modal */}
      {lastCompletedOrder && (
        <ReceiptModal
          order={lastCompletedOrder}
          onClose={clearCompletedOrder}
        />
      )}
    </div>
  );
}
