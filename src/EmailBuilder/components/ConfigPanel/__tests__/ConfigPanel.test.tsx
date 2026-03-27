/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigPanel } from '../ConfigPanel';
import { MockEmailBuilderProvider } from '../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';

// Mock children to simplify
jest.mock("../../PropertyEditor/PropertyEditor", () => ({
    PropertyEditor: ({ onBack }: any) => <div data-testid="property-editor"><button onClick={onBack}>Back</button></div>
}));
jest.mock("../../ElementPalette/ElementPalette", () => ({
   ElementPalette: ({ isCollapsed }: any) => <div data-testid="element-palette">{isCollapsed ? "Collapsed" : "Expanded"}</div>
}));
jest.mock("../BottomActionBar", () => ({ 
    BottomActionBar: () => <div data-testid="bottom-action-bar" /> 
}));

describe('ConfigPanel', () => {
    it('renders PropertyEditor when selectedBlockId is provided', () => {
        const mockOnClearSelection = jest.fn();
        render(
            <MockEmailBuilderProvider>
                <ConfigPanel selectedBlockId="block_1" onClearSelection={mockOnClearSelection} />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('property-editor')).toBeTruthy();
        expect(screen.queryByTestId('element-palette')).toBeNull();

        fireEvent.click(screen.getByText('Back'));
        expect(mockOnClearSelection).toHaveBeenCalled();
    });

    it('renders ElementPalette when no selectedBlockId is provided', () => {
        render(
            <MockEmailBuilderProvider>
                <ConfigPanel />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('element-palette')).toBeTruthy();
        expect(screen.queryByTestId('property-editor')).toBeNull();
    });

    it('toggles collapse state', () => {
        render(
            <MockEmailBuilderProvider>
                <ConfigPanel />
            </MockEmailBuilderProvider>
        );

        const collapseBtn = screen.getByTitle('Collapse sidebar');
        fireEvent.click(collapseBtn);

        expect(screen.getByText('Collapsed')).toBeTruthy();
        expect(screen.getByTitle('Expand sidebar')).toBeTruthy();
    });
});
