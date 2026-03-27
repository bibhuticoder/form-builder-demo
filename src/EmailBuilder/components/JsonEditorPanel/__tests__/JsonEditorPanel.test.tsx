/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JsonEditorPanel } from '../JsonEditorPanel';
import { MockEmailBuilderProvider } from '../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';

// Mock JsonEditor
jest.mock("../JsonEditor", () => ({
    JsonEditor: ({ value, onChange }: any) => (
        <div data-testid="json-editor-content">
            <textarea
                data-testid="json-textarea"
                defaultValue={JSON.stringify(value)}
                onChange={(e) => {
                    try {
                        onChange(JSON.parse(e.target.value));
                    } catch (err) {}
                }}
            />
        </div>
    )
}));

describe('JsonEditorPanel', () => {
    it('renders as a collapsed button initially', () => {
        render(
            <MockEmailBuilderProvider>
                <JsonEditorPanel />
            </MockEmailBuilderProvider>
        );

        const openBtn = screen.getByTitle('Open JSON Editor');
        expect(openBtn).toBeTruthy();
        expect(screen.queryByTestId('json-editor-content')).toBeNull();
    });

    it('expands to show editor when clicked', () => {
        render(
            <MockEmailBuilderProvider>
                <JsonEditorPanel />
            </MockEmailBuilderProvider>
        );

        const openBtn = screen.getByTitle('Open JSON Editor');
        fireEvent.click(openBtn);

        expect(screen.getByTestId('json-editor-content')).toBeTruthy();
        expect(screen.getByText('RAW JSON')).toBeTruthy();
    });

    it('minimizes back to button when close clicked', () => {
        render(
            <MockEmailBuilderProvider>
                <JsonEditorPanel />
            </MockEmailBuilderProvider>
        );

        // Expand
        fireEvent.click(screen.getByTitle('Open JSON Editor'));
        expect(screen.getByTestId('json-editor-content')).toBeTruthy();

        // Minimize
        const minimizeBtn = screen.getByTitle('Minimize');
        fireEvent.click(minimizeBtn);

        expect(screen.queryByTestId('json-editor-content')).toBeNull();
        expect(screen.getByTitle('Open JSON Editor')).toBeTruthy();
    });

    it('calls setJsonContent when textarea changes', () => {
        const setJsonContent = jest.fn();
        const initialJson = { templateSettings: { name: 'Old' }, blocks: [] };
        
        render(
            <MockEmailBuilderProvider value={{ jsonContent: initialJson, setJsonContent }}>
                <JsonEditorPanel />
            </MockEmailBuilderProvider>
        );

        fireEvent.click(screen.getByTitle('Open JSON Editor'));

        const textarea = screen.getByTestId('json-textarea');
        const newJson = { ...initialJson, templateSettings: { name: 'New' } };
        
        fireEvent.change(textarea, { target: { value: JSON.stringify(newJson) } });

        expect(setJsonContent).toHaveBeenCalledWith(newJson);
    });
});
