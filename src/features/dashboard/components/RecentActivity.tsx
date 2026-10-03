import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Activity, ShoppingCart, UserMinus, PackageCheck, Banknote } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    { id: 1, type: 'order', text: 'New order #1042 placed via Dine-in POS', time: '2 mins ago', icon: ShoppingCart },
    { id: 2, type: 'inventory', text: 'Purchase Order PO-2026 received in full', time: '15 mins ago', icon: PackageCheck },
    { id: 3, type: 'void', text: 'Item voided on Ticket #1038 by Manager', time: '45 mins ago', icon: UserMinus },
    { id: 4, type: 'payout', text: 'Cash drawer payout: ₹1,500.00 for Supplies', time: '1 hour ago', icon: Banknote },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#ebd5da]">
        <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
          <Activity className="w-5 h-5 text-[#800000]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative border-l-2 border-[#ebd5da] ml-3 space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <span className="absolute -left-[17px] w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                <activity.icon className="w-4 h-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#800000]">
                  {activity.text}
                </p>
                <p className="text-xs text-[#800000]/70 mt-1 font-medium">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
