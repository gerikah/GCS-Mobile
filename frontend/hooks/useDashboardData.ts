import { useState, useEffect } from 'react';
import type { OverviewStat } from '../types'; 

const API_URL = 'http://192.168.254.189:8080';

export const useDashboardData = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ totalFlights: 0.0, totalFlightTime: '0.0' });

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
        const response = await fetch(`${API_URL}/api/missions/stats`);
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
  }, []); // The empty array means this runs only once

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // The stats now come from the backend (live and fetched)
  const overviewStats: Omit<OverviewStat, 'icon'>[] = [
      { 
        id: 'flights', 
        label: 'Successful Sessions', 
        value: stats.totalFlights.toString(),
        subtext: 'Completed missions' 
      },
      { 
        id: 'flightTime', 
        label: 'Total Flight Time', 
        value: stats.totalFlightTime === '0.0' ? '0.0' : stats.totalFlightTime, 
        subtext: 'Accumulated drone flight duration' 
      },
  ];

  return {
    overviewStats, 
    time: formattedTime, 
    date: formattedDate,
  };
};
