import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  onClose: () => void;
  onUndo?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, onUndo, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 max-w-md">
        <span className="flex-1">{message}</span>
        <div className="flex gap-2">
          {onUndo && (
            <button
              onClick={onUndo}
              className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 font-medium"
            >
              Undo
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-600 hover:text-gray-300 dark:hover:text-gray-500"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
