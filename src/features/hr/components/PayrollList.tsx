import React from 'react';
import { useHrStore } from '../store/hrStore';

export function PayrollList() {
  const { payroll } = useHrStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdf5f6]">
              <tr>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Period</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase">Staff Member</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Gross (₹)</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Deductions (₹)</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-right">Net Pay (₹)</th>
                <th className="p-3.5 text-xs font-black text-[#800000] uppercase text-center">Disbursement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd5da] text-xs font-medium">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-[#fdf5f6] transition-colors">
                  <td className="p-3.5 text-[#800000]/80">
                    {p.month}/{p.year}
                  </td>
                  <td className="p-3.5 font-bold text-[#800000]">
                    {p.employeeName}
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#800000]">
                    ₹{p.grossEarnings.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right text-[#800000]/70">
                    ₹{p.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-black text-[#800000]">
                    ₹{p.netPay.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                      {p.status}
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
