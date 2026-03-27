import { EmailBuilderProvider } from "./context";
import { EmailBuilderShell } from "./components/EmailBuilderShell";

import emptyCanvas from "./data/empty-canvas.json";
import { EmailTemplate } from "./types";

const DEFAULT_TEMPLATE = JSON.parse(JSON.stringify(emptyCanvas, null, 2)) as EmailTemplate;

export default function EmailBuilder() {
  return (
    <EmailBuilderProvider initialContent={DEFAULT_TEMPLATE}>
      <div className="w-full">
        <div style={{ height: `calc(100vh - 7rem)` }}>
          <EmailBuilderShell />
        </div>
      </div>
    </EmailBuilderProvider>
  );
}
