import React, { useState, useEffect } from "react";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { ColorPicker } from "../../../components/ColorPicker";

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
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Link Text (Preview)
        </label>
        <input
          type="text"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
          placeholder="Enter preview text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Link Color
          </label>
          <ColorPicker value={linkColor} onChange={setLinkColor} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Hover Color
          </label>
          <ColorPicker value={hoverColor} onChange={setHoverColor} />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview</p>
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
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
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
