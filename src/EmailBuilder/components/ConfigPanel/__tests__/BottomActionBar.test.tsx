/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BottomActionBar } from '../BottomActionBar';
import { MockEmailBuilderProvider } from '../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';

// Mock EmailSettingsTrigger
jest.mock("../../EmailSettings/EmailSettingsTrigger", () => ({
    EmailSettingsTrigger: () => <div data-testid="settings-trigger">Settings</div>
}));

describe('BottomActionBar', () => {
    it('renders undo/redo icons and settings trigger', () => {
        render(
            <MockEmailBuilderProvider>
                <BottomActionBar isCollapsed={false} parent="element-palette" />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('settings-trigger')).toBeTruthy();
        expect(screen.getByTitle('Undo')).toBeTruthy();
        expect(screen.getByTitle('Redo')).toBeTruthy();
    });

    it('calls undo/redo from context', () => {
        const undo = jest.fn();
        const redo = jest.fn();
        render(
            <MockEmailBuilderProvider value={{ undo, redo, canUndo: true, canRedo: true }}>
                <BottomActionBar isCollapsed={false} parent="element-palette" />
            </MockEmailBuilderProvider>
        );

        fireEvent.click(screen.getByTitle('Undo'));
        expect(undo).toHaveBeenCalled();

        fireEvent.click(screen.getByTitle('Redo'));
        expect(redo).toHaveBeenCalled();
    });

    it('shows icons as disabled when cannot undo/redo', () => {
        render(
            <MockEmailBuilderProvider value={{ canUndo: false, canRedo: false }}>
                <BottomActionBar isCollapsed={false} parent="element-palette" />
            </MockEmailBuilderProvider>
        );

        const undoIcon = screen.getByTestId('undo-icon');
        const redoIcon = screen.getByTestId('redo-icon');

        expect(undoIcon).toHaveClass('cursor-not-allowed');
        expect(redoIcon).toHaveClass('cursor-not-allowed');
    });

    it('applies column layout when collapsed and parent is element-palette', () => {
        render(
            <MockEmailBuilderProvider>
                <BottomActionBar isCollapsed={true} parent="element-palette" />
            </MockEmailBuilderProvider>
        );

        const flexDiv = screen.getByTestId('settings-trigger').parentElement as HTMLElement;
        expect(flexDiv).toHaveClass('flex-col');
    });
});
