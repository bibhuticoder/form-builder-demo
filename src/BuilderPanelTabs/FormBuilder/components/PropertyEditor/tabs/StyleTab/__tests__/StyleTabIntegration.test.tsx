
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleTab } from '../index';
import { FormBuilderContext } from '../../../../../context/FormBuilderContext';
import { FieldType, FormStatus } from '../../../../../types';

// Mock context functions
const mockUpdateField = jest.fn();
const mockUpdateFieldStyleBatch = jest.fn();
const mockSetActiveSubElement = jest.fn();

const renderStyleTab = (field: any) => {
    const contextValue = {
        updateField: mockUpdateField,
        updateFieldStyleBatch: mockUpdateFieldStyleBatch,
        setActiveSubElement: mockSetActiveSubElement,
        // Mock other unused
        jsonContent: { fields: [], formSettings: { name: '', status: FormStatus.DRAFT, settings: {} }, logic: { version: 1, rules: [] } },
        setJsonContent: jest.fn(),
        updateFormName: jest.fn(),
        updateFormSettings: jest.fn(),
        updateCanvasWidth: jest.fn(),
        addField: jest.fn(),
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
            <StyleTab field={field} />
        </FormBuilderContext.Provider>
    );
};

describe('StyleTab Integration', () => {
    const baseField = {
        id: 'f1',
        type: FieldType.TEXT,
        style: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders layout and typography sections', () => {
        renderStyleTab(baseField);
        expect(screen.getByText('Layout')).toBeTruthy();
        expect(screen.getByText('Typography')).toBeTruthy();
    });

    it('updates text alignment via TypographySection', () => {
        renderStyleTab(baseField);

        // Find Text Alignment select in Typography
        // It should default to 'left'
        const alignSelect = screen.getByDisplayValue('Left');
        fireEvent.change(alignSelect, { target: { value: 'center' } });

        expect(mockUpdateField).toHaveBeenCalledWith('f1', {
            style: expect.objectContaining({ textAlign: 'center' })
        });
    });

    it('updates width via LayoutSection', () => {
        renderStyleTab(baseField);

        const widthSelect = screen.getByDisplayValue('Full Width (100%)');
        fireEvent.change(widthSelect, { target: { value: 'half' } });

        expect(mockUpdateField).toHaveBeenCalledWith('f1', {
            style: expect.objectContaining({ width: 'half' })
        });
    });
});
