import { render, screen, fireEvent } from "@testing-library/react"
import { LayoutSection } from "../LayoutSection"
import { FieldType } from "../../../../../../types"

describe("LayoutSection", () => {
  const mockHandleStyleUpdate = jest.fn()
  const mockGetStyleValue = jest.fn((_key, def) => def || "")
  const mockUpdateField = jest.fn()

  const props = {
    field: { id: "1", type: FieldType.TEXT, label: "Text Field", style: { md: {} } } as any,
    capabilities: { supportsAllignment: false },
    getStyleValue: mockGetStyleValue,
    handleStyleUpdate: mockHandleStyleUpdate,
    activeBreakpoint: "md" as const,
    updateField: mockUpdateField,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders width control", () => {
    render(<LayoutSection {...props} />)
    expect(screen.getByText("Width")).toBeTruthy()
  })

  it("renders alignment control", () => {
    const alignProps = { ...props, capabilities: { supportsAllignment: true }, field: { ...props.field, style: { md: { width: "quarter" } } } as any }
    render(<LayoutSection {...alignProps} />)
    expect(screen.getByText("Alignment")).toBeTruthy()
    expect(screen.getByText("Left")).toBeTruthy()
    expect(screen.getByText("Center")).toBeTruthy()
    expect(screen.getByText("Right")).toBeTruthy()
  })

  it("renders width options", () => {
    render(<LayoutSection {...props} />)
    expect(screen.getByText("Full Width (100%)")).toBeTruthy()
    expect(screen.getByText("Half Width (50%)")).toBeTruthy()
  })

  it("calls handleStyleUpdate when width changes", () => {
    render(<LayoutSection {...props} />)
    const select = screen.getByLabelText("Width")
    fireEvent.change(select, { target: { value: "half" } })
    expect(mockHandleStyleUpdate).toHaveBeenCalledWith("width", "half")
  })

  it("calls handleStyleUpdate when alignment changes", () => {
    const alignProps = { ...props, capabilities: { supportsAllignment: true }, field: { ...props.field, style: { md: { width: "quarter" } } } as any }
    render(<LayoutSection {...alignProps} />)
    const btn = screen.getByText("Center")
    fireEvent.click(btn)
    expect(mockHandleStyleUpdate).toHaveBeenCalledWith("alignment", "center")
  })

  it("renders StyleSwitcher inside LayoutSection", () => {
    render(<LayoutSection {...props} />)
    expect(screen.getByText("Apply all")).toBeTruthy()
    expect(screen.getByText("XS")).toBeTruthy()
    expect(screen.getByText("MD")).toBeTruthy()
  })
})
