/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyEditor } from '../PropertyEditor';
import { EmailBlockType } from '../../../types/enums';
import { MockEmailBuilderProvider } from '../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';

describe('PropertyEditor', () => {
    const mockOnBack = jest.fn();

    const mockBlocks = [
        {
            id: 'block_1',
            type: EmailBlockType.HEADING,
            content: 'Hello World',
            style: {},
        },
    ];

    it('renders "Block not found" if selectedBlockId does not exist', () => {
        render(
            <MockEmailBuilderProvider value={{ jsonContent: { blocks: [] } }}>
                <PropertyEditor selectedBlockId="non_existent" onBack={mockOnBack} />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Block not found')).toBeTruthy();
    });

    it('renders correct header and tabs for existing block', () => {
        render(
            <MockEmailBuilderProvider value={{ jsonContent: { blocks: mockBlocks } }}>
                <PropertyEditor selectedBlockId="block_1" onBack={mockOnBack} />
            </MockEmailBuilderProvider>
        );

        // Header should show capitalized block type
        expect(screen.getByText('Heading')).toBeTruthy();

        // Back button should be present
        const backBtn = screen.getByText('Back');
        expect(backBtn).toBeTruthy();

        fireEvent.click(backBtn);
        expect(mockOnBack).toHaveBeenCalledTimes(1);

        // Content Tab should be rendered (can't easily check internal of ContentTab but can check for labels if any)
        // Since we didn't mock ContentTab/StyleTab, they will actually render.
    });

    it('formats special block types correctly (like html)', () => {
        const htmlBlock = {
            id: 'block_html',
            type: 'html' as any,
            content: '<div></div>',
            style: {},
        };
        render(
            <MockEmailBuilderProvider value={{ jsonContent: { blocks: [htmlBlock] } }}>
                <PropertyEditor selectedBlockId="block_html" onBack={mockOnBack} />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('HTML')).toBeTruthy();
    });
});
