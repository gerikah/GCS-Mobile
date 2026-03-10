import React, { useEffect, useRef } from 'react';
import type { LiveTelemetry } from 'types';

interface CameraFeedProps {
    telemetry: LiveTelemetry;
}

const HUDValue: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div>
        <p className="text-[11px] text-yellow-400 opacity-80">{label}</p>
        <p className="font-mono text-lg tracking-wider text-white">
            {value}
            {unit && <span className="text-[11px] ml-1 opacity-70">{unit}</span>}
        </p>
    </div>
);


const MiniMap: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    return (
        <div className="absolute top-4 right-4 w-52 h-36 rounded-lg border-2 border-white/30 overflow-hidden shadow-2xl bg-black">
             <div className="absolute top-1 left-2 text-[11px] text-gray-300 flex items-center gap-2">
                 <img src="https://www.svgrepo.com/show/505878/satellite.svg" className="w-4 h-4 invert opacity-70" alt="satellite icon"/>
                 Satellite map view
             </div>
             <div className="absolute top-6 right-2 text-lg font-mono text-white/90 bg-black/50 px-1 rounded">
                {lon.toFixed(6)}
            </div>

            {/* Drone Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="absolute bottom-2 left-2 text-[11px] font-mono text-white/90 bg-black/50 px-1 rounded">
                <p>{lat.toFixed(4)}</p>
                <p>{lon.toFixed(4)}</p>
            </div>
        </div>
    );
};


const CameraFeed: React.FC<CameraFeedProps> = ({ telemetry }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream;
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            
            {/* HUD Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between font-mono">
                    <HUDValue label="LAT" value={telemetry.gps.lat.toFixed(6)} />
                </div>

                {/* Bottom ALT/SPD values removed and placed in LiveMissionView */}
            </div>
            
            <MiniMap lat={telemetry.gps.lat} lon={telemetry.gps.lon} />
        </>
    );
};

export default CameraFeed;