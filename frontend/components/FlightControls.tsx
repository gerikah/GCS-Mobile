import React from 'react';
import type { LiveTelemetry } from 'types';

// Icons
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556a8.889 8.889 0 0111.112-1.41M5.556 12.889a13.333 13.333 0 0116.11-2.044M3 9.222a17.778 17.778 0 0120.222-2.388M12 18.222h.01" /></svg>;
const BatteryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const SatelliteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;

const TelemetryItem: React.FC<{ label: string; value: string | number; subValue?: string; icon: React.ReactNode }> = ({ label, value, subValue, icon }) => (
    <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
        <div className="flex items-center gap-3">
            <div className="text-yellow-400">{icon}</div>
            <span className="text-[11px] text-gray-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="font-mono text-white">{value}</span>
          {subValue && <span className="text-[11px] ml-1 opacity-70">{subValue}</span>}
        </div>
    </div>
);

const ModeButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="bg-[#334155] hover:bg-[#475569] text-[11px] text-gray-200 font-semibold py-3 rounded-lg transition-colors">
        {children}
    </button>
);


const FlightControls: React.FC<{ telemetry: LiveTelemetry }> = ({ telemetry }) => {
    const modes = [
        "ARM", "ANGLE", "POSITION HOLD", "RETURN TO HOME",
        "ALTITUDE HOLD", "HEADING HOLD", "AIRMODE", "SURFACE",
        "MC BRAKING", "BEEPER"
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Modes Panel */}
            <div className="bg-[#1F2937] p-4 rounded-xl border border-gray-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">MODES</h3>
                <div className="grid grid-cols-2 gap-2">
                    {modes.map(mode => <ModeButton key={mode}>{mode}</ModeButton>)}
                </div>
            </div>

            {/* Telemetry Panel */}
            <div className="bg-[#1F2937] p-4 rounded-xl border border-gray-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">TELEMETRY</h3>
                <div className="space-y-2">
                    <TelemetryItem 
                        label="Signal Strength" 
                        value={`${telemetry.signalStrength} dBm`} 
                        icon={<SignalIcon />} 
                    />
                    <TelemetryItem 
                        label="Battery" 
                        value={`${telemetry.battery.percentage.toFixed(1)}%`} 
                        subValue={`${telemetry.battery.voltage.toFixed(1)}V`} 
                        icon={<BatteryIcon />} 
                    />
                    <TelemetryItem 
                        label="Satellites" 
                        value={telemetry.satellites} 
                        icon={<SatelliteIcon />} 
                    />
                    <TelemetryItem 
                        label="Dist. from Home" 
                        value={`${telemetry.distanceFromHome.toFixed(0)} m`} 
                        icon={<HomeIcon />} 
                    />
                </div>
            </div>
        </div>
    );
};

export default FlightControls;
