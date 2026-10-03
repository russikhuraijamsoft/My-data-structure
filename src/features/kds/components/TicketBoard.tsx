import React from 'react';
import { useKdsStore } from '../store/kdsStore';
import { TicketCard } from './TicketCard';
import { ChefHat } from 'lucide-react';

export function TicketBoard() {
  const { tickets, activeStationId } = useKdsStore();

  const sortedTickets = [...tickets].sort((a, b) => {
    const priorityWeight = { URGENT: 3, HIGH: 2, NORMAL: 1 };
    const pA = priorityWeight[a.priority];
    const pB = priorityWeight[b.priority];
    
    if (pA !== pB) return pB - pA;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (sortedTickets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#800000]/60 p-8">
        <div className="w-20 h-20 bg-[#fdf5f6] border border-[#ebd5da] rounded-full flex items-center justify-center mb-4">
          <ChefHat className="w-10 h-10 text-[#800000]/50" />
        </div>
        <h3 className="text-xl font-bold text-[#800000]">All caught up!</h3>
        <p className="mt-1 text-sm font-medium text-[#800000]/70">No active tickets for this station.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-x-auto bg-[#fdf5f6]/50">
      <div className="flex gap-4 h-full items-start pb-4 min-w-max">
        {sortedTickets.map(ticket => (
          <div key={ticket.id} className="w-80 shrink-0">
            <TicketCard ticket={ticket} activeStationId={activeStationId} />
          </div>
        ))}
      </div>
    </div>
  );
}
