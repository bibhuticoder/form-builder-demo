/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import BuilderSpacer from '../BuilderSpacer';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderSpacer', () => {
    it('renders with default height', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderSpacer
                    block={{
                        id: 'spacer_1',
                        type: EmailBlockType.SPACER,
                        height: 20,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const spacer = container.querySelector('.block-type-spacer div');
        expect(spacer).toBeTruthy();
        expect(spacer!.style.height).toBe('20px');
    });

    it('renders with custom height', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderSpacer
                    block={{
                        id: 'spacer_2',
                        type: EmailBlockType.SPACER,
                        height: 50,
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const spacer = container.querySelector('.block-type-spacer div');
        expect(spacer!.style.height).toBe('50px');
    });

    it('shows dashed border when selected', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderSpacer
                    block={{
                        id: 'spacer_3',
                        type: EmailBlockType.SPACER,
                        height: 30,
                        style: {},
                    }}
                    isSelected={true}
                />
            </MockEmailBuilderProvider>
        );
        const spacerDiv = container.querySelector('.block-type-spacer div');
        expect(spacerDiv!.classList.contains('border')).toBe(true);
        expect(spacerDiv!.classList.contains('border-dashed')).toBe(true);
    });
});
