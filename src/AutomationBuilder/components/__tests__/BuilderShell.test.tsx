import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { BuilderShell } from "../BuilderShell"

describe("BuilderShell component", () => {
  function renderShell() {
    return render(
      <MemoryRouter>
        <BuilderShell>
          <div>Canvas</div>
        </BuilderShell>
      </MemoryRouter>,
    )
  }

  it("shows default automation name for new automation", () => {
    renderShell()
    expect(screen.getByDisplayValue("New Automation")).toBeInTheDocument()
  })

  it("syncs active status between header chip and settings switch", () => {
    renderShell()

    fireEvent.click(screen.getByTitle("Toggle active status"))
    expect(screen.getByText("Inactive")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /settings/i }))
    const switches = screen.getAllByRole("switch")
    expect(switches[0]).toHaveAttribute("aria-checked", "false")

    fireEvent.click(switches[0])
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("disables send window controls when send window switch is off", () => {
    renderShell()
    fireEvent.click(screen.getByRole("button", { name: /settings/i }))

    const switches = screen.getAllByRole("switch")
    const sendWindowSwitch = switches[4]
    fireEvent.click(sendWindowSwitch)

    const startLabel = screen.getByText("Start")
    let sendWindowWrapper: HTMLElement | null = startLabel.parentElement
    while (sendWindowWrapper && !sendWindowWrapper.className.includes("space-y-2")) {
      sendWindowWrapper = sendWindowWrapper.parentElement
    }

    expect(sendWindowWrapper).toHaveClass("opacity-50")
    expect(sendWindowWrapper).toHaveClass("pointer-events-none")
  })

  it("toggles day selection classes for send window day buttons", () => {
    renderShell()
    fireEvent.click(screen.getByRole("button", { name: /settings/i }))

    const dayButtons = screen.getAllByRole("button", { name: "M" })
    const mondayButton = dayButtons[0]
    expect(mondayButton.className).toContain("bg-primary")

    fireEvent.click(mondayButton)
    expect(mondayButton.className).not.toContain("bg-primary")
  })
})
