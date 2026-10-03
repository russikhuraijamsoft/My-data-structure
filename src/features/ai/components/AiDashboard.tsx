import React from 'react';
import { useAiStore } from '../store/aiStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Lightbulb, AlertTriangle, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function AiDashboard() {
  const { insights, alerts, forecast } = useAiStore();

  return (
    <div className="space-y-6 text-[#800000]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Section */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#800000] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#800000]" />
            Real-time Operational Anomalies
          </h2>
          {alerts.map(alert => (
            <Card key={alert.id} className="border-l-4 border-l-[#800000]">
              <CardContent className="p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#800000]" />
                <div>
                  <p className="text-xs font-bold text-[#800000] leading-snug">{alert.message}</p>
                  <p className="text-[10px] text-[#800000]/60 mt-1 font-semibold">{new Date(alert.timestamp).toLocaleTimeString('en-IN')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {alerts.length === 0 && (
            <p className="text-xs text-[#800000]/70 font-semibold">No active alerts. Operational metrics normal.</p>
          )}
        </div>

        {/* Insights Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-black text-[#800000] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#800000]" />
            Predictive Business Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map(insight => (
              <Card key={insight.id} className="border border-[#ebd5da] bg-[#fdf5f6]/40">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#800000] text-white rounded-full uppercase tracking-wider">
                      {insight.type}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#800000]" />
                  </div>
                  <h3 className="font-black text-sm text-[#800000] mb-1">{insight.title}</h3>
                  <p className="text-xs text-[#800000]/80 mb-3 font-medium">{insight.description}</p>
                  
                  <div className="p-3 bg-white rounded-xl border border-[#ebd5da]">
                    <p className="text-xs font-bold text-[#800000] flex items-center gap-1.5 mb-1">
                      <BrainCircuit className="w-3.5 h-3.5 text-[#800000]" />
                      Action
                    </p>
                    <p className="text-xs text-[#800000]/80 font-medium">{insight.recommendation}</p>
                    {insight.impact && (
                      <p className="text-[11px] font-black text-[#800000] mt-2 text-right">
                        Impact: {insight.impact}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-[#800000]">
            <TrendingUp className="w-5 h-5 text-[#800000]" />
            7-Day Projected POS Revenue & Order Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebd5da" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#800000' }} stroke="#dcabb5" />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#800000' }} stroke="#dcabb5" tickFormatter={(value) => `₹${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#800000' }} stroke="#dcabb5" />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ebd5da', backgroundColor: '#ffffff', color: '#800000' }}
                  formatter={(value: any, name: any) => {
                    const numVal = Number(value || 0);
                    if (name === 'projectedSales') return [`₹${numVal.toLocaleString('en-IN')}`, 'Projected Revenue'];
                    if (name === 'projectedOrders') return [numVal, 'Projected Orders'];
                    return [numVal, name];
                  }}
                  labelStyle={{ color: '#800000', fontWeight: 'bold' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="projectedSales" stroke="#800000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="projectedOrders" stroke="#dcabb5" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
