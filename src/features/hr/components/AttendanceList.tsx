import React, { useState } from 'react';
import { useHrStore } from '../store/hrStore';
import { Search, Filter } from 'lucide-react';

export function AttendanceList() {
  const { attendance } = useHrStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendance = attendance.filter(a => 
    a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.date.includes(searchTerm)
  );

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search daily attendance..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#ebd5da] rounded-xl text-xs font-medium text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-[#ebd5da] text-[#800000] text-xs font-bold rounded-xl hover:bg-[#fdf5f6] transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span>Filter Date</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Date</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Staff Member</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Clock In</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Clock Out</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Overtime</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {filteredAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5 text-[#800000]/80">
                    {new Date(att.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3.5 font-bold text-[#800000]">
                    {att.employeeName}
                  </td>
                  <td className="p-3.5 text-[#800000]">
                    {att.clockIn ? new Date(att.clockIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                  </td>
                  <td className="p-3.5 text-[#800000]/70">
                    {att.clockOut ? new Date(att.clockOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#800000]">
                    {att.overtimeHours > 0 ? `${att.overtimeHours.toFixed(1)} hrs` : '-'}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
