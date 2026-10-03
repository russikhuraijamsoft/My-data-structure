import React from 'react';
import { useCrmStore } from '../store/crmStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Users, Star, Award, TrendingUp } from 'lucide-react';

export function CrmDashboard() {
  const { customers, promotions } = useCrmStore();

  const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;
  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const activePromos = promotions.filter(p => p.isActive).length;
  const totalVisits = customers.reduce((sum, c) => sum + c.totalVisits, 0);

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Diners" 
          value={activeCustomers.toString()}
          icon={<Users className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Active Promos" 
          value={activePromos.toString()}
          icon={<Star className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Loyalty Points" 
          value={totalPoints.toString()}
          icon={<Award className="w-5 h-5 text-[#800000]" />}
        />
        <StatCard 
          title="Total Visits" 
          value={totalVisits.toString()}
          icon={<TrendingUp className="w-5 h-5 text-[#800000]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers.slice(0, 5).map(customer => (
                <div key={customer.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-[#800000]/70">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#800000] text-white">
                      {customer.tier}
                    </span>
                    <p className="text-xs font-bold text-[#800000] mt-1">{customer.loyaltyPoints} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#800000]">Campaign Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {promotions.filter(p => p.isActive).map(promo => (
                <div key={promo.id} className="flex justify-between items-center p-3 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
                  <div>
                    <p className="font-bold text-sm text-[#800000]">{promo.name}</p>
                    <p className="text-xs font-mono font-bold text-[#800000]/80">{promo.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#800000]">
                      {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `₹${promo.value} OFF`}
                    </p>
                    <p className="text-[10px] text-[#800000]/70 font-semibold">{promo.timesUsed} claimed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#800000]/70">{title}</p>
          <div className="p-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-black text-[#800000] truncate">{value}</h3>
      </CardContent>
    </Card>
  );
}
