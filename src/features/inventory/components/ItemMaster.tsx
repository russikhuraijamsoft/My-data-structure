import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { ItemForm } from './ItemForm';

export function ItemMaster() {
  const { items, categories, deleteItem } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'General';

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 md:w-80 font-medium"
            />
          </div>
          <button className="p-2 border border-[#ebd5da] rounded-xl text-[#800000] hover:bg-[#fee8eb] bg-white transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#800000] hover:bg-[#680016] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Item
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Item / SKU</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Unit Cost</th>
              <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#fdf5f6] transition-colors text-xs">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-[#800000]">{item.name}</div>
                  <div className="text-[10px] text-[#800000]/70 font-mono">{item.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80 font-medium">
                  {getCategoryName(item.categoryId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`font-black text-sm ${item.currentStock <= item.minimumStock ? 'text-[#800000]' : 'text-[#800000]'}`}>
                    {item.currentStock} {item.unit}
                  </div>
                  {item.currentStock <= item.minimumStock && (
                    <div className="text-[10px] text-[#800000] font-bold">Low Stock</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000] text-right font-black">
                  ₹{item.costPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full ${
                    item.status === 'ACTIVE' ? 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  <button className="text-[#800000] hover:text-[#680016] mr-3 transition-colors cursor-pointer">
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="text-[#800000] hover:text-[#680016] transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#800000]/60">
                  No inventory items found. {searchTerm && "Try clearing your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ItemForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
