import { fireEvent, render, screen } from "@testing-library/react"
import { FlowBuilderSidebar } from "../FlowBuilderSidebar"
import { TOOLBOX_ITEMS } from "../../../constants/toolbox"

describe("FlowBuilderSidebar", () => {
  const firstAvailableItem = TOOLBOX_ITEMS.flatMap((section) => section.items).find((item) => !item.comingSoon)

  if (!firstAvailableItem) {
    throw new Error("Expected at least one available toolbox item for tests")
  }

  it("calls onCollapse when collapse button is clicked", () => {
    const onCollapse = jest.fn()
    render(<FlowBuilderSidebar isCollapsed={false} onCollapse={onCollapse} onExpand={jest.fn()} />)

    fireEvent.click(screen.getAllByRole("button")[0])

    expect(onCollapse).toHaveBeenCalledTimes(1)
  })

  it("calls onExpand when expand button is clicked in collapsed mode", () => {
    const onExpand = jest.fn()
    render(<FlowBuilderSidebar isCollapsed onCollapse={jest.fn()} onExpand={onExpand} />)

    fireEvent.click(screen.getAllByRole("button")[0])

    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it("filters items based on search query", () => {
    render(<FlowBuilderSidebar isCollapsed={false} onCollapse={jest.fn()} onExpand={jest.fn()} />)

    expect(screen.getByText(firstAvailableItem.label)).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "__no_matching_toolbox_item__" } })

    expect(screen.queryByText(firstAvailableItem.label)).not.toBeInTheDocument()
  })

  it("sets expected drag payload for toolbox items", () => {
    render(<FlowBuilderSidebar isCollapsed={false} onCollapse={jest.fn()} onExpand={jest.fn()} />)

    const row = screen.getByText(firstAvailableItem.label).closest("[draggable='true']") as HTMLElement
    expect(row).toBeTruthy()

    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: "",
    } as unknown as DataTransfer

    fireEvent.dragStart(row, { dataTransfer })

    expect(dataTransfer.setData).toHaveBeenCalledWith("application/reactflow/type", firstAvailableItem.type)
    expect(dataTransfer.setData).toHaveBeenCalledWith("application/reactflow/label", firstAvailableItem.label)
    expect(dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      JSON.stringify({ type: firstAvailableItem.type, label: firstAvailableItem.label }),
    )
    expect(dataTransfer.effectAllowed).toBe("move")
  })
})
