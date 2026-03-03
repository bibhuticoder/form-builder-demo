import { Field } from "../../types";
import { fieldRegistry } from "../../utils/fieldRegistry";

interface FieldRendererProps {
  field: Field;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function FieldRenderer({ field, isSelected, activeSubElement }: Readonly<FieldRendererProps>) {
  const FieldComponent = fieldRegistry[field.type];

  if (!FieldComponent) {
    return null; // If no supported field type
  }

  return <FieldComponent field={field} isSelected={isSelected} activeSubElement={activeSubElement} />;
}
