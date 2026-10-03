import React, { useState } from 'react';
import { useTableStore } from '../store/tableStore';
import { Calendar, User, Users, Clock, Edit, Plus } from 'lucide-react';
import { ReservationStatus } from '../models/table';

export function ReservationList() {
  const { reservations } = useTableStore();
  const [showAdd, setShowAdd] = useState(false);

  const getStatusColor = (status: ReservationStatus) => {
    switch(status) {
      case 'PENDING': return 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]';
      case 'CONFIRMED': return 'bg-[#fee8eb] text-[#800000] border border-[#ebd5da] font-bold';
      case 'SEATED': return 'bg-[#800000] text-white';
      case 'CANCELLED': return 'bg-slate-100 text-slate-500';
      case 'NO_SHOW': return 'bg-slate-200 text-slate-600';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <h3 className="text-base font-bold text-[#800000] flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#800000]" />
          Today's Reservations
        </h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[#800000] hover:bg-[#680016] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> New Booking
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#800000]/60 py-12">
            <Calendar className="w-12 h-12 mb-3 text-[#dcabb5]" />
            <p className="font-semibold text-sm">No reservations for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map(res => (
              <div key={res.id} className="border border-[#ebd5da] rounded-xl p-4 bg-white shadow-2xs">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-[#800000]/60 mr-2" />
                    <span className="font-bold text-[#800000]">{res.customerName}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(res.status)}`}>
                    {res.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-[#800000]/80 mt-2 font-medium">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#800000]" />
                    {res.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-[#800000]" />
                    {res.guestCount} guests
                  </div>
                </div>
                
                {res.notes && (
                  <div className="mt-2.5 text-xs text-[#800000]/70 bg-[#fdf5f6] p-2 rounded-lg border border-[#ebd5da]">
                    Note: {res.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
