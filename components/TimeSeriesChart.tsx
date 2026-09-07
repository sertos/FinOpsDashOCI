
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

interface TimeSeriesChartProps {
  data: ChartDataPoint[];
  title: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface/90 backdrop-blur-sm p-3 border border-brand-border rounded-xl shadow-xl">
        <p className="label text-xs text-brand-text-secondary mb-1">Date: <span className="font-mono text-brand-text-primary">{label}</span></p>
        <p className="intro text-brand-accent font-display font-semibold">{`Cost: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[400px]">
      <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `$${Number(value)/1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
          <Legend wrapperStyle={{fontSize: "12px", color: '#64748b', paddingTop: '10px'}} />
          <Line type="monotone" dataKey="value" name="Daily Cost" stroke="#0284c7" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;