import React from 'react';

const TelemetryItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center space-x-3 text-[11px]">
        {icon}
        <span className="text-gray-600">{label}</span>
    </div>
);

const InitializingIcon = () => (
    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const WifiIcon = () => (
    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.556a8.889 8.889 0 0111.112-1.41M5.556 12.889a13.333 13.333 0 0116.11-2.044M3 9.222a17.778 17.778 0 0120.222-2.388" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.222h.01" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
);

const TelemetryData: React.FC = () => {
  return (
    <div className="bg-gcs-card p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold mb-4">Telemetry Data</h3>
        <div className="space-y-4">
            <TelemetryItem icon={<InitializingIcon />} label="Initializing..." />
            <TelemetryItem icon={<ArrowUpIcon />} label="Initializing..." />
            <TelemetryItem icon={<WifiIcon />} label="GCS: -65 dBm" />
            <TelemetryItem icon={<WifiIcon />} label="RC: Standby" />
        </div>
    </div>
  );
};

export default TelemetryData;
