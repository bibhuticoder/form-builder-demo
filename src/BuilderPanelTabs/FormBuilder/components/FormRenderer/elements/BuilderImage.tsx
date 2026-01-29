/**
 * BuilderImage
 * A React component that renders an image field within a form builder.
 * Displays an image with optional alt text and styling.
 */

import { ImageField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderImageProps {
  field: ImageField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderImage({ field, isSelected, activeSubElement }: Readonly<BuilderImageProps>) {
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="space-y-2">
        {field.label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
          </label>
        )}
        <img
          src={field.url}
          alt={field.altText || field.label || "Image"}
          style={field.style}
          className="w-full h-auto rounded-lg"
        />
      </div>
    </BuilderFieldWrapper>
  );
}
