import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { ChefHat, Clock, AlertCircle } from 'lucide-react';

export function KitchenStatusWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
          <ChefHat className="w-5 h-5 text-[#800000]" />
          Kitchen Status
        </CardTitle>
        <span className="px-2.5 py-1 bg-[#fee8eb] text-[#800000] rounded-full text-xs font-bold border border-[#ebd5da]">
          Active
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-2xl font-black text-[#800000]">12</p>
            <p className="text-xs text-[#800000]/70 font-semibold">Open Tickets</p>
          </div>
          <div className="bg-[#fdf5f6] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-2xl font-black text-[#800000]">14m</p>
            <p className="text-xs text-[#800000]/70 font-semibold">Avg Prep Time</p>
          </div>
          <div className="bg-[#fee8eb] p-3 rounded-lg border border-[#ebd5da]">
            <p className="text-2xl font-black text-[#800000]">3</p>
            <p className="text-xs text-[#800000] font-bold">Delayed</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#800000] mb-2">Delayed Tickets</h4>
          
          <div className="flex items-center justify-between p-3 bg-white border border-[#ebd5da] rounded-lg shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#800000] text-white flex items-center justify-center font-bold text-sm">
                #42
              </div>
              <div>
                <p className="text-sm font-bold text-[#800000]">Table 4</p>
                <p className="text-xs text-[#800000]/70 flex items-center gap-1 font-medium"><Clock className="w-3 h-3"/> 24 min ago</p>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-[#800000]" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white border border-[#ebd5da] rounded-lg shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#800000] text-white flex items-center justify-center font-bold text-sm">
                #45
              </div>
              <div>
                <p className="text-sm font-bold text-[#800000]">Takeout - John</p>
                <p className="text-xs text-[#800000]/70 flex items-center gap-1 font-medium"><Clock className="w-3 h-3"/> 21 min ago</p>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-[#800000]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
