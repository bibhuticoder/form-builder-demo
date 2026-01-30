/**
 * Visual indicator showing where items will be dropped during drag operations.
 * Renders a blue horizontal line at the drop location.
 */

import React from "react";

export const DropIndicator: React.FC<{ width: string }> = ({ width }) => <div className={`h-1 bg-primary my-1 rounded-sm ${width}`} />;
