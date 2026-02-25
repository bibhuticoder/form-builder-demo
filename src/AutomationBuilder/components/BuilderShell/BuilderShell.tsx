import type { ReactNode } from "react"

type BuilderShellProps = {
  children: ReactNode
}

export function BuilderShell({ children }: BuilderShellProps) {
  return <div className="h-full w-full overflow-hidden bg-slate-50">{children}</div>
}
