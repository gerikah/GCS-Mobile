import React from 'react';
import OverviewCard from './AttitudeIndicator';
import MissionHistory from './MissionHistory';
import type { OverviewStat, Mission } from '../types';

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
const BatteryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gcs-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
        battery: <BatteryIcon />,
    };
    const overviewStats: OverviewStat[] = rawStats.map(stat => ({ ...stat, icon: icons[stat.id] || <div /> }));

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex-shrink-0">
                <h2 className="text-sm font-bold text-gray-100">Overview</h2>
                <div className="mt-2 grid grid-cols-3 gap-2">
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
