import React from 'react';
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export interface EmptyStateProps {
  isOver?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isOver = false
}) => {
  return (
    <div className={`h-full w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isOver ? 'border-[#5533ff] bg-primary/5 dark:bg-primary/10' : 'border-neutral-300 dark:border-neutral-700 bg-slate-50/50 dark:bg-slate-800/10'}`}>
      <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${isOver ? 'bg-indigo-100 dark:bg-indigo-900/30 text-[#5533ff] dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'}`}>
        <DocumentTextIcon className="w-10 h-10" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isOver ? 'text-[#5533ff] dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
        {isOver ? 'Drop Widget Here' : 'Drag Widget Here'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        Select an element from the sidebar and drag it here to start building your form.
      </p>
    </div>
  );
};
