import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { X } from 'lucide-react';
import { ProductionOrder } from '../models/manufacturing';

interface ProductionOrderFormProps {
  onClose: () => void;
}

export function ProductionOrderForm({ onClose }: ProductionOrderFormProps) {
  const { recipes, addProductionOrder } = useManufacturingStore();
  const [formData, setFormData] = useState<Partial<ProductionOrder>>({
    recipeId: '',
    recipeName: '',
    batchNumber: `BCH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    plannedQuantity: 0,
    unit: 'portions',
    plannedDate: new Date().toISOString().split('T')[0],
    status: 'PLANNED',
  });

  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeId = e.target.value;
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setFormData({
        ...formData,
        recipeId,
        recipeName: recipe.name,
        unit: recipe.yieldUnit,
        plannedQuantity: recipe.yieldQuantity
      });
    } else {
      setFormData({ ...formData, recipeId: '', recipeName: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipeId) return;
    try {
      await addProductionOrder(formData as any);
      onClose();
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#800000] text-white">
          <h2 className="text-lg font-black text-white">
            Create Production Order
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="production-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Target Recipe *</label>
              <select
                required
                value={formData.recipeId}
                onChange={handleRecipeChange}
                className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-bold text-sm"
              >
                <option value="">Select a recipe</option>
                {recipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name} (Yield: {r.yieldQuantity} {r.yieldUnit})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Target Qty *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.plannedQuantity || ''}
                  onChange={e => setFormData({ ...formData, plannedQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Unit</label>
                <input
                  type="text"
                  readOnly
                  value={formData.unit || ''}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-white text-[#800000]/70 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Planned Date *</label>
              <input
                required
                type="date"
                value={formData.plannedDate?.split('T')[0]}
                onChange={e => setFormData({ ...formData, plannedDate: e.target.value })}
                className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-medium"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-[#ebd5da] bg-[#fdf5f6] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-sm text-[#800000] bg-white border border-[#ebd5da] hover:bg-[#fee8eb] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="production-form"
            className="px-5 py-2 rounded-xl font-black text-sm text-white bg-[#800000] hover:bg-[#680016] shadow-xs cursor-pointer"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
