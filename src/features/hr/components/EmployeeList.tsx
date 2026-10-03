import React, { useState } from 'react';
import { useHrStore } from '../store/hrStore';
import { Search, Plus, Filter, User } from 'lucide-react';

export function EmployeeList() {
  const { employees } = useHrStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#ebd5da] rounded-xl text-xs font-medium text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-[#ebd5da] text-[#800000] text-xs font-bold rounded-xl hover:bg-[#fdf5f6] transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Employee</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">ID</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Designation</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Department</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Joined</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#fdf5f6] border border-[#ebd5da] flex items-center justify-center text-[#800000]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#800000]">{emp.firstName} {emp.lastName}</div>
                        <div className="text-[10px] text-[#800000]/70">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-xs text-[#800000]/80">
                    {emp.employeeId}
                  </td>
                  <td className="p-3.5 font-bold text-[#800000]">
                    {emp.designation}
                  </td>
                  <td className="p-3.5 text-[#800000]/70">
                    {emp.department.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3.5 text-[#800000]/80">
                    {new Date(emp.dateOfJoining).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {emp.status}
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
