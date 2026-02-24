import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Props for the Dialog component
 */
interface DialogProps {
  /** The title/header text displayed at the top of the dialog */
  header: string | ReactNode;

  /** Optional: Subtitle/description displayed below the header */
  subtitle?: string | ReactNode;

  /** The main content/body of the dialog */
  body: ReactNode;

  /** Optional: Custom footer content (e.g., action buttons) */
  footer?: ReactNode;

  /** Optional: Callback when the dialog is closed */
  onClose?: () => void;

  /** Optional: Whether the dialog should be closable via the X button */
  isCloseable?: boolean;

  /** Optional: CSS class for custom styling */
  className?: string;

  /** Optional: Whether clicking outside the dialog closes it */
  closeOnBackdropClick?: boolean;
}

/**
 * Dialog Component
 *
 * A reusable popup/modal component that can be triggered to show/hide content.
 * Provides a header, body, and optional footer with a close button.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open Dialog</button>
 *     <Dialog
 *       isOpen={isOpen}
 *       header="Confirm Action"
 *       body="Are you sure you want to proceed?"
 *       onClose={() => setIsOpen(false)}
 *     />
 *   </>
 * );
 */
export const Dialog: React.FC<DialogProps & { isOpen: boolean }> = ({
  header,
  subtitle,
  body,
  footer,
  isOpen,
  onClose,
  isCloseable = true,
  className = "",
  closeOnBackdropClick = true,
}) => {
  /**
   * Prevent background scroll when dialog is open
   * Adds 'overflow-hidden' to body element
   */
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = "hidden";

      // Cleanup: restore original overflow when dialog closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // If dialog is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  /**
   * Handle backdrop click to close dialog
   * Only triggers if closeOnBackdropClick is true
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure the click is on the backdrop itself, not the dialog content
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  /**
   * Handle close button click
   */
  const handleClose = () => {
    if (isCloseable && onClose) {
      onClose();
    }
  };

  return createPortal(
    <>
      {/* Backdrop overlay - semi-transparent background */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-200"
        onClick={handleBackdropClick}
        role="presentation"
      />

      {/* Dialog container - centered on screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dialog panel - the actual popup */}
        <div
          className={`
            bg-white dark:bg-gray-800 rounded-lg shadow-lg
            max-w-lg w-full max-h-[90vh] overflow-y-auto
            border border-gray-200 dark:border-gray-700
            ${className}
          `}
          role="dialog"
          aria-modal="true"
        >
          {/* Header section */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            {/* Header content */}
            <div className="flex-1">
              {typeof header === "string" ? (
                <h2 className="text-md font-semibold text-gray-900 dark:text-white">
                  {header}
                </h2>
              ) : (
                header
              )}

              {/* Optional subtitle */}
              {subtitle && (
                <div className="mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                </div>
              )}
            </div>

            {/* Close button */}
            {isCloseable && (
              <button
                onClick={handleClose}
                className="ml-4 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Body section - main content */}
          <div className="px-3 py-4 text-gray-700 dark:text-gray-300">
            {body}
          </div>

          {/* Footer section - optional actions */}
          {footer && (
            <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};
