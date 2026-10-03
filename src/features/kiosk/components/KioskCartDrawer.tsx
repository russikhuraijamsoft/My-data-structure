import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { Product } from '../../pos/models/pos';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  CreditCard, 
  Utensils 
} from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

interface KioskCartDrawerProps {
  products: Product[];
}

export function KioskCartDrawer({ products }: KioskCartDrawerProps) {
  const { 
    cart, 
    diningMode, 
    tableNumber, 
    setTableNumber, 
    updateQuantity, 
    removeFromCart, 
    setStep,
    addKioskItem
  } = useKioskStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const tax = cgst + sgst;
  const total = subtotal + tax;

  // Upsell candidates (desserts, sides, drinks that aren't already in cart)
  const upsellItems = products
    .filter(p => (p.category === 'Beverages & Desserts' || p.category === 'Sides & Snacks') && p.active !== false && !p.isSubItem)
    .filter(p => !cart.some(c => c.productId === p.id))
    .slice(0, 3);

  const handleProceedToPayment = () => {
    kioskAudio.playTouch();
    setStep('PAYMENT');
  };

  const handleBackToMenu = () => {
    kioskAudio.playTouch();
    setStep('MENU');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden select-none">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b-2 border-[#ebd5da] flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={handleBackToMenu}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ebd5da] text-[#800000] hover:bg-[#fdf5f6] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Add More Items</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-black text-[#800000] tracking-tight">
            Review Your Order
          </h2>
          <span className="text-xs text-[#800000]/70 font-bold">
            {diningMode === 'DINE_IN' ? 'Dine In (Restaurant Table)' : 'Takeaway (Packed To Go)'}
          </span>
        </div>

        <div className="text-xs font-black px-3 py-1.5 rounded-full bg-[#800000] text-white">
          {cart.reduce((s, i) => s + i.quantity, 0)} Items
        </div>
      </header>

      {/* Main Review Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Dine-in Table Number prompt if dining in */}
        {diningMode === 'DINE_IN' && (
          <div className="bg-white p-4 rounded-2xl border-2 border-[#ebd5da] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf5f6] text-[#800000] flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#800000]">
                  Table or Stand Number
                </h4>
                <p className="text-xs text-[#800000]/70 font-bold">
                  Take a tent stand from the kiosk and enter its number:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 4"
                className="px-3.5 py-2 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] text-xs font-black text-[#800000] w-36 text-center focus:outline-hidden focus:border-[#800000]"
              />
            </div>
          </div>
        )}

        {/* Itemized Cart List */}
        <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-4 sm:p-6 shadow-xs divide-y divide-[#ebd5da]">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#800000]/40 mx-auto mb-2" />
              <p className="font-black text-[#800000] text-base">Your tray is currently empty</p>
              <button
                type="button"
                onClick={handleBackToMenu}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#800000] text-white font-black text-xs uppercase"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-xs border border-black/20 flex items-center justify-center p-0.5">
                      {item.isVeg ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </div>
                    <h4 className="font-black text-[#800000] text-base">
                      {item.name}
                    </h4>
                  </div>

                  {/* Modifiers & Addons list */}
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-[#800000]/80 font-bold">
                    {item.size && item.size !== 'Standard' && (
                      <span className="px-2 py-0.5 rounded bg-[#fdf5f6] border border-[#ebd5da]">
                        Size: {item.size}
                      </span>
                    )}
                    {item.selectedDrink && (
                      <span className="px-2 py-0.5 rounded bg-[#fdf5f6] border border-[#ebd5da]">
                        Drink: {item.selectedDrink}
                      </span>
                    )}
                    {item.selectedAddons && item.selectedAddons.map(a => (
                      <span key={a.id} className="px-2 py-0.5 rounded bg-[#fdf5f6] border border-[#ebd5da]">
                        +{a.name}
                      </span>
                    ))}
                    {item.notes && (
                      <span className="italic text-[#800000]/70">
                        "{item.notes}"
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs font-black text-[#800000]/70">
                    ₹{item.price.toFixed(2)} each
                  </div>
                </div>

                {/* Right Quantity & Price Controls */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-base font-black text-[#800000] tabular-nums">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-1.5 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId || item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-[#800000]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId || item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId || item.productId)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#800000]/60 hover:text-[#800000] hover:bg-[#fee8eb] cursor-pointer ml-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Smart Upsell Recommendations Carousel ("Customers Also Loved") */}
        {upsellItems.length > 0 && cart.length > 0 && (
          <div className="bg-[#fdf5f6] border-2 border-[#ebd5da] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#800000]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#800000]">
                Complete Your Feast With These
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upsellItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#ebd5da] p-3 flex flex-col justify-between"
                >
                  <div>
                    <h5 className="font-black text-xs text-[#800000] leading-tight line-clamp-1">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-[#800000]/70 font-semibold mt-0.5 line-clamp-1">
                      {item.comboDescription || item.category}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#ebd5da]/60 flex items-center justify-between">
                    <span className="text-xs font-black text-[#800000]">
                      ₹{item.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => addKioskItem(item, 'Standard')}
                      className="px-3 py-1 rounded-lg bg-[#800000] hover:bg-[#680016] text-white font-black text-[11px] cursor-pointer transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Summary Box */}
        {cart.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-5 shadow-xs space-y-2 text-xs font-bold text-[#800000]/80">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="text-[#800000] font-black tabular-nums">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (2.5%)</span>
              <span className="text-[#800000] font-black tabular-nums">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%)</span>
              <span className="text-[#800000] font-black tabular-nums">₹{sgst.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t-2 border-[#ebd5da] flex justify-between items-baseline text-base font-black text-[#800000]">
              <span className="text-lg">Total Amount</span>
              <span className="text-2xl tabular-nums">₹{total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Checkout Action Bar */}
      {cart.length > 0 && (
        <div className="p-4 sm:p-6 bg-white border-t-2 border-[#ebd5da] flex items-center justify-between shadow-xl">
          <div className="text-left">
            <span className="text-xs text-[#800000]/70 font-bold uppercase tracking-wider block">
              Payable Amount
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#800000] tabular-nums">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceedToPayment}
            className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-[#800000] hover:bg-[#680016] text-white font-black text-base sm:text-lg uppercase tracking-wide flex items-center gap-3 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Proceed to Payment</span>
          </button>
        </div>
      )}
    </div>
  );
}
