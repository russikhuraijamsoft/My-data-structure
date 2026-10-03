import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { Users, Building, Activity, ShieldCheck } from 'lucide-react';

export function AdminDashboard() {
  const { users, branches, logs } = useAdminStore();

  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const activeBranches = branches.filter(b => b.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Users" value={activeUsers.toString()} icon={<Users className="w-5 h-5 text-[#800000]" />} />
        <StatCard title="Active Outlets" value={activeBranches.toString()} icon={<Building className="w-5 h-5 text-[#800000]" />} />
        <StatCard title="POS Nodes Status" value="100% Online" icon={<Activity className="w-5 h-5 text-[#800000]" />} />
        <StatCard title="Audit Events" value={logs.length.toString()} icon={<ShieldCheck className="w-5 h-5 text-[#800000]" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">System Security & Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex justify-between items-start p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{log.action}</p>
                    <p className="text-xs text-[#800000]/70 font-medium">{log.userName} • {log.module} • {log.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#800000]/60 font-semibold">{new Date(log.timestamp).toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Branch Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branches.map(branch => (
                <div key={branch.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{branch.name}</p>
                    <p className="text-xs text-[#800000]/70">{branch.address}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800000] text-white">
                    {branch.code} • Active
                  </span>
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
