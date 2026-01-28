/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import BuilderFieldControls from '../BuilderFieldControls';
import { FieldType } from '../../../../types';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';

describe('BuilderFieldControls', () => {
  const mockField = {
    id: 'test-field',
    type: FieldType.TEXT,
    label: 'Test Field',
    name: 'test_field',
    required: false,
  };
  
  const mockOnDelete = jest.fn();
  const mockDragHandleProps = {
    attributes: {
      role: 'button',
      'aria-describedby': 'drag-handle',
      tabIndex: 0,
    } as DraggableAttributes,
    listeners: {
      onPointerDown: jest.fn(),
      onKeyDown: jest.fn(),
    } as DraggableSyntheticListeners,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render delete button', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('test-field');
  });

  it('should not render delete button when showDelete is false', () => {
    render(
      <BuilderFieldControls
        field={mockField}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });

  it('should render move button with drag handle props', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
        dragHandleProps={mockDragHandleProps}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    const moveButton = screen.getByTitle('Move');
    expect(moveButton).toBeInTheDocument();
    expect(moveButton).toHaveAttribute('role', 'button');
    expect(moveButton).toHaveAttribute('tabIndex', '0');
  });

  it('should spread drag attributes on move button', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
        dragHandleProps={mockDragHandleProps}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    const moveButton = screen.getByTitle('Move');
    expect(moveButton.getAttribute('aria-describedby')).toBe('drag-handle');
  });

  it('should call drag listener on pointer down', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
        dragHandleProps={mockDragHandleProps}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    const moveButton = screen.getByTitle('Move');
    fireEvent.pointerDown(moveButton);

    expect(mockDragHandleProps.listeners?.onPointerDown).toHaveBeenCalled();
  });

  it('should render move button even without drag handle props', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    expect(screen.getByTitle('Move')).toBeInTheDocument();
  });

  it('should render both delete and move buttons', () => {
    render(
      <BuilderFieldControls
        field={mockField}
        onDelete={mockOnDelete}
        dragHandleProps={mockDragHandleProps}
      >
        <div>Test Content</div>
      </BuilderFieldControls>
    );

    expect(screen.getByTitle('Delete')).toBeInTheDocument();
    expect(screen.getByTitle('Move')).toBeInTheDocument();
  });
});
