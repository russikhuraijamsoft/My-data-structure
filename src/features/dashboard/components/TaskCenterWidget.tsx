import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function TaskCenterWidget() {
  const tasks = [
    { id: 1, title: 'Approve Payroll & Shifts', due: 'Today, 2:00 PM', completed: false, priority: 'high' },
    { id: 2, title: 'Review Weekly Stock Usage', due: 'Tomorrow', completed: false, priority: 'medium' },
    { id: 3, title: 'Order Produce & Ingredients', due: 'Today, 11:00 AM', completed: true, priority: 'high' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-[#800000]">
          <CheckCircle2 className="w-5 h-5 text-[#800000]" />
          Task Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 bg-[#fdf5f6] border border-[#ebd5da] rounded-lg">
              <button className="mt-0.5 shrink-0 text-[#800000] cursor-pointer">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#800000]" />
                ) : (
                  <Circle className="w-5 h-5 text-[#800000]/60" />
                )}
              </button>
              <div className={`flex-1 ${task.completed ? 'opacity-50' : ''}`}>
                <p className={`text-sm font-bold text-[#800000] ${task.completed ? 'line-through text-[#800000]/60' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#800000]/70 font-medium">
                    <Clock className="w-3 h-3" />
                    {task.due}
                  </span>
                  {!task.completed && task.priority === 'high' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#800000] text-white uppercase tracking-wider">
                      Priority
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
