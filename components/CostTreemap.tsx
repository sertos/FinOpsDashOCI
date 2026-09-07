
import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface CostTreemapProps {
  data: any[];
  title: string;
}

const COLORS = ['#0ea5e9', '#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];

interface CustomizedContentProps {
  root?: any;
  depth?: any;
  x?: any;
  y?: any;
  width?: any;
  height?: any;
  index?: any;
  payload?: any;
  colors?: any;
  rank?: any;
  name?: any;
}

const CustomizedContent: React.FC<CustomizedContentProps> = (props) => {
  const { root, depth, x, y, width, height, index, name } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        style={{
          fill: depth < 2 ? COLORS[index % COLORS.length] : 'none',
          fillOpacity: 0.85,
          stroke: '#ffffff', // brand-surface
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1,
        }}
        className="transition-all duration-300 hover:fill-opacity-100"
      />
      {depth === 1 && width > 50 && height > 25 ? (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#ffffff" fontSize={12} fontWeight="600" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)'}}>
          {name}
        </text>
      ) : null}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-brand-surface/90 backdrop-blur-sm p-3 border border-brand-border rounded-xl shadow-xl flex flex-col gap-1">
        <p className="label text-sm text-brand-text-secondary">{item.name}</p>
        <p className="intro text-brand-accent font-mono text-base font-semibold">
          {`Cost: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.size)}`}
        </p>
      </div>
    );
  }
  return null;
};


const CostTreemap: React.FC<CostTreemapProps> = ({ data, title }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-[450px]">
      <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="88%">
        <Treemap
          data={data}
          dataKey="size"
          ratio={4 / 3}
          stroke="#ffffff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS} />}
          isAnimationActive={false}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default CostTreemap;