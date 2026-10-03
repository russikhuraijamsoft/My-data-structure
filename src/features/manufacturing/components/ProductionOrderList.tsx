import React, { useState } from 'react';
import { useManufacturingStore } from '../store/manufacturingStore';
import { Plus, Search, Filter, ClipboardList, Calendar, CheckCircle2, Play, Check } from 'lucide-react';
import { ProductionStatus, ProductionOrder } from '../models/manufacturing';
import { ProductionOrderForm } from './ProductionOrderForm';

export function ProductionOrderList() {
  const { productionOrders, updateProductionOrder, completeProductionOrder } = useManufacturingStore();
  const [showForm, setShowForm] = useState(false);
  const [completingOrder, setCompletingOrder] = useState<ProductionOrder | null>(null);
  const [actualQty, setActualQty] = useState(0);
  const [wasteQty, setWasteQty] = useState(0);

  const getStatusColor = (status: ProductionStatus) => {
    switch(status) {
      case 'PLANNED': return 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]';
      case 'IN_PROGRESS': return 'bg-[#fee8eb] text-[#800000] border border-[#ebd5da] font-bold';
      case 'COMPLETED': return 'bg-[#800000] text-white';
      case 'CANCELLED': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleStart = async (id: string) => {
    await updateProductionOrder(id, { status: 'IN_PROGRESS' });
  };

  const openCompleteModal = (order: ProductionOrder) => {
    setCompletingOrder(order);
    setActualQty(order.plannedQuantity);
    setWasteQty(0);
  };

  const handleComplete = async (qcStatus: 'APPROVED' | 'REJECTED') => {
    if (!completingOrder) return;
    await completeProductionOrder(completingOrder.id, actualQty, wasteQty, qcStatus);
    setCompletingOrder(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full relative text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search batches..."
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 font-medium"
            />
          </div>
          <button className="p-2 border border-[#ebd5da] rounded-xl text-[#800000] hover:bg-[#fee8eb] bg-white transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#800000] hover:bg-[#680016] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Batch
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {productionOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#800000]/60 py-12">
            <ClipboardList className="w-12 h-12 mb-3 text-[#dcabb5]" />
            <p className="font-semibold text-sm">No production batches scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {productionOrders.map(order => (
              <div key={order.id} className="border border-[#ebd5da] rounded-xl p-4 bg-white shadow-2xs">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-1">
                      <h3 className="font-black text-base text-[#800000]">{order.recipeName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#800000]/70 font-semibold">Batch: {order.batchNumber}</span>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    {order.status === 'PLANNED' && (
                      <button onClick={() => handleStart(order.id)} className="flex items-center px-3 py-1.5 bg-[#fdf5f6] text-[#800000] border border-[#ebd5da] hover:bg-[#fee8eb] rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        <Play className="w-3.5 h-3.5 mr-1" /> Start
                      </button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <button onClick={() => openCompleteModal(order)} className="flex items-center px-3 py-1.5 bg-[#800000] text-white hover:bg-[#680016] rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        <Check className="w-3.5 h-3.5 mr-1" /> Finish
                      </button>
                    )}
                    <div className="text-right">
                      <div className="text-lg font-black text-[#800000]">
                        {order.actualQuantity || order.plannedQuantity} <span className="text-xs font-bold text-[#800000]/70">{order.unit}</span>
                      </div>
                      <div className="text-[10px] text-[#800000]/70">
                        Target: {order.plannedQuantity} {order.unit}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[#ebd5da] text-xs font-medium text-[#800000]/80">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#800000]" />
                    <span>Scheduled: {new Date(order.plannedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    {order.qcStatus === 'APPROVED' ? (
                      <span className="text-emerald-700 font-bold inline-flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> QC Passed
                      </span>
                    ) : (
                      <span className="text-[#800000]/70 font-semibold">{order.qcStatus || 'QC Pending'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <ProductionOrderForm onClose={() => setShowForm(false)} />}

      {completingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-[#800000]">
          <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-sm flex flex-col p-6">
            <h3 className="text-base font-black text-[#800000] mb-3">Complete Batch: {completingOrder.batchNumber}</h3>
            
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Actual Yield ({completingOrder.unit})</label>
                <input
                  type="number"
                  value={actualQty}
                  onChange={e => setActualQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Waste ({completingOrder.unit})</label>
                <input
                  type="number"
                  value={wasteQty}
                  onChange={e => setWasteQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => handleComplete('REJECTED')}
                className="py-2.5 px-3 bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] hover:bg-[#fee8eb] rounded-xl text-xs font-bold cursor-pointer"
              >
                Reject (Fail QC)
              </button>
              <button
                onClick={() => handleComplete('APPROVED')}
                className="py-2.5 px-3 bg-[#800000] text-white hover:bg-[#680016] rounded-xl text-xs font-black cursor-pointer shadow-xs"
              >
                Approve (Pass QC)
              </button>
            </div>
            <button
              onClick={() => setCompletingOrder(null)}
              className="py-2 text-xs font-bold text-[#800000]/60 hover:text-[#800000] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
