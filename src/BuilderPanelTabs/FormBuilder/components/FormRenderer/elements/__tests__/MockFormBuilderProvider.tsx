import React from 'react';
import { FormBuilderContext } from '../../../../context/FormBuilderContext';
import { FormStatus } from '../../../../types/enums';

// Mock implementation of the context value
const mockContextValue = {
    // State
    jsonContent: {
        formSettings: {
            name: 'Test Form',
            status: FormStatus.DRAFT,
            settings: { width: 800 },
        },
        fields: [],
        logic: { version: 1, rules: [] },
    },
    activeSubElement: null,

    // Core setters
    setJsonContent: jest.fn(),
    setActiveSubElement: jest.fn(),

    // Form-level operations
    updateFormName: jest.fn(),
    updateFormSettings: jest.fn(),
    setCanvasWidth: jest.fn(),

    // Field operations
    addField: jest.fn(),
    updateField: jest.fn(),
    updateFieldStyleBatch: jest.fn(),
    deleteField: jest.fn(),
    reorderFields: jest.fn(),

    // Logic operations
    addLogicRule: jest.fn(),
    updateLogicRule: jest.fn(),
    deleteLogicRule: jest.fn(),

    // Actions
    saveForm: jest.fn(),
    publishForm: jest.fn(),
    previewForm: jest.fn(),
};

export const MockFormBuilderProvider: React.FC<{ children: React.ReactNode, value?: any }> = ({ children, value }) => {
    return (
        <FormBuilderContext.Provider value={{ ...mockContextValue, ...value }}>
            {children}
        </FormBuilderContext.Provider>
    );
};
