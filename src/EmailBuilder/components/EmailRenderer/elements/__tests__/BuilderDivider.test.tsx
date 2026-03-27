/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import BuilderDivider from '../BuilderDivider';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderDivider', () => {
    it('renders a horizontal rule', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderDivider
                    block={{
                        id: 'divider_1',
                        type: EmailBlockType.DIVIDER,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const hr = container.querySelector('hr');
        expect(hr).toBeTruthy();
    });

    it('applies custom border color from styles', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderDivider
                    block={{
                        id: 'divider_2',
                        type: EmailBlockType.DIVIDER,
                        style: {
                            desktop: {
                                borderColor: '#ff0000',
                            },
                        },
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const hr = container.querySelector('hr');
        expect(hr).toBeTruthy();
        expect(hr!.style.borderColor).toBe('rgb(255, 0, 0)');
    });
});
