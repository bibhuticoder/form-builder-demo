import React from 'react';

export interface IconSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

export const IconSelect: React.FC<IconSelectProps> = ({ icon, options, className = '', ...props }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <select
        className={`
          block w-full pl-10 pr-3 py-2 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-colors duration-200
          ${className}
          shadow
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
