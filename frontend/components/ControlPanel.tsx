import React from 'react';

const DashboardIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const AnalyticsIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="20" x2="20" y2="20" />
    <rect x="6" y="11" width="3" height="7" fill="currentColor" stroke="none" rx="0.5" />
    <rect x="11" y="8" width="3" height="10" fill="currentColor" stroke="none" rx="0.5" />
    <rect x="16" y="5" width="3" height="13" fill="currentColor" stroke="none" rx="0.5" />
  </svg>
);
const LogsIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;

type View = 'dashboard' | 'analytics' | 'flightLogs' | 'settings' | 'guide' | 'about' | 'account';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    view: View;
    active: boolean;
    onClick: () => void;
}

const MobileNavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[11px] font-semibold transition-colors ${
      active ? 'bg-white text-gcs-text-dark shadow' : 'text-gcs-text-light'
    }`}
  >
    <span>{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="app-shell-bg fixed inset-x-0 bottom-0 z-40 border-t border-white/20 p-2 backdrop-blur" aria-label="Bottom navigation">
      <div className="mx-auto grid grid-cols-3 gap-1">
        <MobileNavItem icon={<DashboardIcon />} label="Home" view="dashboard" active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
        <MobileNavItem icon={<AnalyticsIcon />} label="Stats" view="analytics" active={currentView === 'analytics'} onClick={() => onNavigate('analytics')} />
        <MobileNavItem icon={<LogsIcon />} label="Logs" view="flightLogs" active={currentView === 'flightLogs'} onClick={() => onNavigate('flightLogs')} />
      </div>
    </nav>
  );
};

export default Sidebar;
