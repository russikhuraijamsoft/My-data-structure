import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Download, AlertTriangle } from 'lucide-react';

export function InventoryReports() {
  const { items, batches } = useInventoryStore();
  const [activeReport, setActiveReport] = useState<'VALUATION' | 'EXPIRY' | 'ABC' | 'STOCK_LEDGER'>('VALUATION');

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h2 className="text-base font-black text-[#800000]">Inventory Reports</h2>
        <div className="flex space-x-2">
          <select 
            value={activeReport}
            onChange={e => setActiveReport(e.target.value as any)}
            className="px-3 py-1.5 border border-[#ebd5da] rounded-xl text-xs font-bold bg-white text-[#800000] focus:outline-none"
          >
            <option value="VALUATION">Inventory Valuation</option>
            <option value="EXPIRY">Expiry Report</option>
            <option value="ABC">ABC Analysis</option>
            <option value="STOCK_LEDGER">Stock Movement Ledger</option>
          </select>
          <button 
            onClick={() => window.print()}
            className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeReport === 'VALUATION' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#800000] mb-3">Current Valuation by Item</h3>
            <table className="min-w-full divide-y divide-[#ebd5da]">
              <thead className="bg-[#fdf5f6]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#ebd5da]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fdf5f6] transition-colors text-xs font-medium">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[#800000]">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{item.currentStock} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">₹{item.costPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-black">₹{(item.currentStock * item.costPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'EXPIRY' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#800000] mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-[#800000]" /> 
              Upcoming Expiries (Next 30 Days)
            </h3>
            {batches.filter(b => b.status !== 'EXPIRED' && b.status !== 'DEPLETED' && Math.ceil((new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)) <= 30).length === 0 ? (
              <p className="text-xs text-[#800000]/70 font-semibold">No items expiring within the next 30 days.</p>
            ) : (
              <table className="min-w-full divide-y divide-[#ebd5da]">
                <thead className="bg-[#fdf5f6]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase">Batch</th>
                    <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebd5da]">
                  {batches.filter(b => b.status !== 'EXPIRED' && b.status !== 'DEPLETED' && Math.ceil((new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)) <= 30).map((batch) => (
                    <tr key={batch.id} className="text-xs">
                      <td className="px-6 py-3 font-mono font-bold">{batch.batchNumber}</td>
                      <td className="px-6 py-3 text-right font-bold">{batch.currentQuantity}</td>
                      <td className="px-6 py-3 text-[#800000] font-black">{new Date(batch.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(activeReport === 'ABC' || activeReport === 'STOCK_LEDGER') && (
          <div className="flex flex-col items-center justify-center py-12 text-[#800000]/70 text-xs">
            <p className="text-sm font-bold text-[#800000] mb-1">Periodic Movement Log</p>
            <p>Calculated dynamically as transactions occur.</p>
          </div>
        )}
      </div>
    </div>
  );
}
