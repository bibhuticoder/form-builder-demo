
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsSection } from '../SettingsSection';
import { FieldType } from '../../../../../../types';

describe('SettingsSection', () => {
    const mockHandleUpdate = jest.fn();
    const baseField = { id: '1', type: FieldType.TEXT, label: 'My Field', required: false, helpText: 'Help me' } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders required toggle when hasRequired is true', () => {
        render(
            <SettingsSection
                field={baseField}
                capabilities={{ hasRequired: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        expect(screen.getByText('Required')).toBeTruthy();
        const toggle = screen.getByRole('switch');
        expect(toggle).toBeTruthy();
        expect(toggle).not.toBeChecked(); // aria-checked="false"
    });

    it('toggles required state', () => {
        render(
            <SettingsSection
                field={baseField}
                capabilities={{ hasRequired: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        const toggle = screen.getByRole('switch');
        fireEvent.click(toggle);

        expect(mockHandleUpdate).toHaveBeenCalledWith('required', true);
    });

    it('renders help text input when hasHelpText is true', () => {
        render(
            <SettingsSection
                field={baseField}
                capabilities={{ hasHelpText: true }}
                handleUpdate={mockHandleUpdate}
            />
        );

        expect(screen.getByText('Help Text')).toBeTruthy();
        expect(screen.getByDisplayValue('Help me')).toBeTruthy();
    });
});
