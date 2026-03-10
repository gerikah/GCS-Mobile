import React from 'react';

const ProgressBar: React.FC<{ label: string; percentage: number }> = ({ label, percentage }) => (
    <div>
        <p className="text-[11px] text-gray-600 mb-2">{label}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gcs-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const PerformanceMetrics: React.FC = () => {
  return (
    <div className="bg-gcs-card p-6 rounded-2xl shadow-sm">
      <h3 className="text-sm font-bold mb-4">Performance Metrics</h3>
      <div className="space-y-5">
        <ProgressBar label="Response Time" percentage={80} />
        <ProgressBar label="Data Throughput" percentage={65} />
      </div>
    </div>
  );
};

export default PerformanceMetrics;
