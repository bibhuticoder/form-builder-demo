import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};
