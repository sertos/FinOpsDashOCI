
import React from 'react';

interface Spender {
  name: string;
  cost: number;
  type: 'App' | 'Service';
}

interface TopSpendersTableProps {
  data: Spender[];
  title: string;
}

const TopSpendersTable: React.FC<TopSpendersTableProps> = ({ data, title }) => {
  return (
    <div className="bg-brand-surface border border-brand-border p-5 sm:p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-display font-semibold text-brand-text-primary mb-5">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-brand-border">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-text-secondary uppercase tracking-wider bg-brand-bg/80 border-b border-brand-border">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Rank</th>
              <th scope="col" className="px-6 py-4 font-medium">Name</th>
              <th scope="col" className="px-6 py-4 font-medium">Type</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Cost (MTD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {data.map((item, index) => (
              <tr key={index} className="bg-brand-surface hover:bg-brand-surface-hover transition-colors">
                <td className="px-6 py-4 font-mono text-brand-text-secondary">{index + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-brand-text-primary whitespace-nowrap">
                  {item.name}
                </th>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${item.type === 'App' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-medium text-brand-text-primary">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(item.cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSpendersTable;