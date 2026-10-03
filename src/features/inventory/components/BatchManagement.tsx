import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Search, Archive } from 'lucide-react';

export function BatchManagement() {
  const { batches, items, warehouses } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter(batch => {
    const item = items.find(i => i.id === batch.itemId);
    const searchString = `${batch.batchNumber} ${item?.name || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'Unknown Warehouse';

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search batch or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Batch Number</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Stock Qty</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            {filteredBatches.map((batch) => {
              const daysToExpiry = getDaysUntilExpiry(batch.expiryDate);
              const isExpired = daysToExpiry < 0;
              const isExpiringSoon = daysToExpiry >= 0 && daysToExpiry <= 30;

              return (
                <tr key={batch.id} className="hover:bg-[#fdf5f6] transition-colors text-xs font-medium">
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-[#800000]">
                    {batch.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-[#800000]">
                    {getItemName(batch.itemId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">
                    {getWarehouseName(batch.warehouseId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-black text-[#800000]">
                    {batch.currentQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={isExpired || isExpiringSoon ? 'font-bold text-[#800000]' : 'text-[#800000]/80'}>
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                    {isExpired && <div className="text-[10px] text-[#800000] font-black">Expired</div>}
                    {isExpiringSoon && <div className="text-[10px] text-[#800000] font-bold">Expiring in {daysToExpiry}d</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full ${
                      batch.status === 'ACTIVE' ? 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]' :
                      batch.status === 'EXPIRED' ? 'bg-[#fee8eb] text-[#800000] border border-[#ebd5da]' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#800000]/60">
                  <Archive className="w-12 h-12 mx-auto text-[#dcabb5] mb-3" />
                  No inventory batches registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
