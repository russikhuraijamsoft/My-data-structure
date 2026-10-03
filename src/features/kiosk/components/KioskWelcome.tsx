import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { Utensils, ShoppingBag, Sparkles, Volume2, VolumeX, Monitor, ShieldCheck, Flame } from 'lucide-react';

interface KioskWelcomeProps {
  onAdminExit?: () => void;
}

export function KioskWelcome({ onAdminExit }: KioskWelcomeProps) {
  const { startOrder, soundEnabled, toggleSound, simulatorHardwareMode, toggleSimulatorHardwareMode } = useKioskStore();

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Kiosk Banner */}
      <header className="px-6 py-4 bg-[#800000] text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-[#800000] rounded-xl flex items-center justify-center font-black text-2xl shadow-inner">
            T
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-tight">
              Talk of the Town
            </h1>
            <p className="text-[11px] text-white/80 font-bold uppercase tracking-widest">
              Express Self-Ordering Terminal #01
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-200" />}
          </button>

          {/* Kiosk Machine Frame Toggle */}
          <button
            onClick={toggleSimulatorHardwareMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            title="Toggle Physical Kiosk Frame"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">
              {simulatorHardwareMode ? 'Full Screen' : 'Kiosk Cabinet'}
            </span>
          </button>

          {/* Staff Exit */}
          {onAdminExit && (
            <button
              onClick={onAdminExit}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              title="Staff Exit"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* Main Attract Canvas */}
      <main className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {/* Animated Deal Showcase Banner */}
        <div className="w-full bg-[#fdf5f6] border-2 border-[#ebd5da] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#800000]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 bg-[#800000] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Limited Time Big Saver Deals
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#800000] tracking-tight mb-2">
            Ultimate Savings Bucket
          </h2>
          <p className="text-sm sm:text-base text-[#800000]/80 font-bold max-w-xl mx-auto">
            Hot & Crispy Fried Chicken, Golden Seasoned Fries, Chilled Pepsi & Secret Recipe Dips. Save up to ₹341!
          </p>

          {/* Quick Price Spotlight */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-gray-400 line-through text-lg font-bold">₹1,040</span>
            <span className="text-3xl sm:text-4xl font-black text-[#800000]">₹699</span>
            <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md">
              SAVE ₹341.00
            </span>
          </div>
        </div>

        {/* Action Prompt */}
        <div className="my-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-[#800000] tracking-tight">
            Where will you be eating today?
          </h3>
          <p className="text-sm text-[#800000]/70 font-semibold mt-1">
            Tap an option below to begin your order
          </p>
        </div>

        {/* Large Tactile Dining Mode Selection Cards (Matching 0:05 in video) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-4">
          {/* DINE IN */}
          <button
            onClick={() => startOrder('DINE_IN')}
            className="group relative bg-white border-3 border-[#ebd5da] hover:border-[#800000] rounded-3xl p-8 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer active:scale-95"
          >
            <div className="w-24 h-24 rounded-3xl bg-[#fdf5f6] group-hover:bg-[#800000] group-hover:text-white text-[#800000] flex items-center justify-center mb-5 transition-colors shadow-inner">
              <Utensils className="w-12 h-12" />
            </div>
            <span className="text-3xl font-black text-[#800000] tracking-tight group-hover:text-[#800000]">
              DINE IN
            </span>
            <span className="text-xs font-bold text-[#800000]/70 uppercase tracking-widest mt-1">
              Eat at Restaurant
            </span>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#fdf5f6] border border-[#ebd5da] text-[11px] font-black text-[#800000]">
              Table & Counter Pickup
            </div>
          </button>

          {/* TAKE AWAY */}
          <button
            onClick={() => startOrder('TAKEAWAY')}
            className="group relative bg-white border-3 border-[#ebd5da] hover:border-[#800000] rounded-3xl p-8 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer active:scale-95"
          >
            <div className="w-24 h-24 rounded-3xl bg-[#fdf5f6] group-hover:bg-[#800000] group-hover:text-white text-[#800000] flex items-center justify-center mb-5 transition-colors shadow-inner">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <span className="text-3xl font-black text-[#800000] tracking-tight group-hover:text-[#800000]">
              TAKE AWAY
            </span>
            <span className="text-xs font-bold text-[#800000]/70 uppercase tracking-widest mt-1">
              Carry Out / Packed
            </span>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#fdf5f6] border border-[#ebd5da] text-[11px] font-black text-[#800000]">
              Express Food Packaging
            </div>
          </button>
        </div>

        {/* Footer trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#800000]/60 font-bold pt-4 border-t border-[#ebd5da]/60 w-full">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pine Labs Contactless Payment</span>
          </div>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>UPI Instant Dynamic QR</span>
          </div>
          <span className="hidden sm:inline">·</span>
          <span>Freshly Prepared To Order</span>
        </div>
      </main>
    </div>
  );
}
