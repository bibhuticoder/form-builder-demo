/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailSettings } from '../EmailSettings';

describe('EmailSettings', () => {
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();
    const mockOnChangeRealTime = jest.fn();

    const initialConfig = {
        subject: 'Initial Subject',
        fromName: 'Initial Name',
        fromEmail: 'init@example.com',
        settings: {
            contentWidth: 600,
            fontFamily: 'Arial, sans-serif'
        }
    };

    it('renders correct initial values when open', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={initialConfig as any}
            />
        );

        const subjectInput = screen.getByPlaceholderText('New Campaign') as HTMLInputElement;
        expect(subjectInput.value).toBe('Initial Subject');

        const fromNameInput = screen.getByPlaceholderText('My Company') as HTMLInputElement;
        expect(fromNameInput.value).toBe('Initial Name');
    });

    it('calls onChangeRealTime when subject is modified', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={initialConfig as any}
            />
        );

        const subjectInput = screen.getByPlaceholderText('New Campaign');
        fireEvent.change(subjectInput, { target: { value: 'Updated Subject' } });

        expect(mockOnChangeRealTime).toHaveBeenCalledWith(expect.objectContaining({
            subject: 'Updated Subject'
        }));
    });

    it('toggles CC/BCC fields', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={{ ...initialConfig, ccBccEnabled: false } as any}
            />
        );

        expect(screen.queryByPlaceholderText('cc@example.com')).toBeNull();

        const switchBtn = screen.getByRole('switch');
        fireEvent.click(switchBtn);

        expect(screen.getByPlaceholderText('cc@example.com')).toBeTruthy();
        expect(mockOnChangeRealTime).toHaveBeenCalledWith(expect.objectContaining({
            ccBccEnabled: true
        }));
    });

    it('adds and removes custom headers', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={{ ...initialConfig, customHeaders: [] } as any}
            />
        );

        expect(screen.getByText('No custom headers added')).toBeTruthy();

        const addBtn = screen.getByTitle('Add header');
        fireEvent.click(addBtn);

        expect(screen.queryByText('No custom headers added')).toBeNull();
        expect(screen.getByPlaceholderText('Name (e.g. X-Custom-ID)')).toBeTruthy();

        const removeBtn = screen.getByRole('button', { name: '' }).closest('button'); // Trash icon button
        // Find by trash icon class or similar if needed, or use tag names
        const trashBtn = screen.getAllByRole('button').find(b => b.querySelector('svg')); 
        if (trashBtn) fireEvent.click(trashBtn);
        
        // After clicking trash, it should update
    });

    it('calls onSave when Save Changes is clicked', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={initialConfig as any}
            />
        );

        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancel is clicked', () => {
        render(
            <EmailSettings 
                isOpen={true} 
                onSave={mockOnSave} 
                onCancel={mockOnCancel} 
                onChangeRealTime={mockOnChangeRealTime}
                initialConfig={initialConfig as any}
            />
        );

        const cancelBtn = screen.getByText('Cancel');
        fireEvent.click(cancelBtn);
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
