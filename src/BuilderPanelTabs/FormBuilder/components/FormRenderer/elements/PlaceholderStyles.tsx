import React from 'react';
import { getPlaceholderStyles } from "../../../utils/styleUtils";
import { useFormBuilder } from "../../../context";

interface PlaceholderStylesProps {
  fieldId: string;
  style?: Record<string, any>;
}

export const PlaceholderStyles: React.FC<PlaceholderStylesProps> = ({ fieldId, style }) => {
  const { activeBreakpoint } = useFormBuilder();

  if (!style) return null;

  const styles = getPlaceholderStyles(style, activeBreakpoint);

  // Convert React style object to CSS string
  const cssRules = Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      // Convert camelCase to kebab-case (e.g. fontSize -> font-size)
      // handling special cases if any? No, standard convert
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      // Add !important to ensure override (though inline styles on element might need handling differently)
      // Placeholder styles are pseudo-elements so cannot be inline.
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
