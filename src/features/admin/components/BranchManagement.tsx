import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Building2, Plus, MapPin } from 'lucide-react';

export function BranchManagement() {
  const { branches } = useAdminStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-black text-[#800000]">Restaurant Outlets & Branches</h2>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Outlet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(branch => (
          <Card key={branch.id} className="hover:border-[#800000] transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#800000]">{branch.name}</h3>
                  <p className="text-[10px] font-bold text-[#800000]/70">Code: {branch.code}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#800000]/80">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#800000]" />
                  {branch.address}
                </p>
                <div className="pt-2 border-t border-[#ebd5da] flex justify-between text-[11px] font-semibold">
                  <span className="text-[#800000]/70">GSTIN: {branch.gstin || 'N/A'}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                    {branch.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
