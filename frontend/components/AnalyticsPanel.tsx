import React, { useMemo, useState } from 'react';
import type { Mission } from 'types';

const MissionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l18-7-4.5 7L21 19l-6-2.5L10 21l1-6-8-3z" />
  </svg>
);

const CoverageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 12h8M8 15h5" />
  </svg>
);

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
    <circle cx="12" cy="12" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
  </svg>
);

const BarChart: React.FC<{ missions: Mission[] }> = ({ missions }) => {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const data = [
      { label: '3 Wks Ago', value: 0 },
      { label: '2 Wks Ago', value: 0 },
      { label: 'Last Wk', value: 0 },
      { label: 'This Wk', value: 0 },
    ];

    missions.forEach(mission => {
      const missionDate = new Date(mission.date);
      if (isNaN(missionDate.getTime()) || missionDate > now) return;

      const diffTime = now.getTime() - missionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) data[3].value++;
      else if (diffDays >= 7 && diffDays < 14) data[2].value++;
      else if (diffDays >= 14 && diffDays < 21) data[1].value++;
      else if (diffDays >= 21 && diffDays < 28) data[0].value++;
    });

    return data;
  }, [missions]);

  const maxValue = Math.max(...weeklyData.map(d => d.value), 1) * 1.2;

  if (missions.length === 0) {
    return <div className="flex h-full items-center justify-center p-2 text-[11px] text-gray-500">No mission logs</div>;
  }

  return (
    <div className="flex h-full items-end justify-around gap-2 px-2 pb-2 pt-4">
      {weeklyData.map(item => (
        <div key={item.label} className="flex flex-1 flex-col items-center">
          <div className="relative flex h-full w-full items-end">
            <div className="w-full rounded-t-sm bg-gcs-primary/20 transition-colors hover:bg-gcs-primary/40" style={{ height: `${(item.value / maxValue) * 100}%` }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold text-gcs-text-dark dark:text-white">{item.value.toFixed(1)}</span>
            </div>
          </div>
          <span className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const parseDuration = (duration: string | null | undefined): number => {
  if (!duration) return 0;
  const totalSeconds = parseInt(duration, 10);
  if (isNaN(totalSeconds)) return 0;
  return totalSeconds / 60;
};

const LineChart: React.FC<{ missions: Mission[] }> = ({ missions }) => {
  const data = useMemo(() => {
    return missions
      .slice(0, 10)
      .reverse()
      .map(m => parseDuration(m.duration));
  }, [missions]);

  if (data.length < 2) {
    return <div className="flex h-full items-center justify-center p-2 text-[11px] text-gray-500">No mission logs</div>;
  }

  const width = 300;
  const height = 150;
  const maxValue = Math.max(...data, 1) * 1.1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / maxValue) * height}`).join(' ');

  return (
    <div className="flex h-full items-center justify-center p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <polyline fill="none" stroke="#F97316" strokeWidth="2" points={points} />
        {data.map((d, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d / maxValue) * height} r="2.5" fill="#F97316" className="opacity-50 hover:opacity-100" />
        ))}
      </svg>
    </div>
  );
};

const DonutChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const size = 84;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="text-gray-200 dark:text-gray-600" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle
          className="text-gcs-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[11px] font-bold dark:text-white">{percentage.toFixed(1)}%</span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">Completed</span>
      </div>
    </div>
  );
};

interface AnalyticsPanelProps {
  missions: Mission[];
}

type DateRange = 'today' | 'week' | 'month';

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number) => new Date(value.getFullYear(), value.getMonth(), value.getDate() + days);

const isInDateRange = (dateValue: string, range: DateRange, now: Date): boolean => {
  const date = new Date(dateValue);
  if (isNaN(date.getTime()) || date > now) return false;

  const day = startOfDay(date);
  const today = startOfDay(now);
  const weekStart = addDays(today, -7);
  const monthStart = addDays(today, -30);

  if (range === 'today') return day.getTime() === today.getTime();
  if (range === 'week') return day >= weekStart && day < today;
  return day >= monthStart && day < weekStart;
};

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ missions }) => {
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMissions = useMemo(() => {
    const now = new Date();
    return missions.filter(mission => isInDateRange(mission.date, dateRange, now));
  }, [missions, dateRange]);

  const totalMissions = filteredMissions.length;
  const completedMissions = filteredMissions.filter(m => m.status === 'Completed').length;
  const successRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  return (
    <div className="grid h-full grid-cols-1 gap-2 animate-fade-in">
      <div className="flex items-center justify-end">
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
      </div>

      {showFilters && (
        <div className="animate-fade-in-fast rounded-lg bg-gray-100 p-2 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 gap-2 text-[11px]">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-600 dark:text-gray-300">Date Range</label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value as DateRange)}
                className="w-full max-w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] leading-tight dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                aria-label="Select analytics date range"
              >
                <option value="today">Last Mission</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="flex min-h-[86px] flex-col rounded-xl bg-gcs-card p-2.5 text-black shadow-sm dark:bg-gray-800">
          <div className="flex h-full flex-col items-start gap-1 text-left">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gcs-primary/10 text-gcs-primary">
              <MissionsIcon />
            </span>
            <p className="truncate whitespace-nowrap text-[11px] text-black dark:text-gray-400">Missions Flown</p>
            <div className="flex flex-1 items-center justify-start">
              <p className="text-lg font-bold text-black dark:text-white">{totalMissions.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="flex min-h-[86px] flex-col rounded-xl bg-gcs-card p-2.5 text-black shadow-sm dark:bg-gray-800">
          <div className="flex h-full flex-col items-start gap-1 text-left">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gcs-primary/10 text-gcs-primary">
              <CoverageIcon />
            </span>
            <p className="truncate whitespace-nowrap text-[11px] text-black dark:text-gray-400">Coverage Area</p>
            <div className="flex flex-1 items-center justify-start">
              <p className="text-lg font-bold text-black dark:text-white">0.0 <span className="text-[11px]">ha</span></p>
            </div>
          </div>
        </div>
        <div className="flex min-h-[86px] flex-col rounded-xl bg-gcs-card p-2.5 text-black shadow-sm dark:bg-gray-800">
          <div className="flex h-full flex-col items-start gap-1 text-left">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gcs-primary/10 text-gcs-primary">
              <SuccessIcon />
            </span>
            <p className="truncate whitespace-nowrap text-[11px] text-black dark:text-gray-400">Success Rate</p>
            <div className="flex flex-1 items-center justify-start">
              <p className="text-lg font-bold text-black dark:text-white">{successRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-xl bg-white p-2.5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-1.5 text-[11px] font-bold dark:text-white">Missions Over Time</h3>
        <div className="min-h-[160px] flex-1">
          <BarChart missions={filteredMissions} />
        </div>
      </div>
      <div className="flex flex-col rounded-xl bg-white p-2.5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-1.5 text-[11px] font-bold dark:text-white">Flight Duration Trend</h3>
        <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/50">
          <LineChart missions={filteredMissions} />
        </div>
      </div>

      <div className="flex flex-col rounded-xl bg-white p-2.5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-1.5 text-[11px] font-bold dark:text-white">Operational and Efficiency</h3>
        <div className="flex-grow space-y-1.5 text-[11px] text-gray-600 dark:text-gray-300">
          <p>Area Covered: <span className="float-right font-semibold dark:text-gray-100">0.0</span></p>
          <p>Spray Efficiency: <span className="float-right font-semibold text-orange-600">0.0%</span></p>
          <p>Chemical: <span className="float-right font-semibold dark:text-gray-100">0.0</span></p>
          <hr className="my-1.5 dark:border-gray-700" />
          <p>Mosquito Reduction: <span className="float-right font-bold text-orange-600">0.0</span></p>
        </div>
      </div>
      <div className="flex flex-col items-center rounded-xl bg-white p-2.5 shadow-sm dark:bg-gray-800">
        <h3 className="mb-1.5 text-[11px] font-bold dark:text-white">Mission Performance Summary</h3>
        <div className="flex flex-grow items-center justify-center">
          <DonutChart percentage={successRate} />
        </div>
        <button className="mt-2 w-full rounded-lg bg-gcs-primary px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90">
          Export Analytics
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
