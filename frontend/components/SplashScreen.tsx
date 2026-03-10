import React from 'react';

const LOGO_BG = '#111828';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  return (
    <div className="flex h-screen items-center justify-center px-6" style={{ backgroundColor: LOGO_BG }}>
      <div className="w-full max-w-xs text-center">
        <div className="mx-auto w-fit rounded-lg p-1" style={{ backgroundColor: LOGO_BG }}>
          <img src="/logo.png" alt="Ground Control Logo" className="h-24 w-24 object-contain" />
        </div>
        <h1 className="mt-3 text-sm font-bold text-white">Ground Control Station Mobile</h1>
        <p className="mt-0.5 text-[11px] text-orange-200">for Smart Mosquito Control Drone</p>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full w-full origin-left rounded-full bg-orange-500 animate-splash-fill"
            onAnimationEnd={onComplete}
          />
        </div>
      </div>
    </div>
  );
};

if (!document.getElementById('splash-animations')) {
  const style = document.createElement('style');
  style.id = 'splash-animations';
  style.innerHTML = `
  @keyframes splash-fill {
    0% { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }
  .animate-splash-fill {
    animation: splash-fill 1.2s linear forwards;
  }
  `;
  document.head.appendChild(style);
}

export default SplashScreen;
