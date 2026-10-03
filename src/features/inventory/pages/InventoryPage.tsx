import React, { useEffect, useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Loader2, Package, FolderTree, Building2, LayoutDashboard, MapPin, Archive, RefreshCw, Activity, ArrowRightLeft } from 'lucide-react';
import { InventoryDashboard } from '../components/InventoryDashboard';
import { ItemMaster } from '../components/ItemMaster';
import { CategoryManagement } from '../components/CategoryManagement';
import { WarehouseManagement } from '../components/WarehouseManagement';
import { StorageLocations } from '../components/StorageLocations';
import { BatchManagement } from '../components/BatchManagement';
import { CycleCounting } from '../components/CycleCounting';
import { StockTransactions } from '../components/StockTransactions';
import { InventoryReports } from '../components/InventoryReports';

type TabType = 'DASHBOARD' | 'ITEMS' | 'CATEGORIES' | 'WAREHOUSES' | 'LOCATIONS' | 'BATCHES' | 'TRANSACTIONS' | 'CYCLE_COUNTS' | 'REPORTS';

export function InventoryPage() {
  const { loadInitialData, loading } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const tabs = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ITEMS', label: 'Item Master', icon: Package },
    { id: 'CATEGORIES', label: 'Categories', icon: FolderTree },
    { id: 'WAREHOUSES', label: 'Warehouses', icon: Building2 },
    { id: 'LOCATIONS', label: 'Storage & Bins', icon: MapPin },
    { id: 'BATCHES', label: 'Batches & Expiry', icon: Archive },
    { id: 'TRANSACTIONS', label: 'Stock Movement', icon: ArrowRightLeft },
    { id: 'CYCLE_COUNTS', label: 'Physical Verification', icon: RefreshCw },
    { id: 'REPORTS', label: 'Reports', icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#800000]">
      <div className="p-4 md:p-6 pb-0 border-b border-[#ebd5da] bg-white">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-[#800000]">Enterprise Inventory</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Comprehensive stock, valuation, and location tracking</p>
        </div>
        
        <div className="flex space-x-1 overflow-x-auto pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#800000] text-[#800000] bg-[#fdf5f6]'
                  : 'border-transparent text-[#800000]/70 hover:text-[#800000]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {loading && activeTab === 'DASHBOARD' ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#800000]" />
          </div>
        ) : (
          <>
            {activeTab === 'DASHBOARD' && <InventoryDashboard />}
            {activeTab === 'ITEMS' && <ItemMaster />}
            {activeTab === 'CATEGORIES' && <CategoryManagement />}
            {activeTab === 'WAREHOUSES' && <WarehouseManagement />}
            {activeTab === 'LOCATIONS' && <StorageLocations />}
            {activeTab === 'BATCHES' && <BatchManagement />}
            {activeTab === 'TRANSACTIONS' && <StockTransactions />}
            {activeTab === 'CYCLE_COUNTS' && <CycleCounting />}
            {activeTab === 'REPORTS' && <InventoryReports />}
          </>
        )}
      </div>
    </div>
  );
}
