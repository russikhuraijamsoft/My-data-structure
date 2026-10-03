import React, { useEffect, useState } from 'react';
import { useKdsStore } from '../store/kdsStore';
import { TicketBoard } from './TicketBoard';
import { KdsAnalytics } from './KdsAnalytics';
import { ChefHat, Clock, CheckSquare, BarChart3, ListOrdered } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';

export function KdsLayout() {
  const { stations, activeStationId, setActiveStation, loadStations, subscribeToTickets, tickets } = useKdsStore();
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics'>('queue');

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets, activeStationId]);

  const activeTicketsCount = tickets.filter(t => t.status !== 'READY').length;
  let totalPrepTime = 0;
  let delayedCount = 0;

  tickets.forEach(t => {
    if (t.status !== 'READY') {
      const created = new Date(t.createdAt);
      const target = new Date(t.targetTime);
      const now = new Date();
      totalPrepTime += Math.max(0, differenceInMinutes(now, created));
      if (differenceInMinutes(now, target) > 0) delayedCount++;
    }
  });

  const avgPrepTime = activeTicketsCount > 0 ? Math.round(totalPrepTime / activeTicketsCount) : 0;

  return (
    <div className="flex flex-col h-full bg-white border border-[#ebd5da] rounded-xl overflow-hidden shadow-xs text-[#800000]">
      {/* Header */}
      <div className="h-16 bg-[#800000] text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-white" />
            <h1 className="text-xl font-black tracking-tight">KDS</h1>
          </div>
          
          <div className="flex bg-[#680016] rounded-lg p-1 mx-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'queue' ? 'bg-white text-[#800000]' : 'text-white/80 hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span className="hidden sm:inline">Live Queue</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'analytics' ? 'bg-white text-[#800000]' : 'text-white/80 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>

          <div className="h-6 w-px bg-white/30 mx-1"></div>
          
          {/* Station Selector */}
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
            {stations.map(station => (
              <button
                key={station.id}
                onClick={() => setActiveStation(station.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeStationId === station.id 
                    ? 'bg-white text-[#800000] shadow-xs' 
                    : 'bg-[#680016] text-white hover:bg-[#550011]'
                }`}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#fbe6ea]" />
            <div>
              <p className="text-[10px] text-[#fbe6ea] uppercase tracking-wider font-bold">Active</p>
              <p className="text-base font-black leading-none">{activeTicketsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#fbe6ea]" />
            <div>
              <p className="text-[10px] text-[#fbe6ea] uppercase tracking-wider font-bold">Avg Time</p>
              <p className="text-base font-black leading-none">{avgPrepTime}m</p>
            </div>
          </div>
          {delayedCount > 0 && (
            <div className="flex items-center gap-2 bg-[#680016] px-3 py-1.5 rounded-lg border border-white/20">
               <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
               <div>
                 <p className="text-[10px] text-[#fbe6ea] uppercase tracking-wider font-bold">Delayed</p>
                 <p className="text-base font-black leading-none text-white">{delayedCount}</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      {activeTab === 'queue' ? <TicketBoard /> : <KdsAnalytics />}
    </div>
  );
}
