import React from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { SalesSummaryWidget } from '../components/SalesSummaryWidget';
import { QuickActions } from '../components/QuickActions';
import { KitchenStatusWidget } from '../components/KitchenStatusWidget';
import { InventoryAlertsWidget } from '../components/InventoryAlertsWidget';
import { RecentActivity } from '../components/RecentActivity';
import { StaffAttendanceWidget } from '../components/StaffAttendanceWidget';
import { TaskCenterWidget } from '../components/TaskCenterWidget';

export function DashboardPage() {
  const { profile, hasRole } = useAuth();

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#800000]">
            Welcome back, {profile?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[#800000]/70 mt-1 font-medium">
            Here's what's happening at your restaurant today.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#ebd5da] rounded-lg px-4 py-2 shadow-xs text-sm font-bold text-[#800000]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <QuickActions />

      {/* Role-based conditional widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('ACCOUNTANT')) && (
            <SalesSummaryWidget />
          )}

          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('KITCHEN')) && (
            <KitchenStatusWidget />
          )}
          
          <RecentActivity />
        </div>

        {/* Sidebar Area - 1/3 width on large screens */}
        <div className="space-y-6">
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('INVENTORY')) && (
            <InventoryAlertsWidget />
          )}
          
          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER')) && (
            <TaskCenterWidget />
          )}

          {(hasRole('OWNER') || hasRole('ADMIN') || hasRole('MANAGER') || hasRole('HR')) && (
            <StaffAttendanceWidget />
          )}
          
          <div className="bg-white rounded-xl border border-[#ebd5da] p-6 shadow-xs">
            <h3 className="font-bold text-[#800000] mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#800000]/80">POS Terminals</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#800000]">
                  <span className="w-2 h-2 rounded-full bg-[#800000]"></span> 4/4 Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#800000]/80">KDS Screens</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#800000]">
                  <span className="w-2 h-2 rounded-full bg-[#800000]"></span> 2/2 Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#800000]/80">Payment Gateway</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#800000]">
                  <span className="w-2 h-2 rounded-full bg-[#800000]"></span> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#800000]/80">Sync State</span>
                <span className="text-sm font-bold text-[#800000]">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
