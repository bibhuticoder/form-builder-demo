import React, { useState, useEffect } from "react";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { ColorControl } from "./PropertyEditor/components/ColorControl";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkHtml: string) => void;
  selectedText: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedText,
}) => {
  const [linkText, setLinkText] = useState(selectedText);
  const [url, setUrl] = useState("https://example.com");
  const [linkColor, setLinkColor] = useState("#5533FF");
  const [hoverColor, setHoverColor] = useState("#4422DD");
  const [isHovering, setIsHovering] = useState(false);

  // Update linkText when selectedText changes
  useEffect(() => {
    setLinkText(selectedText);
  }, [selectedText]);

  const handleSave = () => {
    // Generate HTML anchor tag with inline styles
    const linkHtml = `<a href="${url}" style="color: ${linkColor}; text-decoration: underline;" onclick="this.style.color='${hoverColor}'; return false;">`;
    onSave(linkHtml);
    onClose();
  };

  const body = (
    <div className="space-y-4" data-link-modal>
      {/* Link Text Input */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
          Link Text (Preview)
        </label>
        <input
          type="text"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
          placeholder="Enter preview text"
          className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Color Controls */}
      <div className="grid grid-cols-2 gap-4">
        <ColorControl
          label="Link Color"
          value={linkColor}
          onChange={setLinkColor}
        />
        <ColorControl
          label="Hover Color"
          value={hoverColor}
          onChange={setHoverColor}
        />
      </div>

      {/* Preview */}
      <div className="px-2 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
          Preview
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This is sample text with a{" "}
          <a
            href="#"
            style={{
              color: isHovering ? hoverColor : linkColor,
              textDecoration: "underline",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={(e) => e.preventDefault()}
          >
            {linkText}
          </a>{" "}
          in it.
        </p>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        className="flex items-center gap-2 text-xs"
        variant="secondary"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        className="flex items-center gap-2 text-xs"
        variant="primary"
        onClick={handleSave}
      >
        Apply Styles
      </Button>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      header="Link Settings"
      subtitle="Configure link styles for this text. These colors will apply to this link."
      body={body}
      footer={footer}
      onClose={onClose}
      isCloseable={true}
      closeOnBackdropClick={true}
    />
  );
};
