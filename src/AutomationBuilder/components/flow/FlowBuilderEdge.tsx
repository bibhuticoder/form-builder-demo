import { memo } from "react"
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow"
import type { EdgeProps } from "reactflow"

const CustomEdge = memo(({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data, label }: EdgeProps) => {
  const [edgePath, , labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY })
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.isSplitTest && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${targetX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div className="bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm px-3 py-1 flex items-center justify-center min-w-[40px]">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{(label as string) || "50%"}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})

CustomEdge.displayName = "CustomEdge"

export const flowEdgeTypes = { custom: CustomEdge }
