import React from 'react';
import { useKdsStore } from '../store/kdsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Clock, TrendingUp, AlertCircle, ChefHat, CheckSquare, ListOrdered } from 'lucide-react';

export function KdsAnalytics() {
  const { tickets, stations } = useKdsStore();

  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(t => t.status === 'READY').length;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  const stationWorkloads = stations.map(station => {
    let pendingItems = 0;
    tickets.forEach(ticket => {
      ticket.items.forEach(item => {
        if (item.stationId === station.id && item.status !== 'READY') {
          pendingItems++;
        }
      });
    });
    return { ...station, pendingItems };
  }).filter(s => s.pendingItems > 0 || s.isActive);

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-white text-[#800000]">
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-black text-[#800000]">Kitchen Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Orders Today"
            value={totalTickets.toString()}
            icon={<ListOrdered className="w-5 h-5 text-[#800000]" />}
            trend="+12% from yesterday"
          />
          <StatCard 
            title="Completed"
            value={completedTickets.toString()}
            icon={<CheckSquare className="w-5 h-5 text-[#800000]" />}
            trend={`${completionRate}% completion rate`}
          />
          <StatCard 
            title="Avg Prep Time"
            value="14m"
            icon={<Clock className="w-5 h-5 text-[#800000]" />}
            trend="-2m from average"
          />
          <StatCard 
            title="Delayed Orders"
            value="1"
            icon={<AlertCircle className="w-5 h-5 text-[#800000]" />}
            trend="Needs attention"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
                <ChefHat className="w-5 h-5 text-[#800000]" />
                Station Workloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stationWorkloads.map(station => (
                  <div key={station.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#800000]">{station.name}</p>
                      <p className="text-xs text-[#800000]/70 uppercase tracking-wider font-semibold">{station.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2.5 bg-[#fdf5f6] border border-[#ebd5da] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#800000]"
                          style={{ width: `${Math.min(100, (station.pendingItems / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="font-black text-sm w-16 text-right text-[#800000]">{station.pendingItems} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
                <TrendingUp className="w-5 h-5 text-[#800000]" />
                Kitchen Efficiency Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64 text-[#800000]/70 space-y-2">
              <div className="text-4xl font-black text-[#800000]">94.2%</div>
              <p className="font-semibold text-sm">On-time fulfillment index today</p>
              <p className="text-xs text-[#800000]/60">Target: 90% across all order types</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[#800000]/70">{title}</p>
          <div className="p-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-lg">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-black text-[#800000]">{value}</h3>
          <p className="text-xs font-semibold text-[#800000]/80 mt-1">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}
