
import React from 'react';

interface HeatmapData {
    hour: string;
    days: { day: string; value: number }[];
}

interface HourlyHeatmapProps {
  data: HeatmapData[];
  title: string;
}

const getColor = (value: number, max: number) => {
    if (value === 0) return 'bg-brand-bg border-none';
    const percentage = value / max;
    if (percentage > 0.8) return 'bg-brand-danger shadow-sm';
    if (percentage > 0.6) return 'bg-brand-warning shadow-sm';
    if (percentage > 0.3) return 'bg-brand-accent shadow-sm';
    return 'bg-brand-accent/30';
};

const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data, title }) => {
    if (!data || data.length === 0 || data[0].days.length === 0) {
        return (
             <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[450px]">
                <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-4">{title}</h3>
                <div className="flex items-center justify-center h-full text-brand-text-secondary">Not enough data</div>
            </div>
        )
    }

    const allValues = data.flatMap(h => h.days.map(d => d.value));
    const maxValue = Math.max(...allValues);

    return (
        <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[450px] overflow-x-auto">
            <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-5">{title}</h3>
            <div className="flex text-xs">
                <div className="w-12 shrink-0">&nbsp;</div>
                <div className="grid grid-cols-7 gap-1.5 grow">
                    {data[0].days.map(d => <div key={d.day} className="text-center text-brand-text-secondary font-mono pb-2">{d.day}</div>)}
                </div>
            </div>
            <div className="flex">
                <div className="w-12 shrink-0">
                    {data.map((h, i) => (
                         <div key={h.hour} className="h-[14px] flex items-center text-[10px] text-brand-text-secondary font-mono">{i % 2 === 0 ? h.hour : ''}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 grow">
                    {data.flatMap((h, hourIndex) => h.days.map((d, dayIndex) => (
                        <div key={`${h.hour}-${d.day}`} className="h-[14px] w-full group relative" style={{ gridRow: hourIndex + 1, gridColumn: dayIndex + 1 }}>
                             <div className={`h-full w-full rounded-sm transition-all duration-200 hover:scale-[1.15] hover:z-10 cursor-pointer ${getColor(d.value, maxValue)}`}></div>
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-brand-surface border border-brand-border text-brand-text-primary text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-xl">
                                <span className="text-brand-text-secondary font-mono text-[10px]">{d.day} {h.hour}</span><br />
                                <span className="font-semibold text-brand-accent mt-1 block tracking-wide">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.value)}</span>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default HourlyHeatmap;