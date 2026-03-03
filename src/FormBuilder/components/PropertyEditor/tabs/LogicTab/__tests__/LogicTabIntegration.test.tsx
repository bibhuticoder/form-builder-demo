
import { render, screen, fireEvent } from '@testing-library/react';
import { LogicTab } from '../index';
import { FormBuilderContext } from '../../../../../context/FormBuilderContext';
import { FieldType, FormStatus, LogicEffect, LogicEvent, LogicComparison } from '../../../../../types';

// Mock Dialog as it relies on Portal which can be tricky in tests, 
// BUT LogicDialog imports Dialog from components/Dialog.
// If Dialog uses Portal, we might need to mock it or ensure it renders in body.
// Let's rely on real Dialog if possible, or mock if it fails.
// Assuming Dialog renders content when isOpen is true.

// Set up mock context
const mockAddLogicRule = jest.fn();
const mockUpdateLogicRule = jest.fn();
const mockDeleteLogicRule = jest.fn();

const renderLogicTab = (rules: any[] = [], fields: any[] = []) => {
    const contextValue = {
        jsonContent: {
            fields: fields,
            formSettings: {
                name: 'Test Form',
                status: FormStatus.DRAFT,
                settings: {},
            },
            logic: { version: 1, rules: rules },
        },
        addLogicRule: mockAddLogicRule,
        updateLogicRule: mockUpdateLogicRule,
        deleteLogicRule: mockDeleteLogicRule,
        // Mock other unused methods
        updateField: jest.fn(),
        updateFormSettings: jest.fn(),
        setJsonContent: jest.fn(),
        setActiveSubElement: jest.fn(),
        updateFormName: jest.fn(),
        updateCanvasWidth: jest.fn(),
        addField: jest.fn(),
        updateFieldStyleBatch: jest.fn(),
        deleteField: jest.fn(),
        reorderFields: jest.fn(),
        saveForm: jest.fn(),
        publishForm: jest.fn(),
        previewForm: jest.fn(),
        activeSubElement: null
    };

    return render(
        <FormBuilderContext.Provider value={contextValue as any}>
            <LogicTab />
        </FormBuilderContext.Provider>
    );
};

describe('LogicTab Integration', () => {
    const mockFields = [
        { id: 'field_1', type: FieldType.TEXT, label: 'Name' },
        { id: 'field_2', type: FieldType.TEXT, label: 'Email' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state and allows adding a rule', async () => {
        renderLogicTab([], mockFields);

        // Open Add Rule Dialog
        const addBtn = screen.getByText('Add New Condition');
        fireEvent.click(addBtn);

        // Select Rule Type (Conditional Visibility)
        const visibilityOption = screen.getByText('Conditional Visibility');
        fireEvent.click(visibilityOption);

        // Verify we are in configure step
        expect(screen.getByText('Configure Rule')).toBeTruthy();

        // Configure Condition: If Name Equals "John"
        // Condition Row 0
        // Field Select
        const fieldSelects = screen.getAllByRole('combobox');
        // fieldSelects[0] is matchType (ALL/ANY), fieldSelects[1] is Field, fieldSelects[2] is Condition
        // LogicDialog: matchType select, then conditions map...

        // Select Field: Name
        fireEvent.change(fieldSelects[0], { target: { value: 'field_1' } });

        // Select Condition: Equals (default, but verify)
        fireEvent.change(fieldSelects[1], { target: { value: LogicComparison.EQ } });

        // Enter Value
        const valueInput = screen.getByPlaceholderText('Value...');
        fireEvent.change(valueInput, { target: { value: 'John' } });

        // Configure Action: Hide Email
        // Action section selects
        // LogicDialog renders action selects after "Perform action:"
        // We can look for "Select Action..." option parent select
        const actionSelect = screen.getByDisplayValue('Select Action...');
        fireEvent.change(actionSelect, { target: { value: 'hide' } });

        const targetSelect = screen.getAllByDisplayValue('Select Field...').pop() as HTMLElement;
        fireEvent.change(targetSelect, { target: { value: 'field_2' } });

        // Click Add Rule
        const saveBtn = screen.getByText('Add Rule');
        expect(saveBtn).not.toBeDisabled();
        fireEvent.click(saveBtn);

        // Verify addLogicRule called
        expect(mockAddLogicRule).toHaveBeenCalledTimes(1);
        const calledArg = mockAddLogicRule.mock.calls[0][0];
        expect(calledArg.if.conditions[0].right.str).toBe('John');
        expect(calledArg.then[0].effect).toBe(LogicEffect.FIELD_VISIBILITY_SET);
        expect(calledArg.then[0].value).toBe(false); // hide -> value false
    });

    it('displays existing rules and allows editing', () => {
        const existingRule = {
            id: 'logic_1',
            enabled: true,
            trigger: { event: LogicEvent.FIELD_CHANGE, fieldId: 'Name' },
            if: {
                conditions: [{
                    id: 'cond_1',
                    comparison: LogicComparison.EQ,
                    left: { var: 'field_1' },
                    right: { str: 'Alice' }
                }]
            },
            then: [{
                effect: LogicEffect.FIELD_VISIBILITY_SET,
                targets: ['field_2'],
                value: true
            }]
        };

        renderLogicTab([existingRule], mockFields);

        // Check if rule is listed
        expect(screen.getByText('"Alice"')).toBeTruthy();

        // Click Edit (using test id)
        const editBtn = screen.getByTestId('edit-rule-logic_1');
        fireEvent.click(editBtn);

        // Verify dialog opens populated
        expect(screen.getByDisplayValue('Alice')).toBeTruthy();

        // Change logic value to Bob
        const valueInput = screen.getByDisplayValue('Alice');
        fireEvent.change(valueInput, { target: { value: 'Bob' } });

        // Save
        const updateBtn = screen.getByText('Update Rule');
        fireEvent.click(updateBtn);

        // Verify updateLogicRule called
        expect(mockUpdateLogicRule).toHaveBeenCalledTimes(1);
        expect(mockUpdateLogicRule).toHaveBeenCalledWith('logic_1', expect.objectContaining({
            if: expect.objectContaining({
                conditions: expect.arrayContaining([
                    expect.objectContaining({ right: { str: 'Bob' } })
                ])
            })
        }));
    });
});
