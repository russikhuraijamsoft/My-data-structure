import React, { useState } from 'react';
import { InventoryItem } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface ItemFormProps {
  onClose: () => void;
}

export function ItemForm({ onClose }: ItemFormProps) {
  const { categories, addItem } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    sku: '',
    categoryId: '',
    unit: 'kg',
    costPrice: 0,
    sellingPrice: 0,
    reorderLevel: 10,
    minimumStock: 5,
    valuationMethod: 'WEIGHTED_AVERAGE',
    status: 'ACTIVE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name || !formData.sku || !formData.categoryId) {
        throw new Error('Name, SKU, and Category are required');
      }
      await addItem(formData as Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt' | 'currentStock'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#ebd5da] bg-[#800000] text-white">
          <h2 className="text-xl font-black text-white">Add Inventory Item</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 text-[#800000] bg-[#fee8eb] border border-[#ebd5da] p-3 rounded-lg text-xs font-bold">{error}</div>}
          
          <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Item Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">SKU *</label>
                <input 
                  type="text" 
                  required
                  value={formData.sku || ''}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                  placeholder="e.g. RM-CHK-001"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Category *</label>
                <select 
                  required
                  value={formData.categoryId || ''}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Unit of Measure *</label>
                <input 
                  type="text" 
                  required
                  value={formData.unit || ''}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                  placeholder="kg, liters, pcs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Cost Price (₹) *</label>
                <input 
                  type="number" 
                  required
                  min="0" step="0.01"
                  value={formData.costPrice || 0}
                  onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Minimum Safe Stock *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formData.minimumStock || 0}
                  onChange={e => setFormData({...formData, minimumStock: parseFloat(e.target.value)})}
                  className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                />
              </div>
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
            form="item-form"
            disabled={loading}
            className="px-5 py-2 bg-[#800000] text-white rounded-xl text-sm font-black hover:bg-[#680016] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
