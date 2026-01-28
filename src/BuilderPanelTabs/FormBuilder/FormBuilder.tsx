import { FormBuilderProvider } from "./context"
import { BuilderShell } from "./components/BuilderShell"
import exampleData from "./data/example.json"
import { FormDefinition } from "../../foundation"

// Convert example.json to formatted string
const DEFAULT_JSON = JSON.parse(JSON.stringify(exampleData, null, 2)) as FormDefinition

export default function FormBuilder() {
  return (
    <FormBuilderProvider initialContent={DEFAULT_JSON}>
      <BuilderShell />
    </FormBuilderProvider>
  )
}
