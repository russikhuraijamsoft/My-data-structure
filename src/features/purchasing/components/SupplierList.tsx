import React from 'react';
import { usePurchasingStore } from '../store/purchasingStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Search, Plus, Filter, ShoppingCart } from 'lucide-react';

export function SupplierList() {
  const { suppliers } = usePurchasingStore();

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#ebd5da] rounded-xl text-xs font-medium text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-[#ebd5da] text-[#800000] text-xs font-bold rounded-xl hover:bg-[#fdf5f6] transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-[#680016] transition-colors shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Supplier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-[#ebd5da] text-center">
            <ShoppingCart className="w-10 h-10 text-[#dcabb5] mb-3" />
            <h3 className="text-base font-bold text-[#800000] mb-1">No suppliers configured</h3>
            <p className="text-xs text-[#800000]/70 max-w-sm mx-auto mb-4">
              Add your first vendor to start issuing purchase orders and managing supply chain relations.
            </p>
          </div>
        ) : (
          suppliers.map(supplier => (
            <Card key={supplier.id} className="hover:border-[#800000] transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#800000] line-clamp-1">{supplier.name}</h3>
                    <p className="text-xs text-[#800000]/70 font-medium">{supplier.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#fdf5f6] px-2 py-0.5 rounded-lg border border-[#ebd5da]">
                    <span className="text-xs font-black text-[#800000]">★ {supplier.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#800000]/80 mb-4 font-medium">
                  <div className="flex justify-between">
                    <span className="text-[#800000]/60">Email:</span>
                    <span className="truncate ml-2">{supplier.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#800000]/60">Phone:</span>
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#800000]/60">Balance:</span>
                    <span className="font-black text-[#800000]">
                      ₹{supplier.outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#ebd5da]">
                  <span className="text-[10px] text-[#800000]/70 font-semibold">{supplier.paymentTerms}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#fdf5f6] text-[#800000] border border-[#ebd5da]">
                    {supplier.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
