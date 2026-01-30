import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useFormBuilder } from "../../context";
import { FormSettings } from "./FormSettings";
import { useState, useRef } from "react";
import type { FormSettings as FormSettingsType } from "../../../../types/form";

/**
 * FormSettingsTrigger
 *
 * Manages the UI trigger and state for opening/closing the form styling configuration dialog.
 * This component acts as a bridge between the ElementPalette (UI trigger) and FormSettings (dialog content).
 * Implements real-time preview with cancel/save confirmation.
 *
 * Responsibilities:
 * - Displays the settings icon button
 * - Manages the visibility state of the FormSettings dialog
 * - Fetches current form settings from FormBuilderContext
 * - Stores initial state before editing for cancel functionality
 * - Enables real-time updates to the context as user types
 * - Reverts changes on cancel
 *
 * Data Flow:
 * 1. User clicks the settings icon → stores a backup of current settings → opens FormSettings dialog
 * 2. User modifies styling properties → changes are sent to context immediately (real-time preview)
 * 3. User clicks Save → changes remain in context → dialog closes
 * 4. User clicks Cancel → settings are reverted from backup → dialog closes
 */
export const FormSettingsTrigger: React.FC = () => {
  // Controls visibility of the form settings dialog
  const [showFormSettings, setShowFormSettings] = useState(false);

  // Stores a backup of form settings when dialog opens
  // Used to revert changes if user cancels
  const initialSettingsRef = useRef<FormSettingsType | null>(null);

  // Destructure context values
  // - jsonContent: Contains current form definition including formSettings
  // - updateFormSettings: Function to persist changes back to context
  const { jsonContent, updateFormSettings } = useFormBuilder();

  /**
   * Handles dialog open
   * Stores current settings as backup before allowing edits
   */
  const handleOpenSettings = () => {
    // Create a deep copy of current settings as backup
    initialSettingsRef.current = structuredClone(jsonContent.formSettings);
    setShowFormSettings(true);
  };

  /**
   * Handles save action
   * Changes already exist in context (from onChange), just close dialog
   */
  const handleSave = () => {
    // Settings already updated in context via onChange
    // Just close the dialog to confirm
    setShowFormSettings(false);
    // Clear the backup
    initialSettingsRef.current = null;
  };

  /**
   * Handles cancel action
   * Reverts context to the backed-up initial state
   */
  const handleCancel = () => {
    if (initialSettingsRef.current) {
      // Restore the backed-up settings to context
      updateFormSettings(initialSettingsRef.current);
    }
    setShowFormSettings(false);
    // Clear the backup
    initialSettingsRef.current = null;
  };

  return (
    <>
      {/* Settings icon button - triggers dialog open */}
      <button
        type="button"
        onClick={handleOpenSettings}
        aria-label="Open form settings"
        className="inline-flex items-center justify-center"
      >
        <Cog6ToothIcon
          className="w-5 h-5 text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
        />
      </button>

      {/* Form settings dialog - manages styling configuration UI */}
      <FormSettings
        isOpen={showFormSettings}
        initialConfig={jsonContent.formSettings}
        onSave={handleSave}
        onCancel={handleCancel}
        onChangeRealTime={updateFormSettings}
      />
    </>
  );
};