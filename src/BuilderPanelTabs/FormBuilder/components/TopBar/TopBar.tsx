import React, { useState } from "react"
import { Button, TvModal } from "../../../../components"
import { EyeIcon, CodeBracketIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline"
import { useFormBuilder } from "../../context"

export const TopBar: React.FC = () => {
  const { jsonContent, updateFormName } = useFormBuilder();
  const formName = jsonContent?.formSettings?.name || "Untitled Form";

  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePreview = () => {
    alert("This feature is coming soon");
  };

  const handlePublish = () => {
    alert("This feature is coming soon");
  };

  const handleEmbed = () => {
    setIsEmbedModalOpen(true);
  };

  const handleCopyCode = () => {
    // Generate mock formId from name: "My Form" -> "my-form"
    const mockId = (jsonContent.formSettings?.name || "untitled-form")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    const formId = (jsonContent as any).id || mockId;

    const code = `<div id="cleave-form-${formId}"></div>
<script src="https://cdn.cleave.dev/form-loader.js"></script>
<script>
  CleaveForm.init({
    formId: "${formId}",
    target: "#cleave-form-${formId}"
  });
</script>`;

    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="sticky top-0 z-20">
      <header className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 shadow-sm z-10 shrink-0">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <input value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormName(e.target.value)} className="shadow border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary dark:focus:border-primary focus:outline-none font-semibold w-[200px] px-2 h-7 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md transition-colors" placeholder="Form Name" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleEmbed} className="flex items-center gap-2 text-xs">
            <CodeBracketIcon className="w-4 h-4" />
            Embed
          </Button>

          <Button variant="secondary" onClick={handlePreview} className="flex items-center gap-2 text-xs">
            <EyeIcon className="w-4 h-4" />
            Preview
          </Button>

          <Button variant="primary" onClick={handlePublish} className="flex items-center gap-2 text-xs">
            Publish
          </Button>
        </div>
      </header>

      <TvModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        title="Embed Form"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Copy and paste this code into your website to embed the form.
          </p>

          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              {(() => {
                const mockId = (jsonContent.formSettings?.name || "untitled-form")
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-');
                const formId = (jsonContent as any).id || mockId;

                return `<div id="cleave-form-${formId}"></div>
<script src="https://cdn.cleave.dev/form-loader.js"></script>
<script>
  CleaveForm.init({
    formId: "${formId}",
    target: "#cleave-form-${formId}"
  });
</script>`;
              })()}
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title="Copy to clipboard"
            >
              {isCopied ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsEmbedModalOpen(false)} className="text-xs">
              Close
            </Button>
            <Button variant="primary" onClick={handleCopyCode} className="text-xs flex items-center gap-1">
              {isCopied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </div>
      </TvModal>
    </div>
  )
}
