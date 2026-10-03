import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { AdminDashboard } from '../components/AdminDashboard';
import { UserManagement } from '../components/UserManagement';
import { BranchManagement } from '../components/BranchManagement';
import { SystemConfigForm } from '../components/SystemConfigForm';
import { GCloudOperationsHub } from '../components/GCloudOperationsHub';
import { Settings, Users, Building, ShieldCheck, Cloud } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'dashboard';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'branches' | 'config' | 'gcloud'>(
    ['dashboard', 'users', 'branches', 'config', 'gcloud'].includes(initialTab) ? initialTab : 'dashboard'
  );
  const { loadAdminData, loading } = useAdminStore();

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const tabs = [
    { id: 'dashboard', label: 'System Overview', icon: ShieldCheck },
    { id: 'gcloud', label: 'Google Cloud (gcloud)', icon: Cloud },
    { id: 'users', label: 'Staff & Roles', icon: Users },
    { id: 'branches', label: 'Outlets', icon: Building },
    { id: 'config', label: 'Configuration', icon: Settings },
  ] as const;

  const handleTabChange = (tabId: 'dashboard' | 'users' | 'branches' | 'config' | 'gcloud') => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'dashboard' ? {} : { tab: tabId });
  };

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">Administration & Google Cloud Operations</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Manage permissions, multi-outlet settings, and Google Cloud production deployment</p>
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
                onClick={() => handleTabChange(tab.id as any)}
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

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#800000]">
          <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="py-2">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'gcloud' && <GCloudOperationsHub />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'config' && <SystemConfigForm />}
        </div>
      )}
    </div>
  );
}
