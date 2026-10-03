import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { calculateSellingPriceRecommendation } from '../utils/costCalculator';

export function ManufacturingAI() {
  const { recipes, productionOrders } = useManufacturingStore();
  const [analyzing, setAnalyzing] = useState(false);

  const sortedByProfit = [...recipes].sort((a, b) => (b.costing?.marginPercentage || 0) - (a.costing?.marginPercentage || 0));
  const mostProfitable = sortedByProfit.slice(0, 3);
  const leastProfitable = sortedByProfit.slice(-3).reverse();

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="bg-[#800000] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center mb-1"><Brain className="w-6 h-6 mr-2 text-white" /> AI Menu Engineering</h2>
          <p className="text-xs text-[#fbe6ea] font-medium">Automatic recipe optimization, margin diagnostics, and dynamic price modeling.</p>
        </div>
        <button 
          onClick={() => {
            setAnalyzing(true);
            setTimeout(() => setAnalyzing(false), 1000);
          }}
          disabled={analyzing}
          className="bg-white text-[#800000] px-5 py-2.5 rounded-xl text-xs font-black shadow-xs hover:bg-[#fee8eb] transition-colors cursor-pointer disabled:opacity-80 flex items-center"
        >
          {analyzing ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-2 border-[#800000] border-t-transparent mr-2"></div> Analyzing...</>
          ) : (
            <><Brain className="w-4 h-4 mr-1.5" /> Run AI Diagnostics</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-[360px]">
          <div className="p-4 border-b border-[#ebd5da] flex items-center bg-[#fdf5f6]">
            <TrendingUp className="w-5 h-5 text-[#800000] mr-2" />
            <h3 className="font-bold text-[#800000] text-sm">Most Profitable Recipes</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {mostProfitable.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                <div>
                  <p className="font-black text-sm text-[#800000]">{r.name}</p>
                  <p className="text-xs text-[#800000]/70 font-semibold">Margin: {r.costing?.marginPercentage.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-[#800000]">₹{r.costing?.grossProfit.toFixed(2)} / unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-[360px]">
          <div className="p-4 border-b border-[#ebd5da] flex items-center bg-[#fdf5f6]">
            <TrendingDown className="w-5 h-5 text-[#800000] mr-2" />
            <h3 className="font-bold text-[#800000] text-sm">Target Optimization Recipes</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {leastProfitable.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                <div>
                  <p className="font-black text-sm text-[#800000]">{r.name}</p>
                  <p className="text-xs text-[#800000]/70 font-semibold">Margin: {r.costing?.marginPercentage.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-[#800000]">₹{r.costing?.grossProfit.toFixed(2)} / unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#ebd5da] flex items-center bg-[#fdf5f6]">
            <Lightbulb className="w-5 h-5 text-[#800000] mr-2" />
            <h3 className="font-bold text-[#800000] text-sm">Suggested Selling Price Adjustments</h3>
          </div>
          <div className="p-4 space-y-3">
            {recipes.filter(r => (r.costing?.marginPercentage || 0) < 35).slice(0, 3).map(r => {
              const suggested = calculateSellingPriceRecommendation(r.costing?.totalCost || 0, 35);
              return (
                <div key={r.id} className="p-3 border border-[#ebd5da] rounded-xl bg-[#fdf5f6]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-sm text-[#800000]">{r.name}</span>
                    <span className="text-[10px] font-black text-white bg-[#800000] px-2 py-0.5 rounded-full uppercase">Target: 35%</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-[#800000]/80">
                    <span>Current Price: ₹{r.costing?.sellingPrice}</span>
                    <span className="font-black text-[#800000]">Suggested: ₹{suggested.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#ebd5da] flex items-center bg-[#fdf5f6]">
            <AlertTriangle className="w-5 h-5 text-[#800000] mr-2" />
            <h3 className="font-bold text-[#800000] text-sm">Batch Quality & Wastage Insights</h3>
          </div>
          <div className="p-4 space-y-3">
            {productionOrders.filter(o => o.wasteQuantity && o.wasteQuantity > 0).slice(0, 3).map(o => (
              <div key={o.id} className="p-3 border border-[#ebd5da] rounded-xl bg-[#fdf5f6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-[#800000]">{o.recipeName} ({o.batchNumber})</span>
                  <span className="text-xs font-black text-[#800000]">{o.wasteQuantity} {o.unit} wasted</span>
                </div>
                <p className="text-xs text-[#800000]/70 font-medium">Recorded Reason: {o.wasteReason || 'Standard trimming'}</p>
              </div>
            ))}
            {productionOrders.filter(o => o.wasteQuantity && o.wasteQuantity > 0).length === 0 && (
              <p className="text-xs font-semibold text-[#800000]/70 py-4 text-center">No abnormal waste incidents logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
