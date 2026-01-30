import React, { useState, useEffect } from "react"
import { LinkIcon } from "@heroicons/react/24/outline"
import { LinkModal } from "../LinkModal"
import { useFormBuilder } from "../../context"
import { Button } from "../../../../components"
import { FieldType } from "../../../../types"

export interface AddLinkButtonProps {
  selectedFieldId?: string | null
}

export const AddLinkButton: React.FC<AddLinkButtonProps> = ({ selectedFieldId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const { updateField, jsonContent } = useFormBuilder()

  // Listen for text selection
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      if (!selection) return

      // Check if selection is from within the modal
      const selectedNode = selection.anchorNode
      if (selectedNode) {
        const modalElement = document.querySelector('[data-link-modal]')
        if (modalElement?.contains(selectedNode as Node)) {
          return  // Ignore selections from modal
        }
      }

      const text = selection?.toString().trim()
      
      if (text && text.length > 0) {
        setSelectedText(text)
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [])

  const handleLinkClick = () => {
    if (selectedText) {
      setIsModalOpen(true)
    }
  }

  const handleSave = (linkHtml: string) => {
    if (!selectedFieldId) return

    const field = jsonContent.fields.find(f => f.id === selectedFieldId)
    if (!field || !("label" in field)) return

    // Replace selected text with anchor HTML
    const currentLabel = field.label || ""
    const newLabel = currentLabel.replace(selectedText, `${linkHtml}${selectedText}</a>`)

    updateField(selectedFieldId, { label: newLabel })
    setIsModalOpen(false)
    setSelectedText("")  // Reset selected text
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedText("")  // Reset selected text when modal closes
  }

  // Check if selected field supports links (heading/paragraph only)
  const selectedField = jsonContent.fields.find(f => f.id === selectedFieldId)
  const supportsLinks = selectedField && (
    selectedField.type === FieldType.HEADING || 
    selectedField.type === FieldType.PARAGRAPH
  )
  const isDisabled = !selectedText || !supportsLinks

  return (
    <>
      <Button 
        variant="secondary" 
        title="Add Link"
        onClick={handleLinkClick}
        disabled={isDisabled}
      >
        <LinkIcon className="h-4 w-4 text-gray-900 dark:text-white" />
      </Button>

      <LinkModal
        isOpen={isModalOpen}
        selectedText={selectedText}
        onSave={handleSave}
        onClose={handleModalClose}
      />
    </>
  )
}