import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { X, Plus, Trash2 } from 'lucide-react';
import { Recipe } from '../models/manufacturing';
import { calculateRecipeCosting } from '../utils/costCalculator';

interface RecipeFormProps {
  onClose: () => void;
  recipe?: Recipe;
}

export function RecipeForm({ onClose, recipe }: RecipeFormProps) {
  const { addRecipe, updateRecipe } = useManufacturingStore();
  const { items: inventoryItems } = useInventoryStore();

  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      name: '',
      description: '',
      categoryId: '',
      version: '1.0',
      status: 'DRAFT',
      yieldQuantity: 1,
      yieldUnit: 'portions',
      servingSize: '1 portion',
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      shelfLifeDays: 1,
      ingredients: [],
      instructions: [],
      costing: {
        ingredientsCost: 0,
        gasCost: 0,
        electricityCost: 0,
        waterCost: 0,
        labourCost: 0,
        packagingCost: 0,
        overheadCost: 0,
        totalCost: 0,
        sellingPrice: 100,
        costPerPortion: 0,
        grossProfit: 0,
        marginPercentage: 0
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const computedCosting = calculateRecipeCosting(
        formData.ingredients || [],
        formData.cookTimeMinutes || 0,
        formData.prepTimeMinutes || 0,
        formData.costing?.sellingPrice || 0,
        formData.yieldQuantity || 1,
        inventoryItems
      );

      const payload = {
        ...formData,
        costing: computedCosting
      };

      if (recipe?.id) {
        await updateRecipe(recipe.id, payload);
      } else {
        await addRecipe(payload as any);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        { id: `ing_${Date.now()}`, inventoryItemId: '', itemName: '', quantity: 0, unit: 'kg', isOptional: false, costPerUnit: 0 }
      ]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#800000] text-white">
          <h2 className="text-xl font-black text-white">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-black text-base border-b border-[#ebd5da] pb-2 text-[#800000]">Basic Information</h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Recipe Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    placeholder="e.g. Chicken Chowmein Base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Yield Qty</label>
                    <input
                      type="number"
                      value={formData.yieldQuantity}
                      onChange={e => setFormData({ ...formData, yieldQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Yield Unit</label>
                    <input
                      type="text"
                      value={formData.yieldUnit}
                      onChange={e => setFormData({ ...formData, yieldUnit: e.target.value })}
                      placeholder="e.g. portions, kg, pcs"
                      className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.prepTimeMinutes}
                      onChange={e => setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Cook Time (min)</label>
                    <input
                      type="number"
                      value={formData.cookTimeMinutes}
                      onChange={e => setFormData({ ...formData, cookTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-[#ebd5da] pb-2">
                  <h3 className="font-black text-base text-[#800000]">Bill of Materials (BOM)</h3>
                  <button type="button" onClick={addIngredient} className="text-xs font-bold text-[#800000] bg-[#fdf5f6] border border-[#ebd5da] px-2.5 py-1 rounded-lg hover:bg-[#fee8eb] flex items-center cursor-pointer">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Ingredient
                  </button>
                </div>

                {formData.ingredients?.length === 0 ? (
                  <div className="text-xs text-[#800000]/70 text-center py-6 bg-[#fdf5f6] rounded-xl border border-dashed border-[#ebd5da] font-medium">
                    No ingredients added yet. Tap "Add Ingredient" to configure recipe.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {formData.ingredients?.map((ing, index) => (
                      <div key={ing.id} className="flex gap-2 items-center bg-[#fdf5f6] p-2.5 rounded-xl border border-[#ebd5da]">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Ingredient Name"
                            value={ing.itemName}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].itemName = e.target.value;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-xs font-bold border border-[#ebd5da] rounded-lg bg-white text-[#800000]"
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={ing.quantity || ''}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].quantity = Number(e.target.value);
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-xs font-bold border border-[#ebd5da] rounded-lg bg-white text-[#800000]"
                          />
                        </div>
                        <div className="w-14">
                          <input
                            type="text"
                            placeholder="Unit"
                            value={ing.unit}
                            onChange={(e) => {
                              const newIngs = [...(formData.ingredients || [])];
                              newIngs[index].unit = e.target.value;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                            className="w-full px-2 py-1.5 text-xs font-bold border border-[#ebd5da] rounded-lg bg-white text-[#800000]"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newIngs = [...(formData.ingredients || [])];
                            newIngs.splice(index, 1);
                            setFormData({ ...formData, ingredients: newIngs });
                          }}
                          className="p-1.5 text-[#800000] hover:bg-[#fee8eb] rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Real-time Cost Calculation Estimate */}
          <div className="mt-6 bg-[#fdf5f6] p-4 rounded-xl border border-[#ebd5da]">
            <h3 className="font-bold text-sm text-[#800000] mb-3">Cost Analysis Estimate</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Target Selling Price (₹)</label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={formData.costing?.sellingPrice || 0}
                  onChange={(e) => setFormData({ ...formData, costing: { ...formData.costing, sellingPrice: Number(e.target.value) } as any })}
                  className="w-48 px-3 py-1.5 text-sm font-bold border border-[#ebd5da] rounded-lg bg-white text-[#800000]"
                />
              </div>
            </div>

            {(() => {
              const liveCosting = calculateRecipeCosting(
                formData.ingredients || [],
                formData.cookTimeMinutes || 0,
                formData.prepTimeMinutes || 0,
                formData.costing?.sellingPrice || 0,
                formData.yieldQuantity || 1,
                inventoryItems
              );
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#ebd5da]">
                    <p className="text-[10px] uppercase font-bold text-[#800000]/70 mb-1">Ingredients Cost</p>
                    <p className="text-base font-black text-[#800000]">₹{liveCosting.ingredientsCost.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#ebd5da]">
                    <p className="text-[10px] uppercase font-bold text-[#800000]/70 mb-1">Utility Cost (Gas/Water)</p>
                    <p className="text-base font-black text-[#800000]">₹{(liveCosting.gasCost + liveCosting.electricityCost + liveCosting.waterCost).toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#ebd5da]">
                    <p className="text-[10px] uppercase font-bold text-[#800000]/70 mb-1">Total Cost</p>
                    <p className="text-base font-black text-[#800000]">₹{liveCosting.totalCost.toFixed(2)}</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${liveCosting.marginPercentage > 20 ? 'bg-white border-[#ebd5da]' : 'bg-[#fee8eb] border-[#ebd5da]'}`}>
                    <p className="text-[10px] uppercase font-bold text-[#800000]/70 mb-1">Gross Margin</p>
                    <p className="text-base font-black text-[#800000]">{liveCosting.marginPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })()}
          </div>
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
            form="recipe-form"
            className="px-5 py-2 rounded-xl font-black text-sm text-white bg-[#800000] hover:bg-[#680016] shadow-xs cursor-pointer"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
