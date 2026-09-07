
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

interface RegionDonutChartProps {
  data: ChartDataPoint[];
  title: string;
}

const COLORS = ['#0ea5e9', '#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-surface/90 backdrop-blur-sm p-3 border border-brand-border rounded-xl shadow-xl flex flex-col gap-1">
        <p className="label text-sm text-brand-text-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: payload[0].color}}></span>
            {data.name}
        </p>
        <p className="intro text-brand-text-primary font-mono text-base font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.value)}</p>
      </div>
    );
  }
  return null;
};


const RegionDonutChart: React.FC<RegionDonutChartProps> = ({ data, title }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[400px]">
      <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: "13px", color: '#64748b'}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionDonutChart;