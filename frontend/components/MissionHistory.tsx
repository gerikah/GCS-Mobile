import React, { useMemo } from 'react';
import type { Mission } from 'types';

interface MissionHistoryProps {
    missions: Mission[];
}

const MiniMapView: React.FC<{ track: { lat: number; lon: number }[] | undefined }> = ({ track }) => {
    const points = useMemo(() => {
        if (!track || track.length < 2) return null;

        const lats = track.map(p => p.lat);
        const lons = track.map(p => p.lon);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        
        const latRange = maxLat - minLat;
        const lonRange = maxLon - minLon;
        
        if (latRange === 0 && lonRange === 0) return null;

        const scale = Math.min(90 / (lonRange || 1), 90 / (latRange || 1));

        const lonOffset = (100 - lonRange * scale) / 2;
        const latOffset = (100 - latRange * scale) / 2;

        const pathData = track.map((p, i) => {
            const x = ((p.lon - minLon) * scale) + lonOffset;
            const y = ((maxLat - p.lat) * scale) + latOffset;
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ');

        return pathData;
    }, [track]);

    const MapIcon = () => (
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    );

    return (
        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {points ? (
                <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                    <path d={points} fill="none" stroke="#F97316" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <MapIcon />
            )}
        </div>
    );
};


const MissionHistory: React.FC<MissionHistoryProps> = ({ missions }) => {
    const recentMissions = missions.slice(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-t-xl rounded-b-none shadow-sm h-full flex flex-col">
            <h3 className="mb-1.5 text-[11px] font-bold text-black dark:text-white">Recent Mission Logs</h3>
            <div className="flex-grow space-y-1.5">
                {recentMissions.length > 0 ? recentMissions.map(mission => (
                    <div key={mission.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors">
                        <MiniMapView track={mission.gpsTrack} />
                        <div className="flex-1 grid grid-cols-3 items-center gap-2">
                            <div>
                                <p className="truncate text-[11px] font-semibold text-black dark:text-gray-200">{mission.name}</p>
                                <p className="text-[11px] text-black dark:text-gray-400">{mission.date}</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                                    {mission.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] font-semibold text-black dark:text-gray-200">{mission.duration}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-black dark:text-gray-400">
                        <p className="text-[11px]">No mission logs</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionHistory;
