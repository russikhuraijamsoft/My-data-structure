import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Plus, Search, Filter, ScrollText, Clock } from 'lucide-react';
import { RecipeForm } from './RecipeForm';

export function RecipeList() {
  const { recipes } = useManufacturingStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full relative text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search recipes..."
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 font-medium"
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
          <Plus className="w-4 h-4 mr-1.5" /> New Recipe
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#800000]/60 py-12">
            <ScrollText className="w-12 h-12 mb-3 text-[#dcabb5]" />
            <p className="font-semibold text-sm">No recipes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(recipe => (
              <div key={recipe.id} className="border border-[#ebd5da] rounded-xl p-4 bg-white shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-[#800000] text-base">{recipe.name}</h3>
                      <p className="text-xs text-[#800000]/70 font-medium">{recipe.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {recipe.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
                    <div className="bg-[#fdf5f6] p-2.5 rounded-lg border border-[#ebd5da]">
                      <div className="text-[10px] font-bold text-[#800000]/70 mb-0.5 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Time
                      </div>
                      <div className="font-black text-xs text-[#800000]">
                        {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                      </div>
                    </div>
                    <div className="bg-[#fdf5f6] p-2.5 rounded-lg border border-[#ebd5da]">
                      <div className="text-[10px] font-bold text-[#800000]/70 mb-0.5 flex items-center">
                        Cost
                      </div>
                      <div className="font-black text-xs text-[#800000]">
                        ₹{recipe.costing?.totalCost?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="bg-[#fdf5f6] p-2.5 rounded-lg border border-[#ebd5da]">
                      <div className="text-[10px] font-bold text-[#800000]/70 mb-0.5 flex items-center">
                        Margin
                      </div>
                      <div className="font-black text-xs text-[#800000]">
                        {recipe.costing?.marginPercentage?.toFixed(1) || '0.0'}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ebd5da] flex justify-between items-center text-xs font-semibold text-[#800000]/80">
                  <span>Yield: {recipe.yieldQuantity} {recipe.yieldUnit}</span>
                  <span>v{recipe.version}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
