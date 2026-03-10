import React from 'react';

interface AccountPanelProps {
  email: string;
  onSignOut: () => void;
}

const AccountPanel: React.FC<AccountPanelProps> = ({ email, onSignOut }) => {
  return (
    <div className="animate-fade-in rounded-xl bg-white p-3 shadow-sm dark:bg-gray-800">
      <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white">Account</h2>
      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Signed in as</p>
      <p className="mt-0.5 text-[11px] font-semibold text-gcs-text-dark dark:text-white break-all">{email || 'No mission logs'}</p>

      <button
        onClick={onSignOut}
        className="mt-4 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AccountPanel;
