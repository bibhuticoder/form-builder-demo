import React from 'react';

export interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({ options, className = '', ...props }) => {
  return (
    <select
      className={`
        block w-full px-3 py-2 
        border border-gray-300 dark:border-gray-600 
        rounded-lg 
        bg-white dark:bg-gray-700 
        text-gray-900 dark:text-white 
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        transition-colors duration-200
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
