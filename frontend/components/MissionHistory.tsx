import React, { useMemo } from 'react';
import type { Mission } from '../types';

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
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-white/10 bg-[#0d1019]">
            {points ? (
                <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                    <path d={points} fill="none" stroke="#ff454f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <MapIcon />
            )}
        </div>
    );
};


const getStatusColor = (status: string): string => {
    const normalized = status.toLowerCase();
    if (normalized.includes('complete')) {
        return 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400';
    }
    if (normalized.includes('progress') || normalized.includes('active')) {
        return 'border-red-500/50 bg-red-500/15 text-red-400';
    }
    return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
};

const formatFlightTime = (duration: string | undefined): string => {
    if (!duration) return '0m 0s';
    const seconds = Number(duration) || 0;
    if (isNaN(seconds)) return duration;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
};

const getMissionName = (mission: Mission): string => {
    // Check if session_name is provided by the backend
    const sessionName = (mission as any).session_name;
    if (sessionName && typeof sessionName === 'string' && sessionName.trim() !== '') {
        return sessionName;
    }
    // Fallback to the generated name/UUID format
    return mission.name || `FLT_${mission.id.slice(0, 8).toUpperCase()}`;
};

const MissionHistory: React.FC<MissionHistoryProps> = ({ missions }) => {
    const recentMissions = useMemo(() => {
        return [...missions]
            .filter(mission => mission.status.toLowerCase().includes('complete'))
            .sort((a, b) => {
                const aTime = new Date(a.date).getTime() || 0;
                const bTime = new Date(b.date).getTime() || 0;
                return bTime - aTime;
            })
            .slice(0, 9);
    }, [missions]);

    return (
        <div className="flex h-full flex-col rounded-md border border-white/10 bg-[#191d2d] p-2.5 shadow-sm dark:bg-gray-800">
            <h3 className="mb-2 border-b border-white/10 pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-[#7f8da8] dark:text-white">Recent_Flights_</h3>
            <div className="min-h-0 flex-grow space-y-1.5 overflow-y-auto pr-1">
                {recentMissions.length > 0 ? recentMissions.map(mission => (
                    <div key={mission.id} className="flex items-center gap-2 rounded border border-transparent p-1.5 transition-colors hover:border-gcs-primary/30 hover:bg-gcs-primary/10">
                        <MiniMapView track={mission.gpsTrack} />
                        <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-[11px] font-semibold text-black dark:text-gray-200">{getMissionName(mission)}</p>
                                <p className="truncate text-[11px] text-black dark:text-gray-400">
                                    {new Date(mission.date).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex justify-start">
                                <span className={`inline-flex items-center rounded border px-1 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap ${getStatusColor(mission.status)}`}>
                                    <span className={`mr-1 h-1 w-1 rounded-full ${mission.status.toLowerCase().includes('complete') ? 'bg-emerald-400' : mission.status.toLowerCase().includes('progress') || mission.status.toLowerCase().includes('active') ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                                    {mission.status}
                                </span>
                            </div>
                            <div className="flex-shrink-0 flex justify-start min-w-[50px]">
                                <p className="text-[11px] font-semibold text-black dark:text-gray-200">{formatFlightTime(mission.duration)}</p>
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
