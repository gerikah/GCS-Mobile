import React, { useMemo, useState } from 'react';
import { Activity, ArrowLeft, Bot, CalendarDays, Cpu, Download, FileText, MapPin, Search, Signal, SlidersHorizontal, X } from 'lucide-react';
import type { Mission } from '../types';
import MissionTrackMap from './MissionTrackMap';
import { downloadMissionReport } from '../utils/downloadReport';
import { downloadGpx } from '../utils/downloadGpx';

// IMPORTANT: Change this to your computer's Wi-Fi IP address!
const API_URL = 'http://192.168.254.189:8080';

interface FlightLogsPanelProps {
  missions: Mission[];
  mapStyle: string;
}

type DetailTab = 'overview' | 'ai' | 'hardware' | 'stream';

const formatDuration = (duration: string | null | undefined): string => {
  const seconds = Number(duration || 0);
  if (Number.isNaN(seconds)) return duration || '0 secs';
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes > 0 ? `${minutes}m ${String(remainder).padStart(2, '0')}s` : `${seconds}s`;
};

const shortDate = (dateValue: string): string => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleString([], { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const flightCode = (mission: Mission): string => {
  if (mission.name?.trim()) return mission.name;
  return `FLT_${mission.id.slice(0, 8).toUpperCase()}`;
};

const statusClassName = (status: string): string => {
  const normalized = status.toLowerCase();
  if (normalized.includes('complete')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  if (normalized.includes('interrupt') || normalized.includes('abort')) return 'border-gcs-primary/40 bg-gcs-primary/10 text-gcs-primary';
  return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
};

const StatBlock: React.FC<{ label: string; value: string | number; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="rounded-sm border border-white/5 bg-[#101521] p-3">
    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#65728b]">{label}</p>
    <p className={`mt-2 font-mono text-sm font-black ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
  </div>
);

const TabButton: React.FC<{
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 border-b-2 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.18em] transition-colors ${
      active ? 'border-gcs-primary text-gcs-primary' : 'border-transparent text-[#77839d]'
    }`}
  >
    {children}
  </button>
);

const HardwareRows: React.FC<{ mission: Mission }> = ({ mission }) => {
  const telemetry = mission.rawTelemetry || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[620px] w-full border-collapse font-mono text-[10px]">
        <thead>
          <tr className="bg-[#111827] text-left uppercase tracking-[0.14em] text-[#7b879e]">
            <th className="p-3">Logged_At</th>
            <th className="p-3">GPS_Coords</th>
            <th className="p-3">Alt_Lidar</th>
            <th className="p-3">Heading</th>
            <th className="p-3">Volt</th>
            <th className="p-3">Armed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {telemetry.length > 0 ? (
            telemetry.slice(0, 100).map((t, index) => (
              <tr key={index} className="text-gray-200 hover:bg-white/5">
                <td className="p-3">{new Date(t.logged_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</td>
                <td className="p-3">{t.latitude?.toFixed(6) || '0'}, {t.longitude?.toFixed(6) || '0'}</td>
                <td className="p-3">{t.altitude_lidar_m?.toFixed(2) || '0'}M</td>
                <td className="p-3">{t.heading || '0'}°</td>
                <td className="p-3 text-emerald-400">{t.battery_voltage?.toFixed(2) || '0'}V</td>
                <td className="p-3">{t.is_armed ? 'YES' : 'NO'}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6} className="p-4 text-center text-[#7b879e]">No hardware telemetry logged</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const FlightLogsPanel: React.FC<FlightLogsPanelProps> = ({ missions, mapStyle }) => {
  const sourceMissions = missions;
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Completed');
  const [targetFilter, setTargetFilter] = useState('All_Objects');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('hardware');
  const [missionDetails, setMissionDetails] = useState<Record<string, Mission>>({});
  const [detailLoading, setDetailLoading] = useState(false);

  const filteredMissions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = sourceMissions.filter(mission => {
      const matchesText = `${mission.name} ${mission.location} ${mission.status}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || mission.status === statusFilter;
      const hasTargets = (mission.totalDetections || mission.detectedSites?.length || 0) > 0;
      const matchesTarget = targetFilter === 'All_Objects' || (targetFilter === 'Detected_Only' ? hasTargets : !hasTargets);
      return matchesText && matchesStatus && matchesTarget;
    });

    return filtered.sort((a, b) => {
      const aTime = new Date(a.date).getTime() || 0;
      const bTime = new Date(b.date).getTime() || 0;
      return sortOrder === 'Newest' ? bTime - aTime : aTime - bTime;
    });
  }, [sourceMissions, searchQuery, statusFilter, targetFilter, sortOrder]);

  const selectedMission = useMemo(() => {
    if (!selectedMissionId) return null;
    return missionDetails[selectedMissionId] || filteredMissions.find(mission => mission.id === selectedMissionId) || null;
  }, [filteredMissions, missionDetails, selectedMissionId]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTargetFilter('All_Objects');
    setSortOrder('Newest');
  };

  const handleDownloadReport = () => {
    if (!selectedMission) {
      alert('No mission logs');
      return;
    }
    downloadMissionReport(selectedMission);
  };

  const handleDownloadTrack = () => {
    if (!selectedMission?.gpsTrack?.length) {
      alert('No GPS track available');
      return;
    }
    downloadGpx(selectedMission.gpsTrack, flightCode(selectedMission));
  };

  const handleSelectMission = async (mission: Mission) => {
    const id = String(mission.id);
    setSelectedMissionId(id);
    setActiveTab('hardware');

    if (missionDetails[id]) return;

    setDetailLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/missions/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const detail: Mission = await response.json();
      setMissionDetails(prev => ({ ...prev, [id]: detail }));
    } catch (error) {
      console.error('Failed to fetch mission detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const renderDetail = () => {
    if (!selectedMission) {
      return <div className="flex min-h-[220px] items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#77839d]">No registry match</div>;
    }

    const track = selectedMission.gpsTrack || [];
    const detections = selectedMission.totalDetections || selectedMission.detectedSites?.length || 0;
    const telemetry = selectedMission.rawTelemetry || [];

    if (activeTab === 'overview') {
      return (
        <div className="space-y-3 p-4">
          <div className="h-44 overflow-hidden rounded border border-white/10 bg-[#0b0f19]">
            <MissionTrackMap track={track} mapStyle={mapStyle} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock label="Sortie_Status" value={selectedMission.status} accent />
            <StatBlock label="Chrono_Date" value={shortDate(selectedMission.date)} />
            <StatBlock label="Min_Dur" value={formatDuration(selectedMission.duration)} />
            <StatBlock label="Location" value={selectedMission.location || 'N/A'} />
          </div>
        </div>
      );
    }

    if (activeTab === 'ai') {
      return (
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-2">
            <StatBlock label="Object_Targets" value={detections} accent />
            <StatBlock label="Spray_Events" value={selectedMission.totalSprays || 0} />
          </div>
          <div className="rounded-sm border border-white/10 bg-[#101521] p-3">
            <h4 className="border-l-2 border-gcs-primary pl-2 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-white">AI_Databank_</h4>
            <div className="mt-3 space-y-2">
              {selectedMission.detectedSites?.length ? selectedMission.detectedSites.map((site, index) => (
                <div key={`${site.object}-${index}`} className="rounded border border-white/5 bg-[#171b2d] p-2">
                  <p className="font-mono text-[11px] font-bold text-gcs-primary">{site.object}</p>
                  <p className="mt-1 font-mono text-[10px] text-[#8792aa]">{site.type} · BBox {site.bbox ? site.bbox.map(coord => coord.toFixed(2)).join(', ') : 'N/A'}</p>
                </div>
              )) : (
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#77839d]">No detected objects archived</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'stream') {
      return (
        <div className="grid gap-2 p-4">
          <StatBlock label="Stream_Status" value="Healthy" accent />
          <StatBlock label="Laptop_Link" value="Synchronized" />
          <StatBlock label="Stream_PID" value={`PID_${selectedMission.id.slice(0, 5).toUpperCase()}`} />
          <StatBlock label="Frame_Quality" value={`${selectedMission.sprayEfficiency || 0}%`} accent />
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <h4 className="border-l-2 border-gcs-primary pl-3 font-mono text-[12px] font-black uppercase tracking-[0.24em] text-white">Hardware_Telemetry_Databank</h4>
        {detailLoading && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#77839d]">Loading full telemetry...</p>
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatBlock label="Max_Altitude" value={`${(selectedMission.coverageArea || 0.16).toFixed(2)}M`} />
          <StatBlock label="Min_Battery" value={telemetry.length > 0 ? `${Math.min(...telemetry.map(t => t.battery_voltage || 24)).toFixed(2)}V` : 'N/A'} accent />
          <StatBlock label="Avg_Heading" value={telemetry.length > 0 ? `${Math.round(telemetry.reduce((a, t) => a + (t.heading || 0), 0) / telemetry.length)}°` : 'N/A'} />
          <StatBlock label="Data_Points" value={telemetry.length} />
        </div>
        <HardwareRows mission={selectedMission} />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-0 h-full animate-fade-in font-mono gap-3">
      {!selectedMission && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7890]" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-sm border border-white/10 bg-[#090d17] pl-10 pr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none focus:border-gcs-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(value => !value)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border transition-colors ${showFilters ? 'border-gcs-primary bg-gcs-primary/10 text-gcs-primary' : 'border-white/10 bg-[#111521] text-[#8792aa]'}`}
            aria-label="Toggle registry filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      )}

      {!selectedMission && showFilters && (
        <section className="flex-shrink-0 rounded-md border border-white/10 bg-[#111521] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] animate-fade-in-fast">
          <div className="grid grid-cols-2 gap-2">
            <label className="min-w-0">
              <span className="mb-1 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#65728b]">Sortie_Status</span>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="h-10 w-full rounded-sm border border-white/10 bg-[#090d17] px-3 font-mono text-[10px] uppercase text-white">
                <option>All</option>
                <option>Completed</option>
                <option>Interrupted</option>
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#65728b]">Object_Target</span>
              <select value={targetFilter} onChange={event => setTargetFilter(event.target.value)} className="h-10 w-full rounded-sm border border-white/10 bg-[#090d17] px-3 font-mono text-[10px] uppercase text-white">
                <option>All_Objects</option>
                <option>Detected_Only</option>
                <option>Clear_Only</option>
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#65728b]">Sort_Order</span>
              <select value={sortOrder} onChange={event => setSortOrder(event.target.value)} className="h-10 w-full rounded-sm border border-white/10 bg-[#090d17] px-3 font-mono text-[10px] uppercase text-white">
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </label>
            <button onClick={clearFilters} className="mt-4 flex h-10 items-center justify-center gap-2 rounded-sm border border-white/10 bg-[#090d17] font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#8792aa]">
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
          <p className="mt-3 text-right font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#65728b]">
            Registry_Matches <span className="text-gcs-primary">{filteredMissions.length}</span>
          </p>
        </section>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        {!selectedMission && (
        <section className="flex flex-col min-h-0 rounded-md border border-white/10 bg-[#1a1e31] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <header className="flex items-center justify-between border-b border-white/5 p-3 flex-shrink-0">
            <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#8c97ad]">Log_Archive</h3>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-gcs-primary">{filteredMissions.length} Files</span>
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {filteredMissions.map(mission => {
              const active = selectedMission?.id === mission.id;
              return (
                <button
                  key={mission.id}
                  onClick={() => handleSelectMission(mission)}
                  className={`w-full border-l-4 p-4 text-left transition-colors ${
                    active ? 'border-gcs-primary bg-[#202538]' : 'border-transparent bg-transparent hover:bg-[#171c2d]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[12px] font-black uppercase tracking-[0.06em] text-white">{flightCode(mission)}</p>
                      <p className="mt-2 font-mono text-[10px] text-[#7d879d]">{shortDate(mission.date)}</p>
                      <p className="mt-2 flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-gray-200">
                        <MapPin className="h-3 w-3 text-[#77839d]" />
                        {mission.location || 'Unknown Zone'}
                      </p>
                    </div>
                    <span className={`rounded-sm border px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.08em] ${statusClassName(mission.status)}`}>{mission.status}</span>
                  </div>
                </button>
              );
            })}
            {filteredMissions.length === 0 && (
              <div className="flex h-40 items-center justify-center px-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#77839d]">
                No log archive files match the active filters
              </div>
            )}
          </div>
        </section>
        )}

        {selectedMission && (
        <section className="flex-1 min-h-0 overflow-hidden rounded-md border border-white/10 bg-[#1a1e31] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex flex-col">
          <header className="border-b border-white/5 flex-shrink-0">
            <div className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setSelectedMissionId(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-[#101521] text-[#8792aa]"
                  aria-label="Back to log archive"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#77839d]">Active_Log</p>
                  <h3 className="truncate font-mono text-sm font-black uppercase italic tracking-[0.12em] text-gcs-primary">
                    {flightCode(selectedMission)}
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownloadTrack} className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-[#101521] text-[#8792aa]" aria-label="Download GPX track">
                  <Activity className="h-4 w-4" />
                </button>
                <button onClick={handleDownloadReport} className="flex h-9 w-9 items-center justify-center rounded-sm border border-gcs-primary/40 bg-gcs-primary/10 text-gcs-primary" aria-label="Download mission report">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <nav className="flex overflow-x-auto px-1">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}><FileText className="mr-1 inline h-3 w-3" />Overview_</TabButton>
              <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}><Bot className="mr-1 inline h-3 w-3" />AI_Databank_</TabButton>
              <TabButton active={activeTab === 'hardware'} onClick={() => setActiveTab('hardware')}><Cpu className="mr-1 inline h-3 w-3" />Hardware_Metrics_</TabButton>
              <TabButton active={activeTab === 'stream'} onClick={() => setActiveTab('stream')}><Signal className="mr-1 inline h-3 w-3" />Stream_Health_</TabButton>
            </nav>
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {renderDetail()}
          </div>
        </section>
        )}
      </div>

      {selectedMission && (
      <div className="flex-shrink-0 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-white/10 bg-[#111521] p-3">
          <CalendarDays className="mb-2 h-4 w-4 text-gcs-primary" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#77839d]">Chrono_Date</p>
          <p className="mt-1 truncate font-mono text-[11px] font-black text-white">{selectedMission ? shortDate(selectedMission.date) : 'N/A'}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-[#111521] p-3">
          <Activity className="mb-2 h-4 w-4 text-gcs-primary" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#77839d]">Min_Dur</p>
          <p className="mt-1 truncate font-mono text-[11px] font-black text-white">{selectedMission ? formatDuration(selectedMission.duration) : 'N/A'}</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default FlightLogsPanel;
