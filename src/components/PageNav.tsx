import React from 'react';

export interface PageNavProps {
  navigation: Array<{ name: string; href: string }>;
  currentView: string;
  onNavChange: (view: string) => void;
}

export const PageNav: React.FC<PageNavProps> = ({ navigation, currentView, onNavChange }) => {
  return (
    <nav className="flex space-x-4">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavChange(item.name);
          }}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${
              currentView === item.name
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }
          `}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
};
