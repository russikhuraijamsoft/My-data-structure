import React from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { Search, Plus, Filter, FileText } from 'lucide-react';

export function PurchaseOrdersList() {
  const { purchaseOrders } = usePurchasingStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search PO number or supplier..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#ebd5da] rounded-xl text-xs font-medium text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-[#ebd5da] text-[#800000] text-xs font-bold rounded-xl hover:bg-[#fdf5f6] transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create PO</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">PO Number</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Supplier</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Date</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Expected</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Amount</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-center">Status</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5 font-bold text-[#800000]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#800000]/60" />
                      {po.poNumber}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-[#800000]">
                    {po.supplierName}
                  </td>
                  <td className="p-3.5 text-[#800000]/80">
                    {new Date(po.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-[#800000]/80">
                    {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right font-black text-[#800000]">
                    ₹{po.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {po.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-xs font-bold text-[#800000] hover:underline cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#800000]/60">
                    No purchase orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
