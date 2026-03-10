import type React from 'react';

export interface GpsPoint {
  lat: number;
  lon: number;
}

export interface BatteryTelemetry {
  voltage: number;
  percentage: number;
}

export interface TelemetryModes {
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

export interface DetectedSite {
  object: string;
  type: string;
  bbox?: number[];
}

export interface LiveTelemetry {
  gps: GpsPoint;
  altitude: number;
  speed: number;
  roll: number;
  pitch: number;
  heading: number;
  signalStrength: number;
  battery: BatteryTelemetry;
  satellites: number;
  flightTime: string;
  distanceFromHome: number;
  flightMode: string;
  armed: boolean;
  verticalSpeed: number;
  breedingSiteDetected: boolean;
  detectedSites: DetectedSite[];
  gpsTrack: GpsPoint[];
  modes: TelemetryModes;
}

export interface Mission {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: string;
  location: string;
  gpsTrack?: GpsPoint[];
  detectedSites?: DetectedSite[];
}

export interface OverviewStat {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
}
