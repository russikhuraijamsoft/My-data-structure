import React, { useState } from 'react';
import { useKioskStore } from '../store/kioskStore';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

export function KioskBottomBar() {
  const { cart, cancelOrder, setStep } = useKioskStore();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleCancelClick = () => {
    kioskAudio.playTouch();
    if (cart.length > 0) {
      setShowCancelConfirm(true);
    } else {
      cancelOrder();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    cancelOrder();
  };

  const handleGoToCart = () => {
    if (cart.length === 0) return;
    kioskAudio.playTouch();
    setStep('CART');
  };

  return (
    <>
      {/* Sticky Bottom Bar (Exact fast-food kiosk footer layout from video) */}
      <footer className="h-20 sm:h-24 bg-white border-t-2 border-[#ebd5da] px-4 sm:px-8 flex items-center justify-between shadow-2xl relative z-30 select-none">
        {/* Left: CANCEL ORDER */}
        <button
          type="button"
          onClick={handleCancelClick}
          className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl border-2 border-[#800000] text-[#800000] hover:bg-[#fee8eb] font-black text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer active:scale-95"
        >
          Cancel Order
        </button>

        {/* Center: Cart Bucket & Taxes Breakdown */}
        <div 
          onClick={handleGoToCart}
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
        >
          {/* Bucket/Cart Icon with Badge */}
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fdf5f6] border-2 border-[#ebd5da] flex items-center justify-center text-[#800000] group-hover:border-[#800000] transition-colors shadow-xs">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-[#800000] text-white text-[11px] font-black flex items-center justify-center shadow-md">
              {itemCount}
            </span>
          </div>

          {/* Pricing Info */}
          <div className="text-left">
            <div className="text-[11px] sm:text-xs text-[#800000]/70 font-bold uppercase tracking-wider">
              GST (5%): <span className="text-[#800000] font-black tabular-nums">₹{gst.toFixed(2)}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-[#800000] tracking-tight">
              Total with Taxes: <span className="text-lg sm:text-2xl font-black text-[#800000] tabular-nums">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: GO TO CART Button */}
        <button
          type="button"
          onClick={handleGoToCart}
          disabled={cart.length === 0}
          className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-lg tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-md ${
            cart.length > 0
              ? 'bg-[#800000] hover:bg-[#680016] text-white active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
          }`}
        >
          <span>Go To Cart</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </footer>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-[#42000c]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#ebd5da] shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#fee8eb] text-[#800000] mx-auto flex items-center justify-center mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#800000] mb-2">
              Cancel This Order?
            </h3>
            <p className="text-sm text-[#800000]/80 font-bold mb-6">
              All items in your current tray will be cleared and the kiosk will return to the welcome screen.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="py-3 px-4 rounded-xl border-2 border-[#ebd5da] text-[#800000] font-black text-sm hover:bg-[#fdf5f6] transition-colors cursor-pointer"
              >
                Keep Ordering
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="py-3 px-4 rounded-xl bg-[#800000] text-white font-black text-sm hover:bg-[#680016] transition-colors cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
