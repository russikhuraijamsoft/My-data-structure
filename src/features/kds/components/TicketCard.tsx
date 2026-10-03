import React, { useEffect, useState } from 'react';
import { Ticket, TicketItem } from '../models/kds';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useKdsStore } from '../store/kdsStore';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  activeStationId: string | null;
}

export function TicketCard({ ticket, activeStationId }: TicketCardProps) {
  const { updateTicketStatus } = useKdsStore();
  const [elapsed, setElapsed] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const created = new Date(ticket.createdAt);
      const target = new Date(ticket.targetTime);
      const now = new Date();
      
      setElapsed(formatDistanceToNow(created, { addSuffix: false }));
      
      if (differenceInMinutes(now, target) > 0 && ticket.status !== 'READY') {
        setIsDelayed(true);
      } else {
        setIsDelayed(false);
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [ticket.createdAt, ticket.targetTime, ticket.status]);

  const displayItems = ticket.items.filter(item => 
    !activeStationId || activeStationId === 'st_5' || item.stationId === activeStationId
  );

  if (displayItems.length === 0) return null;

  const headerColors = {
    NORMAL: 'bg-[#fdf5f6] text-[#800000] border-b border-[#ebd5da]',
    HIGH: 'bg-[#800000] text-white',
    URGENT: 'bg-[#680016] text-white animate-pulse',
  };

  const handleNextTicketState = () => {
    if (ticket.status === 'NEW') updateTicketStatus(ticket.id, 'ACCEPTED');
    else if (ticket.status === 'ACCEPTED') updateTicketStatus(ticket.id, 'PREPARING');
    else if (ticket.status === 'PREPARING') updateTicketStatus(ticket.id, 'READY');
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-xs border overflow-hidden ${
      isDelayed ? 'border-[#800000] ring-2 ring-[#800000]/20' : 'border-[#ebd5da]'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center ${headerColors[ticket.priority]}`}>
        <div>
          <h3 className="font-black text-lg leading-none">{ticket.orderNumber}</h3>
          <p className="text-xs font-bold opacity-90 mt-1 uppercase tracking-wider">{ticket.type} {ticket.tableNumber && `• ${ticket.tableNumber}`}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-black text-base">
            {isDelayed && <AlertTriangle className="w-4 h-4 text-[#800000]" />}
            <span>{elapsed}</span>
          </div>
          <p className="text-xs opacity-80 font-medium">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#fdf5f6] p-2.5 flex justify-between items-center border-b border-[#ebd5da]">
        <span className="text-xs font-black px-2.5 py-1 rounded-md bg-white border border-[#ebd5da] text-[#800000]">
          {ticket.status}
        </span>
        {ticket.status !== 'READY' && (
          <button 
            onClick={handleNextTicketState}
            className="text-xs font-black px-3.5 py-1.5 rounded-lg bg-[#800000] text-white hover:bg-[#680016] transition-colors cursor-pointer"
          >
            {ticket.status === 'NEW' ? 'ACCEPT' : ticket.status === 'ACCEPTED' ? 'START PREP' : 'MARK READY'}
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-96">
        {displayItems.map((item) => (
          <TicketItemRow 
            key={item.id} 
            item={item} 
            ticketId={ticket.id}
          />
        ))}
      </div>
    </div>
  );
}

function TicketItemRow({ item, ticketId }: { item: TicketItem, ticketId: string }) {
  const { updateItemStatus } = useKdsStore();
  const isDone = item.status === 'READY';

  const toggleStatus = () => {
    updateItemStatus(ticketId, item.id, isDone ? 'PENDING' : 'READY');
  };

  return (
    <div 
      onClick={toggleStatus}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isDone 
          ? 'bg-[#fdf5f6] border-[#ebd5da] opacity-60' 
          : 'bg-white border-[#ebd5da] hover:border-[#800000] shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {isDone ? (
            <CheckCircle className="w-5 h-5 text-[#800000]" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[#dcabb5]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className={`font-black text-sm leading-tight ${isDone ? 'line-through text-[#800000]/50' : 'text-[#800000]'}`}>
              <span className="mr-1.5 text-[#800000]">{item.quantity}x</span>
              {item.productName}
            </span>
          </div>
          
          {item.modifiers.length > 0 && (
            <ul className={`mt-1 space-y-0.5 ${isDone ? 'line-through text-[#800000]/40' : 'text-[#800000]/80'}`}>
              {item.modifiers.map((mod, idx) => (
                <li key={idx} className="text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#800000]"></span>
                  {mod}
                </li>
              ))}
            </ul>
          )}

          {item.notes && (
            <div className={`mt-1.5 p-1.5 rounded bg-[#fdf5f6] border border-[#ebd5da] text-xs font-bold ${isDone ? 'text-[#800000]/40' : 'text-[#800000]'}`}>
              Note: {item.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
