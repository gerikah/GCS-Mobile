import React, { useState } from 'react';

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, description, children }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
    <h3 className="text-sm font-bold text-gcs-text-dark dark:text-white">{title}</h3>
    <p className="mb-4 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
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
  <div className="flex items-center justify-between border-t pt-3 first:border-t-0 first:pt-0 dark:border-gray-700">
    <div className="pr-4">
      <p className="text-[11px] font-semibold text-gcs-text-dark dark:text-gray-200">{label}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 gcs-primary ${enabled ? 'bg-gcs-orange' : 'bg-gray-300'}`}
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
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  React.useEffect(() => {
    if (showSaveMessage) {
      const timer = setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveMessage]);

  const handleSaveSettings = () => {
    setShowSaveMessage(true);
  };

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

      <div className="flex justify-end gap-3 pb-4">
        <button className="rounded-lg bg-gray-200 px-6 py-2 text-[11px] font-bold text-gray-600 transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
          Reset to Defaults
        </button>
        <button
          className="gcs-primary rounded-lg bg-gcs-orange px-6 py-2 text-[11px] font-bold text-white shadow-lg shadow-gcs-orange/30 transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={handleSaveSettings}
        >
          Save Settings
        </button>
      </div>

      {showSaveMessage && (
        <div className="animate-fade-in-fast absolute bottom-4 right-4 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
          Settings saved successfully!
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
