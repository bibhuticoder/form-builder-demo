import { CSSProperties } from "react";
import { EmailBreakpointId, BlockStyleObject, ResponsiveBlockStyle } from "../types/styles";
import { EMAIL_SCREEN_SIZES, EMAIL_BREAKPOINT_IDS } from "../constants";

/**
 * Determines the active breakpoint based on the current canvas width
 */
export const getActiveBreakpoint = (canvasWidth: number): EmailBreakpointId => {
  if (canvasWidth <= EMAIL_SCREEN_SIZES[0].width) return EMAIL_BREAKPOINT_IDS[0]; // mobile
  return EMAIL_BREAKPOINT_IDS[1]; // desktop
};

/**
 * Resolves a responsive style to the actual style object for a given breakpoint
 */
export const resolveBreakpointStyle = (
  responsiveStyle: ResponsiveBlockStyle | undefined,
  breakpoint: EmailBreakpointId,
  visited: Set<EmailBreakpointId> = new Set()
): BlockStyleObject => {
  if (!responsiveStyle) return {};

  if (visited.has(breakpoint)) {
    console.warn(`Circular style reference detected for breakpoint: ${breakpoint}`);
    return {};
  }
  visited.add(breakpoint);

  const styleOrRef = responsiveStyle[breakpoint];

  if (!styleOrRef) return {};

  if (typeof styleOrRef === 'string') {
    const refBreakpoint = styleOrRef as EmailBreakpointId;
    if (refBreakpoint === breakpoint) return {};
    return resolveBreakpointStyle(responsiveStyle, refBreakpoint, visited);
  }

  return styleOrRef;
};

const formatUnit = (value: string | number | undefined, defaultUnit = "px"): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const strValue = String(value);
  if (!isNaN(Number(strValue))) return `${strValue}${defaultUnit}`;
  return strValue;
};

const getFontFamily = (key: string | undefined): string | undefined => {
  if (!key || key === "default") return undefined;
  switch (key) {
    case "arial": return "Arial, sans-serif";
    case "helvetica": return "Helvetica, Arial, sans-serif";
    case "georgia": return "Georgia, serif";
    case "times": return "'Times New Roman', Times, serif";
    case "courier": return "'Courier New', Courier, monospace";
    case "verdana": return "Verdana, Geneva, sans-serif";
    default: return key;
  }
};

const getFontWeight = (weight: string | number | undefined): number | string | undefined => {
  if (!weight) return undefined;
  if (weight === "default") return undefined;
  if (!isNaN(Number(weight))) return weight;
  switch (weight) {
    case "light": return 300;
    case "normal": return 400;
    case "medium": return 500;
    case "semibold": return 600;
    case "bold": return 700;
    default: return weight;
  }
};

export const getBlockContainerStyles = (style: ResponsiveBlockStyle | undefined, breakpoint: EmailBreakpointId = 'desktop'): CSSProperties => {
  const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

  return {
    paddingTop: formatUnit(resolvedStyle.paddingTop),
    paddingRight: formatUnit(resolvedStyle.paddingRight),
    paddingBottom: formatUnit(resolvedStyle.paddingBottom),
    paddingLeft: formatUnit(resolvedStyle.paddingLeft),
    marginTop: formatUnit(resolvedStyle.marginTop),
    marginBottom: formatUnit(resolvedStyle.marginBottom),
    backgroundColor: resolvedStyle.backgroundColor,
    borderStyle: resolvedStyle.borderStyle,
    borderWidth: formatUnit(resolvedStyle.borderWidth),
    borderColor: resolvedStyle.borderColor,
    borderRadius: formatUnit(resolvedStyle.borderRadius),
    borderTopLeftRadius: formatUnit(resolvedStyle.borderTopLeftRadius),
    borderTopRightRadius: formatUnit(resolvedStyle.borderTopRightRadius),
    borderBottomRightRadius: formatUnit(resolvedStyle.borderBottomRightRadius),
    borderBottomLeftRadius: formatUnit(resolvedStyle.borderBottomLeftRadius),
    textAlign: resolvedStyle.textAlign,
  };
};

export const getBlockContentStyles = (style: ResponsiveBlockStyle | undefined, breakpoint: EmailBreakpointId = 'desktop'): CSSProperties => {
  const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

  return {
    fontFamily: getFontFamily(resolvedStyle.fontFamily),
    fontSize: resolvedStyle.fontSize ? `${resolvedStyle.fontSize}${resolvedStyle.fontSizeUnit || 'px'}` : undefined,
    fontWeight: getFontWeight(resolvedStyle.fontWeight),
    fontStyle: resolvedStyle.fontStyle,
    textDecoration: resolvedStyle.textDecoration,
    textAlign: resolvedStyle.textAlign,
    color: resolvedStyle.color,
    lineHeight: resolvedStyle.lineHeight ? String(resolvedStyle.lineHeight) : undefined,
  };
};

export const getTemplateSettingsStyles = (settings: Record<string, unknown> = {}): CSSProperties => {
  return {
    maxWidth: settings.contentWidth ? `${settings.contentWidth}px` : '600px',
    fontFamily: settings.fontFamily as string | undefined,
    backgroundColor: settings.contentBackgroundColor as string | undefined,
    color: settings.color as string | undefined,
    paddingTop: formatUnit(settings.paddingTop as string | number | undefined),
    paddingRight: formatUnit(settings.paddingRight as string | number | undefined),
    paddingBottom: formatUnit(settings.paddingBottom as string | number | undefined),
    paddingLeft: formatUnit(settings.paddingLeft as string | number | undefined),
    borderColor: settings.borderColor as string | undefined,
    borderStyle: settings.borderStyle as string | undefined,
    borderWidth: formatUnit(settings.borderWidth as string | number | undefined),
    borderRadius: formatUnit(settings.borderRadius as string | number | undefined),
  };
};
