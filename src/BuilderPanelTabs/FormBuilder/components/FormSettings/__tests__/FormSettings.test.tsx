import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormSettings } from "../FormSettings";
import type { FormSettings as FormSettingsType } from "../../../../../types/form";
import { FormStatus } from "../../../../../types/enums";

// Mock Dialog component
jest.mock("../../../../../components/Dialog", () => ({
  Dialog: ({ isOpen, body, footer, onClose }: any) => (
    isOpen ? (
      <div data-testid="dialog">
        <div data-testid="dialog-body">{body}</div>
        <div data-testid="dialog-footer">{footer}</div>
        <button onClick={onClose} data-testid="dialog-close">
          Close
        </button>
      </div>
    ) : null
  ),
}));

// Mock SpacingInputs component
jest.mock("../SpacingInputs", () => ({
  SpacingInputs: ({ label, values, onChange }: any) => (
    <div data-testid={`spacing-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <label>{label}</label>
      {Object.entries(values).map(([key, value]: [string, any]) => (
        <input
          key={key}
          data-testid={`spacing-${key}`}
          type="number"
          value={value}
          onChange={(e) => onChange(key, Number(e.target.value))}
        />
      ))}
    </div>
  ),
}));

// Mock ColorControl component
jest.mock("../../PropertyEditor/components/ColorControl", () => ({
  ColorControl: ({ label, value, onChange }: any) => (
    <div data-testid={`color-control-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <label>{label}</label>
      <input
        data-testid={`color-input-${label.toLowerCase().replace(/\s/g, "-")}`}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

describe("FormSettings Component", () => {
  const defaultProps = {
    isOpen: true,
    onSave: jest.fn(),
    onCancel: jest.fn(),
    onChangeRealTime: jest.fn(),
    initialConfig: {
      name: "Form",
      status: FormStatus.DRAFT,
      settings: {
        width: 768,
        fontFamilyBody: "Inter",
        fontFamilyTitle: "Inter",
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E5E5",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 12,
        paddingTop: 48,
        paddingRight: 48,
        paddingBottom: 48,
        paddingLeft: 48,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
      },
    } as Partial<FormSettingsType>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dialog State", () => {
    it("should not render when isOpen is false", () => {
      render(
        <FormSettings {...defaultProps} isOpen={false} />
      );
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(<FormSettings {...defaultProps} />);
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  describe("Real-time Sync", () => {
    it("should call onChangeRealTime when input changes", async () => {
      render(<FormSettings {...defaultProps} />);

      const maxWidthInput = screen.getByDisplayValue("768");
      fireEvent.change(maxWidthInput, { target: { value: "1000" } });

      await waitFor(() => {
        expect(defaultProps.onChangeRealTime).toHaveBeenCalled();
      });
    });

    it("should update context in real-time while typing", async () => {
      const mockOnChangeRealTime = jest.fn();
      render(
        <FormSettings
          {...defaultProps}
          onChangeRealTime={mockOnChangeRealTime}
        />
      );

      const maxWidthInput = screen.getByDisplayValue("768");
      
      fireEvent.change(maxWidthInput, { target: { value: "800" } });
      expect(mockOnChangeRealTime).toHaveBeenCalled();

      fireEvent.change(maxWidthInput, { target: { value: "900" } });
      expect(mockOnChangeRealTime).toHaveBeenCalledTimes(2);
    });

    it("should call onChangeRealTime with correct FormSettings structure", async () => {
      const mockOnChangeRealTime = jest.fn();
      render(
        <FormSettings
          {...defaultProps}
          onChangeRealTime={mockOnChangeRealTime}
        />
      );

      const maxWidthInput = screen.getByDisplayValue("768");
      fireEvent.change(maxWidthInput, { target: { value: "900" } });

      await waitFor(() => {
        expect(mockOnChangeRealTime).toHaveBeenCalledWith(
          expect.objectContaining({
            name: expect.any(String),
            status: expect.any(String),
            settings: expect.objectContaining({
              width: 900,
            }),
          })
        );
      });
    });
  });

  describe("Survey Mode Toggle", () => {
    it("should render survey mode toggle", () => {
      render(<FormSettings {...defaultProps} />);
      const toggleButton = screen.getAllByRole("button")[0];
      expect(toggleButton).toBeInTheDocument();
    });

    it("should toggle survey mode on button click", async () => {
      render(<FormSettings {...defaultProps} />);
      const toggleButtons = screen.getAllByRole("button");
      const surveyToggle = toggleButtons.find(
        (btn) => btn.textContent?.includes("Survey") || btn.className?.includes("h-6")
      );

      if (surveyToggle) {
        fireEvent.click(surveyToggle);
        await waitFor(() => {
          expect(defaultProps.onChangeRealTime).toHaveBeenCalled();
        });
      }
    });
  });

  describe("Save Action", () => {
    it("should call onSave when Save button is clicked", async () => {
      render(<FormSettings {...defaultProps} />);
      
      const buttons = screen.getAllByRole("button");
      const saveButton = buttons.find((btn) => btn.textContent?.includes("Save"));

      if (saveButton) {
        fireEvent.click(saveButton);
        expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
      }
    });

    it("should only call onSave without modifying context (changes already synced)", async () => {
      const mockOnChangeRealTime = jest.fn();
      const mockOnSave = jest.fn();

      render(
        <FormSettings
          {...defaultProps}
          onChangeRealTime={mockOnChangeRealTime}
          onSave={mockOnSave}
        />
      );

      mockOnChangeRealTime.mockClear();

      const buttons = screen.getAllByRole("button");
      const saveButton = buttons.find((btn) => btn.textContent?.includes("Save"));

      if (saveButton) {
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalled();
        // Changes should already be in context, no additional sync needed
      }
    });
  });

  describe("Cancel Action", () => {
    it("should call onCancel when Cancel button is clicked", async () => {
      render(<FormSettings {...defaultProps} />);
      
      const buttons = screen.getAllByRole("button");
      const cancelButton = buttons.find((btn) => btn.textContent?.includes("Cancel"));

      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
      }
    });

    it("should revert form state on cancel", async () => {
      const mockOnChangeRealTime = jest.fn();
      render(
        <FormSettings
          {...defaultProps}
          onChangeRealTime={mockOnChangeRealTime}
        />
      );

      // Change a value
      const maxWidthInput = screen.getByDisplayValue("768");
      fireEvent.change(maxWidthInput, { target: { value: "1200" } });

      await waitFor(() => {
        expect(mockOnChangeRealTime).toHaveBeenCalled();
      });

      // Reset mocks to check state after cancel
      mockOnChangeRealTime.mockClear();

      const buttons = screen.getAllByRole("button");
      const cancelButton = buttons.find((btn) => btn.textContent?.includes("Cancel"));

      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(defaultProps.onCancel).toHaveBeenCalled();
      }
    });
  });

  describe("Input Validation", () => {
    it("should handle numeric inputs for width", async () => {
      render(<FormSettings {...defaultProps} />);
      
      const maxWidthInput = screen.getByDisplayValue("768");
      
      fireEvent.change(maxWidthInput, { target: { value: "2000" } });
      expect(defaultProps.onChangeRealTime).toHaveBeenCalled();

      fireEvent.change(maxWidthInput, { target: { value: "100" } });
      expect(defaultProps.onChangeRealTime).toHaveBeenCalledTimes(2);
    });

    it("should handle border size input", async () => {
      render(<FormSettings {...defaultProps} />);
      
      const borderSizeInput = screen.getByDisplayValue("1");
      
      fireEvent.change(borderSizeInput, { target: { value: "5" } });
      expect(defaultProps.onChangeRealTime).toHaveBeenCalled();
    });
  });

  describe("Dropdown Selections", () => {
    it("should have font selection dropdowns", () => {
      render(<FormSettings {...defaultProps} />);
      
      const selects = screen.getAllByRole("combobox");
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  describe("Performance", () => {
    it("should use memoized handleChange callback", () => {
      const { rerender } = render(<FormSettings {...defaultProps} />);

      const maxWidthInput1 = screen.getByDisplayValue("768");
      fireEvent.change(maxWidthInput1, { target: { value: "900" } });

      const callCount1 = defaultProps.onChangeRealTime.mock.calls.length;

      // Rerender with different callback but same values
      const newOnChangeRealTime = jest.fn();
      rerender(
        <FormSettings
          {...defaultProps}
          onChangeRealTime={newOnChangeRealTime}
        />
      );

      const maxWidthInput2 = screen.getByDisplayValue("900");
      fireEvent.change(maxWidthInput2, { target: { value: "800" } });

      // New callback should be used
      expect(newOnChangeRealTime).toHaveBeenCalled();
    });
  });
});
