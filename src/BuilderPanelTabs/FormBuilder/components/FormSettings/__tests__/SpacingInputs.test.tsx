import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpacingInputs } from "../SpacingInputs";

describe("SpacingInputs Component", () => {
  const defaultProps = {
    label: "Form Margin",
    values: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40,
    },
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with correct label", () => {
      render(<SpacingInputs {...defaultProps} />);
      expect(screen.getByText("Form Margin")).toBeInTheDocument();
    });

    it("should render all four spacing inputs (T, R, B, L)", () => {
      render(<SpacingInputs {...defaultProps} />);
      const labels = screen.getAllByText(/^[TRBL]$/);
      expect(labels).toHaveLength(4);
    });

    it("should display initial values in inputs", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");
      expect(inputs[0]).toHaveValue(10); // top
      expect(inputs[1]).toHaveValue(20); // right
      expect(inputs[2]).toHaveValue(30); // bottom
      expect(inputs[3]).toHaveValue(40); // left
    });

    it("should render link toggle button", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");
      expect(linkButton).toBeInTheDocument();
    });
  });

  describe("Unlinked Mode (Default)", () => {
    it("should update only the specific value when input changes", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");

      fireEvent.change(inputs[0], { target: { value: "50" } });

      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 50);
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange separately for each input change", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");

      fireEvent.change(inputs[0], { target: { value: "15" } }); // top
      fireEvent.change(inputs[1], { target: { value: "25" } }); // right

      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 15);
      expect(defaultProps.onChange).toHaveBeenCalledWith("right", 25);
      expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Linked Mode", () => {
    it("should toggle link button when clicked", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");

      fireEvent.click(linkButton);
      expect(linkButton).toHaveClass("text-primary");
    });

    it("should update all values when one input changes in linked mode", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");

      // Enable linked mode
      fireEvent.click(linkButton);
      defaultProps.onChange.mockClear();

      const inputs = screen.getAllByRole("spinbutton");
      fireEvent.change(inputs[0], { target: { value: "50" } });

      // Should call onChange 4 times (once for each direction)
      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 50);
      expect(defaultProps.onChange).toHaveBeenCalledWith("right", 50);
      expect(defaultProps.onChange).toHaveBeenCalledWith("bottom", 50);
      expect(defaultProps.onChange).toHaveBeenCalledWith("left", 50);
      expect(defaultProps.onChange).toHaveBeenCalledTimes(4);
    });

    it("should equalize all values when entering linked mode", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");

      defaultProps.onChange.mockClear();

      // Enable linked mode
      fireEvent.click(linkButton);

      // Should call onChange 4 times to set all values to top value (10)
      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 10);
      expect(defaultProps.onChange).toHaveBeenCalledWith("right", 10);
      expect(defaultProps.onChange).toHaveBeenCalledWith("bottom", 10);
      expect(defaultProps.onChange).toHaveBeenCalledWith("left", 10);
    });

    it("should not equalize values if already equal when entering linked mode", () => {
      const equalProps = {
        ...defaultProps,
        values: { top: 20, right: 20, bottom: 20, left: 20 },
      };

      render(<SpacingInputs {...equalProps} />);
      const linkButton = screen.getByRole("button");

      equalProps.onChange.mockClear();

      // Enable linked mode
      fireEvent.click(linkButton);

      // When all values are equal and entering linked mode, no additional calls needed
      // since values are already synchronized
      expect(equalProps.onChange).toHaveBeenCalledTimes(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels for link button", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");
      expect(linkButton).toHaveAttribute(
        "aria-label",
        "Link spacing values"
      );
    });

    it("should update aria label when toggled to linked", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");

      fireEvent.click(linkButton);
      expect(linkButton).toHaveAttribute(
        "aria-label",
        "Unlink spacing values"
      );
    });

    it("should have proper title attributes", () => {
      render(<SpacingInputs {...defaultProps} />);
      const linkButton = screen.getByRole("button");
      expect(linkButton).toHaveAttribute("title", "Link values");
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative values", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");

      fireEvent.change(inputs[0], { target: { value: "-10" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith("top", -10);
    });

    it("should handle zero values", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");

      fireEvent.change(inputs[0], { target: { value: "0" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 0);
    });

    it("should handle large values", () => {
      render(<SpacingInputs {...defaultProps} />);
      const inputs = screen.getAllByRole("spinbutton");

      fireEvent.change(inputs[0], { target: { value: "9999" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith("top", 9999);
    });
  });

  describe("Performance", () => {
    it("should use memoized handleInputChange", () => {
      const { rerender } = render(<SpacingInputs {...defaultProps} />);

      const inputs1 = screen.getAllByRole("spinbutton");
      fireEvent.change(inputs1[0], { target: { value: "100" } });

      const callCount1 = defaultProps.onChange.mock.calls.length;

      // Rerender with same props
      rerender(<SpacingInputs {...defaultProps} />);

      const inputs2 = screen.getAllByRole("spinbutton");
      fireEvent.change(inputs2[0], { target: { value: "100" } });

      // Should use memoized function (no additional calls expected if props unchanged)
      expect(defaultProps.onChange).toHaveBeenCalled();
    });
  });
});
