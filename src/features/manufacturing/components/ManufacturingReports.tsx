import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Download } from 'lucide-react';

export function ManufacturingReports() {
  const { recipes, productionOrders } = useManufacturingStore();
  const [activeReport, setActiveReport] = useState<'RECIPE_COST' | 'CONSUMPTION' | 'PRODUCTION' | 'YIELD'>('RECIPE_COST');

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h2 className="text-base font-black text-[#800000]">Manufacturing Reports</h2>
        <div className="flex space-x-2">
          <select 
            value={activeReport}
            onChange={e => setActiveReport(e.target.value as any)}
            className="px-3 py-1.5 border border-[#ebd5da] rounded-xl text-xs font-bold bg-white text-[#800000] focus:outline-none"
          >
            <option value="RECIPE_COST">Recipe Cost & Profitability</option>
            <option value="CONSUMPTION">Ingredient Consumption</option>
            <option value="PRODUCTION">Batch Production Log</option>
            <option value="YIELD">Yield & Waste Analysis</option>
          </select>
          <button 
            onClick={() => window.print()}
            className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeReport === 'RECIPE_COST' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#800000] mb-3">Recipe Cost & Profitability Report</h3>
            <table className="min-w-full divide-y divide-[#ebd5da]">
              <thead className="bg-[#fdf5f6]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-black text-[#800000] uppercase">Recipe</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Food Cost</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Utilities</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Total Cost</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Price</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Food Cost %</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd5da]">
                {recipes.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fdf5f6] text-xs">
                    <td className="px-4 py-3 font-bold text-[#800000]">{item.name}</td>
                    <td className="px-4 py-3 text-right">₹{item.costing?.ingredientsCost?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-right">₹{((item.costing?.gasCost || 0) + (item.costing?.electricityCost || 0) + (item.costing?.waterCost || 0)).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-black">₹{item.costing?.totalCost?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-right">₹{item.costing?.sellingPrice?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-right">
                      {item.costing?.sellingPrice > 0 ? ((item.costing.totalCost / item.costing.sellingPrice) * 100).toFixed(1) + '%' : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-[#800000]">{item.costing?.marginPercentage?.toFixed(1) || '0.0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'PRODUCTION' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#800000] mb-3">Batch Production Summary</h3>
            <table className="min-w-full divide-y divide-[#ebd5da]">
              <thead className="bg-[#fdf5f6]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-black text-[#800000] uppercase">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-black text-[#800000] uppercase">Batch No</th>
                  <th className="px-4 py-2.5 text-left text-xs font-black text-[#800000] uppercase">Recipe</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Target Qty</th>
                  <th className="px-4 py-2.5 text-right text-xs font-black text-[#800000] uppercase">Actual Qty</th>
                  <th className="px-4 py-2.5 text-center text-xs font-black text-[#800000] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd5da]">
                {productionOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fdf5f6] text-xs">
                    <td className="px-4 py-3">{new Date(order.plannedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-bold">{order.batchNumber}</td>
                    <td className="px-4 py-3 font-medium">{order.recipeName}</td>
                    <td className="px-4 py-3 text-right">{order.plannedQuantity} {order.unit}</td>
                    <td className="px-4 py-3 text-right font-bold">{order.actualQuantity || '-'} {order.unit}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeReport === 'CONSUMPTION' || activeReport === 'YIELD') && (
          <div className="text-center py-12 text-[#800000]/70 text-xs font-medium">
            Generating live breakdown from connected recipe records and production logs...
          </div>
        )}
      </div>
    </div>
  );
}
