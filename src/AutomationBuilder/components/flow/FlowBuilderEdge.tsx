import { memo } from "react"
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow"
import type { EdgeProps } from "reactflow"
import { cn } from "@/lib/utils"

const CustomEdge = memo(({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data, label }: EdgeProps) => {
  const [edgePath, , labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY })
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${sourceX + (targetX - sourceX) * 0.5}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
          >
            <div className={cn(
               "rounded-full border shadow-sm px-2.5 py-1 flex items-center justify-center min-w-[36px]",
               data?.isSplitTest ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" :
               data?.isCondition ? "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50" :
               "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            )}>
              <span className={cn(
                 "text-[9px] font-bold",
                 data?.isCondition ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"
              )}>
                 {label}
              </span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})

CustomEdge.displayName = "CustomEdge"

export const flowEdgeTypes = { custom: CustomEdge }
