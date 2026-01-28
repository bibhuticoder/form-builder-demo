import React, { useEffect, useState } from 'react';

export interface SmoothProgressBarProps {
  progress: number;
}

export const SmoothProgressBar: React.FC<SmoothProgressBarProps> = ({ progress }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${displayProgress}%` }}
      />
    </div>
  );
};
