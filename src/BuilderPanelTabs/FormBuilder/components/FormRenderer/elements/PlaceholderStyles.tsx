import React from 'react';
import { getPlaceholderStyles } from "../../../utils/styleUtils";

interface PlaceholderStylesProps {
  fieldId: string;
  style?: Record<string, any>;
}

export const PlaceholderStyles: React.FC<PlaceholderStylesProps> = ({ fieldId, style }) => {
  if (!style) return null;

  const styles = getPlaceholderStyles(style);
  
  // Convert React style object to CSS string
  const cssRules = Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}: ${value} !important;`;
    })
    .join(" ");

  if (!cssRules) return null;

  return (
    <style>
      {`
        #${fieldId}::placeholder {
          ${cssRules}
        }
        #${fieldId}::-webkit-input-placeholder {
          ${cssRules}
        }
        #${fieldId}::-moz-placeholder {
          ${cssRules}
        }
        #${fieldId}::-ms-input-placeholder {
          ${cssRules}
        }
      `}
    </style>
  );
};
