/**
 * Visual indicator showing where items will be dropped during drag operations.
 * Renders a blue horizontal line at the drop location.
 */

import React from "react";

/** Styles for the blue drop indicator line */
const DROP_INDICATOR_STYLES = {
  height: "4px",
  backgroundColor: "#3b82f6",
  margin: "4px 0",
  borderRadius: "2px",
  width: "100%",
} as const;

export const DropIndicator: React.FC = () => <div style={DROP_INDICATOR_STYLES} />;
