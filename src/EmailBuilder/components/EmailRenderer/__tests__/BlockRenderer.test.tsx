/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BlockRenderer from '../BlockRenderer';
import { EmailBlockType } from '../../../types/enums';
import { MockEmailBuilderProvider } from '../elements/__tests__/MockEmailBuilderProvider';

describe('BlockRenderer', () => {
    it('renders heading block through registry', () => {
        render(
            <MockEmailBuilderProvider>
                <BlockRenderer
                    block={{
                        id: 'heading_1',
                        type: EmailBlockType.HEADING,
                        content: 'Test Heading',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Test Heading')).toBeTruthy();
    });

    it('renders text block through registry', () => {
        render(
            <MockEmailBuilderProvider>
                <BlockRenderer
                    block={{
                        id: 'text_1',
                        type: EmailBlockType.TEXT,
                        content: 'Some text',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Some text')).toBeTruthy();
    });

    it('renders button block through registry', () => {
        render(
            <MockEmailBuilderProvider>
                <BlockRenderer
                    block={{
                        id: 'button_1',
                        type: EmailBlockType.BUTTON,
                        label: 'Click',
                        url: '#',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('button', { name: 'Click' })).toBeTruthy();
    });

    it('returns null for unknown block type', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BlockRenderer
                    block={{
                        id: 'unknown_1',
                        type: 'nonexistent' as any,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(container.innerHTML).toBe('');
    });
});
