
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

interface StackedBarChartProps {
  data: ChartDataPoint[];
  title: string;
  xAxisKey: string;
  barDataKey: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface/90 backdrop-blur-sm p-3 border border-brand-border rounded-xl shadow-xl flex flex-col gap-1">
        <p className="label text-sm text-brand-text-secondary">{`${label}`}</p>
        <p className="intro text-brand-accent font-mono text-base font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};


const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, title, xAxisKey, barDataKey }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[400px]">
      <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
          <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value)/1000}k`} />
          <YAxis type="category" dataKey={xAxisKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={120} />
          <Tooltip cursor={{fill: 'rgba(2, 132, 199, 0.1)'}} content={<CustomTooltip />} />
          <Bar dataKey={barDataKey} name="Cost" fill="#0284c7" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;