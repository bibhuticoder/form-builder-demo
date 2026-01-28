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
        fontFamily: style.inputFontFamily !== "default" ? style.inputFontFamily : undefined,
        fontSize: style.inputFontSize ? `${style.inputFontSize}${style.inputFontSizeUnit || 'px'}` : undefined,
        fontWeight: style.inputFontWeight,
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
    };

    return css;
};

export const getLabelStyles = (style: Record<string, any> = {}): CSSProperties => {
    return {
        // Typography - Label
        fontFamily: style.labelFontFamily !== "default" ? style.labelFontFamily : undefined,
        fontSize: style.labelFontSize ? `${style.labelFontSize}${style.labelFontSizeUnit || 'px'}` : undefined,
        fontWeight: style.labelFontWeight,
        color: style.labelColor,
    };
};

export const getHelpTextStyles = (style: Record<string, any> = {}): CSSProperties => {
    return {
        // Typography - Help Text
        fontFamily: style.helpFontFamily !== "default" ? style.helpFontFamily : undefined,
        fontSize: style.helpFontSize ? `${style.helpFontSize}${style.helpFontSizeUnit || 'px'}` : undefined,
        fontWeight: style.helpFontWeight,
        color: style.helpColor,
    };
};

// Returns a class name for the font family if appropriate, or assumes it's handled by style
// The current implementation uses inline styles for fonts.
