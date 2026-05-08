import React from 'react';
import MissionHistory from './MissionHistory';
import type { OverviewStat, Mission } from '../types';

const OverviewCard: React.FC<OverviewStat> = ({ icon, label, value }) => {
  return (
    <div className="relative flex min-h-[82px] flex-col overflow-hidden rounded-md border border-white/10 bg-gcs-card p-2 text-white shadow-sm dark:bg-gray-800">
      <div className="absolute right-0 top-0 h-14 w-14 bg-gcs-primary/10 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
      <div className="flex h-full flex-col items-start gap-1 text-left">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-gcs-primary/20 bg-[#0b0e17] text-gcs-primary shadow-[0_0_18px_rgba(255,69,79,0.35)]">
          {icon}
        </div>
        <div className="flex flex-1 items-center justify-start">
          <p className="font-mono text-lg font-black text-white dark:text-white">{value}</p>
        </div>
        <p className="truncate whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.18em] text-[#74829e] dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

// SVG Icons for Overview Cards
const FlightsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="7" cy="17" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.8 8.8L10 10M15.2 8.8L14 10M8.8 15.2L10 14M15.2 15.2L14 14" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <circle cx="12" cy="13" r="7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13V9.5M12 13l2.5 2.5M9.5 3h5" />
    </svg>
);

interface DashboardViewProps {
    overviewStats: Omit<OverviewStat, 'icon'>[];
    missions: Mission[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ overviewStats: rawStats, missions }) => {
    const icons: { [key: string]: React.ReactNode } = {
        flights: <FlightsIcon />,
        flightTime: <ClockIcon />,
    };
    const overviewStats: OverviewStat[] = rawStats.map(stat => ({ ...stat, icon: icons[stat.id] || <div /> }));

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex-shrink-0">
                <h2 className="border-b-2 border-gcs-primary pb-1 font-mono text-sm font-black uppercase italic tracking-[0.35em] text-gray-100">System_Overview_</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {overviewStats.map(stat => (
                        <OverviewCard key={stat.id} {...stat} />
                    ))}
                </div>
            </div>

            <div className="mt-2 min-h-0 flex-1 overflow-hidden">
                <MissionHistory missions={missions} />
            </div>
        </div>
    );
};

export default DashboardView;
