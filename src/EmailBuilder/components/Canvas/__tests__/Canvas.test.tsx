/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '../Canvas';
import { MockEmailBuilderProvider } from '../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider';

// Mock dnd-kit
jest.mock("@dnd-kit/core", () => ({
    useDroppable: () => ({
        setNodeRef: jest.fn(),
        isOver: false
    })
}));

// Mock @dnd-kit/sortable
jest.mock("@dnd-kit/sortable", () => ({
    arrayMove: (array: any[], from: number, to: number) => {
        const newArray = array.slice();
        newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
        return newArray;
    },
    SortableContext: ({ children }: any) => children,
    verticalListSortingStrategy: {},
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: jest.fn(),
        transform: null,
        transition: null,
    }),
}));

// Mock child components
jest.mock("../CanvasToolbar", () => ({
    CanvasToolbar: () => <div data-testid="canvas-toolbar">Toolbar</div>
}));

jest.mock("../EmptyState", () => ({
    EmptyState: () => <div data-testid="empty-state">Empty</div>
}));

jest.mock("../../EmailRenderer/EmailRenderer", () => ({
    __esModule: true,
    default: () => <div data-testid="email-renderer">Renderer</div>
}));

describe('Canvas', () => {
    it('renders toolbar and empty state when no blocks', () => {
        render(
            <MockEmailBuilderProvider value={{ jsonContent: { blocks: [] } }}>
                <Canvas />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('canvas-toolbar')).toBeTruthy();
        expect(screen.getByTestId('empty-state')).toBeTruthy();
        expect(screen.queryByTestId('email-renderer')).toBeNull();
    });

    it('renders email renderer when there are blocks', () => {
        const blocks = [{ id: '1', type: 'text', style: {} }];
        render(
            <MockEmailBuilderProvider value={{ jsonContent: { blocks } }}>
                <Canvas />
            </MockEmailBuilderProvider>
        );

        expect(screen.getByTestId('email-renderer')).toBeTruthy();
        expect(screen.queryByTestId('empty-state')).toBeNull();
    });

    it('sets correct width from context', () => {
        render(
            <MockEmailBuilderProvider value={{ canvasWidth: 400 }}>
                <Canvas />
            </MockEmailBuilderProvider>
        );

        const widthContainer = screen.getByTestId('canvas-width-container');
        expect(widthContainer.style.width).toBe('400px');
    });

    it('calls onSelectBlock(null) when clicking outside blocks', () => {
        const mockOnSelectBlock = jest.fn();
        render(
            <MockEmailBuilderProvider>
                <Canvas onSelectBlock={mockOnSelectBlock} />
            </MockEmailBuilderProvider>
        );

        const container = screen.getByTestId('canvas-container');
        
        fireEvent.click(container);
        expect(mockOnSelectBlock).toHaveBeenCalledWith(null);
    });

    it('applies mobile styles when activeBreakpoint is mobile', () => {
        render(
            <MockEmailBuilderProvider value={{ activeBreakpoint: 'mobile' }}>
                <Canvas />
            </MockEmailBuilderProvider>
        );
        
        const container = screen.getByTestId('canvas-main');
        expect(container).toHaveClass('rounded-2xl', 'border-4');
    });
});
