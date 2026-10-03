import React, { useState } from 'react';
import { Warehouse } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface WarehouseFormProps {
  onClose: () => void;
}

export function WarehouseForm({ onClose }: WarehouseFormProps) {
  const { addWarehouse } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: '',
    type: 'MAIN_STORE',
    location: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name) {
        throw new Error('Warehouse Name is required');
      }
      await addWarehouse(formData as Omit<Warehouse, 'id'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#ebd5da] bg-[#800000] text-white">
          <h2 className="text-xl font-black text-white">Add Warehouse</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 text-[#800000] bg-[#fee8eb] border border-[#ebd5da] p-3 rounded-lg text-xs font-bold">{error}</div>}
          
          <form id="warehouse-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Warehouse Name *</label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                placeholder="e.g. Line Cold Storage"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Type *</label>
              <select 
                required
                value={formData.type || ''}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
              >
                <option value="MAIN_STORE">Main Store</option>
                <option value="KITCHEN_STORE">Kitchen Store</option>
                <option value="BRANCH_STORE">Branch Store</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Location</label>
              <textarea 
                rows={2}
                value={formData.location || ''}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
              />
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-[#ebd5da] bg-[#fdf5f6] flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-[#ebd5da] rounded-xl text-sm font-bold text-[#800000] bg-white hover:bg-[#fee8eb] cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="warehouse-form"
            disabled={loading}
            className="px-5 py-2 bg-[#800000] text-white rounded-xl text-sm font-black hover:bg-[#680016] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? 'Saving...' : 'Save Warehouse'}
          </button>
        </div>
      </div>
    </div>
  );
}
