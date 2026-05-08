import React, { useEffect, useState } from 'react';

interface DashboardHeaderProps {
  title: string;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  showMenuButton: boolean;
  showBackButton: boolean;
  onBack: () => void;
  userEmail: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  onOpenGuide,
  onOpenSettings,
  onOpenAbout,
  showMenuButton,
  showBackButton,
  onBack,
  userEmail,
  onSignOut,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!showMenuButton) {
      setMenuOpen(false);
    }
  }, [showMenuButton]);

  return (
    <header className="mb-3 border-b border-white/10 pb-3">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={onBack}
              className="border-l-2 border-gcs-primary px-2 py-1 font-mono text-[11px] font-bold text-gray-100"
              aria-label="Go back"
            >
              &lt;
            </button>
          )}
          <div>
            <h1 className="font-mono text-lg font-black uppercase italic tracking-[-0.02em] text-gray-100">{title}_</h1>
          </div>
        </div>
        {showMenuButton && (
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded border border-white/10 bg-[#10131e] px-3 py-1.5 font-mono text-sm font-semibold text-gray-100"
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
          <aside className="absolute right-0 top-0 bottom-0 flex w-[78vw] min-w-[260px] flex-col border-l border-gcs-primary/30 bg-[#111521] shadow-2xl animate-slide-in">
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-gray-100">Menu_</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded border border-white/10 bg-[#0b0e17] px-2 py-1 font-mono text-[11px] font-semibold text-gray-100"
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
                className="w-full border-l border-transparent px-2 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-gray-100 hover:border-gcs-primary hover:bg-gcs-primary/10"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  onOpenGuide();
                  setMenuOpen(false);
                }}
                className="w-full border-l border-transparent px-2 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-gray-100 hover:border-gcs-primary hover:bg-gcs-primary/10"
              >
                Guide
              </button>
              <button
                onClick={() => {
                  onOpenAbout();
                  setMenuOpen(false);
                }}
                className="w-full border-l border-transparent px-2 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-gray-100 hover:border-gcs-primary hover:bg-gcs-primary/10"
              >
                About
              </button>
            </div>
            </div>

            <div className="flex-shrink-0 border-t border-white/10 bg-[#111521] p-4 pb-24 sm:pb-8">
              <p className="mt-1 text-[11px] text-gray-500">Signed in as</p>
              <p className="mb-4 mt-0.5 break-all font-mono text-[11px] font-semibold text-white">
                {userEmail || 'Not signed in'}
              </p>
              <button
                onClick={onSignOut}
                className="w-full rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-red-400 transition-colors hover:bg-red-500/20"
              >
                Logout
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
