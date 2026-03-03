import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { FormDefinition, Field, FormSettings, LogicRule, BreakpointId, ResponsiveFieldStyle, FieldStyleObject } from "../types";
import { arrayMove } from "@dnd-kit/sortable";
import { useHistory } from "../hooks/useHistory";
// import { SCREEN_SIZES, MAX_CANVAS_WIDTH, BREAKPOINT_IDS } from "../constants"; // Removed

import { resolveBreakpointStyle, getActiveBreakpoint } from "../utils/styleUtils";

interface FormBuilderContextType {
  // State
  jsonContent: FormDefinition;
  activeSubElement: string | null;
  canvasWidth: number;
  activeBreakpoint: BreakpointId;

  // Core setters
  setJsonContent: (content: FormDefinition) => void;
  setActiveSubElement: (subElement: string | null) => void;
  setCanvasWidth: (width: number) => void;

  // Form-level operations
  updateFormName: (name: string) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;

  // Field operations
  addField: (field: Field, position?: string | number) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  updateFieldStyleBatch: (fieldId: string, styleUpdates: Record<string, any>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;

  // Logic operations
  addLogicRule: (rule: LogicRule) => void;
  updateLogicRule: (ruleId: string, updates: Partial<LogicRule>) => void;
  deleteLogicRule: (ruleId: string) => void;

  // Actions
  saveForm: () => void;
  publishForm: () => void;
  previewForm: () => void;

  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyPointer: number;
}

export const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

interface FormBuilderProviderProps {
  initialContent: FormDefinition;
  children: React.ReactNode;
}

export const FormBuilderProvider: React.FC<FormBuilderProviderProps> = ({ initialContent, children }) => {
  // Use history hook for main JSON content
  const {
    state: jsonContent,
    set: setJsonContentState,
    undo,
    redo,
    canUndo,
    canRedo,
    pointer
  } = useHistory<FormDefinition>(initialContent);

  const [activeSubElement, setActiveSubElement] = useState<string | null>(null);

  const [canvasWidth, setCanvasWidth] = useState<number>(768);

  // Derive active breakpoint from canvas width
  const activeBreakpoint = useMemo<BreakpointId>(() => getActiveBreakpoint(canvasWidth), [canvasWidth]);

  // Core setter
  const setJsonContent = useCallback((content: FormDefinition) => {
    setJsonContentState(content);
  }, [setJsonContentState]);

  // Form-level operations
  const updateFormName = useCallback((name: string) => {
    setJsonContentState((old) => ({
      ...old,
      formSettings: {
        ...old.formSettings,
        name,
      },
    }));
  }, []);

  const updateFormSettings = useCallback((settings: Partial<FormSettings>) => {
    setJsonContentState((old) => ({
      ...old,
      formSettings: {
        ...old.formSettings,
        ...settings,
      },
    }));
  }, []);



  // Field operations
  const addField = useCallback((field: Field, position?: string | number) => {
    setJsonContentState((old) => {
      const fields = old.fields ?? [];

      // Case 1: No position specified -> Append to end
      if (position === undefined || position === null) {
        return {
          ...old,
          fields: [...fields, field],
        };
      }

      // Case 2: Position is an ID (legacy behavior, insert AFTER)
      if (typeof position === "string") {
        const insertAfterIndex = fields.findIndex((f) => f.id === position);
        const insertIndex = insertAfterIndex >= 0 ? insertAfterIndex + 1 : fields.length;

        return {
          ...old,
          fields: [...fields.slice(0, insertIndex), field, ...fields.slice(insertIndex)],
        };
      }

      // Case 3: Position is an index (new behavior, insert AT index)
      if (typeof position === "number") {
        const insertIndex = Math.max(0, Math.min(position, fields.length));

        return {
          ...old,
          fields: [...fields.slice(0, insertIndex), field, ...fields.slice(insertIndex)],
        };
      }

      return old;
    });
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<Field>) => {
    setJsonContentState((old) => ({
      ...old,
      fields: old.fields.map((field) =>
        field.id === fieldId ? ({ ...field, ...updates } as Field) : field
      ),
    }));
  }, []);

  const updateFieldStyleBatch = useCallback((fieldId: string, styleUpdates: Record<string, any>) => {
    setJsonContentState((old) => ({
      ...old,
      fields: old.fields.map((field) => {
        if (field.id !== fieldId) return field;

        const currentStyle: ResponsiveFieldStyle = field.style || {};
        // Use the current activeBreakpoint from the closure (will be stale? No, useCallback deps will fix it)
        // Wait, activeBreakpoint is outside. I need to include it in deps.

        // Get current style for this breakpoint
        const currentBreakpointStyleOrRef = currentStyle[activeBreakpoint];

        let newBreakpointStyle: FieldStyleObject;

        // If it's a string reference, resolve it and merge
        if (typeof currentBreakpointStyleOrRef === 'string') {
          const resolved = resolveBreakpointStyle(currentStyle, activeBreakpoint);
          newBreakpointStyle = { ...resolved, ...styleUpdates };
        } else {
          // If it's an object or undefined, just merge
          newBreakpointStyle = { ...(currentBreakpointStyleOrRef || {}), ...styleUpdates };
        }

        return {
          ...field,
          style: {
            ...currentStyle,
            [activeBreakpoint]: newBreakpointStyle
          }
        } as Field;
      }),
    }));
  }, [activeBreakpoint]); // Add activeBreakpoint to deps

  const deleteField = useCallback((fieldId: string) => {
    setJsonContentState((old) => ({
      ...old,
      fields: old.fields.filter((field) => field.id !== fieldId),
    }));

    if (activeSubElement === fieldId) {
      setActiveSubElement(null);
    }
  }, [activeSubElement]);

  const reorderFields = useCallback((oldIndex: number, newIndex: number) => {
    setJsonContentState((old) => ({
      ...old,
      fields: arrayMove(old.fields, oldIndex, newIndex),
    }));
  }, []);

  // Logic Operations
  const addLogicRule = useCallback((rule: LogicRule) => {
    setJsonContentState((old) => ({
      ...old,
      logic: {
        version: old.logic?.version || 1,
        rules: [...(old.logic?.rules || []), rule],
      },
    }));
  }, []);

  const updateLogicRule = useCallback((ruleId: string, updates: Partial<LogicRule>) => {
    setJsonContentState((old) => ({
      ...old,
      logic: {
        ...(old.logic || { version: 1, rules: [] }),
        rules: (old.logic?.rules || []).map((rule) =>
          rule.id === ruleId ? { ...rule, ...updates } : rule
        ),
      },
    }));
  }, []);

  const deleteLogicRule = useCallback((ruleId: string) => {
    setJsonContentState((old) => ({
      ...old,
      logic: {
        ...(old.logic || { version: 1, rules: [] }),
        rules: (old.logic?.rules || []).filter((rule) => rule.id !== ruleId),
      },
    }));
  }, []);

  // Actions
  const saveForm = useCallback(() => {
    console.log("Saving form...", jsonContent);
    // TODO: Implement save functionality
  }, [jsonContent]);

  const publishForm = useCallback(() => {
    console.log("Publishing form...", { formName: jsonContent?.formSettings?.name, jsonContent });
    // TODO: Implement publish functionality
  }, [jsonContent]);

  const previewForm = useCallback(() => {
    console.log("Previewing form...", { formName: jsonContent?.formSettings?.name, jsonContent });
    // TODO: Implement preview functionality
  }, [jsonContent]);

  const value = useMemo(
    () => ({
      jsonContent,
      activeSubElement,
      canvasWidth,
      activeBreakpoint,
      setJsonContent,
      setActiveSubElement,
      setCanvasWidth,
      updateFormName,
      updateFormSettings,
      addField,
      updateField,
      updateFieldStyleBatch,
      deleteField,
      reorderFields,
      addLogicRule,
      updateLogicRule,
      deleteLogicRule,
      saveForm,
      publishForm,
      previewForm,
      undo,
      redo,
      canUndo,
      canRedo,
      historyPointer: pointer,
    }),
    [
      jsonContent,
      activeSubElement,
      canvasWidth,
      activeBreakpoint,
      setJsonContent,
      updateFormName,
      updateFormSettings,
      addField,
      updateField,
      updateFieldStyleBatch,
      deleteField,
      reorderFields,
      addLogicRule,
      updateLogicRule,
      deleteLogicRule,
      saveForm,
      publishForm,
      previewForm,
      undo,
      redo,
      canUndo,
      canRedo,
      pointer
    ]
  );


  return <FormBuilderContext.Provider value={value}>{children}</FormBuilderContext.Provider>;
};
