import React from 'react';

export interface SubNavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SubNavProps {
  items: SubNavItem[];
  activeTab: string;
  onTabClick: (value: string) => void;
}

export const SubNav: React.FC<SubNavProps> = ({ items, activeTab, onTabClick }) => {
  return (
    <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onTabClick(item.value)}
          className={`
            flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200
            border-b-2 -mb-px
            ${activeTab === item.value
              ? 'border-primary text-primary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }
          `}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
};
