/**
 * @jest-environment jsdom
 */
import { createBlockFromType } from '../utils';
import { EmailBlockType } from '../../../types/enums';
import {
    HeadingBlock,
    TextBlock,
    ImageBlock,
    ButtonBlock,
    ColumnsBlock,
    DividerBlock,
    SpacerBlock,
    HtmlBlock,
    DiscountCodeBlock,
    MenuBlock,
    SocialLinksBlock,
} from '../../../types';

describe('dnd/utils', () => {
    describe('createBlockFromType', () => {
        it('should generate unique IDs for each block', () => {
            const block1 = createBlockFromType(EmailBlockType.TEXT, 'Text');
            const block2 = createBlockFromType(EmailBlockType.TEXT, 'Text', [block1]);

            expect(block1.id).not.toBe(block2.id);
        });

        it('should create a heading block with correct defaults', () => {
            const block = createBlockFromType(EmailBlockType.HEADING, 'Welcome') as HeadingBlock;

            expect(block.type).toBe(EmailBlockType.HEADING);
            expect(block.content).toBe('Welcome');
            expect(block.headingLevel).toBeDefined();
            expect(block.style).toBeDefined();
        });

        it('should create a text block with default content', () => {
            const block = createBlockFromType(EmailBlockType.TEXT, 'Text') as TextBlock;

            expect(block.type).toBe(EmailBlockType.TEXT);
            expect(block.content).toBe('Enter your text here...');
        });

        it('should create an image block with empty src', () => {
            const block = createBlockFromType(EmailBlockType.IMAGE, 'Image') as ImageBlock;

            expect(block.type).toBe(EmailBlockType.IMAGE);
            expect(block.src).toBe('');
            expect(block.alt).toBe('Image');
        });

        it('should create a button block with default label and url', () => {
            const block = createBlockFromType(EmailBlockType.BUTTON, 'Button') as ButtonBlock;

            expect(block.type).toBe(EmailBlockType.BUTTON);
            expect(block.label).toBe('Click Here');
            expect(block.url).toBe('#');
        });

        it('should create a columns block with 2 columns', () => {
            const block = createBlockFromType(EmailBlockType.COLUMNS, 'Columns') as ColumnsBlock;

            expect(block.type).toBe(EmailBlockType.COLUMNS);
            expect(block.columns).toHaveLength(2);
            expect(block.columns[0].width).toBe('50%');
            expect(block.columns[1].width).toBe('50%');
            expect(block.columns[0].blocks).toEqual([]);
            expect(block.columns[0].id).not.toBe(block.columns[1].id);
        });

        it('should create a divider block', () => {
            const block = createBlockFromType(EmailBlockType.DIVIDER, 'Divider') as DividerBlock;

            expect(block.type).toBe(EmailBlockType.DIVIDER);
            expect(block.style).toBeDefined();
        });

        it('should create a spacer block with default height', () => {
            const block = createBlockFromType(EmailBlockType.SPACER, 'Spacer') as SpacerBlock;

            expect(block.type).toBe(EmailBlockType.SPACER);
            expect(block.height).toBe(20);
        });

        it('should create an HTML block with default content', () => {
            const block = createBlockFromType(EmailBlockType.HTML, 'HTML') as HtmlBlock;

            expect(block.type).toBe(EmailBlockType.HTML);
            expect(block.content).toBe('<p style="font-size: 16px; color: #333;">Custom HTML</p>');
        });

        it('should create a discount code block with defaults', () => {
            const block = createBlockFromType(EmailBlockType.DISCOUNT_CODE, 'Discount') as DiscountCodeBlock;

            expect(block.type).toBe(EmailBlockType.DISCOUNT_CODE);
            expect(block.code).toBe('SAVE20');
            expect(block.description).toBeDefined();
        });

        it('should create a menu block with default items', () => {
            const block = createBlockFromType(EmailBlockType.MENU, 'Menu') as MenuBlock;

            expect(block.type).toBe(EmailBlockType.MENU);
            expect(block.items).toHaveLength(3);
            expect(block.items[0].label).toBe('Menu 1');
            expect(block.items[1].label).toBe('Menu 2');
            expect(block.items[2].label).toBe('Menu 3');
            expect(block.items[0].url).toBe('#');
            // Each item should have a unique ID
            const ids = block.items.map((i) => i.id);
            expect(new Set(ids).size).toBe(3);
        });

        it('should create a social links block with default links', () => {
            const block = createBlockFromType(EmailBlockType.SOCIAL_LINKS, 'Social') as SocialLinksBlock;

            expect(block.type).toBe(EmailBlockType.SOCIAL_LINKS);
            expect(block.links).toHaveLength(3);
            expect(block.links[0].platform).toBe('facebook');
            expect(block.links[1].platform).toBe('twitter');
            expect(block.links[2].platform).toBe('instagram');
        });

        it('should create responsive styles keyed by active breakpoint', () => {
            const block = createBlockFromType(EmailBlockType.TEXT, 'Text', [], 'desktop');

            expect(block.style).toBeDefined();
            expect(block.style!.desktop).toBeDefined();
            expect(typeof block.style!.desktop).toBe('object');
            // Mobile should reference desktop
            expect(block.style!.mobile).toBe('desktop');
        });

        it('should create responsive styles for mobile breakpoint', () => {
            const block = createBlockFromType(EmailBlockType.TEXT, 'Text', [], 'mobile');

            expect(block.style!.mobile).toBeDefined();
            expect(typeof block.style!.mobile).toBe('object');
            expect(block.style!.desktop).toBe('mobile');
        });

        it('should generate sequential IDs based on existing blocks', () => {
            const block1 = createBlockFromType(EmailBlockType.TEXT, 'Text');
            expect(block1.id).toBe('text_1');

            const block2 = createBlockFromType(EmailBlockType.TEXT, 'Text', [block1]);
            expect(block2.id).toBe('text_2');

            const block3 = createBlockFromType(EmailBlockType.HEADING, 'Heading', [block1, block2]);
            expect(block3.id).toBe('heading_1');
        });

        it('should avoid ID collisions between column-nested and root blocks', () => {
            const nestedText = createBlockFromType(EmailBlockType.TEXT, 'Text');
            const columns = createBlockFromType(EmailBlockType.COLUMNS, 'Columns') as ColumnsBlock;

            columns.columns[0].blocks = [nestedText];

            const rootText = createBlockFromType(EmailBlockType.TEXT, 'Text', [columns]);

            expect(rootText.id).toBe('text_2');
            expect(rootText.id).not.toBe(nestedText.id);
        });
    });
});
