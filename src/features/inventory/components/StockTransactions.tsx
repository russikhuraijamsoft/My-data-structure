import React, { useState } from 'react';
import { ArrowRightLeft, Plus, FileText } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

export function StockTransactions() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h2 className="text-base font-black text-[#800000]">Recent Stock Movements</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.print()}
            className="bg-white hover:bg-[#fee8eb] text-[#800000] border border-[#ebd5da] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Export
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Record Movement
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Recorded By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#800000]/60">
                <ArrowRightLeft className="w-12 h-12 mx-auto text-[#dcabb5] mb-3" />
                <p className="text-sm font-bold text-[#800000] mb-1">No recorded stock movements</p>
                <p className="text-xs">Record incoming goods or manual adjustments above to track history.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
