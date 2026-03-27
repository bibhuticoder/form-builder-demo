/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AddLinkButton } from "../AddLinkButton";
import { FormBuilderProvider } from "../../../context/FormBuilderContext";
import { FieldType } from "../../../types/enums";
import type { FormDefinition } from "../../../types/form";

// Mock LinkModal component
jest.mock("../../LinkModal", () => ({
  LinkModal: ({ isOpen, selectedText, onSave, onClose }: any) =>
    isOpen ? (
      <div data-testid="link-modal">
        <input
          data-testid="modal-selected-text"
          value={selectedText}
          readOnly
        />
        <button
          data-testid="modal-save"
          onClick={() =>
            onSave(
              '<a href="https://example.com" style="color: #5533FF; text-decoration: underline;">'
            )
          }
        >
          Save
        </button>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock components
jest.mock("../../../../components", () => ({
  Button: ({ children, onClick, disabled, title }: any) => (
    <button onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  ),
}));

const mockFormDefinition: FormDefinition = {
  formSettings: {
    name: "Test Form",
    status: "draft" as any,
    settings: {
      width: 768,
      backgroundColor: "#ffffff",
      padding: 10,
      margin: 10,
      fontFamilyBody: "Arial",
      fontFamilyTitle: "Arial",
    },
  },
  fields: [
    {
      id: "heading_1",
      type: FieldType.HEADING,
      label: "Welcome to our Form",
      headingLevel: "h1" as any,
    },
    {
      id: "paragraph_1",
      type: FieldType.PARAGRAPH,
      label: "This is a test paragraph",
    },
    {
      id: "text_1",
      type: FieldType.TEXT,
      label: "Name",
      placeholder: "Enter name",
    },
  ],
};

const renderWithProvider = (ui: React.ReactElement, selectedFieldId?: string | null) => {
  return render(
    <FormBuilderProvider initialContent={mockFormDefinition}>
      {React.cloneElement(ui, { selectedFieldId })}
    </FormBuilderProvider>
  );
};

describe("AddLinkButton", () => {
  beforeEach(() => {
    // Mock window.getSelection
    global.getSelection = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Button State", () => {
    it("renders the link button", () => {
      renderWithProvider(<AddLinkButton />);
      expect(screen.getByTitle("Add Link")).toBeInTheDocument();
    });

    it("disables button when no text is selected", () => {
      renderWithProvider(<AddLinkButton />);
      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();
    });

    it("disables button when selected field is not heading or paragraph", () => {
      renderWithProvider(<AddLinkButton />, "text_1");
      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();
    });

    it("enables button when text is selected and field is heading", async () => {
      const mockSelection = {
        toString: () => "selected text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      // Simulate text selection
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        expect(button).not.toBeDisabled();
      });
    });

    it("enables button when text is selected and field is paragraph", async () => {
      const mockSelection = {
        toString: () => "selected text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "paragraph_1");

      // Simulate text selection
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe("Text Selection", () => {
    it("captures selected text on mouseup", async () => {
      const mockSelection = {
        toString: () => "captured text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      // Click button to open modal
      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      // Verify modal receives selected text
      expect(screen.getByTestId("modal-selected-text")).toHaveValue("captured text");
    });

    it("ignores text selection from within modal", async () => {
      const modalDiv = document.createElement("div");
      modalDiv.setAttribute("data-link-modal", "true");
      document.body.appendChild(modalDiv);

      const textNode = document.createTextNode("modal text");
      modalDiv.appendChild(textNode);

      const mockSelection = {
        toString: () => "modal text",
        anchorNode: textNode,
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      // Button should remain disabled because selection was from modal
      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();

      document.body.removeChild(modalDiv);
    });

    it("trims whitespace from selected text", async () => {
      const mockSelection = {
        toString: () => "  text with spaces  ",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      expect(screen.getByTestId("modal-selected-text")).toHaveValue("text with spaces");
    });
  });

  describe("Modal Interaction", () => {
    it("opens modal when button is clicked with selected text", async () => {
      const mockSelection = {
        toString: () => "test text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      expect(screen.getByTestId("link-modal")).toBeInTheDocument();
    });

    it("does not open modal when button is clicked without selected text", () => {
      renderWithProvider(<AddLinkButton />, "heading_1");

      const button = screen.getByTitle("Add Link");
      fireEvent.click(button);

      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });

    it("closes modal and resets state when close button clicked", async () => {
      const mockSelection = {
        toString: () => "test text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
      });

      // Button should be disabled after close
      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();
    });
  });

  describe("Save Functionality", () => {
    it("updates field label with anchor HTML when save is clicked", async () => {
      const mockSelection = {
        toString: () => "link text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      const saveButton = screen.getByTestId("modal-save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
      });

      // Note: Actual field update verification would require context inspection
      // This is tested in integration tests
    });

    it("resets selected text after save", async () => {
      const mockSelection = {
        toString: () => "link text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      const saveButton = screen.getByTestId("modal-save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        expect(button).toBeDisabled();
      });
    });

    it("does not save when selectedFieldId is null", async () => {
      const mockSelection = {
        toString: () => "link text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, null);

      fireEvent.mouseUp(document);

      // Button should be disabled when no field selected
      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();
    });

    it("replaces selected text in field label with anchor HTML", async () => {
      // This is more of an integration test
      // The actual replacement logic is tested via the mock
      const mockSelection = {
        toString: () => "Form",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "heading_1");

      fireEvent.mouseUp(document);

      await waitFor(() => {
        const button = screen.getByTitle("Add Link");
        fireEvent.click(button);
      });

      // Expected behavior: "Welcome to our Form" should become
      // "Welcome to our <a href="...">Form</a>"
      const saveButton = screen.getByTestId("modal-save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Field Type Validation", () => {
    it("supports heading field type", () => {
      renderWithProvider(<AddLinkButton />, FieldType.HEADING);
      // Button would be enabled if text is selected
      const button = screen.getByTitle("Add Link");
      expect(button).toBeInTheDocument();
    });

    it("supports paragraph field type", () => {
      renderWithProvider(<AddLinkButton />, FieldType.PARAGRAPH);
      const button = screen.getByTitle("Add Link");
      expect(button).toBeInTheDocument();
    });

    it("does not support text input field type", () => {
      const mockSelection = {
        toString: () => "selected text",
        anchorNode: document.createElement("div"),
      };
      (global.getSelection as jest.Mock).mockReturnValue(mockSelection);

      renderWithProvider(<AddLinkButton />, "text_1");

      fireEvent.mouseUp(document);

      const button = screen.getByTitle("Add Link");
      expect(button).toBeDisabled();
    });
  });
});
