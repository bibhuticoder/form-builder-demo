# Email Builder

A visual drag-and-drop email template builder, modeled after the existing Form Builder. Built as an independent module that reuses the same architectural patterns without sharing code, keeping the two builders fully decoupled.

## Architecture Decision

**Copy-and-adapt, not abstract.** Rather than extracting shared abstractions between FormBuilder and EmailBuilder, each builder is self-contained. This was a deliberate choice:

- The two builders look structurally similar but diverge in domain logic (form fields vs. email blocks, 6 breakpoints vs. 2, input validation vs. none).
- Shared abstractions would couple unrelated domains and make each harder to evolve independently.
- Copying patterns is cheap; untangling premature abstractions is expensive.

## Key Differences from FormBuilder

| Concern | FormBuilder | EmailBuilder |
|---|---|---|
| **Data unit** | `Field` (18 types, many are inputs) | `EmailBlock` (12 types, all display-only) |
| **Root type** | `FormDefinition` with `fields[]` | `EmailTemplate` with `blocks[]` |
| **Breakpoints** | 6 (xs/sm/md/lg/xl/2xl, 375px-1536px) | 2 (mobile/desktop, 375px/600px) |
| **Canvas** | Resizable with drag handle | Fixed toggle between 375px and 600px |
| **Style model** | Input/Label/Help/Placeholder/Window scopes | Simplified: container + content only |
| **Capabilities** | Form-centric (hasLabel, hasPlaceholder, hasRequired) | Email-centric (supportsText, supportsImage, supportsLink) |
| **Properties tabs** | Content / Style / Logic | Content / Style (no logic) |
| **Block types** | Text inputs, dropdowns, checkboxes, captcha, etc. | Columns, spacer, HTML, discount code, menu, social links |

## File Structure

```
EmailBuilder/
├── EmailBuilder.tsx              # Entry point, wraps shell in provider
├── index.tsx                     # Barrel export
├── constants.ts                  # Breakpoints, screen sizes, defaults
│
├── types/
│   ├── enums.ts                  # EmailBlockType (12), EmailStatus, HeadingLevel, etc.
│   ├── blocks.ts                 # Block interfaces (BaseBlock + 12 specific types)
│   ├── styles.ts                 # BlockStyleObject, ResponsiveBlockStyle (mobile/desktop)
│   ├── block-capabilities.ts     # What each block type supports (text, image, link, etc.)
│   ├── email-template.ts         # EmailTemplate, TemplateSettings
│   ├── dnd.ts                    # DragData, CANVAS_DROPPABLE_ID
│   └── index.ts                  # Barrel export
│
├── context/
│   ├── EmailBuilderContext.tsx    # React Context + Provider (state, mutations, history)
│   └── index.ts
│
├── hooks/
│   └── useHistory.ts             # 50-step undo/redo (identical to FormBuilder's)
│
├── utils/
│   ├── blockRegistry.ts          # Maps EmailBlockType -> React component
│   ├── styleUtils.ts             # getActiveBreakpoint, resolveBreakpointStyle, CSS helpers
│   └── dnd/
│       └── utils.ts              # createBlockFromType() with defaults per block type
│
├── data/
│   └── empty-canvas.json         # Default empty template
│
└── components/
    ├── EmailBuilderShell.tsx      # Main 3-panel layout
    │
    ├── TopBar/
    │   └── TopBar.tsx             # Template name input, preview/send buttons
    │
    ├── Canvas/
    │   ├── Canvas.tsx             # Droppable canvas area
    │   ├── CanvasToolbar.tsx      # Mobile/Desktop toggle (no resizer)
    │   └── EmptyState.tsx         # Empty canvas placeholder
    │
    ├── dnd/
    │   ├── DndProvider.tsx        # @dnd-kit context, drag/drop event handling
    │   ├── SortableItem.tsx       # Individual sortable wrapper
    │   ├── SortableList.tsx       # SortableContext wrapper
    │   ├── DropIndicator.tsx      # Visual drop target line
    │   └── index.ts
    │
    ├── ElementPalette/
    │   └── ElementPalette.tsx     # Sidebar block picker (Content/Layout/Advanced groups)
    │
    ├── EmailRenderer/
    │   ├── EmailRenderer.tsx      # Renders all blocks with DnD sorting
    │   ├── BlockRenderer.tsx      # Dispatches block to registry component
    │   └── elements/
    │       ├── BuilderBlockWrapper.tsx    # Container styles + selection highlight
    │       ├── BuilderBlockControls.tsx   # Hover controls (delete, drag handle)
    │       ├── BuilderHeading.tsx
    │       ├── BuilderText.tsx
    │       ├── BuilderImage.tsx
    │       ├── BuilderVideo.tsx
    │       ├── BuilderButton.tsx
    │       ├── BuilderColumns.tsx
    │       ├── BuilderDivider.tsx
    │       ├── BuilderSpacer.tsx
    │       ├── BuilderHtml.tsx
    │       ├── BuilderDiscountCode.tsx
    │       ├── BuilderMenu.tsx
    │       └── BuilderSocialLinks.tsx
    │
    ├── ConfigPanel/
    │   └── ConfigPanel.tsx        # Sidebar: palette or property editor
    │
    └── PropertyEditor/
        ├── PropertyEditor.tsx     # 2-tab editor (Content/Style)
        └── tabs/
            ├── ContentTab/
            │   └── index.tsx      # Block-specific property fields
            └── StyleTab/
                └── index.tsx      # Typography, alignment, padding, background, border
```

## Implementation Process

### Phase 1: Foundation (types, enums, constants)

Started by reading every FormBuilder type file to understand the data model. Then adapted:

- **EmailBlockType enum** with 12 block types replacing FormBuilder's 18 field types. Dropped all input-specific types (text, email, phone, dropdown, etc.) and added email-specific ones (columns, spacer, HTML, discount code, menu, social links).
- **Simplified breakpoints** from 6 to 2. Emails render at max 600px, so only mobile (375px) and desktop (600px) are needed. This simplified every breakpoint-related type and utility.
- **Block interfaces** replaced the Field hierarchy. FormBuilder has `BaseField -> LabeledField -> InputField` with form-specific properties (placeholder, required, helpText). EmailBuilder has a flat `BaseBlock` with block-specific extensions (content, src, url, columns, links).
- **BlockStyleCapabilities** simplified from FormBuilder's input/label/help/placeholder/window model to a flat set of flags: supportsText, supportsImage, supportsLink, supportsAlignment, supportsPadding, supportsBackgroundColor, supportsBorder, supportsTypography.

### Phase 2: Context, hooks, utilities

- **useHistory** was copied directly -- identical undo/redo logic with a 50-step stack.
- **EmailBuilderContext** mirrors FormBuilderContext but with block-oriented operations (addBlock, updateBlock, deleteBlock, reorderBlocks) instead of field operations. Dropped all logic rule operations since emails don't have conditional logic.
- **styleUtils** simplified. `getActiveBreakpoint()` is a simple threshold check instead of a 6-way cascade. CSS helper functions were reduced from 5 (container, input, label, help, placeholder) to 2 (container, content).
- **blockRegistry** maps each EmailBlockType to its React renderer component, same pattern as fieldRegistry.
- **createBlockFromType()** creates properly typed blocks with sensible defaults. Each block type has its own default style set (e.g., buttons get a primary background color, dividers get a border).

### Phase 3: Shell, canvas, DnD

- **DndProvider** adapted from FormBuilder: changed "field" terminology to "block", drag data uses `palette-block`/`canvas-block` kinds instead of `palette-field`/`canvas-field`.
- **Canvas** dropped the `CanvasResizer` component entirely. Instead of a draggable resize handle, there's a simple Mobile/Desktop toggle button pair. The canvas width snaps between 375px and 600px.
- **EmailBuilderShell** follows the same 3-panel layout (sidebar + topbar + canvas) but wired to EmailBuilder context.
- **TopBar** simplified: no embed modal, no example JSON loader. Just template name, preview, and send buttons.

### Phase 4: Element palette + block renderers

- **ElementPalette** groups blocks into Content (heading, text, image, video, button), Layout (columns, divider, spacer), and Advanced (HTML, discount code, menu, social links). Same draggable card pattern.
- **Block renderers** each follow the same pattern: receive block + isSelected + activeSubElement props, wrap in BuilderBlockWrapper for container styles, render block-specific content.
- New block types not in FormBuilder:
  - **Columns**: Renders 2+ side-by-side drop zones (visual placeholder for now).
  - **Spacer**: Configurable height empty div.
  - **HTML**: Renders raw HTML via dangerouslySetInnerHTML.
  - **DiscountCode**: Shows a styled code badge with description.
  - **Menu**: Horizontal link list.
  - **SocialLinks**: Circle icon grid with platform abbreviations (FB, X, IG, etc.).
- **BuilderBlockControls** adapted from BuilderFieldControls: same hover/selected border, action bar with delete and drag handle, but uses block.type for display name.

### Phase 5: Properties panel

- **PropertyEditor** reduced from 3 tabs (Content/Style/Logic) to 2 (Content/Style). No logic system for emails.
- **ContentTab** renders different form controls per block type. Each block type gets its own section with appropriate inputs (text fields for content, URL inputs for images, number inputs for spacer height, repeatable item lists for menus and social links).
- **StyleTab** is capability-driven. It checks `getBlockCapabilities(block.type)` and only shows relevant sections. Typography section for text-bearing blocks, alignment for alignable blocks, padding/background/border where supported.

### Integration

Added an "Email Builder" tab to `src/BuilderPanel.tsx` alongside the existing Form Builder tab. Imported `EmailBuilder` and rendered it conditionally when the `email-builder` tab is active.

## How to Access

1. `npm run dev`
2. Navigate to `/forms/new` (or any form route)
3. Click the **Email Builder** tab in the top navigation

## Block Types

| Block | Description | Content Properties | Style Capabilities |
|---|---|---|---|
| **Heading** | H1-H4 heading | content, headingLevel | Typography, alignment, padding, background |
| **Text** | Rich text paragraph | content | Typography, alignment, padding, background |
| **Image** | Image with optional link | src, alt, linkUrl | Alignment, padding, border |
| **Video** | YouTube/Vimeo embed | url, thumbnailUrl | Alignment, padding |
| **Button** | CTA button | label, url | Typography, alignment, padding, background, border |
| **Columns** | 2-4 column layout | columns (nested blocks) | Padding, background |
| **Divider** | Horizontal rule | -- | Padding, border |
| **Spacer** | Empty vertical space | height | -- |
| **HTML** | Raw HTML | content | Padding, background |
| **Discount Code** | Promo code display | code, description | Typography, alignment, padding, background, border |
| **Menu** | Horizontal nav links | items (label, url) | Typography, alignment, padding, background |
| **Social Links** | Social media icons | links (platform, url) | Alignment, padding, background |

## Data Model

```typescript
interface EmailTemplate {
  templateSettings: {
    name: string;
    subject: string;
    preheader?: string;
    status: EmailStatus;
    settings: EmailStyleSettings;  // font, colors, padding, border
  };
  blocks: EmailBlock[];  // ordered array of blocks
}
```

Each block has responsive styles keyed by breakpoint:
```typescript
block.style = {
  desktop: { fontSize: 16, color: '#333', paddingTop: 10, ... },
  mobile: 'desktop'  // reference = inherit from desktop
}
```
