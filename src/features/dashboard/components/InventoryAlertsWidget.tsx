import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Package, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InventoryAlertsWidget() {
  const alerts = [
    { item: 'Avocado', stock: 12, unit: 'units', status: 'critical' },
    { item: 'Sirloin Steak', stock: 4, unit: 'kg', status: 'critical' },
    { item: 'Tomatoes', stock: 15, unit: 'kg', status: 'warning' },
    { item: 'Craft IPA', stock: 8, unit: 'bottles', status: 'warning' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
          <Package className="w-5 h-5 text-[#800000]" />
          Low Stock Alerts
        </CardTitle>
        <span className="w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold">
          4
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#fdf5f6] rounded-lg border border-[#ebd5da]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-[#800000]" />
                <p className="text-sm font-bold text-[#800000]">{alert.item}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                alert.status === 'critical' 
                  ? 'bg-[#fee8eb] text-[#800000] border border-[#ebd5da]'
                  : 'bg-white text-[#800000] border border-[#ebd5da]'
              }`}>
                {alert.stock} {alert.unit} left
              </span>
            </div>
          ))}
        </div>
        
        <Link 
          to="/inventory"
          className="mt-4 block w-full text-center text-sm font-bold text-[#800000] py-2 border border-[#ebd5da] rounded-lg bg-[#fdf5f6] hover:bg-[#fee8eb] transition-colors"
        >
          View all inventory
        </Link>
      </CardContent>
    </Card>
  );
}
