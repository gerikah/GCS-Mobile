// Backend-specific types (without React dependencies)

// --- NEW SCHEMA TYPES ---

export interface User {
  id: string;
  full_name: string;
  role: 'Pilot' | 'LGU Personnel' | 'Sanitation Officer';
  email: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Barangay {
  id: number;
  city_id: number;
  name: string;
  city?: City;
}

export interface FlightSession {
  id: string;
  pilot_id: string | null;
  barangay_id: number | null;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed' | 'aborted';
  pilot?: User;
  barangay?: Barangay;
  session_name?: string;
}

export interface TargetType {
  id: number;
  label: string;
  description: string | null;
}

export interface Detection {
  id: string;
  session_id: string;
  target_type_id: number;
  confidence: number | null;
  water_confirmed: boolean;
  latitude: number;
  longitude: number;
  lidar_m: number | null;
  image_url: string | null;
  created_at: string;
  target_type?: TargetType;
}

export interface HardwareTelemetry {
  id: number;
  session_id: string;
  logged_at: string;
  latitude: number | null;
  longitude: number | null;
  altitude_lidar_m: number | null;
  battery_voltage: number | null;
  heading: number | null;
  is_armed: boolean | null;
}

export interface AiPerformanceLog {
  id: number;
  session_id: string;
  logged_at: string;
  sharpness_score: number | null;
  tracking_progress_percent: number | null;
  pipeline_speed_ms: number | null;
}

export interface SprayOperation {
  id: string;
  detection_id: string;
  session_id: string | null;
  triggered_at: string;
  trigger_type: 'Manual' | 'Auto' | null;
  duration_seconds: number;
  target_area_pixels: number | null;
  true_area_scaled: number | null;
}

export interface StreamHealth {
  id: number;
  session_id: string | null;
  logged_at: string;
  pi_ip: string | null;
  laptop_ip: string | null;
  stream_pid: string | null;
  status: 'Healthy' | 'Missing/Restarting' | 'Disconnected' | 'Failed' | 'Stream Frozen' | 'Too Blurry' | null;
}

// --- LEGACY COMPATIBILITY TYPES ---

export type MissionStatus = 'Completed' | 'Interrupted' | 'In Progress' | 'active' | 'completed' | 'aborted';

export interface BreedingSiteInfo {
    type: string;
    object: string; 
    bbox?: [number, number, number, number];
    confidence?: number;
    location?: { lat: number; lon: number };
}

export interface Mission {
  id: string | number;
  name: string;
  date: string;
  duration: string;
  status: MissionStatus;
  location: string;
  gpsTrack?: { lat: number; lon: number }[];
  detectedSites?: BreedingSiteInfo[];
  coverageArea?: number;
  sprayEfficiency?: number;
  totalDetections?: number;
  totalSprays?: number;
}

export interface LiveTelemetry {
    gps: {
        lat: number;
        lon: number;
    };
    altitude: number;
    speed: number;
    roll: number;
    pitch: number;
    heading: number;
    signalStrength: number;
    battery: {
        voltage: number;
        percentage: number;
    };
    satellites: number;
    flightTime: string;
    distanceFromHome: number;
    flightMode: string;
    armed: boolean;
    verticalSpeed: number;
    breedingSiteDetected: boolean;
    currentBreedingSite?: BreedingSiteInfo;
    detectedSites: BreedingSiteInfo[];
    gpsTrack: { lat: number; lon: number }[];
    modes: {
      angle: boolean;
      positionHold: boolean;
      returnToHome: boolean;
      altitudeHold: boolean;
      headingHold: boolean;
      airmode: boolean;
      surface: boolean;
      mcBraking: boolean;
      beeper: boolean;
    }
}
