import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { Save } from 'lucide-react';

export function SystemConfigForm() {
  const { config } = useAdminStore();

  if (!config) return null;

  return (
    <div className="space-y-6 max-w-4xl text-[#800000]">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-black text-[#800000]">System Parameters & Tax Rules</h2>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white rounded-xl text-xs font-bold hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#800000]">General Group Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#800000]">Company / Brand Name</label>
              <input 
                type="text" 
                defaultValue={config.companyName}
                className="w-full px-3 py-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#800000]">Operational Currency</label>
              <select 
                defaultValue={config.defaultCurrency}
                className="w-full px-3 py-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]"
              >
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#800000]">Taxation Engine</label>
              <select 
                defaultValue={config.taxType}
                className="w-full px-3 py-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]"
              >
                <option value="GST (5%)">GST (5% Restaurant Standard: 2.5% CGST + 2.5% SGST)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#800000]">Time Zone</label>
              <select 
                defaultValue={config.timezone}
                className="w-full px-3 py-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl text-[#800000] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
