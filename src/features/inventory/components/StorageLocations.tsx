import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { Plus, Search } from 'lucide-react';
import { StorageLocation } from '../models/inventory';

export function StorageLocations() {
  const { storageLocations, warehouses, addStorageLocation } = useInventoryStore();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = storageLocations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'Unknown';

  return (
    <div className="bg-white rounded-xl border border-[#ebd5da] shadow-xs overflow-hidden flex flex-col h-full text-[#800000]">
      <div className="p-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#fdf5f6]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/60" />
            <input 
              type="text"
              placeholder="Search storage bins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#ebd5da] rounded-xl text-xs bg-white text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] w-64 font-medium"
            />
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#800000] hover:bg-[#680016] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> New Location
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-[#ebd5da]">
          <thead className="bg-[#fdf5f6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Location / Bin Code</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-black text-[#800000] uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-xs font-black text-[#800000] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebd5da]">
            {filteredLocations.map((loc) => (
              <tr key={loc.id} className="hover:bg-[#fdf5f6] transition-colors text-xs font-medium">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-[#800000]">{loc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">{getWarehouseName(loc.warehouseId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#800000]/80">{loc.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full ${
                    loc.isActive ? 'bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {loc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredLocations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-[#800000]/60">
                  No storage bin locations configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <LocationForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function LocationForm({ onClose }: { onClose: () => void }) {
  const { warehouses, addStorageLocation } = useInventoryStore();
  const [formData, setFormData] = useState<Partial<StorageLocation>>({
    name: '',
    warehouseId: warehouses[0]?.id || '',
    type: 'BIN',
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.warehouseId) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      await addStorageLocation(formData as Omit<StorageLocation, 'id'>);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-[#800000]">
      <div className="bg-white rounded-2xl border-2 border-[#ebd5da] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ebd5da] flex justify-between items-center bg-[#800000] text-white">
          <h2 className="text-base font-black text-white">Add Storage Location</h2>
          <button onClick={onClose} className="text-white hover:opacity-80 cursor-pointer">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#fee8eb] text-[#800000] text-xs font-bold rounded-lg border border-[#ebd5da]">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Name / Code</label>
            <input
              type="text"
              required
              placeholder="e.g. Aisle-1-Bin-A"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Warehouse</label>
            <select
              required
              value={formData.warehouseId}
              onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#800000] mb-1">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-[#ebd5da] rounded-xl bg-[#fdf5f6] text-[#800000] text-sm font-bold"
            >
              <option value="ZONE">Zone</option>
              <option value="AISLE">Aisle</option>
              <option value="RACK">Rack</option>
              <option value="SHELF">Shelf</option>
              <option value="BIN">Bin</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#800000] bg-white border border-[#ebd5da] hover:bg-[#fee8eb] rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-black text-white bg-[#800000] hover:bg-[#680016] rounded-xl shadow-xs cursor-pointer disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
