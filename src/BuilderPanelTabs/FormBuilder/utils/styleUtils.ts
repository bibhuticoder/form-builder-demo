import { CSSProperties } from "react";

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

export const getContainerStyles = (style: Record<string, any> = {}): CSSProperties => {
    return {
        // Spacing - Window
        marginTop: formatUnit(style.windowMarginTop),
        marginRight: formatUnit(style.windowMarginRight),
        marginBottom: formatUnit(style.windowMarginBottom),
        marginLeft: formatUnit(style.windowMarginLeft),

        paddingTop: formatUnit(style.windowPaddingTop),
        paddingRight: formatUnit(style.windowPaddingRight),
        paddingBottom: formatUnit(style.windowPaddingBottom),
        paddingLeft: formatUnit(style.windowPaddingLeft),

        // Decoration - Window
        backgroundColor: style.windowBackgroundColor,

        // Border - Window
        borderStyle: style.windowBorderStyle,
        borderWidth: formatUnit(style.windowBorderWidth),
        borderColor: style.windowBorderColor,

        // Border Radius - Window
        borderTopLeftRadius: formatUnit(style.windowBorderTopLeftRadius),
        borderTopRightRadius: formatUnit(style.windowBorderTopRightRadius),
        borderBottomRightRadius: formatUnit(style.windowBorderBottomRightRadius),
        borderBottomLeftRadius: formatUnit(style.windowBorderBottomLeftRadius),
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

export const getInputStyles = (style: Record<string, any> = {}): CSSProperties => {
    const css: CSSProperties = {
        // Spacing - Input
        marginTop: formatUnit(style.inputMarginTop),
        marginRight: formatUnit(style.inputMarginRight),
        marginBottom: formatUnit(style.inputMarginBottom),
        marginLeft: formatUnit(style.inputMarginLeft),

        paddingTop: formatUnit(style.inputPaddingTop),
        paddingRight: formatUnit(style.inputPaddingRight),
        paddingBottom: formatUnit(style.inputPaddingBottom),
        paddingLeft: formatUnit(style.inputPaddingLeft),

        // Typography - Input
        fontFamily: getFontFamily(style.inputFontFamily),
        fontSize: style.inputFontSize ? `${style.inputFontSize}${style.inputFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(style.inputFontWeight),
        textAlign: style.textAlign,
        color: style.inputColor,

        // Decoration - Input
        backgroundColor: style.inputBackgroundColor,

        // Border - Input
        borderStyle: style.inputBorderStyle,
        borderWidth: formatUnit(style.inputBorderWidth),
        borderColor: style.inputBorderColor,

        // Border Radius - Input
        borderTopLeftRadius: formatUnit(style.inputBorderTopLeftRadius),
        borderTopRightRadius: formatUnit(style.inputBorderTopRightRadius),
        borderBottomRightRadius: formatUnit(style.inputBorderBottomRightRadius),
        borderBottomLeftRadius: formatUnit(style.inputBorderBottomLeftRadius),

        // Calculated width & height
        width: `calc(100% - ${formatUnit(style.inputMarginRight)} - ${formatUnit(style.inputMarginLeft)})`
    };

    return css;
};

export const getLabelStyles = (style: Record<string, any> = {}): CSSProperties => {
    return {
        // Typography - Label
        fontFamily: getFontFamily(style.labelFontFamily),
        fontSize: style.labelFontSize ? `${style.labelFontSize}${style.labelFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(style.labelFontWeight),
        textAlign: style.labelTextAlign,
        color: style.labelColor,
    };
};

import { DEFAULT_CONFIG } from "../constants";

export const getHelpTextStyles = (style: Record<string, any> = {}, globalSettings?: Record<string, any>): CSSProperties => {
    // Default to global settings if provided, otherwise fallback to constants
    const defaultFontSize = globalSettings?.helpFontSize !== undefined ? globalSettings.helpFontSize : DEFAULT_CONFIG.helpFontSize;
    const defaultFontSizeUnit = globalSettings?.helpFontSizeUnit || DEFAULT_CONFIG.helpFontSizeUnit;
    const defaultColor = globalSettings?.helpColor || DEFAULT_CONFIG.helpColor;

    return {
        // Typography - Help Text
        fontFamily: getFontFamily(style.helpFontFamily),
        fontSize: style.helpFontSize
            ? `${style.helpFontSize}${style.helpFontSizeUnit || 'px'}`
            : `${defaultFontSize}${defaultFontSizeUnit}`,
        fontWeight: getFontWeight(style.helpFontWeight),
        textAlign: style.helpTextAlign,
        color: style.helpColor || defaultColor,
    };
};

export const getPlaceholderStyles = (style: Record<string, any> = {}): CSSProperties => {
    return {
        // Typography - Placeholder
        fontFamily: getFontFamily(style.placeholderFontFamily),
        fontSize: style.placeholderFontSize ? `${style.placeholderFontSize}${style.placeholderFontSizeUnit || 'px'}` : undefined,
        fontWeight: getFontWeight(style.placeholderFontWeight),
        textAlign: style.placeholderTextAlign,
        color: style.placeholderColor,
    };
};

// Returns a class name for the font family if appropriate, or assumes it's handled by style
// The current implementation uses inline styles for fonts.
