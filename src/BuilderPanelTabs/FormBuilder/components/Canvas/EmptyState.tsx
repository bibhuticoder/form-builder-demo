import React from 'react';
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export interface EmptyStateProps {
  isOver?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isOver = false
}) => {
  return (
    <div className={`h-full w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isOver ? 'border-[#5533ff] bg-primary/5' : 'border-neutral-300 bg-slate-50/50'}`}>
      <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${isOver ? 'bg-indigo-100 text-[#5533ff]' : 'bg-slate-100 text-slate-300'}`}>
        <DocumentTextIcon className="w-10 h-10" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isOver ? 'text-[#5533ff]' : 'text-slate-700'}`}>
        {isOver ? 'Drop Widget Here' : 'Drag Widget Here'}
      </h3>
      <p className="text-slate-500 max-w-sm">
        Select an element from the sidebar and drag it here to start building your form.
      </p>
    </div>
  );
};
