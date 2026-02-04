# Form Builder Test Cases Documentation

This document provides a comprehensive overview of the test cases in the Cleave Form Builder project, categorized by feature and code module.

## 1. Form Renderer Elements
Tests for individual form components to ensure they render correctly with appropriate attributes and labels.

**Location:** `src/BuilderPanelTabs/FormBuilder/components/FormRenderer/elements/__tests__/`

| File | Description |
|------|-------------|
| **BuilderButton.test.tsx** | Verifies the submit button renders with the correct label. |
| **BuilderCaptcha.test.tsx** | Verifies the captcha component renders a placeholder. |
| **BuilderCheckbox.test.tsx** | Verifies checkbox options render with correct labels. |
| **BuilderDate.test.tsx** | Verifies date input rendering with label and attributes. |
| **BuilderDivider.test.tsx** | Verifies the divider (hr) element renders. |
| **BuilderDropdown.test.tsx** | Verifies select dropdown renders with provided options. |
| **BuilderEmail.test.tsx** | Verifies email input renders with label and placeholder. |
| **BuilderFieldControls.test.tsx** | Tests field controls: delete button visibility/action, move button (drag handle) rendering and interaction. |
| **BuilderHeading.test.tsx** | Verifies heading renders with correct level (h1-h6) and text. |
| **BuilderImage.test.tsx** | Verifies image renders with alt text. |
| **BuilderNumber.test.tsx** | Verifies number input renders with label and placeholder. |
| **BuilderParagraph.test.tsx** | Verifies paragraph text rendering. |
| **BuilderPhone.test.tsx** | Verifies phone input renders with label and placeholder. |
| **BuilderRadio.test.tsx** | Verifies radio buttons render with correct option labels. |
| **BuilderText.test.tsx** | Verifies text input renders with label and placeholder. |
| **BuilderTextArea.test.tsx** | Verifies textarea renders with label and placeholder. |
| **BuilderTime.test.tsx** | Verifies time input renders with label. |
| **BuilderUpload.test.tsx** | Verifies file upload dropzone renders with label and help text. |
| **BuilderUrl.test.tsx** | Verifies URL input renders with label and placeholder. |
| **BuilderVideo.test.tsx** | Verifies video iframe renders with title. |

## 2. Form Renderer Core
Tests for the main rendering logic of the form builder canvas.

**Location:** `src/BuilderPanelTabs/FormBuilder/components/FormRenderer/__tests__/`

| File | Description |
|------|-------------|
| **CanvasRenderingStyles.test.tsx** | Tests dynamic style updates and content changes based on formData props. |
| **FieldRenderer.test.tsx** | Comprehensive test to ensure the `FieldRenderer` correctly delegates to specific component types (text, email, etc.) and handles unsupported types gracefully. |
| **FormRenderer.test.tsx** | Integration tests for the full form: field ordering, settings application (width/styles), and complex form structures. |

## 3. Canvas & Interaction
Tests for canvas-specific tools and interactions.

**Location:** `src/BuilderPanelTabs/FormBuilder/components/Canvas/__tests__/`

| File | Description |
|------|-------------|
| **AddLinkButton.test.tsx** | Tests the "Add Link" floating button: enablement based on selection, modal interaction, and saving link HTML to field labels. |
| **CanvasToolbar.test.tsx** | Tests the top toolbar: breakpoint switching (XS-2XL), width display, and responsiveness. |

## 4. Property Editor
Tests for the configuration panel where users edit field properties.

**Location:** `src/BuilderPanelTabs/FormBuilder/components/PropertyEditor/`

### Core Integration
| File | Description |
|------|-------------|
| **PropertyEditorIntegration.test.tsx** | Integration tests checking context updates for label, required status, and style properties. |

### Content Tab
**Location:** `.../tabs/ContentTab/components/__tests__/`

| File | Description |
|------|-------------|
| **ContentSection.test.tsx** | Tests rendering and updating of basic content fields (Label, Placeholder). |
| **OptionsSection.test.tsx** | Tests management of options for choice fields (Add, Update, Remove). |
| **SettingsSection.test.tsx** | Tests toggling of "Required" status and help text input. |

### Logic Tab
**Location:** `.../tabs/LogicTab/__tests__/`

| File | Description |
|------|-------------|
| **LogicTabIntegration.test.tsx** | Tests the rendering of the Logic tab, adding new rules, and editing existing ones. |

### Style Tab
**Location:** `.../tabs/StyleTab/`

| File | Description |
|------|-------------|
| **StyleTabIntegration.test.tsx** | Integration tests for Layout and Typography sections within the Style tab. |
| **LayoutSection.test.tsx** | Tests width controls and sub-tabs (Input vs Window). |
| **TypographySection.test.tsx** | Tests font family, size controls, and sub-tabs (Input vs Label). |

### Utilities
**Location:** `.../utils/__tests__/`

| File | Description |
|------|-------------|
| **htmlUtils.test.ts** | Extensive tests for HTML string manipulation: stripping tags, extracting link metadata, and reconstructing HTML (used for rich text editing support). |

## 5. Form Settings
Tests for global form configuration.

**Location:** `src/BuilderPanelTabs/FormBuilder/components/FormSettings/__tests__/`

| File | Description |
|------|-------------|
| **FormSettings.test.tsx** | Tests rendering of form setting controls. |
| **FormSettings.integration.test.tsx** | Integration tests ensuring settings changes update usage validation. |

## 6. Context & Hooks
Tests for the application state management.

**Location:** `src/BuilderPanelTabs/FormBuilder/`

| File | Description |
|------|-------------|
| **context/__tests__/FormBuilderContext.test.tsx** | Tests the main context provider, reducer logic, and state updates. |
| **hooks/__tests__/useHistory.test.ts** | Tests undo/redo functionality and history stack management. |

## 7. Validators
Tests for validation logic used throughout the builder.

**Location:** `src/BuilderPanelTabs/FormBuilder/validators/__tests__/`

| File | Description |
|------|-------------|
| **logic.validators.test.ts** | Tests validation of logic rules, nested expressions, and effects. |
| **utility.validators.test.ts** | Tests common validators: Email, URL, Phone, and field references. |
| **validation-result-builder.test.ts** | Tests the helper class for constructing validation result objects. |

## 8. General Utilities & Integration
Other tests covering utility functions and drag-and-drop integration.

| File | Description |
|------|-------------|
| **utils/__tests__/fieldRegistry.test.ts** | Tests the field registry mechanism. |
| **utils/__tests__/styleUtils.test.ts** | Tests style generation helpers. |
| **utils/dnd/__tests__/utils.test.ts** | Tests drag-and-drop utility functions. |
| **components/__tests__/dnd-integration.test.tsx** | Integration tests for drag-and-drop behavior. |
| **components/__tests__/drag-handlers.test.ts** | Tests specific drag event handlers. |
| **components/__tests__/LinkModal.test.tsx** | Tests the modal used for adding/editing hyperlinks. |
