import React from 'react';
import { EmailBuilderContext } from '../../../../context/EmailBuilderContext';
import { EmailStatus } from '../../../../types/enums';

const mockContextValue = {
    jsonContent: {
        templateSettings: {
            name: 'Test Email',
            subject: 'Test Subject',
            status: EmailStatus.DRAFT,
            settings: { contentWidth: 600, fontFamily: 'Arial, sans-serif' },
        },
        blocks: [],
    },
    activeSubElement: null,
    canvasWidth: 600,
    activeBreakpoint: 'desktop' as const,

    setJsonContent: jest.fn(),
    setActiveSubElement: jest.fn(),
    setCanvasWidth: jest.fn(),

    updateTemplateName: jest.fn(),
    updateTemplateSettings: jest.fn(),

    addBlock: jest.fn(),
    updateBlock: jest.fn(),
    updateBlockStyleBatch: jest.fn(),
    deleteBlock: jest.fn(),
    reorderBlocks: jest.fn(),

    undo: jest.fn(),
    redo: jest.fn(),
    canUndo: false,
    canRedo: false,
    historyPointer: 0,
};

export const MockEmailBuilderProvider: React.FC<{ children: React.ReactNode; value?: any }> = ({ children, value }) => {
    return (
        <EmailBuilderContext.Provider value={{ ...mockContextValue, ...value }}>
            {children}
        </EmailBuilderContext.Provider>
    );
};
