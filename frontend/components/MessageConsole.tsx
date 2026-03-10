import React, { useEffect, useState } from 'react';

interface DashboardHeaderProps {
  title: string;
  batteryPercentage: number;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenAccount: () => void;
  showMenuButton: boolean;
  showBackButton: boolean;
  onBack: () => void;
}

const BatteryStatusIcon: React.FC<{ percentage: number }> = ({ percentage }) => {
    const level = Math.round(percentage / 25); // 0-4
    const color = percentage > 50 ? 'text-green-500' : percentage > 20 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
            <svg className={`w-6 h-6 ${color}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.75 3.25V2a.75.75 0 00-1.5 0v1.25H9A2.75 2.75 0 006.25 6v10A2.75 2.75 0 009 18.75h2A2.75 2.75 0 0013.75 16V6A2.75 2.75 0 0011 3.25h-.25zM9 4.75h2a1.25 1.25 0 011.25 1.25v10a1.25 1.25 0 01-1.25 1.25H9A1.25 1.25 0 017.75 16V6A1.25 1.25 0 019 4.75z" clipRule="evenodd" />
              {percentage > 10 && <rect x="8" y={15 - ((percentage-10)/90)*9} width="4" height={((percentage-10)/90)*9} rx="0.5" />}
            </svg>
            <span className={`font-semibold text-[11px] ${color}`}>{percentage.toFixed(1)}%</span>
        </div>
    )
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  batteryPercentage,
  onOpenGuide,
  onOpenSettings,
  onOpenAbout,
  onOpenAccount,
  showMenuButton,
  showBackButton,
  onBack,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!showMenuButton) {
      setMenuOpen(false);
    }
  }, [showMenuButton]);

  return (
    <header className="mb-2 border-b border-gray-200 pb-2 dark:border-gray-700">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={onBack}
              className="rounded-md px-2 py-1 text-[11px] font-semibold text-gray-100"
              aria-label="Go back"
            >
              &lt;
            </button>
          )}
          <h1 className="text-sm font-bold text-gray-100">{title}</h1>
        </div>
        {showMenuButton && (
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-gray-100"
              aria-label="Open menu"
            >
              &#9776;
            </button>
          </div>
        )}
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[78vw] min-w-[260px] bg-[#162746] p-4 shadow-2xl animate-slide-in">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-100">Menu</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-md bg-[#243b63] px-2 py-1 text-[11px] font-semibold text-gray-100"
              >
                X
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onOpenSettings();
                  setMenuOpen(false);
                }}
                className="w-full rounded-md px-2 py-3 text-left text-[11px] font-medium text-gray-100 hover:bg-[#243b63]"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  onOpenGuide();
                  setMenuOpen(false);
                }}
                className="w-full rounded-md px-2 py-3 text-left text-[11px] font-medium text-gray-100 hover:bg-[#243b63]"
              >
                Guide
              </button>
              <button
                onClick={() => {
                  onOpenAccount();
                  setMenuOpen(false);
                }}
                className="w-full rounded-md px-2 py-3 text-left text-[11px] font-medium text-gray-100 hover:bg-[#243b63]"
              >
                Account
              </button>
              <button
                onClick={() => {
                  onOpenAbout();
                  setMenuOpen(false);
                }}
                className="w-full rounded-md px-2 py-3 text-left text-[11px] font-medium text-gray-100 hover:bg-[#243b63]"
              >
                About
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};

if (!document.getElementById('header-menu-animations')) {
  const style = document.createElement('style');
  style.id = 'header-menu-animations';
  style.innerHTML = `
  @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
  }
  .animate-slide-in {
      animation: slide-in 0.2s ease-out forwards;
  }
  `;
  document.head.appendChild(style);
}

export default DashboardHeader;
