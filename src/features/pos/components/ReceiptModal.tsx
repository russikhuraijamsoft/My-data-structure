import React, { useState } from 'react';
import { Order } from '../models/pos';
import { CheckCircle, Printer, X, ChefHat, ReceiptText } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<'receipt' | 'kot'>('receipt');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-[#ebd5da] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#800000] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#800000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-black tracking-wide">
                Order Completed
              </h3>
              <p className="text-xs text-[#fbe6ea] font-medium">
                {order.orderNumber} • Paid Successfully
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#ebd5da] bg-[#fdf5f6] p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'receipt'
                ? 'bg-white text-[#800000] shadow-xs'
                : 'text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            Customer Receipt
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kot')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'kot'
                ? 'bg-white text-[#800000] shadow-xs'
                : 'text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Kitchen Order Ticket (KOT)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'receipt' ? (
            <div className="border border-[#ebd5da] rounded-xl p-5 bg-[#fdf5f6]/50 shadow-xs font-mono">
              <div className="text-center pb-4 border-b border-dashed border-[#ebd5da]">
                <h2 className="text-xl font-black tracking-tight text-[#800000]">
                  TALK OF THE TOWN
                </h2>
                <p className="text-xs text-[#800000]/80 mt-0.5">Authentic Asian & Fast Food</p>
                <p className="text-xs text-[#800000]/80">Tel: +91 98765 43210</p>
              </div>

              <div className="py-3 border-b border-dashed border-[#ebd5da] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Order No:</span>
                  <span className="font-bold text-[#800000]">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Date:</span>
                  <span className="font-bold text-[#800000]">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#800000]/80">Type:</span>
                  <span className="font-bold text-[#800000]">{order.orderType || 'DINE_IN'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-3 border-b border-dashed border-[#ebd5da] space-y-2">
                {order.items.map((item, idx) => {
                  const displayName = item.selectedOption
                    ? `${item.name} (${item.selectedOption})`
                    : (item.size && item.size !== 'Standard' ? `${item.name} • ${item.size}` : item.name);
                  
                  return (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-[#800000]">
                          {displayName}
                        </div>
                        <div className="text-[#800000]/70 text-[11px]">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-black text-[#800000]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Totals */}
              <div className="pt-3 text-xs space-y-1.5">
                <div className="flex justify-between text-[#800000]/80">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discountAmount ? (
                  <div className="flex justify-between text-[#800000] font-bold">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[#800000]/80">
                  <span>GST (5%)</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#800000] pt-2 border-t border-[#ebd5da]">
                  <span>TOTAL PAID</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[11px] text-[#800000]/70 mt-6 pt-3 border-t border-dashed border-[#ebd5da]">
                Thank you for dining with us! Please visit again.
              </div>
            </div>
          ) : (
            <div className="border-2 border-[#800000] rounded-xl p-5 bg-white shadow-xs font-mono">
              <div className="bg-[#800000] text-white p-3 rounded-lg text-center mb-4">
                <span className="text-xs uppercase tracking-widest font-black">
                  KITCHEN ORDER TICKET (KOT)
                </span>
                <h2 className="text-2xl font-black mt-0.5">
                  {order.orderNumber}
                </h2>
                <span className="text-xs">
                  Time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => {
                  const displayName = item.selectedOption 
                    ? `${item.name} (${item.selectedOption})`
                    : (item.size && item.size !== 'Standard' ? `${item.name} • ${item.size}` : item.name);
                  return (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-[#fdf5f6] border border-[#ebd5da]">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-[#800000] bg-white border border-[#ebd5da] px-2.5 py-1 rounded-md">
                          {item.quantity}x
                        </span>
                        <div>
                          <div className="font-black text-sm text-[#800000]">
                            {displayName}
                          </div>
                          {item.size && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-sm bg-[#800000] text-white">
                              SIZE: {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebd5da] text-center text-xs text-[#800000]/70 font-sans font-bold">
                Route: Main Kitchen • Priority: Normal
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#fdf5f6] border-t border-[#ebd5da] flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl border border-[#ebd5da] bg-white font-black text-[#800000] hover:bg-[#fee8eb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print {activeTab === 'receipt' ? 'Receipt' : 'KOT'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black transition-colors shadow-xs cursor-pointer"
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}
