
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentSection } from '../ContentSection';
import { FieldType } from '../../../../../../types';

describe('ContentSection', () => {
    const mockHandleUpdate = jest.fn();
    const baseField = {
        id: '1',
        type: FieldType.TEXT,
        label: 'My Field',
        placeholder: 'Enter text',
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders label input when capability allows', () => {
        render(
            <ContentSection
                field={baseField}
                capabilities={{ hasLabel: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        expect(screen.getByText('Label')).toBeTruthy();
        expect(screen.getByDisplayValue('Test Label')).toBeTruthy();
    });

    it('hides label input when capability disabled', () => {
        render(
            <ContentSection
                field={baseField}
                capabilities={{ hasLabel: false }}
                handleUpdate={mockHandleUpdate}
            />
        );

        expect(screen.queryByText('Label')).toBeNull();
    });

    it('calls handleUpdate when label changes', () => {
        render(
            <ContentSection
                field={baseField}
                capabilities={{ hasLabel: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        const input = screen.getByDisplayValue('Test Label');
        fireEvent.change(input, { target: { value: 'New Label' } });

        expect(mockHandleUpdate).toHaveBeenCalledWith('label', 'New Label');
    });

    it('renders placeholder input when hasPlaceholder is true', () => {
        render(
            <ContentSection
                field={baseField}
                capabilities={{ hasPlaceholder: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        expect(screen.getByText('Placeholder')).toBeTruthy();
        expect(screen.getByDisplayValue('Test Placeholder')).toBeTruthy();
    });
});
