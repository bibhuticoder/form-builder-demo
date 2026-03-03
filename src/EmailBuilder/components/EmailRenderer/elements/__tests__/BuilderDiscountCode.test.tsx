/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderDiscountCode from '../BuilderDiscountCode';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderDiscountCode', () => {
    it('renders discount code', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderDiscountCode
                    block={{
                        id: 'discount_1',
                        type: EmailBlockType.DISCOUNT_CODE,
                        code: 'SAVE20',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('SAVE20')).toBeTruthy();
    });

    it('renders description when provided', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderDiscountCode
                    block={{
                        id: 'discount_2',
                        type: EmailBlockType.DISCOUNT_CODE,
                        code: 'WELCOME10',
                        description: 'Get 10% off your first order',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('WELCOME10')).toBeTruthy();
        expect(screen.getByText('Get 10% off your first order')).toBeTruthy();
    });

    it('renders without description', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderDiscountCode
                    block={{
                        id: 'discount_3',
                        type: EmailBlockType.DISCOUNT_CODE,
                        code: 'CODE',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('CODE')).toBeTruthy();
        // Should not render description paragraph
        const paragraphs = container.querySelectorAll('p');
        expect(paragraphs).toHaveLength(0);
    });
});
