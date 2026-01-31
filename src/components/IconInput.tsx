import React from 'react';

export interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  containerStyles?: string;
  inputStyles?: string;
}

export const IconInput: React.FC<IconInputProps> = ({
  icon,
  className = '',
  containerStyles = '',
  inputStyles = '',
  ...props
}) => {
  return (
    <div className={`relative ${containerStyles}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <input
        className={`
          block w-full pl-10 pr-3 py-1.5 text-sm 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-colors duration-200
          ${inputStyles}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
