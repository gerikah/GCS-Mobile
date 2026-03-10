import React from 'react';

const GuidePanel: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gcs-primary/10 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gcs-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white">Guide coming soon</h2>
      </div>
    </div>
  );
};

export default GuidePanel;
