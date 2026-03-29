/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { EmailBuilderShell } from '../EmailBuilderShell';
import { MockEmailBuilderProvider } from '../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';
import { EditorView } from '../../types/enums';

// Mock @dnd-kit/sortable
jest.mock("@dnd-kit/sortable", () => ({
    arrayMove: (array: any[], from: number, to: number) => {
        const newArray = array.slice();
        newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
        return newArray;
    },
    SortableContext: ({ children }: any) => children,
    verticalListSortingStrategy: {},
}));

// Mock child components to avoid complex sub-renders
jest.mock("../TopBar/TopBar", () => ({
    TopBar: () => <div data-testid="top-bar">Top Bar</div>
}));
jest.mock("../Canvas/Canvas", () => ({
    Canvas: ({ onSelectBlock }: any) => (
        <div data-testid="canvas" onClick={() => onSelectBlock("block_1")}>
            Canvas
        </div>
    )
}));
jest.mock("../ConfigPanel/ConfigPanel", () => ({
    ConfigPanel: ({ selectedBlockId }: any) => (
        <div data-testid="config-panel">Config Panel: {selectedBlockId || "None"}</div>
    )
}));
jest.mock("../JsonEditorPanel/JsonEditorPanel", () => ({
    JsonEditorPanel: () => <div data-testid="json-editor">JSON Editor</div>
}));

describe('EmailBuilderShell', () => {
    it('renders essential sections in DESIGN view', () => {
        render(
            <MockEmailBuilderProvider value={{ activeView: EditorView.DESIGN }}>
                <EmailBuilderShell />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('top-bar')).toBeTruthy();
        expect(screen.getByTestId('config-panel')).toBeTruthy();
        expect(screen.getByTestId('canvas')).toBeTruthy();
        expect(screen.getByTestId('json-editor')).toBeTruthy();
    });

    it('renders HTML view when activeView is HTML', () => {
        render(
            <MockEmailBuilderProvider value={{ activeView: EditorView.HTML }}>
                <EmailBuilderShell />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('top-bar')).toBeTruthy();
        expect(screen.getByText('HTML SOURCE')).toBeTruthy();
        expect(screen.queryByTestId('canvas')).toBeNull();
        expect(screen.queryByTestId('config-panel')).toBeNull();
    });

    it('manages block selection', () => {
        render(
            <MockEmailBuilderProvider value={{ activeView: EditorView.DESIGN, jsonContent: { blocks: [{ id: 'block_1', type: 'text', style: {} }] } }}>
                <EmailBuilderShell />
            </MockEmailBuilderProvider>
        );

        const canvas = screen.getByTestId('canvas');
        fireEvent.click(canvas); // selects block_1

        expect(screen.getByText('Config Panel: block_1')).toBeTruthy();
    });
});
