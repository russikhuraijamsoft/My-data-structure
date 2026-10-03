import React, { useState } from 'react';
import { Category } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface CategoryFormProps {
  onClose: () => void;
}

export function CategoryForm({ onClose }: CategoryFormProps) {
  const { categories, addCategory } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    parentId: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name) {
        throw new Error('Category Name is required');
      }
      await addCategory(formData as Omit<Category, 'id' | 'createdAt'>);
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
          <h2 className="text-xl font-black text-white">Add Category</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 text-[#800000] bg-[#fee8eb] border border-[#ebd5da] p-3 rounded-lg text-xs font-bold">{error}</div>}
          
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Category Name *</label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
                placeholder="e.g. Vegetables, Sauces"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Parent Category</label>
              <select 
                value={formData.parentId || ''}
                onChange={e => setFormData({...formData, parentId: e.target.value})}
                className="w-full rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-[#800000] px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#800000]"
              >
                <option value="">None (Top Level)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Description</label>
              <textarea 
                rows={2}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
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
            form="category-form"
            disabled={loading}
            className="px-5 py-2 bg-[#800000] text-white rounded-xl text-sm font-black hover:bg-[#680016] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
