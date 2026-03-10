import React, { useState, useEffect } from "react"
import { Button } from "@/components/Button"
import { Dialog } from "@/components/Dialog"
import { CodeBracketIcon, PaperAirplaneIcon, QuestionMarkCircleIcon, PaintBrushIcon } from "@heroicons/react/24/outline"
import { useEmailBuilder } from "../../context"
import { EmailSettingsTrigger } from "../EmailSettings/EmailSettingsTrigger"
import { EditorView } from "../../types/enums"

const Switch = ({ checked, onChange, id }: { checked: boolean; onChange: (checked: boolean) => void; id?: string }) => (
  <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}>
    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
  </button>
)

export const TopBar: React.FC = () => {
  const { jsonContent, updateTemplateName, updateTemplateSettings, activeView, setActiveView, historyPointer } = useEmailBuilder()
  const templateName = jsonContent?.templateSettings?.name || "Untitled Email"
  const sendAsPlainText = jsonContent?.templateSettings?.sendAsPlainText || false
  const updatedAt = jsonContent?.templateSettings?.updatedAt

  const [isTestSendOpen, setIsTestSendOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Initialize lastSavedPointer to 0 initially, assuming loaded content is an unsaved state until loaded from DB 
  // For this local builder, we consider the initial load as "not changed yet". 
  const [lastSavedPointer, setLastSavedPointer] = useState<number>(0)
  const isDraft = historyPointer !== lastSavedPointer

  const [timeAgoStr, setTimeAgoStr] = useState<string>("Never saved")

  useEffect(() => {
    const update = () => {
      if (!updatedAt) {
        setTimeAgoStr("Never saved")
        return
      }
      const mins = Math.floor((Date.now() - updatedAt) / 60000)
      if (mins < 1) setTimeAgoStr("Just now")
      else if (mins < 60) setTimeAgoStr(`${mins}m ago`)
      else {
        const hours = Math.floor(mins / 60)
        if (hours < 24) setTimeAgoStr(`${hours}h ago`)
        else setTimeAgoStr(`${Math.floor(hours / 24)}d ago`)
      }
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [updatedAt])

  const handleSaveAndExit = () => {
    updateTemplateSettings({ updatedAt: Date.now() })
    setLastSavedPointer(historyPointer + 1)
  }

  return (
    <div className="sticky top-0 z-20">
      <header className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 shadow-sm z-10 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <input value={templateName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplateName(e.target.value)} className="shadow border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary dark:focus:border-primary focus:outline-none font-semibold w-[200px] px-2 h-7 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md transition-colors" placeholder="Email Name" />
            <EmailSettingsTrigger />
          </div>
          <span className="text-[10px] text-slate-500 ml-1 mt-0.5">
            {isDraft ? "Draft - " : ""}
            {updatedAt ? `Last saved ${timeAgoStr}` : timeAgoStr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4 border-r pr-4 dark:border-gray-600">
            <label htmlFor="plain-text" className="text-xs font-medium cursor-pointer text-gray-700 dark:text-gray-300">
              Send as Plain Text
            </label>
            <Switch
              id="plain-text"
              checked={sendAsPlainText}
              onChange={(checked) => {
                updateTemplateSettings({ sendAsPlainText: checked })
                if (checked) setActiveView(EditorView.DESIGN)
              }}
            />
            <div className="relative flex items-center" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
              <QuestionMarkCircleIcon className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-help transition-colors" />
              {showTooltip && <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-primary text-white text-xs rounded shadow-lg ring-1 ring-primary/60 z-50">Sending your first email as plain text can significantly improve deliverability rates. It feels more personal and is less likely to be flagged as promotion or spam by email providers.</div>}
            </div>
          </div>

          <Button variant="transparent" className={`gap-2 h-8 text-xs border ${activeView === EditorView.HTML ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-800"} text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600`} onClick={() => setActiveView(activeView === EditorView.HTML ? EditorView.DESIGN : EditorView.HTML)} disabled={sendAsPlainText}>
            {activeView === EditorView.HTML ? <PaintBrushIcon className="w-4 h-4" /> : <CodeBracketIcon className="w-4 h-4" />}
            {activeView === EditorView.HTML ? "Design View" : "HTML View"}
          </Button>

          <Button variant="secondary" className="gap-2 h-8 text-xs" onClick={() => setIsTestSendOpen(true)}>
            <PaperAirplaneIcon className="w-4 h-4" /> Test Send
          </Button>

          <Dialog
            isOpen={isTestSendOpen}
            onClose={() => setIsTestSendOpen(false)}
            header="Send Test Email"
            subtitle="Send a preview of this email to yourself or team members."
            body={
              <div className="py-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium leading-none dark:text-gray-300">To Email(s)</label>
                  <input className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:text-gray-200" placeholder="name@company.com, other@company.com" />
                  <p className="text-xs text-slate-500 dark:text-gray-400">Separate multiple emails with commas</p>
                </div>
              </div>
            }
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" className="h-8 text-xs" onClick={() => setIsTestSendOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="h-8 text-xs" onClick={() => setIsTestSendOpen(false)}>
                  Send Test
                </Button>
              </div>
            }
          />

          <Button variant="primary" className="h-8 text-xs ml-2" onClick={handleSaveAndExit}>
            Save & Exit
          </Button>
        </div>
      </header>
    </div>
  )
}
