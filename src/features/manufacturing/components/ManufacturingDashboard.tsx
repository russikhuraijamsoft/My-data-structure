import React from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Factory, ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ManufacturingDashboard() {
  const { productionOrders, recipes } = useManufacturingStore();
  const activeOrders = productionOrders.filter(o => o.status === 'IN_PROGRESS');
  const completedOrders = productionOrders.filter(o => o.status === 'COMPLETED');

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#ebd5da] p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#800000]/70 uppercase tracking-wider mb-1">Active Production</p>
              <h3 className="text-3xl font-black text-[#800000]">{activeOrders.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <Factory className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#800000]/70 uppercase tracking-wider mb-1">Recipes Managed</p>
              <h3 className="text-3xl font-black text-[#800000]">{recipes.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#800000]/70 uppercase tracking-wider mb-1">Batches Completed</p>
              <h3 className="text-3xl font-black text-[#800000]">{completedOrders.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[#800000]/70 uppercase tracking-wider mb-1">Avg Yield Variance</p>
              <h3 className="text-3xl font-black text-[#800000]">-1.8%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#ebd5da] bg-[#fdf5f6] flex justify-between items-center">
            <h3 className="font-bold text-[#800000] text-base">Active Batches</h3>
            <span className="text-xs font-bold text-[#800000]">{activeOrders.length} in progress</span>
          </div>
          <div className="p-4 space-y-3">
            {activeOrders.length === 0 ? (
              <p className="text-center text-sm font-semibold text-[#800000]/60 py-6">No active production batches.</p>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da] flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-[#800000]">{order.recipeName}</h4>
                    <p className="text-xs text-[#800000]/70 font-mono">Batch {order.batchNumber}</p>
                  </div>
                  <span className="text-sm font-black text-[#800000]">{order.plannedQuantity} {order.unit}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#ebd5da] bg-[#fdf5f6] flex justify-between items-center">
            <h3 className="font-bold text-[#800000] text-base">Master Menu Recipes</h3>
            <span className="text-xs font-bold text-[#800000]">{recipes.length} recipes</span>
          </div>
          <div className="p-4 space-y-3">
            {recipes.slice(0, 5).map(recipe => (
              <div key={recipe.id} className="p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#800000]">{recipe.name}</h4>
                  <p className="text-xs text-[#800000]/70 font-semibold">{recipe.yieldQuantity} {recipe.yieldUnit}</p>
                </div>
                <span className="text-sm font-black text-[#800000]">₹{recipe.costing?.totalCost?.toFixed(2)} cost</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
