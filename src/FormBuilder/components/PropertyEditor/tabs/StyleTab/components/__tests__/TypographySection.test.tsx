
import { render, screen, fireEvent } from '@testing-library/react';
import { TypographySection } from '../TypographySection';
import { FieldType } from '../../../../../../types';

describe('TypographySection', () => {
    const mockHandleStyleUpdate = jest.fn();
    const mockGetStyleValue = jest.fn((_key, def) => def || '');
    const mockSetActiveSubElement = jest.fn();

    const props = {
        field: { id: '1', type: FieldType.TEXT, label: 'Text Field' } as any,
        capabilities: { supportsInputStyles: true, supportsLabelStyles: true },
        getStyleValue: mockGetStyleValue,
        handleStyleUpdate: mockHandleStyleUpdate,
        setActiveSubElement: mockSetActiveSubElement
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders font family control', () => {
        render(<TypographySection {...props} />);
        expect(screen.getByText('Font Family')).toBeTruthy();
    });

    it('switches between Input and Label typography tabs', () => {
        render(<TypographySection {...props} />);

        const labelTab = screen.getByText('Label');
        fireEvent.click(labelTab);

        expect(mockSetActiveSubElement).toHaveBeenCalledWith('label');
    });

    it('calls update on font size change', () => {
        mockGetStyleValue.mockReturnValue(14);
        render(<TypographySection {...props} />);

        const sizeInput = screen.getByPlaceholderText('14');
        fireEvent.change(sizeInput, { target: { value: '16' } });

        // Defaults to 'input' tab
        expect(mockHandleStyleUpdate).toHaveBeenCalledWith('inputFontSize', '16');
    });
});
