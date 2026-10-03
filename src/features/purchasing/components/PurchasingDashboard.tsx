import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { usePurchasingStore } from '../store/purchasingStore';
import { TrendingUp, FileText, Truck, Users } from 'lucide-react';

export function PurchasingDashboard() {
  const { suppliers, purchaseOrders } = usePurchasingStore();

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);
  const pendingApprovals = purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length;
  const pendingDeliveries = purchaseOrders.filter(po => po.status === 'APPROVED' || po.status === 'PARTIAL').length;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Procurement Spend" 
          value={`₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingApprovals.toString()}
          icon={<FileText className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Outstanding Deliveries" 
          value={pendingDeliveries.toString()}
          icon={<Truck className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Active Suppliers" 
          value={suppliers.filter(s => s.status === 'ACTIVE').length.toString()}
          icon={<Users className="w-5 h-5 text-[#800000]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchaseOrders.slice(0, 5).map(po => (
                <div key={po.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{po.poNumber}</p>
                    <p className="text-xs text-[#800000]/70 font-medium">{po.supplierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#800000]">₹{po.grandTotal.toFixed(2)}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#800000] border border-[#ebd5da]">
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Supplier Rating & Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suppliers.slice(0, 5).map(supplier => (
                <div key={supplier.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{supplier.name}</p>
                    <p className="text-xs text-[#800000]/70 font-medium">{supplier.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#ebd5da]">
                    <span className="text-xs font-black text-[#800000]">★ {supplier.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#800000]/70">{title}</p>
          <div className="p-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-black text-[#800000] truncate">{value}</h3>
      </CardContent>
    </Card>
  );
}
