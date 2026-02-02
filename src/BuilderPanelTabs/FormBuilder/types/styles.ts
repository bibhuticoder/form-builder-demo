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
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  color?: string;

  // Padding
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;

  // Margin
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;

  fontSize?: string | number;
  fontWeight?: string | number;

  // Border
  borderStyle?: string;
  borderRadius?: string | number;
  borderWidth?: string | number;
  borderColor?: string;

  // Help Text
  helpFontSize?: string | number;
  helpFontSizeUnit?: string;
  helpColor?: string;

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
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Typography (Label)
  labelFontSize?: string | number;
  labelFontSizeUnit?: string;
  labelFontWeight?: string | number;
  labelFontFamily?: string;
  labelColor?: string;
  labelTextAlign?: 'left' | 'center' | 'right' | 'justify';
  labelMarginBottom?: string | number;

  // Typography (Help)
  helpFontSize?: string | number;
  helpFontSizeUnit?: string;
  helpFontWeight?: string | number;
  helpFontFamily?: string;
  helpColor?: string;
  helpTextAlign?: 'left' | 'center' | 'right' | 'justify';

  // Typography (Placeholder)
  placeholderFontSize?: string | number;
  placeholderFontSizeUnit?: string;
  placeholderFontWeight?: string | number;
  placeholderFontFamily?: string;
  placeholderColor?: string;
  placeholderTextAlign?: 'left' | 'center' | 'right' | 'justify';

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
