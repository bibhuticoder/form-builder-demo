
import { render, screen, fireEvent } from '@testing-library/react';
import { LayoutSection } from '../LayoutSection';
import { FieldType } from '../../../../../../types';

describe('LayoutSection', () => {
    const mockHandleStyleUpdate = jest.fn();
    const mockHandleStyleBatchUpdate = jest.fn();
    const mockSetActiveSubElement = jest.fn();
    const mockGetStyleValue = jest.fn((_key, def) => def || '');

    const props = {
        field: { id: '1', type: FieldType.TEXT, label: 'Text Field', style: { md: {} } } as any,
        capabilities: { supportsInputStyles: true, supportsWindowStyles: true },
        getStyleValue: mockGetStyleValue,
        handleStyleUpdate: mockHandleStyleUpdate,
        handleStyleBatchUpdate: mockHandleStyleBatchUpdate,
        setActiveSubElement: mockSetActiveSubElement
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders width control', () => {
        render(<LayoutSection {...props} />);
        expect(screen.getByText('Width')).toBeTruthy();
    });

    it('renders width options', () => {
        render(<LayoutSection {...props} />);
        expect(screen.getByText('Full Width (100%)')).toBeTruthy();
        expect(screen.getByText('Half Width (50%)')).toBeTruthy();
    });

    it('calls handleStyleUpdate when width changes', () => {
        render(<LayoutSection {...props} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'half' } });
        expect(mockHandleStyleUpdate).toHaveBeenCalledWith('width', 'half');
    });
});
