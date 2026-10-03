import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { UserPlus, Shield } from 'lucide-react';

export function UserManagement() {
  const { users } = useAdminStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-black text-[#800000]">Users & Access Control</h2>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
          <UserPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">User</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Role</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Outlets</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Status</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Last Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#800000]">{user.name}</span>
                      <span className="text-[10px] text-[#800000]/70">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      <Shield className="w-3 h-3 text-[#800000]" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#800000]/80">
                    {user.branchIds.length} Assigned
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-[#800000] border border-[#ebd5da]">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#800000]/70">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
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
