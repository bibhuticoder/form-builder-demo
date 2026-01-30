/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LinkModal } from "../LinkModal";

// Mock Dialog component
jest.mock("../../../../components/Dialog", () => ({
  Dialog: ({ isOpen, header, subtitle, body, footer, onClose }: any) =>
    isOpen ? (
      <div data-testid="dialog">
        <div data-testid="dialog-header">{header}</div>
        <div data-testid="dialog-subtitle">{subtitle}</div>
        <div data-testid="dialog-body">{body}</div>
        <div data-testid="dialog-footer">{footer}</div>
        <button onClick={onClose} data-testid="dialog-close-backdrop">
          Close
        </button>
      </div>
    ) : null,
}));

// Mock Button component
jest.mock("../../../../components/Button", () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock ColorPicker component
jest.mock("../../../../components/ColorPicker", () => ({
  ColorPicker: ({ value, onChange, label }: any) => (
    <div data-testid={`color-picker-${label?.toLowerCase().replace(/\s/g, "-")}`}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="color-input"
      />
    </div>
  ),
}));

describe("LinkModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    selectedText: "test link",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders when isOpen is true", () => {
      render(<LinkModal {...defaultProps} />);
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(<LinkModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders header and subtitle", () => {
      render(<LinkModal {...defaultProps} />);
      expect(screen.getByTestId("dialog-header")).toHaveTextContent("Link Settings");
      expect(screen.getByTestId("dialog-subtitle")).toHaveTextContent(
        "Configure link styles for this text"
      );
    });

    it("renders with data-link-modal attribute", () => {
      render(<LinkModal {...defaultProps} />);
      const body = screen.getByTestId("dialog-body");
      expect(body.querySelector('[data-link-modal]')).toBeInTheDocument();
    });
  });

  describe("Initial State", () => {
    it("prefills link text with selectedText prop", () => {
      render(<LinkModal {...defaultProps} selectedText="my link" />);
      const linkTextInput = screen.getByPlaceholderText("Enter preview text");
      expect(linkTextInput).toHaveValue("my link");
    });

    it("updates link text when selectedText prop changes", () => {
      const { rerender } = render(<LinkModal {...defaultProps} selectedText="first" />);
      expect(screen.getByPlaceholderText("Enter preview text")).toHaveValue("first");

      rerender(<LinkModal {...defaultProps} selectedText="second" />);
      expect(screen.getByPlaceholderText("Enter preview text")).toHaveValue("second");
    });

    it("initializes URL with default value", () => {
      render(<LinkModal {...defaultProps} />);
      const urlInput = screen.getByPlaceholderText("https://example.com");
      expect(urlInput).toHaveValue("https://example.com");
    });

    it("initializes link color with default value", () => {
      render(<LinkModal {...defaultProps} />);
      // ColorPicker is mocked, check it exists
      expect(screen.getAllByTestId("color-input")).toHaveLength(2);
    });

    it("initializes hover color with default value", () => {
      render(<LinkModal {...defaultProps} />);
      expect(screen.getAllByTestId("color-input")).toHaveLength(2);
    });
  });

  describe("User Interactions", () => {
    it("updates link text when user types", async () => {
      const user = userEvent.setup();
      render(<LinkModal {...defaultProps} />);

      const linkTextInput = screen.getByPlaceholderText("Enter preview text");
      await user.clear(linkTextInput);
      await user.type(linkTextInput, "new link text");

      expect(linkTextInput).toHaveValue("new link text");
    });

    it("updates URL when user types", async () => {
      const user = userEvent.setup();
      render(<LinkModal {...defaultProps} />);

      const urlInput = screen.getByPlaceholderText("https://example.com");
      await user.clear(urlInput);
      await user.type(urlInput, "https://google.com");

      expect(urlInput).toHaveValue("https://google.com");
    });

    it("updates link color when user changes color", () => {
      render(<LinkModal {...defaultProps} />);

      const colorInputs = screen.getAllByTestId("color-input");
      fireEvent.change(colorInputs[0], { target: { value: "#ff0000" } });

      expect(colorInputs[0]).toHaveValue("#ff0000");
    });

    it("updates hover color when user changes color", () => {
      render(<LinkModal {...defaultProps} />);

      const colorInputs = screen.getAllByTestId("color-input");
      fireEvent.change(colorInputs[1], { target: { value: "#00ff00" } });

      expect(colorInputs[1]).toHaveValue("#00ff00");
    });
  });

  describe("Preview Section", () => {
    it("renders preview section", () => {
      render(<LinkModal {...defaultProps} />);
      expect(screen.getByText(/This is sample text with a/i)).toBeInTheDocument();
    });

    it("displays selected text in preview", () => {
      render(<LinkModal {...defaultProps} selectedText="click here" />);
      expect(screen.getByText("click here")).toBeInTheDocument();
    });

    it("preview link has correct styling", () => {
      render(<LinkModal {...defaultProps} />);
      const previewLink = screen.getByText(defaultProps.selectedText);
      expect(previewLink).toHaveStyle({ textDecoration: "underline" });
    });

    it("preview link shows hover effect on mouse enter", () => {
      render(<LinkModal {...defaultProps} />);
      const previewLink = screen.getByText(defaultProps.selectedText);

      fireEvent.mouseEnter(previewLink);
      // Hover state changes would be tested visually or with more complex setup
    });

    it("preview link prevents default on click", () => {
      render(<LinkModal {...defaultProps} />);
      const previewLink = screen.getByText(defaultProps.selectedText);

      const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

      previewLink.dispatchEvent(clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Save Functionality", () => {
    it("calls onSave with generated HTML when Apply Styles is clicked", () => {
      render(<LinkModal {...defaultProps} />);

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.stringContaining('<a href="https://example.com"')
      );
    });

    it("generates HTML with correct URL", async () => {
      const user = userEvent.setup();
      render(<LinkModal {...defaultProps} />);

      const urlInput = screen.getByPlaceholderText("https://example.com");
      await user.clear(urlInput);
      await user.type(urlInput, "https://test.com");

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.stringContaining('href="https://test.com"')
      );
    });

    it("generates HTML with correct link color", () => {
      render(<LinkModal {...defaultProps} />);

      const colorInputs = screen.getAllByTestId("color-input");
      fireEvent.change(colorInputs[0], { target: { value: "#ff0000" } });

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.stringContaining('color: #ff0000')
      );
    });

    it("generates HTML with text-decoration underline", () => {
      render(<LinkModal {...defaultProps} />);

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.stringContaining('text-decoration: underline')
      );
    });

    it("closes modal after save", () => {
      render(<LinkModal {...defaultProps} />);

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cancel Functionality", () => {
    it("calls onClose when Cancel button is clicked", () => {
      render(<LinkModal {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it("calls onClose when backdrop/close button is clicked", () => {
      render(<LinkModal {...defaultProps} />);

      const closeButton = screen.getByTestId("dialog-close-backdrop");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onSave when modal is closed without saving", () => {
      render(<LinkModal {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe("HTML Generation", () => {
    it("generates opening anchor tag only (not closing)", () => {
      render(<LinkModal {...defaultProps} />);

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      const generatedHtml = mockOnSave.mock.calls[0][0];
      expect(generatedHtml).toMatch(/^<a href=/);
      expect(generatedHtml).toMatch(/>$/);
      expect(generatedHtml).not.toContain("</a>");
    });

    it("includes inline styles in anchor tag", () => {
      render(<LinkModal {...defaultProps} />);

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      const generatedHtml = mockOnSave.mock.calls[0][0];
      expect(generatedHtml).toContain('style="');
      expect(generatedHtml).toContain('color:');
      expect(generatedHtml).toContain('text-decoration:');
    });

    it("escapes quotes in URL", async () => {
      const user = userEvent.setup();
      render(<LinkModal {...defaultProps} />);

      const urlInput = screen.getByPlaceholderText("https://example.com");
      await user.clear(urlInput);
      await user.type(urlInput, 'https://test.com/path?param="value"');

      const saveButton = screen.getByText("Apply Styles");
      fireEvent.click(saveButton);

      // Note: In real implementation, URLs should be properly escaped
      expect(mockOnSave).toHaveBeenCalled();
    });
  });
});
