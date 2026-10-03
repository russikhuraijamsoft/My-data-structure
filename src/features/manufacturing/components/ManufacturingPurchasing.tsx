import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { ShoppingCart, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export function ManufacturingPurchasing() {
  const { recipes, productionOrders } = useManufacturingStore();
  const { items: inventoryItems } = useInventoryStore();
  const [forecastDays, setForecastDays] = useState(7);

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentOrders = productionOrders.filter(o => 
    (o.status === 'COMPLETED' || o.status === 'IN_PROGRESS') && 
    new Date(o.createdAt).getTime() >= thirtyDaysAgo
  );

  const consumptionMap = new Map<string, { unit: string, qty: number }>();
  recentOrders.forEach(order => {
    const recipe = recipes.find(r => r.id === order.recipeId);
    if (recipe) {
      const ratio = (order.actualQuantity || order.plannedQuantity) / recipe.yieldQuantity;
      recipe.ingredients.forEach(ing => {
        if (!consumptionMap.has(ing.itemName)) consumptionMap.set(ing.itemName, { unit: ing.unit, qty: 0 });
        consumptionMap.get(ing.itemName)!.qty += ing.quantity * ratio;
      });
    }
  });

  const dailyConsumption = new Map<string, number>();
  consumptionMap.forEach((data, itemName) => {
    dailyConsumption.set(itemName, data.qty / 30);
  });

  const recommendations = inventoryItems.map(item => {
    const daily = dailyConsumption.get(item.name) || 0;
    const forecastedNeed = daily * forecastDays;
    const projectedStock = item.currentStock - forecastedNeed;
    
    let recommendation = 0;
    let status = 'OK';
    
    if (projectedStock <= item.minimumStock) {
      recommendation = (item.reorderLevel > 0 ? item.reorderLevel : item.minimumStock * 2) - projectedStock;
      status = 'REORDER';
    } else if (item.currentStock <= item.minimumStock) {
      recommendation = (item.reorderLevel > 0 ? item.reorderLevel : item.minimumStock * 2) - item.currentStock;
      status = 'CRITICAL';
    }

    return {
      ...item,
      daily,
      forecastedNeed,
      projectedStock,
      recommendation,
      status
    };
  }).filter(r => r.recommendation > 0 || r.daily > 0).sort((a, b) => b.recommendation - a.recommendation);

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="bg-white rounded-xl border border-[#ebd5da] p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-[#800000] flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-[#800000]" /> 
            Smart Purchasing Recommendations
          </h2>
          <p className="text-xs text-[#800000]/70 mt-1 font-medium">Real-time inventory run-out forecasting based on POS sales and recipe BOMs.</p>
        </div>
        <div className="flex items-center space-x-3 bg-[#fdf5f6] p-2.5 rounded-xl border border-[#ebd5da]">
          <label className="text-xs font-bold text-[#800000] whitespace-nowrap">Forecast Horizon:</label>
          <select 
            value={forecastDays}
            onChange={(e) => setForecastDays(Number(e.target.value))}
            className="px-3 py-1.5 bg-white border border-[#ebd5da] rounded-lg text-xs font-bold text-[#800000]"
          >
            <option value={3}>Next 3 Days</option>
            <option value={7}>Next 7 Days</option>
            <option value={14}>Next 14 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#ebd5da]">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Daily Avg</th>
                <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">{forecastDays}d Need</th>
                <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Projected</th>
                <th className="px-6 py-3 text-right text-xs font-black text-[#800000] uppercase tracking-wider">Suggested Order</th>
                <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#ebd5da]">
              {recommendations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#800000]/60">
                    <CheckCircle2 className="w-12 h-12 text-[#dcabb5] mx-auto mb-3" />
                    <p className="text-base font-bold text-[#800000]">Inventory levels are healthy.</p>
                    <p className="text-xs text-[#800000]/70 mt-1">No emergency purchases recommended for this horizon.</p>
                  </td>
                </tr>
              ) : (
                recommendations.map(item => (
                  <tr key={item.id} className="hover:bg-[#fdf5f6] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#800000]">
                      {item.name}
                      <p className="text-[10px] text-[#800000]/60 font-semibold">Min: {item.minimumStock}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#800000] text-right font-medium">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#800000]/80 text-right">
                      {item.daily > 0 ? item.daily.toFixed(2) : '-'} {item.unit}/day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#800000]/80 text-right">
                      {item.forecastedNeed > 0 ? item.forecastedNeed.toFixed(2) : '-'} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-[#800000]">
                      {item.projectedStock.toFixed(2)} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-[#800000] text-right bg-[#fdf5f6]">
                      {item.recommendation > 0 ? `${item.recommendation.toFixed(2)} ${item.unit}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                      {item.status === 'CRITICAL' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#fee8eb] text-[#800000] border border-[#ebd5da] inline-flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1 text-[#800000]" /> Critical
                        </span>
                      ) : item.status === 'REORDER' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#fdf5f6] text-[#800000] border border-[#ebd5da] inline-flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1 text-[#800000]" /> Reorder Soon
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#800000] border border-[#ebd5da] inline-flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-[#800000]" /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
