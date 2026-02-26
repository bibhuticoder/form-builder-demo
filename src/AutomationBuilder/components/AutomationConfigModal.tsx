import { useEffect, useMemo, useState } from "react"
import type { Edge, Node } from "reactflow"
import { Dialog } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"

type Props = {
  isOpen: boolean
  onClose: () => void
  node: Node | null
  edges: Edge[]
  onSave: (nodeId: string, newData: any) => void
}

export function AutomationConfigModal({ isOpen, onClose, node, edges, onSave }: Props) {
  const isSplitTest = node?.data?.label === "Split Test (A/B)"

  const outgoingEdges = useMemo(() => {
    if (!node) return []
    return edges.filter((e) => e.source === node.id && e.sourceHandle !== "right-source" && !e.data?.isLoopBack).sort((a, b) => a.id.localeCompare(b.id))
  }, [edges, node])

  const [label, setLabel] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [weights, setWeights] = useState<number[]>([])

  useEffect(() => {
    setLabel(node?.data?.label || "")
    setSubtitle(node?.data?.subtitle || "")
    if (isSplitTest) {
      const existing = outgoingEdges.map((e) => {
        const raw = (e.label as string) || "50%"
        const n = Number(String(raw).replace("%", ""))
        return Number.isFinite(n) ? n : 50
      })
      setWeights(existing.length ? existing : [50, 50])
    } else {
      setWeights([])
    }
  }, [node, isSplitTest, outgoingEdges])

  const body = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-700 dark:text-slate-200">Label</Label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-primary" />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-700 dark:text-slate-200">Subtitle</Label>
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional" className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-primary" />
      </div>

      {isSplitTest && (
        <div className="space-y-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3">
          <Label className="text-slate-700 dark:text-slate-200">Branch weights (%)</Label>
          <div className="grid grid-cols-2 gap-2">
            {weights.map((w, idx) => (
              <Input
                key={idx}
                type="number"
                min={0}
                max={100}
                value={w}
                className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-primary"
                onChange={(e) => {
                  const next = [...weights]
                  next[idx] = Number(e.target.value)
                  setWeights(next)
                }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">This updates the edge labels (e.g. 50%).</p>
        </div>
      )}
    </div>
  )

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" className="h-8 px-3 text-xs dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" onClick={onClose} size={"sm"}>
        Cancel
      </Button>
      <Button
        variant="primary"
        className="h-8 px-3 text-xs shadow-sm dark:shadow-none"
        size={"sm"}
        onClick={() => {
          if (!node) return
          const newData: any = { label, subtitle }
          if (isSplitTest) newData.weights = weights
          onSave(node.id, newData)
          onClose()
        }}
      >
        Save
      </Button>
    </div>
  )

  return <Dialog isOpen={isOpen} onClose={onClose} header={node?.data?.label || "Step settings"} subtitle={node ? "Configure this step" : undefined} body={body} footer={footer} className="max-w-xl" />
}
