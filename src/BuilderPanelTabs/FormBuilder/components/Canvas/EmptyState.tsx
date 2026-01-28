import React from 'react';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="text-4xl mb-4 opacity-50">
          {icon}
        </div>
      )}
      
      <h3 className="text-sm font-semibold text-neutral-300 dark:text-gray-600 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-xs text-neutral-500 dark:text-gray-500 mb-4 max-w-[200px]">
          {description}
        </p>
      )}
    </div>
  );
};
