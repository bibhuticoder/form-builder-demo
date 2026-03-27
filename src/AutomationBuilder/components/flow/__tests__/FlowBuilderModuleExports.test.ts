import { flowNodeTypes } from "../FlowBuilderNodes"
import { flowEdgeTypes } from "../FlowBuilderEdge"

describe("FlowBuilder extracted modules", () => {
  it("exports all expected node types", () => {
    expect(Object.keys(flowNodeTypes).sort()).toEqual(["action", "addStep", "condition", "delay", "end", "loopBack", "placeholder", "trigger"].sort())
  })

  it("exports custom edge type", () => {
    expect(flowEdgeTypes).toHaveProperty("custom")
    expect(flowEdgeTypes.custom).toBeTruthy()
  })
})
