/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderButton from '../BuilderButton';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderButton', () => {
    it('renders button with label', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderButton
                    block={{
                        id: 'button_1',
                        type: EmailBlockType.BUTTON,
                        label: 'Shop Now',
                        url: 'https://example.com',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('button', { name: 'Shop Now' })).toBeTruthy();
    });

    it('renders with custom styles', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderButton
                    block={{
                        id: 'button_2',
                        type: EmailBlockType.BUTTON,
                        label: 'Click Me',
                        url: '#',
                        style: {
                            desktop: {
                                backgroundColor: '#ff0000',
                                color: '#ffffff',
                            },
                        },
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('button', { name: 'Click Me' })).toBeTruthy();
    });
});
