import React, { useState, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';

import Sidebar from './components/ControlPanel';
import DashboardHeader from './components/Header';
import DashboardView from './components/DashboardView';
import AnalyticsPanel from './components/AnalyticsPanel';
import FlightLogsPanel from './components/FlightLogsPanel';
import SettingsPanel from './components/SettingsPanel';
import GuidePanel from './components/GuidePanel';
import AboutPanel from './components/AboutPanel';
import AccountPanel from './components/AccountPanel';
import AuthScreen from './components/AuthScreen';
import SplashScreen from './components/SplashScreen';

import { useDashboardData } from './hooks/useDashboardData';
import { supabase } from './supabaseClient';
import type { Mission } from 'types';

type View = 'dashboard' | 'analytics' | 'flightLogs' | 'settings' | 'guide' | 'about' | 'account';

interface AuthenticatedAppProps {
  session: Session;
  onSignOut: () => Promise<void>;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ session, onSignOut }) => {
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem('mapStyle') || 'Satellite';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'orange';
  });

  useEffect(() => {
    localStorage.setItem('mapStyle', mapStyle);
  }, [mapStyle]);

  useEffect(() => {
    const oldTheme = localStorage.getItem('theme');
    if (oldTheme) {
      document.documentElement.classList.remove(`theme-${oldTheme}`);
    }
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [missions, setMissions] = useState<Mission[]>([]);
  const { overviewStats, liveTelemetry } = useDashboardData(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Mission[] = await response.json();
        setMissions(data);
      } catch (error) {
        console.error('Failed to fetch missions:', error);
        setMissions([]);
      }
    };
    fetchMissions();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsPanel missions={missions} />;
      case 'flightLogs':
        return <FlightLogsPanel missions={missions} mapStyle={mapStyle} />;
      case 'settings':
        return (
          <SettingsPanel
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
            theme={theme}
            setTheme={setTheme}
          />
        );
      case 'guide':
        return <GuidePanel />;
      case 'about':
        return <AboutPanel />;
      case 'account':
        return <AccountPanel email={session.user.email || ''} onSignOut={onSignOut} />;
      case 'dashboard':
      default:
        return <DashboardView overviewStats={overviewStats} missions={missions} />;
    }
  };

  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    flightLogs: 'Flight Logs',
    settings: 'Settings',
    guide: 'Guide',
    about: 'About Project',
    account: 'Account',
  };

  const contentClassName = currentView === 'dashboard' ? 'min-h-0 flex-1 overflow-hidden' : 'min-h-0 flex-1 overflow-y-auto';
  const showBackView = currentView === 'guide' || currentView === 'settings' || currentView === 'about' || currentView === 'account';

  return (
    <div className="app-theme app-shell-bg relative flex h-screen overflow-hidden bg-gcs-background font-sans text-gcs-text-dark dark:bg-gcs-dark dark:text-gcs-text-light">
      <div className="pointer-events-none absolute -left-10 top-14 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-52 w-52 rounded-full bg-blue-300/10 blur-3xl" />
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden p-3 pb-20">
        <DashboardHeader
          title={viewTitles[currentView]}
          batteryPercentage={liveTelemetry.battery.percentage}
          onOpenGuide={() => setCurrentView('guide')}
          onOpenSettings={() => setCurrentView('settings')}
          onOpenAbout={() => setCurrentView('about')}
          onOpenAccount={() => setCurrentView('account')}
          showMenuButton={!showBackView}
          showBackButton={showBackView}
          onBack={() => setCurrentView('dashboard')}
        />
        <div className={contentClassName}>{renderView()}</div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [splashRunId, setSplashRunId] = useState(0);
  const hasShownInitialSplash = useRef(false);
  const previousSession = useRef<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setAuthLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const shouldShow = !hasShownInitialSplash.current || (!previousSession.current && !!session);
    previousSession.current = session;

    if (!shouldShow) {
      return;
    }

    hasShownInitialSplash.current = true;
    setShowSplash(true);
    setSplashRunId(prev => prev + 1);
  }, [authLoading, session]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error.message);
    }
  };

  if (authLoading) {
    return <SplashScreen key={`splash-auth-${splashRunId}`} />;
  }

  if (showSplash) {
    return <SplashScreen key={`splash-ui-${splashRunId}`} onComplete={() => setShowSplash(false)} />;
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <AuthenticatedApp session={session} onSignOut={handleSignOut} />;
};

export default App;
