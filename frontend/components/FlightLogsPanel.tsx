import React, { useMemo, useState } from 'react';
import type { Mission } from 'types';
import MissionTrackMap from './MissionTrackMap';
import { downloadMissionReport } from '../utils/downloadReport';

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const SearchIcon = () => (
  <svg className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronRight = () => (
  <span className="rounded-md px-1.5 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-200">&gt;</span>
);

interface FlightLogsPanelProps {
  missions: Mission[];
  mapStyle: string;
}

const sampleMissions: Mission[] = [
  {
    id: 'sample-1',
    name: 'Sample Mission 0.0',
    date: 'Mar 4, 2026',
    duration: '0.0',
    status: 'Completed',
    location: '0.0',
    gpsTrack: [
      { lat: 14.5995, lon: 120.9842 },
      { lat: 14.6001, lon: 120.9851 },
    ],
    detectedSites: [],
  },
  {
    id: 'sample-2',
    name: 'Sample Mission 0.0',
    date: 'Mar 4, 2026',
    duration: '0.0',
    status: 'Completed',
    location: '0.0',
    gpsTrack: [
      { lat: 14.5995, lon: 120.9842 },
      { lat: 14.6001, lon: 120.9851 },
    ],
    detectedSites: [],
  },
  {
    id: 'sample-3',
    name: 'Sample Mission 0.0',
    date: 'Mar 4, 2026',
    duration: '0.0',
    status: 'Completed',
    location: '0.0',
    gpsTrack: [
      { lat: 14.5995, lon: 120.9842 },
      { lat: 14.6001, lon: 120.9851 },
    ],
    detectedSites: [],
  },
];

const FlightLogsPanel: React.FC<FlightLogsPanelProps> = ({ missions, mapStyle }) => {
  const sourceMissions = useMemo(() => (missions.length > 0 ? missions : sampleMissions), [missions]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Last Mission');

  const handleDownloadReport = () => {
    if (!selectedMission) {
      alert('No mission logs');
      return;
    }
    downloadMissionReport(selectedMission);
  };

  const handleExport = () => {
    alert('Exporting all logs...');
  };

  const filteredMissions = useMemo(() => {
    const now = new Date();

    return sourceMissions.filter(mission => {
      if (!mission.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (statusFilter !== 'All' && mission.status !== statusFilter) {
        return false;
      }

      if (dateFilter !== 'Last Mission') {
        const missionDate = new Date(mission.date);
        if (isNaN(missionDate.getTime())) return false;

        const diffTime = now.getTime() - missionDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === 'Last 7 Days' && diffDays > 7) return false;
        if (dateFilter === 'Last 30 Days' && diffDays > 30) return false;
      }

      return true;
    });
  }, [sourceMissions, searchQuery, statusFilter, dateFilter]);

  if (selectedMission) {
    const displayTrack = selectedMission.gpsTrack || [];

    return (
      <div className="h-full animate-fade-in">
        <div className="flex h-full flex-col rounded-t-xl rounded-b-none bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="mb-1 flex items-center gap-2">
            <button
              onClick={() => setSelectedMission(null)}
              className="rounded-md px-1.5 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-200"
              aria-label="Back to mission history"
            >
              &lt;
            </button>
            <h2 className="text-sm font-bold dark:text-white">{selectedMission.name}</h2>
          </div>

          <p className="mb-1.5 text-[11px] text-gray-500 dark:text-gray-400">{selectedMission.date}</p>

          <div className="h-44 w-full overflow-hidden rounded-lg bg-gray-700">
            <MissionTrackMap track={displayTrack} mapStyle={mapStyle} />
          </div>

          <h3 className="mb-1 mt-2 text-sm font-bold dark:text-white">Detected Objects</h3>
          <div className="min-h-0 w-full flex-1 overflow-y-auto rounded-lg bg-gray-100 p-2 dark:bg-gray-900">
            {(!selectedMission.detectedSites || selectedMission.detectedSites.length === 0) ? (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">No mission logs</p>
            ) : (
              <ul className="space-y-1.5">
                {selectedMission.detectedSites.map((site, index) => (
                  <li key={index} className="rounded bg-white p-1.5 shadow-sm dark:bg-gray-800">
                    <p className="text-[11px] font-semibold text-orange-600">
                      {site.object}
                      <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400"> ({site.type})</span>
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 dark:text-gray-300">
                      BBox: {site.bbox ? site.bbox.map(coord => coord.toFixed(4)).join(', ') : 'N/A'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <InfoItem label="Status" value={selectedMission.status} />
              <InfoItem label="Duration" value={`${selectedMission.duration || '0.0'} secs`} />
              <InfoItem label="Location" value={selectedMission.location || '0.0'} />
            </div>
            <button
              onClick={handleDownloadReport}
              className="rounded-lg bg-orange-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full animate-fade-in">
      <div className="flex h-full flex-col rounded-t-xl rounded-b-none bg-white p-3 shadow-sm dark:bg-gray-800">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-black dark:text-white">Mission History</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                showFilters
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-600/30 dark:text-orange-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FilterIcon />
              <span className="ml-1">Filters</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center rounded-md px-2 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ExportIcon />
              <span className="ml-1">Export</span>
            </button>
          </div>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search missions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-transparent bg-gray-100 p-1.5 pl-7 text-[11px] dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:outline-none focus:ring-0"
          />
          <SearchIcon />
        </div>

        {showFilters && (
          <div className="mb-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-700/50 animate-fade-in-fast">
            <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full max-w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] leading-tight dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option>All</option>
                  <option>Completed</option>
                  <option>Interrupted</option>
                </select>
              </div>
              <div className="min-w-0">
                <label className="mb-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="w-full max-w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] leading-tight dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option>Last Mission</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredMissions.map(mission => (
            <div
              key={mission.id}
              onClick={() => setSelectedMission(mission)}
              className="flex cursor-pointer overflow-hidden rounded-xl bg-white transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/60"
            >
              <div className="flex-1 p-2">
                <p className="truncate text-[11px] font-semibold text-black dark:text-white">{mission.name}</p>
                <p className="text-[11px] text-black dark:text-gray-400">{mission.date} - {mission.duration || '0.0'} secs</p>
                <p className="mt-0.5 text-[11px] font-semibold text-orange-600">{mission.status}</p>
              </div>
              <div className="flex items-center justify-end px-2">
                <ChevronRight />
              </div>
            </div>
          ))}

          {filteredMissions.length === 0 && (
            <div className="flex h-20 items-center justify-center rounded-xl bg-white text-[11px] text-black dark:bg-gray-800 dark:text-gray-300">No mission logs</div>
          )}

          <div className="h-20 rounded-xl bg-white dark:bg-gray-800" />
          <div className="h-20 rounded-xl bg-white dark:bg-gray-800" />
          <div className="h-20 rounded-xl bg-white dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <p className="text-[11px] text-gray-600 dark:text-gray-300">
    {label}: <span className="font-semibold dark:text-white">{value}</span>
  </p>
);

export default FlightLogsPanel;
