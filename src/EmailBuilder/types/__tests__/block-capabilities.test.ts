import { EmailBlockType } from '../enums';
import { BLOCK_CAPABILITIES, getBlockCapabilities } from '../block-capabilities';

describe('block-capabilities', () => {
    it('should have capabilities for every EmailBlockType', () => {
        const blockTypes = Object.values(EmailBlockType);
        blockTypes.forEach((type) => {
            expect(BLOCK_CAPABILITIES[type]).toBeDefined();
        });
    });

    it('getBlockCapabilities returns correct capabilities for heading', () => {
        const caps = getBlockCapabilities(EmailBlockType.HEADING);
        expect(caps.supportsText).toBe(true);
        expect(caps.supportsImage).toBe(false);
        expect(caps.supportsAlignment).toBe(true);
        expect(caps.supportsTypography).toBe(true);
    });

    it('getBlockCapabilities returns correct capabilities for image', () => {
        const caps = getBlockCapabilities(EmailBlockType.IMAGE);
        expect(caps.supportsText).toBe(false);
        expect(caps.supportsImage).toBe(true);
        expect(caps.supportsLink).toBe(true);
        expect(caps.supportsTypography).toBe(false);
    });

    it('getBlockCapabilities returns correct capabilities for button', () => {
        const caps = getBlockCapabilities(EmailBlockType.BUTTON);
        expect(caps.supportsText).toBe(true);
        expect(caps.supportsLink).toBe(true);
        expect(caps.supportsBackgroundColor).toBe(true);
        expect(caps.supportsBorder).toBe(true);
        expect(caps.supportsTypography).toBe(true);
    });

    it('spacer supports nothing except being a spacer', () => {
        const caps = getBlockCapabilities(EmailBlockType.SPACER);
        expect(caps.supportsText).toBe(false);
        expect(caps.supportsImage).toBe(false);
        expect(caps.supportsLink).toBe(false);
        expect(caps.supportsAlignment).toBe(false);
        expect(caps.supportsPadding).toBe(false);
        expect(caps.supportsBackgroundColor).toBe(false);
        expect(caps.supportsBorder).toBe(false);
        expect(caps.supportsTypography).toBe(false);
    });

    it('columns supports padding and background but not text or typography', () => {
        const caps = getBlockCapabilities(EmailBlockType.COLUMNS);
        expect(caps.supportsPadding).toBe(true);
        expect(caps.supportsBackgroundColor).toBe(true);
        expect(caps.supportsText).toBe(false);
        expect(caps.supportsTypography).toBe(false);
    });

    it('divider supports padding and border only', () => {
        const caps = getBlockCapabilities(EmailBlockType.DIVIDER);
        expect(caps.supportsPadding).toBe(true);
        expect(caps.supportsBorder).toBe(true);
        expect(caps.supportsText).toBe(false);
        expect(caps.supportsAlignment).toBe(false);
    });

    it('all capabilities have boolean values', () => {
        Object.values(BLOCK_CAPABILITIES).forEach((caps) => {
            Object.values(caps).forEach((val) => {
                expect(typeof val).toBe('boolean');
            });
        });
    });
});
