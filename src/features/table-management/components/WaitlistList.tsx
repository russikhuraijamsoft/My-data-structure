import React from 'react';
import { useTableStore } from '../store/tableStore';
import { ListTodo, Users, Clock, CheckCircle } from 'lucide-react';

export function WaitlistList() {
  const { waitlist } = useTableStore();

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h3 className="text-base font-bold text-[#800000] flex items-center">
          <ListTodo className="w-5 h-5 mr-2 text-[#800000]" />
          Waitlist Queue
        </h3>
        <button className="bg-[#800000] hover:bg-[#680016] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs">
          Add Guest
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {waitlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#800000]/60 py-12">
            <ListTodo className="w-12 h-12 mb-3 text-[#dcabb5]" />
            <p className="font-semibold text-sm">Waitlist is currently empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {waitlist.map(entry => (
              <div key={entry.id} className="border border-[#ebd5da] rounded-xl p-4 bg-white flex items-center justify-between shadow-2xs">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-bold text-[#800000] mr-2 text-sm">{entry.customerName}</span>
                    <span className="text-xs bg-[#fdf5f6] text-[#800000] px-2 py-0.5 rounded border border-[#ebd5da] flex items-center font-bold">
                      <Users className="w-3 h-3 mr-1" /> {entry.guestCount}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-[#800000]/70 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#800000]" />
                    Quoted: {entry.quotedTime} (~{entry.estimatedWaitMinutes}m)
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-[#800000] hover:bg-[#fdf5f6] rounded-lg transition-colors cursor-pointer" title="Seat Guest">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
