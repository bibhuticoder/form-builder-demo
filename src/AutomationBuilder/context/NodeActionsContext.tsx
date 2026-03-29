import { createContext, useContext } from "react"

export interface NodeActionsContextValue {
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onMove: (id: string) => void
}

export const NodeActionsContext = createContext<NodeActionsContextValue | null>(null)

export function useNodeActions() {
  const ctx = useContext(NodeActionsContext)
  if (!ctx) throw new Error("useNodeActions must be used within NodeActionsProvider")
  return ctx
}
