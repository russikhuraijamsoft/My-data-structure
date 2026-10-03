import React from 'react';
import { useHrStore } from '../store/hrStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Users, Clock, CalendarDays, Wallet } from 'lucide-react';

export function HrDashboard() {
  const { employees, attendance, leaveRequests, payroll } = useHrStore();

  const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'PRESENT').length;
  const attendanceRate = activeEmployees > 0 ? (presentToday / activeEmployees) * 100 : 0;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING').length;
  const totalPayroll = payroll.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.grossEarnings, 0);

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Staff" 
          value={activeEmployees.toString()}
          icon={<Users className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${attendanceRate.toFixed(0)}%`}
          icon={<Clock className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Pending Leaves" 
          value={pendingLeaves.toString()}
          icon={<CalendarDays className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Monthly Wages" 
          value={`₹${totalPayroll.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={<Wallet className="w-5 h-5 text-[#800000]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.slice(0, 5).map(leave => (
                <div key={leave.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{leave.employeeName}</p>
                    <p className="text-xs text-[#800000]/70 font-medium">
                      {leave.type} Leave • {new Date(leave.startDate).toLocaleDateString('en-IN')} to {new Date(leave.endDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
              {leaveRequests.length === 0 && (
                <p className="text-xs text-[#800000]/70 text-center py-4 font-semibold">No pending leave requests.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Department Staffing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(employees.map(e => e.department))).map(dept => {
                const count = employees.filter(e => e.department === dept && e.status === 'ACTIVE').length;
                return (
                  <div key={dept} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                    <div>
                      <p className="font-bold text-sm text-[#800000]">{dept.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-[#800000]">{count} Staff</p>
                    </div>
                  </div>
                );
              })}
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
