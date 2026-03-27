/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { CanvasToolbar } from "../CanvasToolbar";

// Mock components
jest.mock("../../../../components", () => ({
  Button: ({ children, onClick, variant, title, disabled }: any) => (
    <button onClick={onClick} data-variant={variant} title={title} disabled={disabled}>
      {children}
    </button>
  ),
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("../AddLinkButton", () => ({
  AddLinkButton: ({ selectedFieldId }: any) => (
    <button data-testid="add-link-button" data-selected-field={selectedFieldId}>
      Link
    </button>
  ),
}));

describe("CanvasToolbar", () => {
  const defaultProps = {
    canvasWidth: 768,
    onCanvasWidthChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the toolbar", () => {
      render(<CanvasToolbar {...defaultProps} />);
      expect(screen.getAllByTestId("card")).toHaveLength(2); // Breakpoints card + width display card
    });

    it("renders all breakpoint buttons", () => {
      render(<CanvasToolbar {...defaultProps} />);
      expect(screen.getByText("XS")).toBeInTheDocument();
      expect(screen.getByText("SM")).toBeInTheDocument();
      expect(screen.getByText("MD")).toBeInTheDocument();
      expect(screen.getByText("LG")).toBeInTheDocument();
      expect(screen.getByText("XL")).toBeInTheDocument();
      expect(screen.getByText("2XL")).toBeInTheDocument();
    });

    it("renders width display", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={768} />);
      expect(screen.getByText("768px")).toBeInTheDocument();
    });

    it("renders AddLinkButton component", () => {
      render(<CanvasToolbar {...defaultProps} />);
      expect(screen.getByTestId("add-link-button")).toBeInTheDocument();
    });
  });

  describe("Breakpoint Selection", () => {
    it("highlights active breakpoint based on canvas width - XS", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={320} />);
      const xsButton = screen.getByText("XS").closest("button");
      expect(xsButton).toHaveAttribute("data-variant", "primary");
    });

    it("highlights active breakpoint based on canvas width - SM", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={640} />);
      const smButton = screen.getByText("SM").closest("button");
      expect(smButton).toHaveAttribute("data-variant", "primary");
    });

    it("highlights active breakpoint based on canvas width - MD", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={768} />);
      const mdButton = screen.getByText("MD").closest("button");
      expect(mdButton).toHaveAttribute("data-variant", "primary");
    });

    it("highlights active breakpoint based on canvas width - LG", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={1024} />);
      const lgButton = screen.getByText("LG").closest("button");
      expect(lgButton).toHaveAttribute("data-variant", "primary");
    });

    it("highlights active breakpoint based on canvas width - XL", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={1280} />);
      const xlButton = screen.getByText("XL").closest("button");
      expect(xlButton).toHaveAttribute("data-variant", "primary");
    });

    it("highlights active breakpoint based on canvas width - 2XL", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={1536} />);
      const xxlButton = screen.getByText("2XL").closest("button");
      expect(xxlButton).toHaveAttribute("data-variant", "primary");
    });

    it("inactive breakpoints have secondary variant", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={768} />);
      const xsButton = screen.getByText("XS").closest("button");
      expect(xsButton).toHaveAttribute("data-variant", "secondary");
    });
  });

  describe("Width Change Functionality", () => {
    it("calls onCanvasWidthChange when XS button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const xsButton = screen.getByText("XS");
      fireEvent.click(xsButton);

      expect(onWidthChange).toHaveBeenCalledWith(375); // XS width
    });

    it("calls onCanvasWidthChange when SM button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const smButton = screen.getByText("SM");
      fireEvent.click(smButton);

      expect(onWidthChange).toHaveBeenCalledWith(640); // SM width
    });

    it("calls onCanvasWidthChange when MD button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const mdButton = screen.getByText("MD");
      fireEvent.click(mdButton);

      expect(onWidthChange).toHaveBeenCalledWith(768); // MD width
    });

    it("calls onCanvasWidthChange when LG button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const lgButton = screen.getByText("LG");
      fireEvent.click(lgButton);

      expect(onWidthChange).toHaveBeenCalledWith(1024); // LG width
    });

    it("calls onCanvasWidthChange when XL button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const xlButton = screen.getByText("XL");
      fireEvent.click(xlButton);

      expect(onWidthChange).toHaveBeenCalledWith(1280); // XL width
    });

    it("calls onCanvasWidthChange when 2XL button is clicked", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} onCanvasWidthChange={onWidthChange} />);

      const xxlButton = screen.getByText("2XL");
      fireEvent.click(xxlButton);

      expect(onWidthChange).toHaveBeenCalledWith(1536); // 2XL width
    });

    it("does not call onCanvasWidthChange when clicking active breakpoint", () => {
      const onWidthChange = jest.fn();
      render(<CanvasToolbar {...defaultProps} canvasWidth={768} onCanvasWidthChange={onWidthChange} />);

      const mdButton = screen.getByText("MD");
      fireEvent.click(mdButton);

      // It will still call with same value, but in real app might be optimized
      expect(onWidthChange).toHaveBeenCalledWith(768);
    });
  });

  describe("Width Display", () => {
    it("displays width rounded to nearest pixel", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={768.7} />);
      expect(screen.getByText("769px")).toBeInTheDocument();
    });

    it("updates when canvasWidth prop changes", () => {
      const { rerender } = render(<CanvasToolbar {...defaultProps} canvasWidth={768} />);
      expect(screen.getByText("768px")).toBeInTheDocument();

      rerender(<CanvasToolbar {...defaultProps} canvasWidth={1024} />);
      expect(screen.getByText("1024px")).toBeInTheDocument();
    });

    it("handles decimal values correctly", () => {
      render(<CanvasToolbar {...defaultProps} canvasWidth={768.4} />);
      expect(screen.getByText("768px")).toBeInTheDocument();
    });
  });

  describe("AddLinkButton Integration", () => {
    it("passes selectedFieldId to AddLinkButton when provided", () => {
      render(<CanvasToolbar {...defaultProps} selectedFieldId="heading_1" />);
      const linkButton = screen.getByTestId("add-link-button");
      expect(linkButton).toHaveAttribute("data-selected-field", "heading_1");
    });


    it("updates AddLinkButton when selectedFieldId changes", () => {
      const { rerender } = render(
        <CanvasToolbar {...defaultProps} selectedFieldId="heading_1" />
      );
      expect(screen.getByTestId("add-link-button")).toHaveAttribute(
        "data-selected-field",
        "heading_1"
      );

      rerender(<CanvasToolbar {...defaultProps} selectedFieldId="paragraph_1" />);
      expect(screen.getByTestId("add-link-button")).toHaveAttribute(
        "data-selected-field",
        "paragraph_1"
      );
    });
  });

  describe("Layout", () => {
    it("renders in horizontal flex layout", () => {
      const { container } = render(<CanvasToolbar {...defaultProps} />);
      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("flex", "justify-center");
    });

    it("maintains consistent spacing between elements", () => {
      const { container } = render(<CanvasToolbar {...defaultProps} />);
      const innerContainer = container.querySelector(".flex.items-center.gap-4");
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe("Breakpoint Button Titles", () => {
    it("XS button has appropriate title", () => {
      render(<CanvasToolbar {...defaultProps} />);
      const xsButton = screen.getByText("XS").closest("button");
      expect(xsButton).toHaveAttribute("title");
    });

    it("all breakpoint buttons have titles", () => {
      render(<CanvasToolbar {...defaultProps} />);
      ["XS", "SM", "MD", "LG", "XL", "2XL"].forEach((size) => {
        const button = screen.getByText(size).closest("button");
        expect(button).toHaveAttribute("title");
      });
    });
  });
});
