import React, { useMemo, useState } from 'react';
import { Activity, Clock3, Droplet, Percent, PlusSquare, Target } from 'lucide-react';
import type { Mission } from '../types';

const parseDurationSeconds = (duration: string | null | undefined): number => {
  if (!duration) return 0;
  const numericValue = Number(duration);
  if (!Number.isNaN(numericValue)) return numericValue;
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

const formatUptime = (seconds: number): string => {
  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}H ${String(minutes).padStart(2, '0')}M`;
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  description?: string;
}> = ({ icon, label, value, sublabel, description }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section 
      className="relative overflow-hidden rounded-md border border-white/10 bg-[#1a1e31] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="pointer-events-none absolute right-2 top-1 font-mono text-3xl font-black text-white/[0.03]">#</div>
      
      {description && (
        <button 
          onClick={(e) => { e.preventDefault(); setShowTooltip(v => !v); }}
          className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-gcs-primary/40 bg-[#10131e] font-mono text-[9px] font-bold text-gcs-primary transition-colors hover:bg-gcs-primary/20 focus:outline-none"
          aria-label="Show definition"
        >
          ?
        </button>
      )}

      {showTooltip && description && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b0e17]/95 p-3 text-center backdrop-blur-sm animate-fade-in border border-gcs-primary/60 shadow-[inset_0_0_15px_rgba(255,69,79,0.2)] rounded-md cursor-pointer"
          onClick={() => setShowTooltip(false)}
        >
          <p className="font-mono text-[9px] leading-relaxed text-gcs-primary">
            {description}
          </p>
        </div>
      )}

      <div className="flex h-full flex-col justify-between gap-2">
        <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#74809b]">{label}</p>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-gcs-primary/20 bg-[#10131e] text-gcs-primary shadow-[0_0_26px_rgba(255,69,79,0.35)]">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-base font-black tracking-[0.03em] text-white">{value}</p>
          </div>
        </div>
        <p className="truncate font-mono text-[8px] uppercase tracking-[0.16em] text-[#69748d]">{sublabel}</p>
      </div>
    </section>
  );
};

const TemporalChart: React.FC<{ values: number[], labels: string[] }> = ({ values, labels }) => {
  const maxValue = Math.max(...values, 1);

  return (
    <div className="relative h-[280px] p-4">
      <div className="absolute inset-x-4 top-10 bottom-12 border border-white/[0.03] bg-[#171b2d]/40" />
      <div className="relative z-10 flex h-full items-end justify-around gap-2 sm:gap-4 px-2 pb-8 pt-6">
        {values.map((value, index) => {
          // Use a square root scale with a minimum height so small values remain visible alongside massive ones
          const height = value === 0 ? 4 : Math.max(12, Math.sqrt(value / maxValue) * 100);
          const isCurrent = index === values.length - 1;

          return (
            <div key={labels[index]} className="flex h-full flex-1 flex-col items-center justify-end">
              <div className="relative flex h-full w-full items-end justify-center border-b border-white/[0.04]">
                {value > 0 && (
                  <span className="absolute -top-5 font-mono text-[10px] font-bold text-gcs-primary">{value}</span>
                )}
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    value > 0
                      ? 'bg-gradient-to-t from-gcs-primary to-gcs-primary/30 shadow-[0_0_20px_rgba(255,69,79,0.35)]'
                      : 'bg-[#232842] shadow-[0_0_12px_rgba(120,130,160,0.08)]'
                  } ${isCurrent && value > 0 ? 'brightness-125' : ''}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className={`mt-2 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] ${isCurrent ? 'text-white' : 'text-[#74809b]'}`}>{labels[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AnalyticsPanelProps {
  missions: Mission[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ missions }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showTemporalTooltip, setShowTemporalTooltip] = useState(false);

  const analytics = useMemo(() => {
    const now = new Date();
    const dailyBuckets = [0, 0, 0, 0, 0, 0, 0];
    const weeklyBuckets = [0, 0, 0, 0];
    const monthlyBuckets = [0, 0, 0, 0, 0, 0];

    let totalSeconds = 0;
    let totalCoverage = 0;
    let detections = 0;
    let sprays = 0;

    missions.forEach(mission => {
      const missionDate = new Date(mission.date);
      if (!Number.isNaN(missionDate.getTime()) && missionDate <= now) {
        const daysAgo = Math.floor((now.getTime() - missionDate.getTime()) / 86400000);
        
        if (daysAgo < 7 && daysAgo >= 0) dailyBuckets[6 - daysAgo] += 1;
        
        if (daysAgo < 28 && daysAgo >= 0) {
          const weekIndex = Math.floor(daysAgo / 7);
          weeklyBuckets[3 - weekIndex] += 1;
        }

        const monthsAgo = (now.getFullYear() - missionDate.getFullYear()) * 12 + (now.getMonth() - missionDate.getMonth());
        if (monthsAgo < 6 && monthsAgo >= 0) {
          monthlyBuckets[5 - monthsAgo] += 1;
        }
      }

      totalSeconds += parseDurationSeconds(mission.duration);
      totalCoverage += mission.coverageArea || 0;
      detections += mission.totalDetections || mission.detectedSites?.length || 0;
      sprays += mission.totalSprays || 0;
    });

    const completedCount = missions.filter(mission => mission.status === 'Completed' || mission.status?.toLowerCase() === 'completed').length;

    return {
      dailyBuckets,
      weeklyBuckets,
      monthlyBuckets,
      sortieCount: missions.length,
      completedCount,
      detections,
      sprays,
      uptime: formatUptime(totalSeconds),
      coverage: totalCoverage,
    };
  }, [missions]);

  let chartValues = analytics.weeklyBuckets;
  let chartLabels = ['W-3', 'W-2', 'W-1', 'CURR'];
  if (timeframe === 'daily') {
    chartValues = analytics.dailyBuckets;
    chartLabels = ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'TODAY'];
  } else if (timeframe === 'monthly') {
    chartValues = analytics.monthlyBuckets;
    chartLabels = ['M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'CURR'];
  }

  const sprayRate = analytics.detections > 0 ? (analytics.sprays / analytics.detections) * 100 : 0;

  return (
    <div className="min-h-full animate-fade-in space-y-4 pb-4 font-mono">
      {/* Top Stats Banner */}
      <section className="rounded-md border border-gcs-primary/30 bg-gcs-primary/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#74809b]">COMPLETED_SORTIE_LOGS</p>
            <p className="mt-1 font-mono text-sm font-black uppercase tracking-[0.12em] text-emerald-400">{analytics.completedCount} SUCCESSFUL</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-black text-white">{analytics.sortieCount}</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#74809b]">TOTAL_DATABASE</p>
          </div>
        </div>
      </section>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <MetricCard icon={<Activity className="h-5 w-5" />} label="Stream_Count" value={String(analytics.sortieCount)} sublabel="Total_deployments" description="Total number of drone deployment sessions recorded in the database." />
        <MetricCard icon={<Target className="h-5 w-5" />} label="AI_Identification" value={String(analytics.detections)} sublabel="Positive_targets" description="Confirmed mosquito larvae habitats detected via YOLOv8 computer vision." />
        <MetricCard icon={<Droplet className="h-5 w-5" />} label="Neutralization" value={String(analytics.sprays)} sublabel="Spray_events" description="Manual intervention instances where the chemical payload was deployed." />
        <MetricCard icon={<Clock3 className="h-5 w-5" />} label="Stream_Run_Time" value={analytics.uptime} sublabel="Total_flight_time" description="Total duration the drone system was in an ARMED state." />
        <MetricCard icon={<PlusSquare className="h-5 w-5" />} label="Area_Treated" value={analytics.coverage.toFixed(2)} sublabel="Scaled_units_sq" description="Total surface area covered during operations in scaled square units." />
        <MetricCard icon={<Percent className="h-5 w-5" />} label="Efficacy_RT" value={`${sprayRate.toFixed(0)}%`} sublabel={`${analytics.sprays}/${analytics.detections} Units`} description="Mission success rate based on target detection vs. successful manual neutralization sessions." />
      </div>

      {/* Temporal Analysis Chart */}
      <section 
        className="relative rounded-md border border-white/10 bg-[#1a1e31] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        onMouseLeave={() => setShowTemporalTooltip(false)}
      >
        {showTemporalTooltip && (
          <div 
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b0e17]/95 p-6 text-center backdrop-blur-sm animate-fade-in border border-gcs-primary/60 shadow-[inset_0_0_20px_rgba(255,69,79,0.2)] rounded-md cursor-pointer"
            onClick={() => setShowTemporalTooltip(false)}
          >
            <p className="font-mono text-[11px] leading-relaxed text-gcs-primary max-w-sm">
              Activity frequency trending with daily, weekly, and monthly tracking options. Displays historical deployment sessions over time.
            </p>
          </div>
        )}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 p-3">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-mono text-sm font-black uppercase tracking-[0.28em] text-white">Temporal_Analysis_v4</h3>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#76829c]">Activity_Frequency_Trending</p>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); setShowTemporalTooltip(v => !v); }}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-gcs-primary/40 bg-[#10131e] font-mono text-[9px] font-bold text-gcs-primary transition-colors hover:bg-gcs-primary/20 focus:outline-none"
              aria-label="Show definition"
            >
              ?
            </button>
          </div>
          <div className="flex gap-1 bg-[#10131e] p-1 rounded-sm border border-white/10 self-start sm:self-auto z-10">
            {(['daily', 'weekly', 'monthly'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] rounded-sm transition-colors ${timeframe === t ? 'bg-gcs-primary text-white shadow-[0_0_10px_rgba(255,69,79,0.3)]' : 'text-[#74809b] hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>
        <TemporalChart values={chartValues} labels={chartLabels} />
      </section>
    </div>
  );
};

export default AnalyticsPanel;
