import { render, screen, fireEvent } from '@testing-library/react';
import { OptionsSection } from '../OptionsSection';
import { FieldType } from '../../../../../../types';

describe('OptionsSection', () => {
    const mockHandleUpdate = jest.fn();
    const baseField = {
        id: '1',
        type: FieldType.CHECKBOX,
        label: 'Options Field',
        options: ['Option 1', 'Option 2']
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render if capabilities do not support options', () => {
        const { container } = render(
            <OptionsSection
                field={baseField}
                capabilities={{ hasOptions: false }}
                handleUpdate={mockHandleUpdate}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders existing options', () => {
        render(
            <OptionsSection
                field={baseField}
                capabilities={{ hasOptions: true }}
                handleUpdate={mockHandleUpdate}
            />
        );
        expect(screen.getByDisplayValue('Option 1')).toBeTruthy();
        expect(screen.getByDisplayValue('Option 2')).toBeTruthy();
    });

    it('adds a new option', () => {
        render(
            <OptionsSection
                field={baseField}
                capabilities={{ hasOptions: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        const addBtn = screen.getByText('Add Option');
        fireEvent.click(addBtn);

        expect(mockHandleUpdate).toHaveBeenCalledWith('options', expect.arrayContaining([
            ...baseField.options,
            expect.objectContaining({ label: 'Option 3' })
        ]));
    });

    it('updates option label', () => {
        render(
            <OptionsSection
                field={baseField}
                capabilities={{ hasOptions: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        const input = screen.getByDisplayValue('Option 1');
        fireEvent.change(input, { target: { value: 'Updated 1' } });

        expect(mockHandleUpdate).toHaveBeenCalledWith('options', [
            { ...baseField.options[0], label: 'Updated 1' },
            baseField.options[1]
        ]);
    });

    it('removes an option', () => {
        render(
            <OptionsSection
                field={baseField}
                capabilities={{ hasOptions: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        // Find remove buttons (TrashIcon)
        // OptionsSection usually puts remove button next to label/value
        // Let's assume there are multiple buttons (Add is one, Remove are others)
        // We can scope by finding the option container
        // Or finding button by SVG trash icon class if test id missing
        // Let's grab all buttons and assume remove are the ones in list
        // Or better: click the first remove button
        // Since we have "Add Option" button too...

        // This is tricky without test-ids. 
        // Let's update implementation to add test-ids or use a stable selector?
        // Let's try to infer from structure: inputs are followed by remove button.
        // Actually, OptionsSection.tsx shows:
        // div > input (label) > Button (trash)

        // Let's update OptionsSection.tsx to add data-testid first for robustness?
        // Or simply getByText specific aria-label? No aria-label.
        // Let's assume I already looked at the file (I did).

        // I will just add test ids in a separate step if I need to.
        // For now, let's try to select by generic role button that is not "Add Option"
        const buttons = screen.getAllByRole('button');
        const removeBtns = buttons.filter(b => !b.textContent?.includes('Add Option'));

        fireEvent.click(removeBtns[0]);

        expect(mockHandleUpdate).toHaveBeenCalledWith('options', [baseField.options[1]]);
    });
});
