/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElementPalette } from '../ElementPalette';

// Mock dnd-kit
jest.mock("@dnd-kit/core", () => ({
    useDraggable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: jest.fn(),
        isDragging: false
    })
}));

describe('ElementPalette', () => {
    it('renders all groups and some elements in expanded mode', () => {
        render(<ElementPalette isCollapsed={false} />);
        
        expect(screen.getByText('Content')).toBeTruthy();
        expect(screen.getByText('Layout')).toBeTruthy();
        expect(screen.getByText('Advanced')).toBeTruthy();
        
        expect(screen.getByText('Heading')).toBeTruthy();
        expect(screen.getByText('Button')).toBeTruthy();
        expect(screen.getByText('Columns')).toBeTruthy();
    });

    it('filters elements based on search query', () => {
        render(<ElementPalette isCollapsed={false} />);
        
        const searchInput = screen.getByPlaceholderText('Search Blocks...');
        fireEvent.change(searchInput, { target: { value: 'Button' } });
        
        expect(screen.getByText('Button')).toBeTruthy();
        expect(screen.queryByText('Heading')).toBeNull();
    });

    it('shows "No elements found" for non-matching search', () => {
        render(<ElementPalette isCollapsed={false} />);
        
        const searchInput = screen.getByPlaceholderText('Search Blocks...');
        fireEvent.change(searchInput, { target: { value: 'XYZ_NONEXISTENT' } });
        
        expect(screen.getByText('No elements found')).toBeTruthy();
    });

    it('renders minimized version when isCollapsed is true', () => {
        render(<ElementPalette isCollapsed={true} />);
        
        // Groups should be vertical text or similar
        // We can check if search input is missing
        expect(screen.queryByPlaceholderText('Search Blocks...')).toBeNull();
        
        // Element labels should NOT be visible as text in minimized mode (it uses title attribute on icons)
        expect(screen.queryByText('Heading')).toBeNull();
        
        // But the icons with titles should be there
        const buttonIcon = screen.getByTitle('Button');
        expect(buttonIcon).toBeTruthy();
    });
});
