import { FormBuilderProvider } from "./context"
import { BuilderShell } from "./components/BuilderShell"
import { JsonEditorPanel } from "./components/JsonEditorPanel"

import exampleData from "./data/example.json"
import { FormDefinition } from "../../foundation"

// Convert example.json to formatted string
const DEFAULT_JSON = JSON.parse(JSON.stringify(exampleData, null, 2)) as FormDefinition

export default function FormBuilder() {
  return (
    <FormBuilderProvider initialContent={DEFAULT_JSON}>
      <div className="w-full">
        <div className="h-[75vh]">
          <BuilderShell />
        </div>
      </div>
      <JsonEditorPanel />
    </FormBuilderProvider>
  )
}
