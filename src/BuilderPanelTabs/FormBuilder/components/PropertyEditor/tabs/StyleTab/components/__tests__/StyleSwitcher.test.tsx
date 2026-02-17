import { render, screen, fireEvent } from '@testing-library/react';
import { StyleSwitcher } from '../StyleSwitcher';
import { FieldType } from '../../../../../../types/enums';
import type { Field } from '../../../../../../types';
import type { ResponsiveFieldStyle } from '../../../../../../types/styles';

const makeField = (style?: ResponsiveFieldStyle): Field => ({
    id: 'field_1',
    type: FieldType.TEXT,
    label: 'Test',
    style,
});

describe('StyleSwitcher', () => {
    const mockUpdateField = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all 6 breakpoint buttons', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByText('XS')).toBeInTheDocument();
        expect(screen.getByText('SM')).toBeInTheDocument();
        expect(screen.getByText('MD')).toBeInTheDocument();
        expect(screen.getByText('LG')).toBeInTheDocument();
        expect(screen.getByText('XL')).toBeInTheDocument();
        expect(screen.getByText('2XL')).toBeInTheDocument();
    });

    it('renders Apply All checkbox and label', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByText('Apply All')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('shows Apply All checked when all breakpoints reference the active', () => {
        const field = makeField({
            md: { width: '100%' },
            xs: 'md',
            sm: 'md',
            lg: 'md',
            xl: 'md',
            '2xl': 'md',
        });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('shows Apply All unchecked when not all breakpoints reference the active', () => {
        const field = makeField({
            md: { width: '100%' },
            xs: { width: '50%' },
        });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('does not show Save button initially', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('shows Save button after toggling a size', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByText('XS'));
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('shows Save button after toggling Apply All', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('hides Save button after clicking Save', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByText('LG'));
        expect(screen.getByText('Save')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Save'));
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('clicking Apply All selects all sizes', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByRole('checkbox'));
        // Apply All should now be checked
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('unchecking Apply All deselects all except active', () => {
        const field = makeField({
            md: { width: '100%' },
            xs: 'md',
            sm: 'md',
            lg: 'md',
            xl: 'md',
            '2xl': 'md',
        });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByRole('checkbox')).toBeChecked();

        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('deselecting one size unchecks Apply All', () => {
        const field = makeField({
            md: { width: '100%' },
            xs: 'md',
            sm: 'md',
            lg: 'md',
            xl: 'md',
            '2xl': 'md',
        });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        expect(screen.getByRole('checkbox')).toBeChecked();

        fireEvent.click(screen.getByText('XS'));
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('clicking the active breakpoint button does not toggle it', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByText('MD'));
        // No Save button since nothing changed
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('Save calls updateField with references for selected sizes', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByText('LG'));
        fireEvent.click(screen.getByText('XL'));
        fireEvent.click(screen.getByText('Save'));

        expect(mockUpdateField).toHaveBeenCalledWith('field_1', {
            style: expect.objectContaining({
                md: { width: '100%' },
                lg: 'md',
                xl: 'md',
            }),
        });
    });

    it('Save with Apply All sets all sizes to reference active', () => {
        const field = makeField({ md: { width: '100%' } });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByText('Save'));

        expect(mockUpdateField).toHaveBeenCalledWith('field_1', {
            style: expect.objectContaining({
                md: { width: '100%' },
                xs: 'md',
                sm: 'md',
                lg: 'md',
                xl: 'md',
                '2xl': 'md',
            }),
        });
    });

    it('deselecting a size that referenced active resolves it to an object on Save', () => {
        const field = makeField({
            md: { width: '100%' },
            xs: 'md',
            sm: 'md',
            lg: 'md',
            xl: 'md',
            '2xl': 'md',
        });
        render(<StyleSwitcher field={field} activeBreakpoint="md" updateField={mockUpdateField} />);

        // Deselect LG
        fireEvent.click(screen.getByText('LG'));
        fireEvent.click(screen.getByText('Save'));

        const call = mockUpdateField.mock.calls[0];
        const newStyle = call[1].style;

        // LG was referencing md, now deselected — should be resolved to an object
        expect(typeof newStyle.lg).toBe('object');
        expect(newStyle.lg).toEqual({ width: '100%' });

        // Others still reference md
        expect(newStyle.xs).toBe('md');
        expect(newStyle.sm).toBe('md');
        expect(newStyle.xl).toBe('md');
        expect(newStyle['2xl']).toBe('md');
    });
});
