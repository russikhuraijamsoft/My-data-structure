import React, { useEffect, useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { ClipboardList, ScrollText, TrendingUp, Brain, FileText, ShoppingCart } from 'lucide-react';
import { RecipeList } from '../components/RecipeList';
import { ProductionOrderList } from '../components/ProductionOrderList';
import { ManufacturingDashboard } from '../components/ManufacturingDashboard';
import { ManufacturingAI } from '../components/ManufacturingAI';
import { ManufacturingReports } from '../components/ManufacturingReports';
import { ManufacturingPurchasing } from '../components/ManufacturingPurchasing';

type TabType = 'DASHBOARD' | 'RECIPES' | 'PRODUCTION' | 'PURCHASING' | 'AI' | 'REPORTS';

export function ManufacturingPage() {
  const { loadData, loading } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] text-[#800000]">
      <div className="flex-none p-4 md:p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-[#800000]">Kitchen Manufacturing & Recipes</h1>
            <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Bill of materials, recipe cost calculator, and kitchen prep batches</p>
          </div>
        </div>

        <div className="flex space-x-1 border-b border-[#ebd5da] overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'DASHBOARD'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('RECIPES')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'RECIPES'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ScrollText className="w-4 h-4 mr-1.5" />
            Recipes & BOM
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTION')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'PRODUCTION'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ClipboardList className="w-4 h-4 mr-1.5" />
            Prep Batches
          </button>
          <button
            onClick={() => setActiveTab('PURCHASING')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'PURCHASING'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Stock Forecast
          </button>
          <button
            onClick={() => setActiveTab('AI')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'AI'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <Brain className="w-4 h-4 mr-1.5" />
            AI Engineering
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center whitespace-nowrap cursor-pointer ${
              activeTab === 'REPORTS'
                ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
            }`}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Cost Reports
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#800000] border-t-transparent"></div>
          </div>
        ) : (
          <div className="h-full">
            {activeTab === 'DASHBOARD' && <ManufacturingDashboard />}
            {activeTab === 'RECIPES' && <RecipeList />}
            {activeTab === 'PRODUCTION' && <ProductionOrderList />}
            {activeTab === 'AI' && <ManufacturingAI />}
            {activeTab === 'PURCHASING' && <ManufacturingPurchasing />}
            {activeTab === 'REPORTS' && <ManufacturingReports />}
          </div>
        )}
      </div>
    </div>
  );
}
