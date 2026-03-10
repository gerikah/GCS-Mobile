import React from 'react';
import type { OverviewStat } from '../types';

const OverviewCard: React.FC<OverviewStat> = ({ icon, label, value }) => {
  return (
    <div className="flex min-h-[72px] flex-col rounded-xl bg-gcs-card p-2 text-black shadow-sm dark:bg-gray-800">
      <div className="flex h-full flex-col items-start gap-1 text-left">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gcs-primary/10">
          {icon}
        </div>
        <div className="flex flex-1 items-center justify-start">
          <p className="text-lg font-bold text-black dark:text-white">{value}</p>
        </div>
        <p className="truncate whitespace-nowrap text-[11px] text-black dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export default OverviewCard;
