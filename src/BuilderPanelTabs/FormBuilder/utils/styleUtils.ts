import { CSSProperties } from "react";
import { BreakpointId, FieldStyleObject, ResponsiveFieldStyle } from "../types/styles";
import { SCREEN_SIZES, MAX_CANVAS_WIDTH, BREAKPOINT_IDS } from "../constants";

/**
 * Determines the active breakpoint based on the current canvas width
 */
export const getActiveBreakpoint = (canvasWidth: number): BreakpointId => {
    if (canvasWidth < SCREEN_SIZES[1].width) return BREAKPOINT_IDS[0];
    if (canvasWidth < SCREEN_SIZES[2].width) return BREAKPOINT_IDS[1];
    if (canvasWidth < SCREEN_SIZES[3].width) return BREAKPOINT_IDS[2];
    if (canvasWidth < SCREEN_SIZES[4].width) return BREAKPOINT_IDS[3];
    if (canvasWidth < MAX_CANVAS_WIDTH) return BREAKPOINT_IDS[4];
    return BREAKPOINT_IDS[5];
};


/**
 * Resolves a responsive style to the actual style object for a given breakpoint
 * Handles references (e.g., "xs" -> "md") recursively
 */
export const resolveBreakpointStyle = (
    responsiveStyle: ResponsiveFieldStyle | undefined,
    breakpoint: BreakpointId,
    visited: Set<BreakpointId> = new Set()
): FieldStyleObject => {
    if (!responsiveStyle) return {};

    // Cycle detection
    if (visited.has(breakpoint)) {
        console.warn(`Circular style reference detected for breakpoint: ${breakpoint}`);
        return {};
    }
    visited.add(breakpoint);

    const styleOrRef = responsiveStyle[breakpoint];

    if (!styleOrRef) {
        return {};
    }

    if (typeof styleOrRef === 'string') {
        const refBreakpoint = styleOrRef as BreakpointId;
        // Prevent immediate self-ref (already caught by visited, but keep for clarity)
        if (refBreakpoint === breakpoint) return {};

        return resolveBreakpointStyle(responsiveStyle, refBreakpoint, visited);
    }

    return styleOrRef;
};

// Helper to add 'px' if the value is a number or a numeric string, 
// unless it already has a unit.
const formatUnit = (value: string | number | undefined, defaultUnit = "px"): string | undefined => {
    if (value === undefined || value === null || value === "") return undefined;

    const strValue = String(value);

    // If it's just a number, append 'px'
    if (!isNaN(Number(strValue))) {
        return `${strValue}${defaultUnit}`;
    }

    // If it's a string, return as is (assuming it has a unit or is a keyword like 'auto')
    return strValue;
};

export const getContainerStyles = (style: ResponsiveFieldStyle | undefined, breakpoint: BreakpointId = 'md'): CSSProperties => {
    const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

    return {
        // Spacing - Window
        marginTop: formatUnit(resolvedStyle.windowMarginTop),
        marginRight: formatUnit(resolvedStyle.windowMarginRight),
        marginBottom: formatUnit(resolvedStyle.windowMarginBottom),
        marginLeft: formatUnit(resolvedStyle.windowMarginLeft),

        paddingTop: formatUnit(resolvedStyle.windowPaddingTop),
        paddingRight: formatUnit(resolvedStyle.windowPaddingRight),
        paddingBottom: formatUnit(resolvedStyle.windowPaddingBottom),
        paddingLeft: formatUnit(resolvedStyle.windowPaddingLeft),

        // Decoration - Window
        backgroundColor: resolvedStyle.windowBackgroundColor,

        // Border - Window
        borderStyle: resolvedStyle.windowBorderStyle,
        borderWidth: formatUnit(resolvedStyle.windowBorderWidth),
        borderColor: resolvedStyle.windowBorderColor,

        // Border Radius - Window
        borderTopLeftRadius: formatUnit(resolvedStyle.windowBorderTopLeftRadius),
        borderTopRightRadius: formatUnit(resolvedStyle.windowBorderTopRightRadius),
        borderBottomRightRadius: formatUnit(resolvedStyle.windowBorderBottomRightRadius),
        borderBottomLeftRadius: formatUnit(resolvedStyle.windowBorderBottomLeftRadius),
    };
};

// Helper to map internal font keys to CSS font-family values
const getFontFamily = (key: string | undefined): string | undefined => {
    if (!key || key === "default") return undefined;

    switch (key) {
        case "inter": return "'Inter', sans-serif";
        case "roboto": return "'Roboto', sans-serif";
        case "playfair": return "'Playfair Display', serif";
        case "lora": return "'Lora', serif";
        case "mono": return "'JetBrains Mono', monospace";
        // Fallback for legacy or direct values
        default: return key;
    }
};

// Helper to map weight keywords to numeric values
const getFontWeight = (weight: string | number | undefined): number | string | undefined => {
    if (!weight) return undefined;
    if (weight === "default") return undefined;

    // If it's already a number, return it
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

export const getInputStyles = (style: ResponsiveFieldStyle | undefined, breakpoint: BreakpointId = 'md'): CSSProperties => {
    const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

    const css: CSSProperties = {
        // Spacing - Input
        marginTop: formatUnit(resolvedStyle.inputMarginTop),
        marginRight: formatUnit(resolvedStyle.inputMarginRight),
        marginBottom: formatUnit(resolvedStyle.inputMarginBottom),
        marginLeft: formatUnit(resolvedStyle.inputMarginLeft),

        paddingTop: formatUnit(resolvedStyle.inputPaddingTop),
        paddingRight: formatUnit(resolvedStyle.inputPaddingRight),
        paddingBottom: formatUnit(resolvedStyle.inputPaddingBottom),
        paddingLeft: formatUnit(resolvedStyle.inputPaddingLeft),

        // Typography - Input
        fontFamily: getFontFamily(resolvedStyle.inputFontFamily),
        fontSize: resolvedStyle.inputFontSize ? `${resolvedStyle.inputFontSize}${resolvedStyle.inputFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(resolvedStyle.inputFontWeight),
        textAlign: resolvedStyle.inputTextAlign || resolvedStyle.textAlign, // Fallback to legacy textAlign
        color: resolvedStyle.inputColor,

        // Decoration - Input
        backgroundColor: resolvedStyle.inputBackgroundColor,

        // Border - Input
        borderStyle: resolvedStyle.inputBorderStyle,
        borderWidth: formatUnit(resolvedStyle.inputBorderWidth),
        borderColor: resolvedStyle.inputBorderColor,

        // Border Radius - Input
        borderTopLeftRadius: formatUnit(resolvedStyle.inputBorderTopLeftRadius),
        borderTopRightRadius: formatUnit(resolvedStyle.inputBorderTopRightRadius),
        borderBottomRightRadius: formatUnit(resolvedStyle.inputBorderBottomRightRadius),
        borderBottomLeftRadius: formatUnit(resolvedStyle.inputBorderBottomLeftRadius),

        // Calculated width & height
        width: `calc(100% - ${formatUnit(resolvedStyle.inputMarginRight)} - ${formatUnit(resolvedStyle.inputMarginLeft)})`
    };

    return css;
};

export const getLabelStyles = (style: ResponsiveFieldStyle | undefined, breakpoint: BreakpointId = 'md'): CSSProperties => {
    const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

    return {
        // Typography - Label
        fontFamily: getFontFamily(resolvedStyle.labelFontFamily),
        fontSize: resolvedStyle.labelFontSize ? `${resolvedStyle.labelFontSize}${resolvedStyle.labelFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(resolvedStyle.labelFontWeight),
        textAlign: resolvedStyle.labelTextAlign,
        color: resolvedStyle.labelColor,
        // Margin bottom for label
        marginBottom: formatUnit(resolvedStyle.labelMarginBottom)
    };
};

import { DEFAULT_CONFIG } from "../constants";

export const getHelpTextStyles = (style: ResponsiveFieldStyle | undefined, globalSettings?: Record<string, any>, breakpoint: BreakpointId = 'md'): CSSProperties => {
    const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

    // Default to global settings if provided, otherwise fallback to constants
    const defaultFontSize = globalSettings?.helpFontSize !== undefined ? globalSettings.helpFontSize : DEFAULT_CONFIG.helpFontSize;
    const defaultFontSizeUnit = globalSettings?.helpFontSizeUnit || DEFAULT_CONFIG.helpFontSizeUnit;
    const defaultColor = globalSettings?.helpColor || DEFAULT_CONFIG.helpColor;

    return {
        // Typography - Help Text
        fontFamily: getFontFamily(resolvedStyle.helpFontFamily),
        fontSize: resolvedStyle.helpFontSize
            ? `${resolvedStyle.helpFontSize}${resolvedStyle.helpFontSizeUnit || 'px'}`
            : `${defaultFontSize}${defaultFontSizeUnit}`,
        fontWeight: getFontWeight(resolvedStyle.helpFontWeight),
        textAlign: resolvedStyle.helpTextAlign,
        color: resolvedStyle.helpColor || defaultColor,
    };
};

export const getPlaceholderStyles = (style: ResponsiveFieldStyle | undefined, breakpoint: BreakpointId = 'md'): CSSProperties => {
    const resolvedStyle = resolveBreakpointStyle(style, breakpoint);

    return {
        // Typography - Placeholder
        fontFamily: getFontFamily(resolvedStyle.placeholderFontFamily),
        fontSize: resolvedStyle.placeholderFontSize ? `${resolvedStyle.placeholderFontSize}${resolvedStyle.placeholderFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(resolvedStyle.placeholderFontWeight),
        textAlign: resolvedStyle.placeholderTextAlign,
        color: resolvedStyle.placeholderColor,
    };
};

export const getFormSettingsStyles = (settings: Record<string, any> = {}): CSSProperties => {
    const style: CSSProperties = {
        width: `calc(100% - ${settings.marginLeft || '0'}px - ${settings.marginRight || '0'}px)`,
        height: `calc(100% - ${settings.marginTop || '0'}px - ${settings.marginBottom || '0'}px)`,
        maxWidth: settings.maxWidth ? `${settings.maxWidth}px` : undefined,
        maxHeight: settings.maxHeight === 'auto' ? 'auto' : `${settings.maxHeight}px`,
        fontFamily: settings.fontFamilyBody,
        backgroundColor: settings.backgroundColor,
        borderColor: settings.borderColor,
        borderStyle: settings.borderStyle,
        borderWidth: formatUnit(settings.borderWidth),
        borderRadius: formatUnit(settings.borderRadius),
        paddingTop: formatUnit(settings.paddingTop),
        paddingRight: formatUnit(settings.paddingRight),
        paddingBottom: formatUnit(settings.paddingBottom),
        paddingLeft: formatUnit(settings.paddingLeft),
        marginTop: formatUnit(settings.marginTop),
        marginRight: formatUnit(settings.marginRight),
        marginBottom: formatUnit(settings.marginBottom),
        marginLeft: formatUnit(settings.marginLeft),
    };

    // Add background image properties if present
    if (settings.backgroundImage) {
        style.backgroundImage = `url(${settings.backgroundImage})`;
        style.backgroundRepeat = settings.backgroundRepeat;
        style.backgroundSize = settings.backgroundSize;
        style.backgroundPosition = settings.backgroundPosition;
        style.backgroundAttachment = settings.backgroundAttachment;
    }

    return style;
};

// Returns a class name for the font family if appropriate, or assumes it's handled by style
// The current implementation uses inline styles for fonts.
