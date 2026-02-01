import { getContainerStyles, getInputStyles, getLabelStyles, getHelpTextStyles, getPlaceholderStyles } from '../styleUtils';

describe('styleUtils', () => {
    describe('getContainerStyles', () => {
        it('returns empty object for empty input', () => {
            expect(getContainerStyles({})).toEqual(expect.objectContaining({}));
        });

        it('formats margin and padding with px', () => {
            const style = {
                windowMarginTop: 10,
                windowPaddingLeft: '2em'
            };
            const result = getContainerStyles(style);
            expect(result.marginTop).toBe('10px');
            expect(result.paddingLeft).toBe('2em');
        });

        it('applies border styles', () => {
            const style = {
                windowBorderWidth: 2,
                windowBorderColor: 'red',
                windowBorderStyle: 'solid'
            };
            const result = getContainerStyles(style);
            expect(result.borderWidth).toBe('2px');
            expect(result.borderColor).toBe('red');
            expect(result.borderStyle).toBe('solid');
        });
    });

    describe('getInputStyles', () => {
        it('handles typography styles', () => {
            const style = {
                inputFontFamily: 'Roboto',
                inputFontSize: 16,
                inputFontSizeUnit: 'rem',
                inputFontWeight: 'bold',
                textAlign: 'center'
            };
            const result = getInputStyles(style);
            expect(result.fontFamily).toBe('Roboto');
            expect(result.fontSize).toBe('16rem');
            expect(result.fontWeight).toBe('bold');
            expect(result.textAlign).toBe('center');
        });

        it('ignores default font family', () => {
            const result = getInputStyles({ inputFontFamily: 'default' });
            expect(result.fontFamily).toBeUndefined();
        });

        it('defaults font size unit to px if missing', () => {
            const result = getInputStyles({ inputFontSize: 14 });
            expect(result.fontSize).toBe('14px');
        });
    });

    describe('getLabelStyles', () => {
        it('returns correct label styles', () => {
            const style = {
                labelColor: 'blue',
                labelFontSize: 12
            };
            const result = getLabelStyles(style);
            expect(result.color).toBe('blue');
            expect(result.fontSize).toBe('12px');
        });
    });

    describe('getHelpTextStyles', () => {
        it('uses global defaults when style is missing', () => {
            const globalSettings = {
                helpFontSize: 10,
                helpFontSizeUnit: 'pt',
                helpColor: 'gray'
            };
            const result = getHelpTextStyles({}, globalSettings);
            expect(result.fontSize).toBe('10pt');
            expect(result.color).toBe('gray');
        });

        it('overrides global defaults with specific style', () => {
            const style = {
                helpFontSize: 14,
                helpColor: 'black'
            };
            const globalSettings = {
                helpFontSize: 10,
                helpColor: 'gray'
            };
            const result = getHelpTextStyles(style, globalSettings);
            expect(result.fontSize).toBe('14px');
            expect(result.color).toBe('black');
        });
    });

    describe('getPlaceholderStyles', () => {
        it('returns placeholder styles', () => {
            const style = {
                placeholderColor: '#ccc',
                placeholderFontWeight: 'light'
            };
            const result = getPlaceholderStyles(style);
            expect(result.color).toBe('#ccc');
            expect(result.fontWeight).toBe('light');
        });
    });
});
