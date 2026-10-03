import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { Wifi, ShieldCheck, Monitor, Maximize2 } from 'lucide-react';

interface KioskHardwareFrameProps {
  children: React.ReactNode;
}

export function KioskHardwareFrame({ children }: KioskHardwareFrameProps) {
  const { simulatorHardwareMode, toggleSimulatorHardwareMode, tokenNumber, lastOrder } = useKioskStore();

  if (!simulatorHardwareMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto select-none">
      {/* Simulation Toggle Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between text-white/70 text-xs font-bold mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Fast-Food Self-Ordering Kiosk Terminal</span>
        </div>

        <button
          type="button"
          onClick={toggleSimulatorHardwareMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Switch to Full Screen UI</span>
        </button>
      </div>

      {/* Physical Kiosk Machine Outer Chassis */}
      <div className="w-full max-w-[480px] bg-[#800000] rounded-[40px] p-4 shadow-2xl border-4 border-neutral-700 flex flex-col items-center relative">
        {/* Top Camera & Sensor Bar */}
        <div className="w-full flex items-center justify-between px-6 py-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60 font-black tracking-widest uppercase">
              KIOSK #01
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-black/60 border border-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* The Touchscreen Display Bezel & Screen (Children) */}
        <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 flex flex-col min-h-[640px] max-h-[750px] relative">
          {children}
        </div>

        {/* Lower Console Chassis (Identical to User Video 0:00 - 0:08) */}
        <div className="w-full pt-4 pb-2 px-6 flex flex-col items-center">
          {/* Receipt Printer Slot */}
          <div className="w-48 h-3.5 bg-neutral-900 rounded-full border border-neutral-700 shadow-inner mb-4 relative flex items-center justify-center">
            {lastOrder && (
              <div className="absolute top-1 w-36 h-6 bg-amber-50 rounded-b shadow-md text-[8px] font-mono text-center pt-0.5 text-black animate-slideDown overflow-hidden">
                Receipt #{tokenNumber}
              </div>
            )}
          </div>

          {/* Mounted Pine Labs POS Terminal (Seen in user video mounted right below screen!) */}
          <div className="w-56 bg-neutral-100 rounded-2xl p-2.5 shadow-2xl border-2 border-neutral-400 flex flex-col items-center relative -mb-3 z-10">
            {/* Pine Labs Logo Plate */}
            <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-neutral-300">
              <span className="text-[10px] font-black text-neutral-800 tracking-wider">
                Pine Labs
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Wifi className="w-2.5 h-2.5 text-neutral-600" />
              </div>
            </div>

            {/* Pine Labs Color Display */}
            <div className="w-full h-16 bg-slate-900 rounded-lg my-1.5 p-2 flex flex-col items-center justify-center text-center text-white">
              <span className="text-[9px] font-black text-emerald-400">
                PINE LABS ANDROID POS
              </span>
              <span className="text-[8px] text-neutral-400 mt-0.5">
                Ready for Contactless / Chip
              </span>
            </div>

            {/* Card Insertion Slot at bottom */}
            <div className="w-36 h-1.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600" />
          </div>

          {/* Three White Vertical Stripes (Iconic fast-food / KFC branding chassis in video) */}
          <div className="flex items-center gap-3 mt-6 mb-2">
            <div className="w-3 h-14 bg-white rounded-full shadow-xs" />
            <div className="w-3 h-14 bg-white rounded-full shadow-xs" />
            <div className="w-3 h-14 bg-white rounded-full shadow-xs" />
          </div>
        </div>
      </div>

      {/* Kiosk Floor Stand Pole */}
      <div className="w-16 h-20 bg-neutral-800 border-x-2 border-neutral-700 shadow-2xl" />
      <div className="w-48 h-5 bg-neutral-700 rounded-t-xl border-t border-neutral-500 shadow-2xl" />
    </div>
  );
}
