import React, { useState, useEffect } from "react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"
import { validateFormDefinition, type FormDefinition, type ValidationError } from "./foundation"


export interface JsonEditorProps {
  value: FormDefinition
  onChange: (value: FormDefinition) => void
  onSave?: () => void
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, onSave }) => {
  const [localValue, setLocalValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: FormDefinition) => {
    setLocalValue(newValue)
    onChange(newValue)

    // Validate form definition
    if (newValue) {
      try {
        const parsed = newValue as FormDefinition
        const result = validateFormDefinition(parsed)

        if (result.valid) {
          setIsValid(true)
          setValidationErrors([])
        } else {
          setIsValid(false)
          setValidationErrors(result.errors)
        }
      } catch (error) {
        setIsValid(false)
        setValidationErrors([
          {
            path: "root",
            message: error instanceof Error ? error.message : "Unknown error",
            type: "syntax",
          },
        ])
      }
    } else {
      setIsValid(true)
      setValidationErrors([])
    }
  }

  return (
    <div className="flex flex-col h-fit">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-700 dark:text-gray-700">JSON Editor</span>
          {isValid ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-600">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-600" />
              <span className="text-xs">Valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-600">
              <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-600" />
              <span className="text-xs">Invalid</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="flex-1 relative overflow-auto" style={{ maxHeight: "600px" }}>
        <textarea value={JSON.stringify(localValue, null, 2)} onChange={(e) => handleChange(JSON.parse(e.target.value))} className="w-full h-full min-h-[400px] p-4 font-mono text-xs text-slate-900 dark:text-gray-900 bg-neutral-50 dark:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary resize-none border-none dark:border-gray-300" placeholder="Paste your JSON here..." rows={30} spellCheck={false} />
      </div>

      {/* Validation Errors at Bottom */}
      {!isValid && validationErrors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md max-h-32 overflow-y-auto">
          <div className="flex items-start gap-2 mb-2">
            <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">Validation Errors:</span>
          </div>
          <ul className="space-y-2 ml-6">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary dark:text-primary font-semibold">{error.path}:</span>
                  <span className="text-red-700 dark:text-red-400">{error.message}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
