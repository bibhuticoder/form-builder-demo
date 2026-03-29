import { useEffect, useState } from "react"
import { useAutomationBuilderContext } from "../context/AutomationBuilderContext"

export function LastSavedIndicator() {
  const { savedAt, isDirty } = useAutomationBuilderContext()
  const [text, setText] = useState<string>("Not saved")

  useEffect(() => {
    if (isDirty || !savedAt) {
      setText("Not saved")
      return
    }

    const update = () => {
      const diff = Date.now() - new Date(savedAt).getTime()
      const seconds = Math.floor(diff / 1000)
      if (seconds < 10) setText("Just now")
      else if (seconds < 60) setText("Seconds ago")
      else if (seconds < 3600) setText(`${Math.floor(seconds / 60)}m ago`)
      else setText(`${Math.floor(seconds / 3600)}h ago`)
    }

    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [savedAt, isDirty])

  return <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{text}</div>
}
