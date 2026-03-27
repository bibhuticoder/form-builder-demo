import React, { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { XMarkIcon } from "@heroicons/react/24/outline"

const DIALOG_CLOSE_ANIMATION_MS = 200

/**
 * Props for the Dialog component
 */
interface DialogProps {
  /** The title/header text displayed at the top of the dialog */
  header: string | ReactNode

  /** Optional: Subtitle/description displayed below the header */
  subtitle?: string | ReactNode

  /** The main content/body of the dialog */
  body: ReactNode

  /** Optional: Custom footer content (e.g., action buttons) */
  footer?: ReactNode

  /** Optional: Callback when the dialog is closed */
  onClose?: () => void

  /** Optional: Whether the dialog should be closable via the X button */
  isCloseable?: boolean

  /** Optional: CSS class for custom styling */
  className?: string

  /** Optional: Whether clicking outside the dialog closes it */
  closeOnBackdropClick?: boolean
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
export const Dialog: React.FC<DialogProps & { isOpen: boolean }> = ({ header, subtitle, body, footer, isOpen, onClose, isCloseable = true, className = "", closeOnBackdropClick = true }) => {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => setIsVisible(true))
      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => {
      setShouldRender(false)
    }, DIALOG_CLOSE_ANIMATION_MS)

    return () => clearTimeout(timeout)
  }, [isOpen])

  /**
   * Prevent background scroll when dialog is open
   * Adds 'overflow-hidden' to body element
   */
  useEffect(() => {
    if (shouldRender) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow
      // Prevent scrolling
      document.body.style.overflow = "hidden"

      // Cleanup: restore original overflow when dialog closes
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [shouldRender])

  // If dialog is not open, don't render anything
  if (!shouldRender) {
    return null
  }

  /**
   * Handle backdrop click to close dialog
   * Only triggers if closeOnBackdropClick is true
   */
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure the click is on the backdrop itself, not the dialog content
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose()
    }
  }

  /**
   * Handle close button click
   */
  const handleClose = () => {
    if (isCloseable && onClose) {
      onClose()
    }
  }

  return createPortal(
    <>
      {/* Backdrop overlay - semi-transparent background */}
      <div className={`fixed inset-0 z-40 bg-black transition-opacity duration-200 ${isVisible ? "bg-opacity-50" : "bg-opacity-0"}`} role="presentation" />

      {/* Dialog container - centered on screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={handleOutsideClick}>
        {/* Dialog panel - the actual popup */}
        <div
          className={`
            bg-white dark:bg-gray-800 rounded-lg shadow-xl
            max-w-md w-full my-8 overflow-visible
            border border-gray-200 dark:border-gray-700
            transition-all duration-200 ease-out flex flex-col
            ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Header section */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            {/* Header content */}
            <div className="flex-1">
              {typeof header === "string" ? <h2 className="text-md font-semibold text-gray-900 dark:text-white">{header}</h2> : header}

              {/* Optional subtitle */}
              {subtitle && (
                <div className="mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
              )}
            </div>

            {/* Close button */}
            {isCloseable && (
              <button onClick={handleClose} className="ml-4 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close dialog">
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Body section */}
          <div className="px-4 py-4 text-gray-700 dark:text-gray-300 overflow-visible min-h-[100px]">{body}</div>

          {/* Footer section */}
          {footer && (
            <div className="px-5 pb-5 pt-2 flex items-center justify-end rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
