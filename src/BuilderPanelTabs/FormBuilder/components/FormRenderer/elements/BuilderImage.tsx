/**
 * BuilderImage
 * A React component that renders an image field within a form builder.
 * Displays an image with optional alt text and styling.
 */

import { ImageField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getLabelStyles, getHelpTextStyles, getInputStyles } from "../../../utils/styleUtils";

interface BuilderImageProps {
  field: ImageField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderImage({ field, isSelected, activeSubElement }: Readonly<BuilderImageProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="space-y-2">
        {field.label && (
          <label
            className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}
            style={getLabelStyles(field.style)}
          >
            {field.label}
          </label>
        )}
        <img
          src={field.url}
          alt={field.altText || field.label || "Image"}
          style={getInputStyles(field.style)}
          className={`w-full h-auto rounded-lg ${isSelected && ['input', 'url'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
        />
        {field.caption && (
          <p
            className={`text-[9px] text-gray-500 ${isSelected && (activeSubElement === 'caption' || activeSubElement === 'help') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getHelpTextStyles(field.style, jsonContent.formSettings.settings)}
          >
            {field.caption}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
