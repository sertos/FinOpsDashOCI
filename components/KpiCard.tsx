
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  format: 'currency' | 'percentage';
  trend?: number;
  tooltip?: string;
}

const formatValue = (value: number, format: 'currency' | 'percentage') => {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }
  if (format === 'percentage') {
    return `${value.toFixed(1)}%`;
  }
  return value.toString();
};

const TrendIndicator: React.FC<{ trend: number }> = ({ trend }) => {
  const isUp = trend > 0;
  const isDown = trend < 0;
  const color = isUp ? 'text-brand-danger bg-brand-danger/10' : 'text-brand-accent bg-brand-accent/10';

  if (!isFinite(trend) || trend === 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-brand-text-secondary bg-brand-surface-hover px-2 py-0.5 rounded-full ml-3">
        <Minus className="w-3 h-3" /> 0.0%
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ml-3 ${color}`}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(trend).toFixed(1)}%
    </span>
  );
};


const KpiCard: React.FC<KpiCardProps> = ({ title, value, format, trend, tooltip }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 h-full relative group">
       {tooltip && (
        <div className="absolute top-4 right-4 text-brand-text-secondary cursor-help">
          <Info className="w-4 h-4 hover:text-brand-text-primary transition-colors" />
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-brand-bg text-brand-text-primary text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg border border-brand-border">
            {tooltip}
          </div>
        </div>
      )}
      <h3 className="text-sm font-medium text-brand-text-secondary pr-6">{title}</h3>
      <div className="mt-3 flex items-end">
        <p className="text-3xl font-display font-bold tracking-tight text-brand-text-primary">
          {formatValue(value, format)}
        </p>
        {trend !== undefined && <TrendIndicator trend={trend} />}
      </div>
    </div>
  );
};

export default KpiCard;