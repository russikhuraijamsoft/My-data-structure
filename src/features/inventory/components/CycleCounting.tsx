import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Plus, Search, RefreshCw } from 'lucide-react';

export function CycleCounting() {
  const { cycleCounts, warehouses } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCounts = cycleCounts.filter(count => 
    count.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'Unknown Warehouse';

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search cycle counts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 font-medium"
            />
          </div>
        </div>
        <button 
          className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Start Verification
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Count Name</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Items to Count</th>
              <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            {filteredCounts.map((count) => (
              <tr key={count.id} className="hover:bg-[#fdf5f6] transition-colors text-xs font-medium">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-[#800000]">
                  {count.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">
                  {getWarehouseName(count.warehouseId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">
                  {new Date(count.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-black text-[#800000]">
                  {count.items.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full ${
                    count.status === 'COMPLETED' ? 'bg-[#800000] text-white' :
                    count.status === 'IN_PROGRESS' ? 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {count.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
                  {count.status !== 'COMPLETED' && (
                    <button className="text-[#800000] hover:underline cursor-pointer">Continue Count</button>
                  )}
                  {count.status === 'COMPLETED' && (
                    <button className="text-[#800000]/70 hover:underline cursor-pointer">View Report</button>
                  )}
                </td>
              </tr>
            ))}
            {filteredCounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#800000]/60">
                  <RefreshCw className="w-12 h-12 mx-auto text-[#dcabb5] mb-3" />
                  No cycle counts active.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
