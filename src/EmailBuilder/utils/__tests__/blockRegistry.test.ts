/**
 * @jest-environment jsdom
 */
import { blockRegistry } from '../blockRegistry';

import BuilderHeading from '../../components/EmailRenderer/elements/BuilderHeading';
import BuilderText from '../../components/EmailRenderer/elements/BuilderText';
import BuilderImage from '../../components/EmailRenderer/elements/BuilderImage';
import BuilderVideo from '../../components/EmailRenderer/elements/BuilderVideo';
import BuilderButton from '../../components/EmailRenderer/elements/BuilderButton';
import BuilderColumns from '../../components/EmailRenderer/elements/BuilderColumns';
import BuilderDivider from '../../components/EmailRenderer/elements/BuilderDivider';
import BuilderSpacer from '../../components/EmailRenderer/elements/BuilderSpacer';
import BuilderHtml from '../../components/EmailRenderer/elements/BuilderHtml';
import BuilderDiscountCode from '../../components/EmailRenderer/elements/BuilderDiscountCode';
import BuilderMenu from '../../components/EmailRenderer/elements/BuilderMenu';
import BuilderSocialLinks from '../../components/EmailRenderer/elements/BuilderSocialLinks';
import { EmailBlockType } from '../../types';

describe('blockRegistry', () => {
    it('should have all block types registered', () => {
        const expectedBlockTypes = Object.values(EmailBlockType);
        const registeredBlockTypes = Object.keys(blockRegistry);

        expectedBlockTypes.forEach((blockType) => {
            expect(registeredBlockTypes).toContain(blockType);
        });
    });

    it('should map heading to BuilderHeading', () => {
        expect(blockRegistry[EmailBlockType.HEADING]).toBe(BuilderHeading);
    });

    it('should map text to BuilderText', () => {
        expect(blockRegistry[EmailBlockType.TEXT]).toBe(BuilderText);
    });

    it('should map image to BuilderImage', () => {
        expect(blockRegistry[EmailBlockType.IMAGE]).toBe(BuilderImage);
    });

    it('should map video to BuilderVideo', () => {
        expect(blockRegistry[EmailBlockType.VIDEO]).toBe(BuilderVideo);
    });

    it('should map button to BuilderButton', () => {
        expect(blockRegistry[EmailBlockType.BUTTON]).toBe(BuilderButton);
    });

    it('should map columns to BuilderColumns', () => {
        expect(blockRegistry[EmailBlockType.COLUMNS]).toBe(BuilderColumns);
    });

    it('should map divider to BuilderDivider', () => {
        expect(blockRegistry[EmailBlockType.DIVIDER]).toBe(BuilderDivider);
    });

    it('should map spacer to BuilderSpacer', () => {
        expect(blockRegistry[EmailBlockType.SPACER]).toBe(BuilderSpacer);
    });

    it('should map html to BuilderHtml', () => {
        expect(blockRegistry[EmailBlockType.HTML]).toBe(BuilderHtml);
    });

    it('should map discount_code to BuilderDiscountCode', () => {
        expect(blockRegistry[EmailBlockType.DISCOUNT_CODE]).toBe(BuilderDiscountCode);
    });

    it('should map menu to BuilderMenu', () => {
        expect(blockRegistry[EmailBlockType.MENU]).toBe(BuilderMenu);
    });

    it('should map social_links to BuilderSocialLinks', () => {
        expect(blockRegistry[EmailBlockType.SOCIAL_LINKS]).toBe(BuilderSocialLinks);
    });

    it('should have all registry entries be valid React components', () => {
        Object.values(blockRegistry).forEach((component) => {
            expect(component).toBeDefined();
            expect(typeof component).toBe('function');
        });
    });

    it('should not have any undefined or null entries', () => {
        Object.entries(blockRegistry).forEach(([, value]) => {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
        });
    });
});
