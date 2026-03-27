/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import BuilderBlockControls from '../BuilderBlockControls';
import { EmailBlockType } from '../../../../types/enums';

describe('BuilderBlockControls', () => {
    const mockBlock = {
        id: 'test_1',
        type: EmailBlockType.TEXT,
    };

    it('renders children', () => {
        render(
            <BuilderBlockControls block={mockBlock}>
                <span>Child content</span>
            </BuilderBlockControls>
        );
        expect(screen.getByText('Child content')).toBeTruthy();
    });

    it('shows block type name in action bar', () => {
        render(
            <BuilderBlockControls block={mockBlock} forceHover={true}>
                <span>Content</span>
            </BuilderBlockControls>
        );
        expect(screen.getByText('TEXT')).toBeTruthy();
    });

    it('shows formatted name for underscore types', () => {
        const discountBlock = {
            id: 'discount_1',
            type: EmailBlockType.DISCOUNT_CODE,
        };
        render(
            <BuilderBlockControls block={discountBlock} forceHover={true}>
                <span>Content</span>
            </BuilderBlockControls>
        );
        expect(screen.getByText('DISCOUNT CODE')).toBeTruthy();
    });

    it('calls onDelete when delete button clicked', () => {
        const onDelete = jest.fn();
        render(
            <BuilderBlockControls block={mockBlock} onDelete={onDelete} forceHover={true}>
                <span>Content</span>
            </BuilderBlockControls>
        );
        fireEvent.click(screen.getByTitle('Delete'));
        expect(onDelete).toHaveBeenCalledWith('test_1');
    });

    it('calls onSelect when wrapper clicked', () => {
        const onSelect = jest.fn();
        render(
            <BuilderBlockControls block={mockBlock} onSelect={onSelect}>
                <span>Content</span>
            </BuilderBlockControls>
        );
        fireEvent.click(screen.getByText('Content'));
        expect(onSelect).toHaveBeenCalledWith('test_1');
    });

    it('applies selected styles when selected', () => {
        const { container } = render(
            <BuilderBlockControls block={mockBlock} selected={true}>
                <span>Content</span>
            </BuilderBlockControls>
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.classList.contains('bg-primary/5')).toBe(true);
    });
});
