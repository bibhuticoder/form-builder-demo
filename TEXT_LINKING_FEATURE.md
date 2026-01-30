# Text Linking Feature - Architecture & Implementation

## Overview

This feature allows users to select text within heading and paragraph fields, add an HTML anchor tag with custom styling (link color, hover color, URL), and have it rendered as clickable HTML in the form.

**Key Principle:** Store rich HTML content (with `<a>` tags) directly in the field's `label` property without modifying the JSON structure.

---

## Architecture & Approach

### Design Decision: HTML in Label Field

Instead of:
- Adding a separate `links` property to field types
- Using complex data structures to track link metadata

We simply:
- Store HTML anchor tags inline in the `label` string
- Example: `"Heading <a href='url' style='color: blue; text-decoration: underline;'>rest</a>"`
- Render using `dangerouslySetInnerHTML` (no sanitization for simplicity)

**Advantages:**
- Minimal JSON structure changes
- Simple string replacement for adding/removing links
- Easy to export as HTML
- Single source of truth (the label string)

---

## Components Involved

### 1. **AddLinkButton.tsx**
**Location:** `src/BuilderPanelTabs/FormBuilder/components/Canvas/AddLinkButton.tsx`

**Responsibility:**
- Detect text selection in the canvas
- Track which field is selected
- Manage modal open/close state
- Handle saving the anchor HTML to the field
- Reset state when modal closes

**Key Logic:**
```typescript
// Text selection detection
const handleMouseUp = () => {
  const selection = window.getSelection()
  const selectedNode = selection.anchorNode
  
  // Ignore selections from within the modal
  const modalElement = document.querySelector('[data-link-modal]')
  if (modalElement?.contains(selectedNode as Node)) {
    return
  }
  
  setSelectedText(selection.toString().trim())
}

// Save the anchor HTML to field label
const handleSave = (linkHtml: string) => {
  const currentLabel = field.label || ""
  const newLabel = currentLabel.replace(selectedText, `${linkHtml}${selectedText}</a>`)
  updateField(selectedFieldId, { label: newLabel })
}
```

**Props:**
- `selectedFieldId: string | null` — which field is currently selected

**State:**
- `isModalOpen: boolean` — whether LinkModal is visible
- `selectedText: string` — the text user selected in canvas

---

### 2. **LinkModal.tsx**
**Location:** `src/BuilderPanelTabs/FormBuilder/components/LinkModal.tsx`

**Responsibility:**
- Display form to configure link (URL, text, colors)
- Show live preview of the link with hover effect
- Generate the anchor HTML tag
- Pass back generated HTML on save

**Key Output:**
```typescript
const linkHtml = `<a href="${url}" style="color: ${linkColor}; text-decoration: underline;">`
```

This is an **opening tag** that gets:
- Combined with selected text: `${linkHtml}${selectedText}`
- Closed with: `</a>`

**Props:**
- `isOpen: boolean` — visibility
- `selectedText: string` — text to be linked (prefilled in inputs)
- `onSave: (linkHtml: string) => void` — called with opening anchor tag
- `onClose: () => void` — called when modal closes

**Features:**
- Text input (prefilled with selected text)
- URL input
- Color pickers for link color and hover color
- Live preview showing styled link

---

### 3. **CanvasToolbar.tsx**
**Location:** `src/BuilderPanelTabs/FormBuilder/components/Canvas/CanvasToolbar.tsx`

**Responsibility:**
- Display toolbar with breakpoint buttons, width display, and link button
- Pass `selectedFieldId` to AddLinkButton

**Props Added:**
- `selectedFieldId?: string | null` — passed from Canvas component

---

### 4. **Canvas.tsx**
**Location:** `src/BuilderPanelTabs/FormBuilder/components/Canvas/Canvas.tsx`

**Responsibility:**
- Render the form canvas
- Track which field is selected
- Pass `selectedFieldId` to CanvasToolbar

**Props:**
- `selectedFieldId?: string | null` — from parent component (FormBuilder or BuilderShell)

---

## Data Flow

### Step 1: User Selects Text in Canvas
```
User highlights text in heading/paragraph field
    ↓
Canvas triggers mouseup event
    ↓
AddLinkButton.handleMouseUp() listener fires
    ↓
window.getSelection() captures text
    ↓
Check if selection is from modal (ignore if yes)
    ↓
setSelectedText(text)
```

### Step 2: User Clicks Link Button
```
AddLinkButton renders with disabled={!selectedText || !supportsLinks}
    ↓
selectedText is set + field is heading/paragraph → button enabled
    ↓
User clicks button
    ↓
handleLinkClick() → setIsModalOpen(true)
    ↓
LinkModal opens with selectedText prop
```

### Step 3: User Configures Link in Modal
```
User enters:
- Link text (auto-filled with selected text)
- URL (default: https://example.com)
- Link Color (default: #5533FF)
- Hover Color (default: #4422DD)
    ↓
Preview updates in real-time showing styled link
    ↓
User clicks "Apply Styles"
```

### Step 4: Save Anchor HTML to Field Label
```
LinkModal.handleSave() calls onSave with generated anchor opening tag
    ↓
AddLinkButton.handleSave() receives linkHtml
    ↓
Find the selected field in jsonContent.fields
    ↓
Get current label string
    ↓
Replace selected text with: ${linkHtml}${selectedText}</a>
    ↓
Call updateField(selectedFieldId, { label: newLabel })
    ↓
Context updates state
    ↓
Canvas re-renders with new label containing HTML
```

### Step 5: Modal Closes & State Resets
```
Modal closes (via onClose callback)
    ↓
handleModalClose() resets:
  - setIsModalOpen(false)
  - setSelectedText("")
    ↓
Button disabled again (no selected text)
    ↓
User can select new text for next link
```

---

## HTML Generation Example

### Input
- Selected text: `"rest"`
- URL: `"https://example.com"`
- Link color: `"#5533FF"`
- Hover color: `"#4422DD"`

### Output
```html
<a href="https://example.com" style="color: #5533FF; text-decoration: underline;">rest</a>
```

### Stored in Field
```typescript
{
  id: "heading_123",
  type: "heading",
  label: "Heading <a href=\"https://example.com\" style=\"color: #5533FF; text-decoration: underline;\">rest</a>",
  headingLevel: "h1",
  style: { /* ... */ }
}
```

---

## Text Selection Detection - Modal Isolation

**Problem:** When user types in modal inputs, `window.getSelection()` also captured that text.

**Solution:** Add `data-link-modal` attribute to modal body wrapper and check if selection originated from within modal:

```typescript
const handleMouseUp = () => {
  const selection = window.getSelection()
  const selectedNode = selection.anchorNode
  
  // Ignore selections from within the modal
  const modalElement = document.querySelector('[data-link-modal]')
  if (modalElement?.contains(selectedNode as Node)) {
    return  // Exit early, don't update selectedText
  }
  
  // Process normal canvas selections
  setSelectedText(selection.toString().trim())
}
```

---

## Field Type Support

Link button is **only enabled** for:
- `FieldType.HEADING`
- `FieldType.PARAGRAPH`

Check in AddLinkButton:
```typescript
const supportsLinks = selectedField && (
  selectedField.type === FieldType.HEADING || 
  selectedField.type === FieldType.PARAGRAPH
)
```

Input fields, buttons, etc. cannot have text links added via this UI (though they technically could have HTML in their label if manually edited).

---

## Future Enhancements (Not Implemented)

1. **Edit existing links** — detect and allow modification of already-linked text
2. **Remove individual links** — add UI to strip specific `<a>` tags
3. **Multiple links per field** — currently supports unlimited, but no UI to manage them
4. **Link preview rendering** — currently stored as string, need to render in BuilderHeading/BuilderParagraph with `dangerouslySetInnerHTML`
5. **Reset button** — strip all `<a>` tags from field (regex: `/<a[^>]*>(.*?)<\/a>/g` → `$1`)

---

## Context Integration

**useFormBuilder() provides:**
- `jsonContent` — current form definition with all fields
- `updateField(fieldId, updates)` — persist field changes to context

**Prop Chain:**
```
Canvas (has selectedFieldId)
  ↓ passes selectedFieldId
CanvasToolbar
  ↓ passes selectedFieldId
AddLinkButton (uses selectedFieldId)
  ↓ opens
LinkModal (receives selectedText, calls onSave/onClose)
```

---

## Files Created/Modified

**Created:**
- `src/BuilderPanelTabs/FormBuilder/components/Canvas/AddLinkButton.tsx`
- `src/BuilderPanelTabs/FormBuilder/components/LinkModal.tsx`

**Modified:**
- `src/BuilderPanelTabs/FormBuilder/components/Canvas/CanvasToolbar.tsx` — added selectedFieldId prop, render AddLinkButton
- `src/BuilderPanelTabs/FormBuilder/components/Canvas/Canvas.tsx` — pass selectedFieldId to CanvasToolbar

---

## Testing Scenario

1. Create form with heading field
2. Select portion of heading text (e.g., select the word "rest" in "Welcome rest")
3. Link button becomes enabled
4. Click link button
5. LinkModal opens with "rest" prefilled in link text
6. Enter URL: `https://example.com`
7. Optionally change colors
8. Click "Apply Styles"
9. Modal closes, field label now contains: `"Welcome <a href="https://example.com" style="color: #5533FF; text-decoration: underline;">rest</a>"`
10. Select different text, add another link (multiple links in one field)
11. Select text, click link button → button should be enabled and modal should reopen
