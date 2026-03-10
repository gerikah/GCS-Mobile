import React, { useState, useEffect, useRef } from 'react';
import type { OverviewStat, LiveTelemetry } from 'types'; 

//
// --- THIS IS THE FIX ---
//
// We must add the 'modes' object to the default telemetry
// so the component doesn't crash before the websocket connects.
//
const defaultTelemetry: LiveTelemetry = {
    gps: { lat: 0.0, lon: 0.0 },
    altitude: 0,
    speed: 0,
    roll: 0,
    pitch: 0,
    heading: 0,
    signalStrength: 0.0,
    battery: { voltage: 0.0, percentage: 0.0 },
    satellites: 0,
    flightTime: '0.0',
    distanceFromHome: 0,
    flightMode: '0.0',
    armed: false,
    verticalSpeed: 0,
    breedingSiteDetected: false,
    detectedSites: [],
    gpsTrack: [],
    // --- ADDED THIS BLOCK ---
    modes: {
      angle: false,
      positionHold: false,
      returnToHome: false,
      altitudeHold: false,
      headingHold: false,
      airmode: false,
      surface: false,
      mcBraking: false,
      beeper: false,
    }
    // --- END OF FIX ---
};

export const useDashboardData = (isMissionActive: boolean) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveTelemetry, setLiveTelemetry] = useState<LiveTelemetry>(defaultTelemetry);
  const [stats, setStats] = useState({ totalFlights: 0.0, totalFlightTime: '0.0' });
  const socketRef = useRef<WebSocket | null>(null); // Holds the WebSocket connection

  // This function now SENDS a command to the backend
  const setArmedState = (shouldArm: boolean) => {
      if (isMissionActive && !shouldArm) {
          alert("Cannot disarm while a mission is active. Please end the mission first.");
          return;
      }
      
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        // Send the "arm" command to the backend as a JSON string
        socketRef.current.send(JSON.stringify({
          type: 'SET_ARM',
          payload: shouldArm
        }));
      } else {
        console.warn("WebSocket is not connected. Cannot send arm command.");
      }
  };

  // This effect just runs the clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []); // Runs once

  // This effect runs ONCE to connect to the backend
  useEffect(() => {
    // 1. Fetch the dashboard stats from the API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/missions/stats');
        const data = await response.json();
        setStats({
          totalFlights: Number(data?.totalFlights ?? 0.0),
          totalFlightTime: String(data?.totalFlightTime ?? '0.0'),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();

    // 2. Connect to the WebSocket for live data
    // This calculates the correct ws:// or wss:// address
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = `${wsProtocol}//${window.location.host}/ws/live`;
    
    const socket = new WebSocket(wsHost);
    socketRef.current = socket; // Save the connection

    socket.onopen = () => console.log('WebSocket connected!');
    socket.onclose = () => console.log('WebSocket disconnected.');
    socket.onerror = (err) => console.error('WebSocket error:', err);

    // 3. This is where we receive live data from the backend
    socket.onmessage = (event) => {
      try {
        // We receive the new telemetry data...
        const telemetryData: LiveTelemetry = JSON.parse(event.data);
        // ...and use it to update the state, which updates the UI
        setLiveTelemetry(telemetryData); 
      } catch (error) {
        console.error("Failed to parse telemetry:", error);
      }
    };

    // This function runs when the component is unmounted
    return () => {
      socket.close(); // Clean up the connection
    };
  }, []); // The empty array means this runs only once

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // The stats now come from the backend (live and fetched)
  const overviewStats: Omit<OverviewStat, 'icon'>[] = [
      { 
        id: 'flights', 
        label: 'Total Flights', 
        value: `${stats.totalFlights.toFixed(1)}`,
        subtext: 'Completed Missions' 
      },
      { 
        id: 'flightTime', 
        label: 'Total Flight Time', 
        value: stats.totalFlightTime === '0.0' ? '0.0' : stats.totalFlightTime, 
        subtext: 'Accumulated drone flight duration' 
      },
      { 
        id: 'battery', 
        label: 'System Battery', 
        value: `${liveTelemetry.battery.percentage.toFixed(1)}`,
        subtext: liveTelemetry.battery.percentage > 20 ? 'Healthy' : 'Low' 
      },
  ];

  return {
    overviewStats, 
    time: formattedTime, 
    date: formattedDate,
    liveTelemetry, // This is now live data from the backend
    setArmedState
  };
};
