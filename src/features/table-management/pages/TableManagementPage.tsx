import React, { useEffect, useState } from 'react';
import { useTableStore } from '../store/tableStore';
import { Plus, Users, Calendar, ListTodo, Armchair, X } from 'lucide-react';
import { TableStatus } from '../models/table';
import { ReservationList } from '../components/ReservationList';
import { WaitlistList } from '../components/WaitlistList';

type SidebarView = 'NONE' | 'RESERVATIONS' | 'WAITLIST';

export function TableManagementPage() {
  const { floors, tables, loadData, updateTableStatus, updateTablePosition } = useTableStore();
  const [activeFloorId, setActiveFloorId] = useState<string>('');
  const [sidebarView, setSidebarView] = useState<SidebarView>('NONE');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    loadData(today);
  }, [loadData]);

  useEffect(() => {
    if (floors.length > 0 && !activeFloorId) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  const activeTables = tables.filter(t => t.floorId === activeFloorId);
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTableId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTableId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 30);
    const y = Math.max(0, e.clientY - rect.top - 30);
    
    await updateTablePosition(draggedTableId, x, y);
    setDraggedTableId(null);
  };

  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-[#fdf5f6] border-[#800000] text-[#800000]';
      case 'RESERVED': return 'bg-[#fbe6ea] border-[#800000] text-[#800000]';
      case 'OCCUPIED': return 'bg-[#800000] border-[#680016] text-white';
      case 'CLEANING': return 'bg-white border-[#ebd5da] text-[#800000]';
      default: return 'bg-white border-slate-300 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col text-[#800000]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#800000]">Table Management</h1>
          <p className="text-xs text-[#800000]/70 font-semibold mt-0.5">Floor layout, tables status, and seating queue</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setSidebarView(sidebarView === 'WAITLIST' ? 'NONE' : 'WAITLIST')}
            className={`px-3.5 py-2 rounded-xl flex items-center transition-colors shadow-xs text-xs font-bold cursor-pointer ${
              sidebarView === 'WAITLIST' 
                ? 'bg-[#800000] text-white' 
                : 'bg-white border border-[#ebd5da] hover:bg-[#fdf5f6] text-[#800000]'
            }`}
          >
            <ListTodo className="w-4 h-4 mr-1.5" /> Waitlist
          </button>
          <button 
            onClick={() => setSidebarView(sidebarView === 'RESERVATIONS' ? 'NONE' : 'RESERVATIONS')}
            className={`px-3.5 py-2 rounded-xl flex items-center transition-colors shadow-xs text-xs font-bold cursor-pointer ${
              sidebarView === 'RESERVATIONS'
                ? 'bg-[#800000] text-white'
                : 'bg-white border border-[#ebd5da] hover:bg-[#fdf5f6] text-[#800000]'
            }`}
          >
            <Calendar className="w-4 h-4 mr-1.5" /> Reservations
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Main Floor Plan Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Floor selector */}
          <div className="flex space-x-2 mb-4 shrink-0 overflow-x-auto pb-1">
            {floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => setActiveFloorId(floor.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeFloorId === floor.id 
                    ? 'bg-[#800000] text-white shadow-xs' 
                    : 'bg-white text-[#800000] border border-[#ebd5da] hover:bg-[#fdf5f6]'
                }`}
              >
                {floor.name}
              </button>
            ))}
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-[#800000] border border-dashed border-[#ebd5da] hover:bg-[#fdf5f6] flex items-center transition-colors shrink-0 cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> Add Floor
            </button>
          </div>

          {/* Floor Map Area */}
          <div className="flex-1 bg-[#fdf5f6]/40 rounded-2xl border-2 border-[#ebd5da] overflow-hidden relative shadow-inner">
            <div 
              className="absolute inset-0"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {activeTables.map(table => (
                <div
                  key={table.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, table.id)}
                  className={`absolute cursor-move border-2 shadow-xs flex flex-col items-center justify-center transition-all user-select-none hover:shadow-md cursor-pointer ${getStatusColor(table.status)}`}
                  style={{
                    left: table.positionX,
                    top: table.positionY,
                    width: table.width,
                    height: table.height,
                    borderRadius: table.shape === 'ROUND' ? '50%' : '0.75rem'
                  }}
                  onClick={() => {
                    const statuses: TableStatus[] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];
                    const nextStatus = statuses[(statuses.indexOf(table.status) + 1) % statuses.length];
                    updateTableStatus(table.id, nextStatus);
                  }}
                >
                  <span className="font-black text-base">{table.tableNumber}</span>
                  <div className="flex items-center text-[10px] font-bold opacity-90 mt-0.5">
                    <Users className="w-3 h-3 mr-0.5" /> {table.capacity}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-[#ebd5da] rounded-xl p-3 shadow-md pointer-events-none">
              <div className="text-[10px] font-black text-[#800000]/70 mb-2 uppercase tracking-wider">Status Indicator</div>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#fdf5f6] border border-[#800000] mr-2"></div> Available</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#fbe6ea] border border-[#800000] mr-2"></div> Reserved</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#800000] mr-2"></div> Occupied</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-white border border-[#ebd5da] mr-2"></div> Cleaning</div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-white border border-[#ebd5da] p-2.5 rounded-xl shadow-xs text-[#800000] hover:bg-[#fdf5f6] transition-colors cursor-pointer" title="Floor Layout Mode">
                <Armchair className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        {sidebarView !== 'NONE' && (
          <div className="w-96 shrink-0 flex flex-col transition-all duration-300 ease-in-out">
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setSidebarView('NONE')}
                className="p-1 rounded-md text-[#800000]/60 hover:text-[#800000] hover:bg-[#fdf5f6] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {sidebarView === 'RESERVATIONS' && <ReservationList />}
              {sidebarView === 'WAITLIST' && <WaitlistList />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
