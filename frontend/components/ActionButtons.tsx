import React from 'react';
import type { LiveTelemetry } from '../types';

// Icons
const GpsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SatelliteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const BatteryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556a8.889 8.889 0 0111.112-1.41M5.556 12.889a13.333 13.333 0 0116.11-2.044M3 9.222a17.778 17.778 0 0120.222-2.388M12 18.222h.01" /></svg>;

const TelemetryItem: React.FC<{ icon: React.ReactNode; label: string; value: string; statusColor?: string }> = ({ icon, label, value, statusColor }) => (
    <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-gcs-primary/10 ${statusColor || 'text-gcs-primary'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{label}</p>
            <p className="font-semibold text-[11px] text-gcs-text-dark dark:text-white truncate">{value}</p>
        </div>
    </div>
);

const getGpsStatus = (satellites: number) => {
    if (satellites > 10) return { text: 'Excellent Lock', color: 'text-green-500' };
    if (satellites > 6) return { text: 'Good Lock', color: 'text-yellow-500' };
    return { text: 'Weak Lock', color: 'text-red-500' };
};

const getSignalStatus = (dbm: number) => {
    if (dbm > -60) return { text: 'Excellent', color: 'text-green-500' };
    if (dbm > -80) return { text: 'Good', color: 'text-yellow-500' };
    return { text: 'Weak', color: 'text-red-500' };
}

interface PreFlightPanelProps {
    telemetry: LiveTelemetry;
    setArmedState: (isArmed: boolean) => void;
}

const PreFlightPanel: React.FC<PreFlightPanelProps> = ({ telemetry, setArmedState }) => {
    const gpsStatus = getGpsStatus(telemetry.satellites);
    const signalStatus = getSignalStatus(telemetry.signalStrength);

    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2">Pre-Flight Systems</h3>
                
                <div className="bg-gray-100 dark:bg-gray-900/50 p-2 mb-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] dark:text-gray-300">STATUS:</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${telemetry.armed ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                            {telemetry.armed ? 'ARMED' : 'DISARMED'}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <button onClick={() => setArmedState(true)} disabled={telemetry.armed} className="text-[11px] font-bold bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">ARM</button>
                        <button onClick={() => setArmedState(false)} disabled={!telemetry.armed} className="text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">DISARM</button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Live Telemetry</h4>
                     <div className="grid grid-cols-2 gap-1.5 flex-1">
                        <TelemetryItem icon={<GpsIcon />} label="GPS Status" value={gpsStatus.text} statusColor={gpsStatus.color} />
                        <TelemetryItem icon={<SatelliteIcon />} label="Satellites" value={`${telemetry.satellites} Locked`} />
                        <TelemetryItem icon={<BatteryIcon />} label="Drone Battery" value={`${telemetry.battery.percentage.toFixed(1)}%`} />
                        <TelemetryItem icon={<SignalIcon />} label="Signal Strength" value={`${telemetry.signalStrength} dBm`} statusColor={signalStatus.color} />
                    </div>
                    <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                        Mode: {telemetry.flightMode} | Lat: {telemetry.gps.lat.toFixed(4)}, Lon: {telemetry.gps.lon.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreFlightPanel;
