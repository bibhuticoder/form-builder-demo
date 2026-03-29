/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react"
import { TopBar } from "../TopBar"
import { MockEmailBuilderProvider } from "../../EmailRenderer/elements/__tests__/MockEmailBuilderProvider"
import { EditorView } from "../../../types/enums"

describe("TopBar", () => {
  it("renders template name from context", () => {
    const jsonContent = {
      templateSettings: { name: "My Special Email" },
    }
    render(
      <MockEmailBuilderProvider value={{ jsonContent }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const input = screen.getByPlaceholderText("Email Name") as HTMLInputElement
    expect(input.value).toBe("My Special Email")
  })

  it("calls updateTemplateName when input changes", () => {
    const updateTemplateName = jest.fn()
    render(
      <MockEmailBuilderProvider value={{ updateTemplateName }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const input = screen.getByPlaceholderText("Email Name")
    fireEvent.change(input, { target: { value: "New Name" } })
    expect(updateTemplateName).toHaveBeenCalledWith("New Name")
  })

  it("toggles plain text mode via switch", () => {
    const updateTemplateSettings = jest.fn()
    const jsonContent = {
      templateSettings: { sendAsPlainText: false },
    }
    render(
      <MockEmailBuilderProvider value={{ jsonContent, updateTemplateSettings }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const switchBtn = screen.getByRole("switch")
    fireEvent.click(switchBtn)
    expect(updateTemplateSettings).toHaveBeenCalledWith({ sendAsPlainText: true })
  })

  it("toggles HTML view when button is clicked", () => {
    const setActiveView = jest.fn()
    render(
      <MockEmailBuilderProvider value={{ activeView: EditorView.DESIGN, setActiveView }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const htmlViewBtn = screen.getByText("HTML View")
    fireEvent.click(htmlViewBtn)
    expect(setActiveView).toHaveBeenCalledWith(EditorView.HTML)
  })

  it("shows Design View button when in HTML view", () => {
    render(
      <MockEmailBuilderProvider value={{ activeView: EditorView.HTML }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    expect(screen.getByText("Design View")).toBeTruthy()
  })

  it("disables view toggle if sendAsPlainText is true", () => {
    const jsonContent = {
      templateSettings: { sendAsPlainText: true },
    }
    render(
      <MockEmailBuilderProvider value={{ jsonContent }}>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const btn = screen.getByText("HTML View").closest("button")
    expect(btn).toBeDisabled()
  })

  it("opens test send dialog on click", () => {
    render(
      <MockEmailBuilderProvider>
        <TopBar />
      </MockEmailBuilderProvider>
    )
    const testSendBtn = screen.getByText("Test Send")
    fireEvent.click(testSendBtn)
    expect(screen.getByText("Send Test Email")).toBeTruthy()
    expect(screen.getByPlaceholderText("name@company.com, other@company.com")).toBeTruthy()
  })

  it("calls updateTemplateSettings with updatedAt when clicking Save & Exit", () => {
     const updateTemplateSettings = jest.fn();
     render(
       <MockEmailBuilderProvider value={{ updateTemplateSettings }}>
         <TopBar />
       </MockEmailBuilderProvider>
     )
     const saveBtn = screen.getByText("Save & Exit");
     fireEvent.click(saveBtn);
     expect(updateTemplateSettings).toHaveBeenCalledWith(expect.objectContaining({
         updatedAt: expect.any(Number)
     }));
  });

  it("displays 'Just now' if updatedAt is recent", () => {
      const jsonContent = {
          templateSettings: { updatedAt: Date.now() }
      };
      render(
          <MockEmailBuilderProvider value={{ jsonContent }}>
              <TopBar />
          </MockEmailBuilderProvider>
      );
      expect(screen.getByText(/Last saved Just now/i)).toBeTruthy();
  });
});
