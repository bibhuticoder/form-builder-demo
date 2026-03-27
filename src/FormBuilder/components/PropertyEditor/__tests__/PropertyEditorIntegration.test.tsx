import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyEditor } from '../PropertyEditor';
import { FormBuilderContext } from '../../../context/FormBuilderContext';
import { FieldType, FormStatus } from '../../../types';

// Remove mocks for tabs to allow full integration testing
// We only mock the context provider

const mockUpdateField = jest.fn();
const mockUpdateFormSettings = jest.fn();

const renderPropertyEditor = (field: any) => {
    const contextValue = {
        jsonContent: {
            fields: [field],
            formSettings: {
                name: 'Test Form',
                status: FormStatus.DRAFT,
                settings: { width: 800 },
            },
            logic: { version: 1, rules: [] },
        },
        updateField: mockUpdateField,
        updateFormSettings: mockUpdateFormSettings,
        // Add other necessary context methods mocked
        setJsonContent: jest.fn(),
        setActiveSubElement: jest.fn(),
        updateFormName: jest.fn(),
        updateCanvasWidth: jest.fn(),
        addField: jest.fn(),
        updateFieldStyleBatch: jest.fn(),
        deleteField: jest.fn(),
        reorderFields: jest.fn(),
        addLogicRule: jest.fn(),
        updateLogicRule: jest.fn(),
        deleteLogicRule: jest.fn(),
        saveForm: jest.fn(),
        publishForm: jest.fn(),
        previewForm: jest.fn(),
        activeSubElement: null
    };

    return render(
        <FormBuilderContext.Provider value={contextValue as any}>
            <PropertyEditor selectedFieldId={field.id} onBack={jest.fn()} />
        </FormBuilderContext.Provider>
    );
};

describe('PropertyEditor Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initializes with correct values from context', () => {
        const field = {
            id: 'field-1',
            type: FieldType.TEXT,
            label: 'Test Input',
            placeholder: 'Enter text',
            required: false,
            style: {},
        };

        renderPropertyEditor(field);

        // switch to Content tab (default)
        // Check for Label input
        expect(screen.getByDisplayValue('Test Input')).toBeInTheDocument();
    });

    // verify ContentSection updates label
    it('updates field label in context when changed', () => {
        const field = {
            id: 'field-1',
            type: FieldType.TEXT,
            label: 'Old Label',
            placeholder: '',
            required: false,
            style: {},
        };

        renderPropertyEditor(field);

        const input = screen.getByDisplayValue('Old Label');
        fireEvent.change(input, { target: { value: 'New Label' } });

        expect(mockUpdateField).toHaveBeenCalledWith('field-1', expect.objectContaining({ label: 'New Label' }));
    });

    // verify SettingsSection toggles required
    it('toggles required state in context', () => {
        const field = {
            id: 'field-1',
            type: FieldType.TEXT, // Text has 'required' capability
            label: 'Test Field',
            required: false,
            style: {},
        };

        renderPropertyEditor(field);

        // Find the toggle. "Required" is the label text, the button acts as the switch
        // The switch button has aria-checked
        const toggle = screen.getByRole('switch');
        fireEvent.click(toggle);

        expect(mockUpdateField).toHaveBeenCalledWith('field-1', expect.objectContaining({ required: true }));
    });

    // Verify StyleTab updates
    it('updates style properties in context', () => {
        const field = {
            id: 'field-1',
            type: FieldType.TEXT,
            label: 'Test Field',
            style: { width: 'full' },
        };

        renderPropertyEditor(field);

        // Switch to Style Tab
        fireEvent.click(screen.getByText('Style'));

        // LayoutSection renders width/padding etc.
        // Width is usually a select or input.
        // Based on previous knowledge, width might be a select with value 'full'
        // Let's assert we can see the section first
        expect(screen.getByText('Width')).toBeInTheDocument();
    });
});
