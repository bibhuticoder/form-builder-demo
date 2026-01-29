/**
 * Styling Types
 * Global and field-level styling configurations
 */


export type WidthValue = 'full' | 'three-quarters' | 'half' | 'third' | 'quarter';

export type StyleSettings = {
  fontFamilyBody: string;
  fontFamilyTitle: string;
  width: number;
  // CSS Properties
  backgroundColor?: string;
  color?: string;
  padding?: string | number;
  margin?: string | number;
  fontSize?: string | number;
  fontWeight?: string | number;
  borderRadius?: string | number;
  borderWidth?: string | number;
  borderColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export type FieldStyle = {
  // Layout
  width?: WidthValue;

  // Spacing (Input)
  inputMargin?: string | number;
  inputMarginTop?: string | number;
  inputMarginRight?: string | number;
  inputMarginBottom?: string | number;
  inputMarginLeft?: string | number;
  inputPadding?: string | number;
  inputPaddingTop?: string | number;
  inputPaddingRight?: string | number;
  inputPaddingBottom?: string | number;
  inputPaddingLeft?: string | number;

  // Spacing (Window)
  windowMargin?: string | number;
  windowMarginTop?: string | number;
  windowMarginRight?: string | number;
  windowMarginBottom?: string | number;
  windowMarginLeft?: string | number;
  windowPadding?: string | number;
  windowPaddingTop?: string | number;
  windowPaddingRight?: string | number;
  windowPaddingBottom?: string | number;
  windowPaddingLeft?: string | number;

  // Typography (Input)
  inputFontSize?: string | number;
  inputFontSizeUnit?: string;
  inputFontWeight?: string | number;
  inputFontFamily?: string;
  inputColor?: string;
  inputTextAlign?: 'left' | 'center' | 'right' | 'justify';

  // Typography (Label)
  labelFontSize?: string | number;
  labelFontSizeUnit?: string;
  labelFontWeight?: string | number;
  labelFontFamily?: string;
  labelColor?: string;
  labelMarginBottom?: string | number;

  // Typography (Help)
  helpFontSize?: string | number;
  helpFontSizeUnit?: string;
  helpFontWeight?: string | number;
  helpFontFamily?: string;
  helpColor?: string;

  // Typography (Placeholder)
  placeholderFontSize?: string | number;
  placeholderFontSizeUnit?: string;
  placeholderFontWeight?: string | number;
  placeholderFontFamily?: string;
  placeholderColor?: string;

  // Decoration (Input)
  inputBackgroundColor?: string;
  inputBorder?: string;
  inputBorderWidth?: string | number;
  inputBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  inputBorderColor?: string;
  inputBorderRadius?: string | number;
  inputBorderTopLeftRadius?: string | number;
  inputBorderTopRightRadius?: string | number;
  inputBorderBottomRightRadius?: string | number;
  inputBorderBottomLeftRadius?: string | number;

  // Decoration (Window)
  windowBackgroundColor?: string;
  windowBorder?: string;
  windowBorderWidth?: string | number;
  windowBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  windowBorderColor?: string;
  windowBorderRadius?: string | number;
  windowBorderTopLeftRadius?: string | number;
  windowBorderTopRightRadius?: string | number;
  windowBorderBottomRightRadius?: string | number;
  windowBorderBottomLeftRadius?: string | number;

  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  opacity?: number;
}
