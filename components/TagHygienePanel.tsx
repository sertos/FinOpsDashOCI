
import React from 'react';

interface TagHygienePanelProps {
  data: {
    tagged: number;
    untagged: number;
  };
}

const TagHygienePanel: React.FC<TagHygienePanelProps> = ({ data }) => {
  const total = data.tagged + data.untagged;
  const taggedPercentage = total > 0 ? (data.tagged / total) * 100 : 0;

  return (
    <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-sm h-full flex flex-col items-center justify-center relative hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-brand-text-secondary w-full text-left mb-4 px-2 absolute top-5 left-3">Tag Hygiene</h3>
      <div className="relative h-24 w-24 mx-auto mt-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-brand-border"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            className="text-brand-accent transition-all duration-1000 ease-out"
            strokeDasharray={`${taggedPercentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-display font-bold text-brand-text-primary mt-1">{taggedPercentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Tagged</p>
      </div>
    </div>
  );
};

export default TagHygienePanel;