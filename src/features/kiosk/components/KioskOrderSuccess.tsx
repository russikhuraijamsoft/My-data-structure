import React, { useState, useEffect } from 'react';
import { useKioskStore } from '../store/kioskStore';
import { 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  ChefHat, 
  Utensils, 
  ShoppingBag, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

export function KioskOrderSuccess() {
  const { 
    tokenNumber, 
    lastOrder, 
    diningMode, 
    tableNumber, 
    resetToAttract 
  } = useKioskStore();

  const [countdown, setCountdown] = useState(25);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          resetToAttract();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetToAttract]);

  const handlePrint = () => {
    kioskAudio.playPineLabsBeep('pin');
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] overflow-y-auto p-4 sm:p-8 select-none">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
          {/* Top Celebration Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3 animate-pulse">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#800000] tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-[#800000]/70 font-bold mt-1">
            Your ticket has been sent straight to our kitchen display.
          </p>

          {/* Huge Token Calling Number Badge */}
          <div className="my-6 p-6 rounded-3xl bg-[#fdf5f6] border-2 border-[#800000] text-center shadow-inner">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#800000]/70 block mb-1">
              Your Order Token Number
            </span>
            <span className="text-5xl sm:text-6xl font-black text-[#800000] tracking-tight tabular-nums">
              {tokenNumber}
            </span>
            
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#800000] text-white uppercase tracking-wider">
                {diningMode === 'DINE_IN' ? `Dine In • ${tableNumber || 'Table'}` : 'Take Away (Packed)'}
              </span>
            </div>
          </div>

          {/* Live Kitchen Preparation Timeline */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#fafafa] rounded-2xl border border-[#ebd5da] text-center my-4">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black mb-1">
                ✓
              </div>
              <span className="text-[11px] font-black text-emerald-800">Order Placed</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-black mb-1 animate-spin">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-[#800000]">Cooking Now</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-black mb-1">
                3
              </div>
              <span className="text-[11px] font-bold text-gray-500">Pick Up at Counter</span>
            </div>
          </div>

          {/* Thermal Receipt Preview Paper */}
          {lastOrder && (
            <div className="p-4 bg-amber-50/40 border border-dashed border-[#ebd5da] rounded-2xl text-left text-xs font-mono space-y-1.5 text-[#800000]">
              <div className="text-center font-bold pb-2 border-b border-[#ebd5da]">
                TALK OF THE TOWN - KIOSK RECEIPT
                <div className="text-[10px] text-[#800000]/70 font-sans font-bold">
                  {new Date().toLocaleString()} · Ticket {tokenNumber}
                </div>
              </div>

              <div className="pt-2 space-y-1">
                {lastOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.quantity}x {i.name}</span>
                    <span>₹{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#ebd5da] flex justify-between font-bold">
                <span>TOTAL PAID ({lastOrder.paymentMethod})</span>
                <span>₹{lastOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="py-3.5 px-4 rounded-xl border-2 border-[#800000] text-[#800000] hover:bg-[#fee8eb] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Printing Receipt...' : 'Print Token Receipt'}</span>
            </button>

            <button
              type="button"
              onClick={resetToAttract}
              className="py-3.5 px-4 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Finish & Start Next Order</span>
            </button>
          </div>

          {/* Auto return countdown message */}
          <div className="mt-4 text-xs text-[#800000]/60 font-bold">
            Screen will return to welcome in <span className="text-[#800000] font-black">{countdown}</span> seconds
          </div>
        </div>
      </div>
    </div>
  );
}
