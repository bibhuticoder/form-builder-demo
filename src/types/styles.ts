/**
 * Styling Types
 * Global and field-level styling configurations
 */
import React from "react";

export type StyleSettings = React.CSSProperties & {
  fontFamilyBody: string;
  fontFamilyTitle: string;
  width: number
}

export type FieldStyle = React.CSSProperties & {

  /**
   * Allow additional style properties (e.g., custom CSS variables, vendor-prefixed
   * properties, or other framework-specific style keys) that are not explicitly
   * modeled above.
   */
  [key: string]: string | number | undefined;
}
