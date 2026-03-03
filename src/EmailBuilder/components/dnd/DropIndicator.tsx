import React from "react";

export const DropIndicator: React.FC<{ width?: string }> = ({ width }) => <div className={`h-1 bg-primary my-1 rounded-sm ${width || 'w-full'}`} />;
