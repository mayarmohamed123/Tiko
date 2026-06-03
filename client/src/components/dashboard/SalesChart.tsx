import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SalesDataPoint } from '../../services/analyticsService';

interface SalesChartProps {
  data: SalesDataPoint[];
  isLoading: boolean;
  days: number;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-EG', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tiko-surface border border-tiko-outline-variant rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-tiko-on-surface mb-1">{formatDate(label)}</p>
        <p className="text-tiko-primary font-bold">{payload[0].value.toFixed(2)} EGP</p>
        <p className="text-tiko-on-surface-variant text-xs">{payload[1]?.value ?? 0} orders</p>
      </div>
    );
  }
  return null;
};

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading, days }) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-tiko-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-tiko-on-surface-variant gap-2">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" /><path d="m7 16 4-4 4 4 4-6" />
        </svg>
        <p className="text-sm font-medium">No sales data for the last {days} days</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-tiko-primary, #6750A4)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--color-tiko-primary, #6750A4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#666' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => `${v.toFixed(0)}`}
          tick={{ fontSize: 11, fill: '#666' }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#6750A4"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#7DD3FC"
          strokeWidth={1.5}
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
