import React from "react";
import { Field } from "../../../../../types";

interface LogicTabProps {
  field: Field;
}

export const LogicTab: React.FC<LogicTabProps> = () => {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Logic tab coming soon...</p>
        <p className="text-xs mt-2">Configure conditional rules, visibility, and form submission logic.</p>
      </div>
    </div>
  );
};
