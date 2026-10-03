import React, { useState, useEffect } from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { PurchasingDashboard } from '../components/PurchasingDashboard';
import { SupplierList } from '../components/SupplierList';
import { PurchaseOrdersList } from '../components/PurchaseOrdersList';
import { LayoutDashboard, Users, FileText, Truck } from 'lucide-react';

export function PurchasingPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suppliers' | 'pos' | 'grn'>('dashboard');
  const { loadSuppliers, loadPurchaseOrders, loading } = usePurchasingStore();

  useEffect(() => {
    loadSuppliers();
    loadPurchaseOrders();
  }, [loadSuppliers, loadPurchaseOrders]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'pos', label: 'Purchase Orders', icon: FileText },
    { id: 'grn', label: 'Goods Receiving', icon: Truck },
  ] as const;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">Purchasing & Suppliers</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Manage suppliers, purchase orders, and receiving</p>
        </div>
      </div>

      <div className="border-b border-[#ebd5da]">
        <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-xs whitespace-nowrap transition-colors cursor-pointer
                  ${isActive 
                    ? 'border-[#800000] text-[#800000]' 
                    : 'border-transparent text-[#800000]/70 hover:text-[#800000]'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {loading && activeTab === 'dashboard' ? (
        <div className="flex items-center justify-center h-64 text-[#800000]">
          <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="py-2">
          {activeTab === 'dashboard' && <PurchasingDashboard />}
          {activeTab === 'suppliers' && <SupplierList />}
          {activeTab === 'pos' && <PurchaseOrdersList />}
          {activeTab === 'grn' && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[#ebd5da] rounded-2xl bg-[#fdf5f6]/50">
              <Truck className="w-12 h-12 text-[#dcabb5] mb-3" />
              <h3 className="text-base font-bold text-[#800000] mb-1">Goods Receiving Note (GRN)</h3>
              <p className="text-xs text-[#800000]/70 max-w-md">
                Select a Purchase Order to receive incoming deliveries or reconcile quantities against packing slips.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
