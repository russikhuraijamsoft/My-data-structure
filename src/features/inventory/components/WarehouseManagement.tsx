import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Plus } from 'lucide-react';
import { WarehouseForm } from './WarehouseForm';

export function WarehouseManagement() {
  const { warehouses } = useInventoryStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h2 className="text-base font-black text-[#800000]">Warehouses & Locations</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> New Warehouse
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Warehouse Name</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            {warehouses.map((wh) => (
              <tr key={wh.id} className="hover:bg-[#fdf5f6] transition-colors text-xs font-medium">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-[#800000]">{wh.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">{wh.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-[#800000]/70">{wh.location || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-black rounded-full ${
                    wh.isActive ? 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {wh.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <WarehouseForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
