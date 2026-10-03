import React, { useState } from 'react';
import { StockTransaction } from '../models/inventory';
import { useInventoryStore } from '../store/inventoryStore';

interface TransactionFormProps {
  onClose: () => void;
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { items, warehouses, batches, recordTransaction } = useInventoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<StockTransaction>>({
    itemId: items[0]?.id || '',
    type: 'STOCK_IN',
    quantity: 0,
    unitCost: 0,
    totalCost: 0,
    notes: '',
    fromWarehouseId: warehouses[0]?.id || '',
    batchId: '',
    performedBy: 'Store Manager'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.itemId || (formData.quantity || 0) <= 0) {
        throw new Error('Item and valid quantity are required');
      }
      await recordTransaction(formData as Omit<StockTransaction, 'id' | 'date'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (q: number) => {
    const item = items.find(i => i.id === formData.itemId);
    const unitCost = formData.unitCost || (item ? item.costPrice : 0);
    setFormData({
      ...formData,
      quantity: q,
      unitCost,
      totalCost: q * unitCost
    });
  };

  const handleItemChange = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const unitCost = item ? item.costPrice : 0;
    setFormData({
      ...formData,
      itemId,
      unitCost,
      totalCost: (formData.quantity || 0) * unitCost,
      batchId: ''
    });
  };

  const itemBatches = batches.filter(b => b.itemId === formData.itemId && b.status !== 'EXPIRED');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#ebd5da] bg-[#800000] text-white">
          <h2 className="text-xl font-black text-white">Record Stock Movement</h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-4 text-[#800000] bg-[#fee8eb] border border-[#ebd5da] p-3 rounded-lg text-xs font-bold">{error}</div>}
          
          <form id="txn-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Transaction Type *</label>
                <select 
                  required
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
                >
                  <option value="STOCK_IN">Stock In (Receive / Purchase)</option>
                  <option value="STOCK_OUT">Stock Out (Usage / Dispense)</option>
                  <option value="ADJUSTMENT">Adjustment (Audit / Count)</option>
                  <option value="DAMAGE">Damage</option>
                  <option value="WASTAGE">Wastage</option>
                  <option value="EXPIRY">Expiry Write-off</option>
                  <option value="RETURN">Vendor Return</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Warehouse</label>
                <select 
                  value={formData.fromWarehouseId}
                  onChange={e => setFormData({...formData, fromWarehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Inventory Item *</label>
              <select 
                required
                value={formData.itemId}
                onChange={e => handleItemChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
              >
                <option value="">Select Item</option>
                {items.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (Stock: {i.currentStock} {i.unit})</option>
                ))}
              </select>
            </div>

            {formData.itemId && itemBatches.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Select Batch</label>
                <select 
                  value={formData.batchId}
                  onChange={e => setFormData({...formData, batchId: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
                >
                  <option value="">No Batch Selected</option>
                  {itemBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.batchNumber} (Stock: {b.currentQuantity}) - Exp: {new Date(b.expiryDate).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Quantity *</label>
                <input 
                  type="number" 
                  required
                  min="0.01" step="0.01"
                  value={formData.quantity || ''}
                  onChange={e => handleQuantityChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Unit Cost (₹)</label>
                <input 
                  type="number" 
                  min="0" step="0.01"
                  value={formData.unitCost || 0}
                  onChange={e => setFormData({
                    ...formData, 
                    unitCost: parseFloat(e.target.value) || 0,
                    totalCost: (parseFloat(e.target.value) || 0) * (formData.quantity || 0)
                  })}
                  className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Notes / Reason</label>
              <textarea 
                rows={2}
                value={formData.notes || ''}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-medium"
                placeholder="Reason for adjustment, supplier name, etc."
              />
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-[#ebd5da] bg-[#fdf5f6] flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-[#ebd5da] rounded-xl text-sm font-bold text-[#800000] bg-white hover:bg-[#fee8eb] cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="txn-form"
            disabled={loading}
            className="px-5 py-2 bg-[#800000] text-white rounded-xl text-sm font-black hover:bg-[#680016] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? 'Recording...' : 'Record Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
