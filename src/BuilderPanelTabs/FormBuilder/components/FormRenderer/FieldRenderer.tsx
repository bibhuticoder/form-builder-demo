import { Field } from "../../../../types";
import { fieldRegistry } from "../../utils/fieldRegistry";

interface FieldRendererProps {
  field: Field;
}

export default function FieldRenderer({ field }: Readonly<FieldRendererProps>) {
  const FieldComponent = fieldRegistry[field.type];

  if (!FieldComponent) {
    return null; // If no supported field type
  }

  return <FieldComponent field={field} />;
}
