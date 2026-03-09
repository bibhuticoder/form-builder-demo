import {
    getActiveBreakpoint,
    resolveBreakpointStyle,
    getBlockContainerStyles,
    getBlockContentStyles,
    getTemplateSettingsStyles,
} from '../styleUtils';
import { BlockStyleObject, ResponsiveBlockStyle } from '../../types/styles';

const desktop = (style: BlockStyleObject): ResponsiveBlockStyle => ({ desktop: style });

describe('styleUtils', () => {
    describe('getActiveBreakpoint', () => {
        it('returns mobile for widths <= 375', () => {
            expect(getActiveBreakpoint(375)).toBe('mobile');
            expect(getActiveBreakpoint(320)).toBe('mobile');
        });

        it('returns desktop for widths > 375', () => {
            expect(getActiveBreakpoint(376)).toBe('desktop');
            expect(getActiveBreakpoint(600)).toBe('desktop');
            expect(getActiveBreakpoint(1000)).toBe('desktop');
        });
    });

    describe('resolveBreakpointStyle', () => {
        it('returns empty object for undefined input', () => {
            expect(resolveBreakpointStyle(undefined, 'desktop')).toEqual({});
        });

        it('returns empty object for missing breakpoint', () => {
            expect(resolveBreakpointStyle({}, 'desktop')).toEqual({});
        });

        it('returns style object directly', () => {
            const style: ResponsiveBlockStyle = {
                desktop: { fontSize: 16, color: '#333' },
            };
            expect(resolveBreakpointStyle(style, 'desktop')).toEqual({ fontSize: 16, color: '#333' });
        });

        it('resolves string reference to another breakpoint', () => {
            const style: ResponsiveBlockStyle = {
                desktop: { fontSize: 16 },
                mobile: 'desktop',
            };
            expect(resolveBreakpointStyle(style, 'mobile')).toEqual({ fontSize: 16 });
        });

        it('returns empty object for circular reference', () => {
            const style: ResponsiveBlockStyle = {
                desktop: 'mobile',
                mobile: 'desktop',
            };
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            expect(resolveBreakpointStyle(style, 'desktop')).toEqual({});
            consoleSpy.mockRestore();
        });

        it('returns empty object for self-reference', () => {
            const style: ResponsiveBlockStyle = {
                desktop: 'desktop',
            };
            expect(resolveBreakpointStyle(style, 'desktop')).toEqual({});
        });
    });

    describe('getBlockContainerStyles', () => {
        it('returns empty-ish object for empty input', () => {
            expect(getBlockContainerStyles({})).toEqual(expect.objectContaining({}));
        });

        it('formats padding with px', () => {
            const style = desktop({
                paddingTop: 10,
                paddingLeft: '2em',
            });
            const result = getBlockContainerStyles(style);
            expect(result.paddingTop).toBe('10px');
            expect(result.paddingLeft).toBe('2em');
        });

        it('formats margin with px', () => {
            const style = desktop({
                marginTop: 20,
                marginBottom: 0,
            });
            const result = getBlockContainerStyles(style);
            expect(result.marginTop).toBe('20px');
            expect(result.marginBottom).toBe('0px');
        });

        it('applies background color', () => {
            const style = desktop({ backgroundColor: '#ff0000' });
            const result = getBlockContainerStyles(style);
            expect(result.backgroundColor).toBe('#ff0000');
        });

        it('applies border styles', () => {
            const style = desktop({
                borderWidth: 2,
                borderColor: 'red',
                borderStyle: 'solid',
                borderRadius: 8,
            });
            const result = getBlockContainerStyles(style);
            expect(result.borderWidth).toBe('2px');
            expect(result.borderColor).toBe('red');
            expect(result.borderStyle).toBe('solid');
            expect(result.borderRadius).toBe('8px');
        });

        it('applies text alignment', () => {
            const style = desktop({ textAlign: 'center' });
            const result = getBlockContainerStyles(style);
            expect(result.textAlign).toBe('center');
        });
    });

    describe('getBlockContentStyles', () => {
        it('handles typography styles', () => {
            const style = desktop({
                fontSize: 16,
                fontSizeUnit: 'rem',
                fontWeight: 'bold',
                fontStyle: 'italic',
                textDecoration: 'underline',
                textAlign: 'center',
                color: '#111',
            });
            const result = getBlockContentStyles(style);
            expect(result.fontSize).toBe('16rem');
            expect(result.fontWeight).toBe(700);
            expect(result.fontStyle).toBe('italic');
            expect(result.textDecoration).toBe('underline');
            expect(result.textAlign).toBe('center');
            expect(result.color).toBe('#111');
        });

        it('defaults font size unit to px', () => {
            const result = getBlockContentStyles(desktop({ fontSize: 14 }));
            expect(result.fontSize).toBe('14px');
        });

        it('ignores default font family', () => {
            const result = getBlockContentStyles(desktop({ fontFamily: 'default' }));
            expect(result.fontFamily).toBeUndefined();
        });

        it('maps known font families', () => {
            const result = getBlockContentStyles(desktop({ fontFamily: 'arial' }));
            expect(result.fontFamily).toBe('Arial, sans-serif');
        });

        it('maps font weight keywords to numbers', () => {
            expect(getBlockContentStyles(desktop({ fontWeight: 'light' })).fontWeight).toBe(300);
            expect(getBlockContentStyles(desktop({ fontWeight: 'normal' })).fontWeight).toBe(400);
            expect(getBlockContentStyles(desktop({ fontWeight: 'medium' })).fontWeight).toBe(500);
            expect(getBlockContentStyles(desktop({ fontWeight: 'semibold' })).fontWeight).toBe(600);
            expect(getBlockContentStyles(desktop({ fontWeight: 'bold' })).fontWeight).toBe(700);
        });

        it('handles line height', () => {
            const result = getBlockContentStyles(desktop({ lineHeight: 1.5 }));
            expect(result.lineHeight).toBe('1.5');
        });
    });

    describe('getTemplateSettingsStyles', () => {
        it('returns max width from content width setting', () => {
            const result = getTemplateSettingsStyles({ contentWidth: 600 });
            expect(result.maxWidth).toBe('600px');
        });

        it('defaults max width to 600px when not set', () => {
            const result = getTemplateSettingsStyles({});
            expect(result.maxWidth).toBe('600px');
        });

        it('applies font family', () => {
            const result = getTemplateSettingsStyles({ fontFamily: 'Georgia, serif' });
            expect(result.fontFamily).toBe('Georgia, serif');
        });

        it('applies background and padding', () => {
            const result = getTemplateSettingsStyles({
                contentBackgroundColor: '#fff',
                paddingTop: 20,
                paddingRight: 20,
                paddingBottom: 20,
                paddingLeft: 20,
            });
            expect(result.backgroundColor).toBe('#fff');
            expect(result.paddingTop).toBe('20px');
            expect(result.paddingRight).toBe('20px');
        });

        it('applies border settings', () => {
            const result = getTemplateSettingsStyles({
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
            });
            expect(result.borderStyle).toBe('solid');
            expect(result.borderWidth).toBe('1px');
            expect(result.borderColor).toBe('#ccc');
            expect(result.borderRadius).toBe('4px');
        });
    });
});
