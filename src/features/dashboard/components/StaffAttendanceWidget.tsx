import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Users } from 'lucide-react';

export function StaffAttendanceWidget() {
  const staff = [
    { name: 'Sarah J.', role: 'Server', status: 'clocked_in', time: '08:45 AM' },
    { name: 'Mike T.', role: 'Kitchen', status: 'clocked_in', time: '09:00 AM' },
    { name: 'Elena R.', role: 'Manager', status: 'clocked_in', time: '07:30 AM' },
    { name: 'David B.', role: 'Bartender', status: 'late', time: 'Expected 10:00 AM' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
          <Users className="w-5 h-5 text-[#800000]" />
          Shift Status
        </CardTitle>
        <span className="text-sm font-bold text-[#800000]/80">
          8 / 10 Present
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {staff.map((employee, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-[#ebd5da] last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-xs font-bold text-[#800000]">
                    {employee.name.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    employee.status === 'clocked_in' ? 'bg-[#800000]' : 'bg-[#dcabb5]'
                  }`}></span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#800000] leading-none">{employee.name}</p>
                  <p className="text-xs text-[#800000]/70 mt-1 font-medium">{employee.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#800000]">
                  {employee.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
