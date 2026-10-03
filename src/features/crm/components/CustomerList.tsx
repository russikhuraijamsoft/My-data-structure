import React, { useState } from 'react';
import { useCrmStore } from '../store/crmStore';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { Search, Plus, Filter, Mail, Phone } from 'lucide-react';

export function CustomerList() {
  const { customers } = useCrmStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4 text-[#800000]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800000]/60" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="hover:border-[#800000] transition-colors">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-base text-[#800000]">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#800000] text-white">
                      {customer.tier}
                    </span>
                    <span className="font-black text-xs text-[#800000]">
                      {customer.loyaltyPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#800000]/80 mb-4 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#800000]/60" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#800000]/60" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#ebd5da] text-xs font-semibold">
                <span>{customer.totalVisits} visits</span>
                <span className="font-black text-[#800000]">₹{customer.totalSpent.toFixed(2)} spent</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
