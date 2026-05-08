// packages/types/index.ts
import React from 'react';

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

// --- LEGACY COMPATIBILITY TYPES (Mapped to new schema) ---

export type MissionStatus = 'Completed' | 'Interrupted' | 'In Progress' | 'active' | 'completed' | 'aborted';

export interface BreedingSiteInfo {
    type: string;
    object: string; // e.g., 'Tires', 'Sewage', 'Pots'
    bbox?: [number, number, number, number];
    confidence?: number;
    location?: { lat: number; lon: number };
}

export interface Mission {
  id: string | number;
  name: string;
  date: string;
  duration: string; // This will store total seconds as a string
  status: MissionStatus;
  location: string;
  gpsTrack?: { lat: number; lon: number }[];
  detectedSites?: BreedingSiteInfo[];
}

export interface OverviewStat {
  id:string;
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
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
