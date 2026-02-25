/**
 * Email Builder Styling Types
 * Simplified for email (2 breakpoints: mobile/desktop)
 */

import { EMAIL_BREAKPOINT_IDS } from '../constants';

export type EmailBreakpointId = typeof EMAIL_BREAKPOINT_IDS[number];

export type EmailStyleSettings = {
  fontFamily: string;
  backgroundColor?: string;
  contentBackgroundColor?: string;
  contentWidth?: number;
  color?: string;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  borderStyle?: string;
  borderRadius?: string | number;
  borderWidth?: string | number;
  borderColor?: string;
}

export type BlockStyleObject = {
  // Layout
  width?: 'full' | 'auto';
  alignment?: 'left' | 'center' | 'right';

  // Spacing
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;

  // Typography
  fontSize?: string | number;
  fontSizeUnit?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string | number;

  // Decoration
  backgroundColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderWidth?: string | number;
  borderColor?: string;
  borderRadius?: string | number;

  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'none';
  opacity?: number;
}

export type ResponsiveBlockStyle = {
  [K in EmailBreakpointId]?: BlockStyleObject | EmailBreakpointId;
};

export type BlockStyle = ResponsiveBlockStyle;
