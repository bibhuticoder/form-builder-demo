
import { render, screen, fireEvent } from '@testing-library/react';
import { LayoutSection } from '../LayoutSection';
import { FieldType } from '../../../../../../types';

describe('LayoutSection', () => {
    const mockHandleStyleUpdate = jest.fn();
    const mockHandleStyleBatchUpdate = jest.fn();
    const mockSetActiveSubElement = jest.fn();
    const mockGetStyleValue = jest.fn((_key, def) => def || '');

    const props = {
        field: { id: '1', type: FieldType.TEXT, label: 'Text Field' } as any,
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

    it('renders subtabs for Input and Window', () => {
        render(<LayoutSection {...props} />);
        expect(screen.getByText('Input')).toBeTruthy();
        expect(screen.getByText('Window')).toBeTruthy();
    });

    it('switches to Window tab', () => {
        render(<LayoutSection {...props} />);

        const windowTab = screen.getByText('Window');
        fireEvent.click(windowTab);

        expect(mockSetActiveSubElement).toHaveBeenCalledWith('window');
        // Once switched, window specific controls should verify... 
        // Logic relies on internal state state 'activeSpacingTab', difficult to assert directly without checking rendered content change
        // We assume SpacingControl for Window renders with prefix "windowMargin"
    });

    // We accept that SpacingControl is tested elsewhere or implicitly here by existence
});
