import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { name: 'MON', revenue: 4000, profit: 2400 },
  { name: 'TUE', revenue: 3000, profit: 1398 },
  { name: 'WED', revenue: 2000, profit: 9800 },
  { name: 'THU', revenue: 2780, profit: 3908 },
  { name: 'FRI', revenue: 1890, profit: 4800 },
  { name: 'SAT', revenue: 2390, profit: 3800 },
  { name: 'SUN', revenue: 3490, profit: 4300 },
];

export const SalesAnalyticsChart: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-tiko-surface p-6 rounded-tiko-xl border border-tiko-surface-container-high shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Sales Analytics</h3>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffe3cf" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#53433d', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', top: -40, right: 0 }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue" 
              stroke="#8b4b2f" 
              strokeWidth={4} 
              dot={false}
              activeDot={{ r: 6, fill: '#8b4b2f', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Profit" 
              stroke="#54603f" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
