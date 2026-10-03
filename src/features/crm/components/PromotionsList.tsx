import React from 'react';
import { useCrmStore } from '../store/crmStore';
import { Search, Plus, Filter, Tag } from 'lucide-react';

export function PromotionsList() {
  const { promotions } = useCrmStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search promos..." 
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
            <span>New Promo</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Promo Code</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Name</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Value</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Valid Until</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-center">Status</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Redemptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5 font-bold text-[#800000]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#800000]/60" />
                      {promo.code}
                    </div>
                  </td>
                  <td className="p-3.5 text-[#800000]">
                    <div className="font-bold">{promo.name}</div>
                    <div className="text-[10px] text-[#800000]/70">{promo.description}</div>
                  </td>
                  <td className="p-3.5 font-black text-[#800000]">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `₹${promo.value}`}
                  </td>
                  <td className="p-3.5 text-[#800000]/80">
                    {new Date(promo.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {promo.isActive ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-[#800000] font-bold">
                    {promo.timesUsed} uses
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
