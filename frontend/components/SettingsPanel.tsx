import React, { useState } from 'react';

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, description, children }) => (
  <div className="rounded-md border border-white/10 bg-[#191d2d] p-4 shadow-sm dark:bg-gray-800">
    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-gcs-text-dark dark:text-white">{title}</h3>
    <p className="mb-4 mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{description}</p>
    <div className="space-y-3">{children}</div>
  </div>
);

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between border-t border-white/10 pt-3 first:border-t-0 first:pt-0 dark:border-gray-700">
    <div className="pr-4">
      <p className="text-[11px] font-semibold text-gcs-text-dark dark:text-gray-200">{label}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gcs-primary gcs-primary ${enabled ? 'bg-gcs-orange shadow-[0_0_14px_rgba(255,69,79,0.35)]' : 'bg-gray-700'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

interface SettingsPanelProps {
  mapStyle: string;
  setMapStyle: (style: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = () => {
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="relative h-full space-y-4 overflow-y-auto animate-fade-in">
      <SettingSection title="Data and Privacy" description="Manage account data synchronization preferences.">
        <ToggleSetting
          label="Cloud Sync"
          description="Automatically back up mission logs and settings to the cloud."
          enabled={autoSync}
          onToggle={() => setAutoSync(!autoSync)}
        />
      </SettingSection>

      <SettingSection title="GCS Web Version" description="Download the desktop application for full mission control.">
        <div className="pt-1">
          <a
            href="https://drive.google.com/file/d/1lQUv4REZPz7wOOdE-PPedlBWymVx38Ki/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-gcs-primary/50 bg-gcs-primary/10 px-6 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-gcs-primary transition-all duration-200 hover:bg-gcs-primary/20 focus:outline-none focus:ring-2"
          >
            Download Web Version
          </a>
        </div>
      </SettingSection>
    </div>
  );
};

export default SettingsPanel;
