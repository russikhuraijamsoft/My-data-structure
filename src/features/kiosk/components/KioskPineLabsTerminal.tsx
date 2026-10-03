import React, { useState, useEffect } from 'react';
import { useKioskStore, KioskPaymentType } from '../store/kioskStore';
import { 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone,
  Sparkles,
  Wifi,
  Lock
} from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

export function KioskPineLabsTerminal() {
  const { 
    cart, 
    paymentType, 
    setPaymentType, 
    setStep,
    terminalStep,
    setTerminalStep,
    terminalPin,
    enterTerminalPin,
    clearTerminalPin,
    submitTerminalPin,
    simulateUpiPayment,
    processCashPayment,
    isProcessingPayment 
  } = useKioskStore();

  const [upiTimer, setUpiTimer] = useState(120); // 2 minutes

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentType === 'UPI_QR' && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paymentType, upiTimer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMethodSelect = (type: KioskPaymentType) => {
    setPaymentType(type);
    if (type === 'CARD_PINELABS') {
      setTerminalStep('WAITING_CARD');
    }
  };

  const simulateCardTap = () => {
    kioskAudio.playPineLabsBeep('tap');
    setTerminalStep('PIN_ENTRY');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden select-none">
      {/* Top Header */}
      <header className="px-6 py-4 bg-white border-b-2 border-[#ebd5da] flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => {
            kioskAudio.playTouch();
            setStep('CART');
          }}
          disabled={isProcessingPayment}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ebd5da] text-[#800000] hover:bg-[#fdf5f6] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-black text-[#800000] tracking-tight">
            Select Payment Method
          </h2>
          <span className="text-xs text-[#800000]/70 font-bold">
            Pine Labs Multi-Option Payment Gateway
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#800000]/70 font-bold uppercase block">
            Amount Due
          </span>
          <span className="text-xl font-black text-[#800000] tabular-nums">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </header>

      {/* Main Payment Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center">
        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-2xl mb-6">
          {/* UPI */}
          <button
            type="button"
            onClick={() => handleMethodSelect('UPI_QR')}
            disabled={isProcessingPayment}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentType === 'UPI_QR'
                ? 'border-[#800000] bg-white text-[#800000] shadow-md ring-2 ring-[#800000]/20'
                : 'border-[#ebd5da] bg-[#fdf5f6] text-[#800000]/70 hover:bg-white'
            }`}
          >
            <QrCode className="w-7 h-7" />
            <span className="text-xs font-black uppercase tracking-wider">
              UPI Dynamic QR
            </span>
          </button>

          {/* Pine Labs Card */}
          <button
            type="button"
            onClick={() => handleMethodSelect('CARD_PINELABS')}
            disabled={isProcessingPayment}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentType === 'CARD_PINELABS'
                ? 'border-[#800000] bg-white text-[#800000] shadow-md ring-2 ring-[#800000]/20'
                : 'border-[#ebd5da] bg-[#fdf5f6] text-[#800000]/70 hover:bg-white'
            }`}
          >
            <CreditCard className="w-7 h-7" />
            <span className="text-xs font-black uppercase tracking-wider">
              Pine Labs Card POS
            </span>
          </button>

          {/* Cash */}
          <button
            type="button"
            onClick={() => handleMethodSelect('CASH_COUNTER')}
            disabled={isProcessingPayment}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentType === 'CASH_COUNTER'
                ? 'border-[#800000] bg-white text-[#800000] shadow-md ring-2 ring-[#800000]/20'
                : 'border-[#ebd5da] bg-[#fdf5f6] text-[#800000]/70 hover:bg-white'
            }`}
          >
            <Banknote className="w-7 h-7" />
            <span className="text-xs font-black uppercase tracking-wider">
              Pay at Counter
            </span>
          </button>
        </div>

        {/* 1. UPI QR Code Panel */}
        {paymentType === 'UPI_QR' && (
          <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-6 sm:p-8 max-w-md w-full shadow-lg text-center flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-black text-[#800000] mb-2 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Scan with any UPI App</span>
            </div>
            <p className="text-xs text-[#800000]/70 font-semibold mb-4">
              Google Pay, PhonePe, Paytm, CRED, BHIM UPI
            </p>

            {/* Generated QR Code Canvas simulation */}
            <div className="relative p-4 bg-white border-2 border-[#800000] rounded-2xl shadow-inner mb-4">
              {/* Authentic dynamic QR graphic */}
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" fill="white" />
                {/* QR Finder Corners */}
                <rect x="15" y="15" width="45" height="45" rx="6" fill="#800000" />
                <rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
                <rect x="29" y="29" width="17" height="17" rx="2" fill="#800000" />

                <rect x="140" y="15" width="45" height="45" rx="6" fill="#800000" />
                <rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
                <rect x="154" y="29" width="17" height="17" rx="2" fill="#800000" />

                <rect x="15" y="140" width="45" height="45" rx="6" fill="#800000" />
                <rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
                <rect x="29" y="154" width="17" height="17" rx="2" fill="#800000" />

                {/* Simulated Data Matrix dots */}
                <g fill="#800000">
                  <rect x="70" y="20" width="8" height="8" rx="1" />
                  <rect x="85" y="20" width="16" height="8" rx="1" />
                  <rect x="110" y="20" width="8" height="8" rx="1" />
                  <rect x="125" y="20" width="8" height="8" rx="1" />
                  
                  <rect x="70" y="35" width="16" height="8" rx="1" />
                  <rect x="95" y="35" width="8" height="8" rx="1" />
                  <rect x="115" y="35" width="16" height="8" rx="1" />

                  <rect x="20" y="70" width="8" height="16" rx="1" />
                  <rect x="35" y="70" width="8" height="8" rx="1" />
                  <rect x="50" y="70" width="16" height="8" rx="1" />
                  <rect x="75" y="70" width="8" height="8" rx="1" />
                  <rect x="90" y="70" width="20" height="8" rx="1" />
                  <rect x="120" y="70" width="8" height="8" rx="1" />
                  <rect x="140" y="70" width="16" height="8" rx="1" />
                  <rect x="165" y="70" width="15" height="8" rx="1" />

                  <rect x="20" y="95" width="16" height="8" rx="1" />
                  <rect x="45" y="95" width="8" height="16" rx="1" />
                  <rect x="65" y="95" width="16" height="8" rx="1" />
                  <rect x="90" y="95" width="8" height="8" rx="1" />
                  <rect x="110" y="95" width="16" height="16" rx="1" />
                  <rect x="140" y="95" width="8" height="8" rx="1" />
                  <rect x="160" y="95" width="16" height="8" rx="1" />

                  <rect x="70" y="120" width="8" height="16" rx="1" />
                  <rect x="85" y="120" width="16" height="8" rx="1" />
                  <rect x="140" y="120" width="8" height="8" rx="1" />
                  <rect x="160" y="120" width="20" height="8" rx="1" />

                  <rect x="70" y="145" width="20" height="8" rx="1" />
                  <rect x="100" y="145" width="8" height="16" rx="1" />
                  <rect x="120" y="145" width="16" height="8" rx="1" />
                  <rect x="145" y="145" width="8" height="8" rx="1" />
                  <rect x="165" y="145" width="15" height="16" rx="1" />

                  <rect x="70" y="170" width="8" height="8" rx="1" />
                  <rect x="90" y="170" width="16" height="8" rx="1" />
                  <rect x="115" y="170" width="8" height="8" rx="1" />
                  <rect x="135" y="170" width="16" height="8" rx="1" />
                </g>

                {/* Center Pine Labs logo chip */}
                <rect x="82" y="82" width="36" height="36" rx="8" fill="#800000" />
                <text x="100" y="104" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">₹</text>
              </svg>

              {/* Laser Scanning Animation */}
              <div className="absolute inset-x-4 top-4 h-1 bg-[#800000] opacity-80 animate-bounce shadow-md" />
            </div>

            <div className="flex items-center justify-between w-full text-xs font-black text-[#800000] mb-4">
              <span>Dynamic QR Expires in:</span>
              <span className="font-mono text-sm bg-[#fdf5f6] px-2.5 py-1 rounded-md border border-[#ebd5da]">
                {formatTimer(upiTimer)}
              </span>
            </div>

            {/* Test Simulation Button */}
            <button
              type="button"
              onClick={simulateUpiPayment}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#800000] hover:bg-[#680016] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying UPI Transaction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Customer Phone Scan</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 2. Pine Labs Card POS Terminal Simulation (As shown mounted on kiosk in video) */}
        {paymentType === 'CARD_PINELABS' && (
          <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-6 sm:p-8 max-w-md w-full shadow-lg text-center flex flex-col items-center">
            {/* Pine Labs Branding Header */}
            <div className="flex items-center justify-between w-full border-b pb-3 mb-4 border-[#ebd5da]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800 tracking-wider">
                  PINE LABS ANDROID POS
                </span>
              </div>
              <Wifi className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Terminal Screen display */}
            <div className="w-full bg-[#1e293b] text-white rounded-2xl p-5 shadow-inner mb-6 flex flex-col items-center text-center min-h-[170px] justify-center relative">
              {terminalStep === 'WAITING_CARD' && (
                <>
                  <CreditCard className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
                  <span className="text-sm font-black tracking-wide text-emerald-300">
                    PLEASE TAP, INSERT OR SWIPE CARD
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Visa, MasterCard, RuPay, Amex Contactless
                  </span>
                  <div className="mt-3 text-lg font-black text-white tabular-nums">
                    ₹{total.toFixed(2)}
                  </div>
                </>
              )}

              {terminalStep === 'PIN_ENTRY' && (
                <>
                  <Lock className="w-7 h-7 text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    ENTER 4-DIGIT CARD PIN
                  </span>
                  <div className="flex items-center gap-3 my-3">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${
                          terminalPin.length > i
                            ? 'bg-amber-400 border-amber-400'
                            : 'border-slate-500 bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Use keypad below or press Enter
                  </span>
                </>
              )}

              {terminalStep === 'PROCESSING' && (
                <>
                  <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-2" />
                  <span className="text-sm font-black text-emerald-300">
                    AUTHORIZING WITH BANK...
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Please do not remove card
                  </span>
                </>
              )}

              {terminalStep === 'APPROVED' && (
                <>
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                  <span className="text-sm font-black text-emerald-300">
                    PAYMENT APPROVED
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Printing receipt & order token...
                  </span>
                </>
              )}
            </div>

            {/* Action based on terminal step */}
            {terminalStep === 'WAITING_CARD' && (
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={simulateCardTap}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#800000] hover:bg-[#680016] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tap / Insert Card</span>
                </button>
              </div>
            )}

            {/* PIN Keypad */}
            {terminalStep === 'PIN_ENTRY' && (
              <div className="w-full max-w-xs space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map(key => {
                    const isOk = key === 'OK';
                    const isClear = key === 'C';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (isClear) clearTerminalPin();
                          else if (isOk) submitTerminalPin();
                          else enterTerminalPin(key);
                        }}
                        className={`h-11 rounded-xl font-black text-sm transition-colors cursor-pointer active:scale-90 ${
                          isOk
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white col-span-1'
                            : isClear
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-[#fdf5f6] hover:bg-[#fee8eb] text-[#800000] border border-[#ebd5da]'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Cash at Counter Panel */}
        {paymentType === 'CASH_COUNTER' && (
          <div className="bg-white rounded-3xl border-2 border-[#ebd5da] p-6 sm:p-8 max-w-md w-full shadow-lg text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fdf5f6] text-[#800000] flex items-center justify-center mb-4">
              <Banknote className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-[#800000] mb-2">
              Pay Cash at Pick-Up Counter
            </h3>
            <p className="text-xs text-[#800000]/80 font-bold mb-6">
              A Kiosk Order Token will be printed. Present it to the cashier counter to pay ₹{total.toFixed(2)} in cash and collect your meal when ready.
            </p>

            <button
              type="button"
              onClick={processCashPayment}
              disabled={isProcessingPayment}
              className="w-full py-4 px-6 rounded-2xl bg-[#800000] hover:bg-[#680016] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Order Token...</span>
                </>
              ) : (
                <span>Confirm & Print Order Token</span>
              )}
            </button>
          </div>
        )}

        {/* Security guarantee */}
        <div className="flex items-center gap-2 text-xs text-[#800000]/60 font-bold mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PCI-DSS Level 1 Encrypted Terminal Connection</span>
        </div>
      </div>
    </div>
  );
}
