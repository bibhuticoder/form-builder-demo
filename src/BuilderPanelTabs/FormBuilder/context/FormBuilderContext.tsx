import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { FormDefinition, Field, FormSettings, LogicRule } from "../types";
import { arrayMove } from "@dnd-kit/sortable";
import { useHistory } from "../hooks/useHistory";

interface FormBuilderContextType {
  // State
  jsonContent: FormDefinition;
  activeSubElement: string | null;
  canvasWidth: number;

  // Core setters
  setJsonContent: (content: FormDefinition) => void;
  setActiveSubElement: (subElement: string | null) => void;
  setCanvasWidth: (width: number) => void;

  // Form-level operations
  updateFormName: (name: string) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;

  // Field operations
  addField: (field: Field, afterId?: string) => void;
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
  const addField = useCallback((field: Field, afterId?: string) => {
    setJsonContentState((old) => {
      const fields = old.fields ?? [];

      if (!afterId) {
        // Add to end if no afterId specified
        return {
          ...old,
          fields: [...fields, field],
        };
      }

      // Insert after the specified field
      const insertAfterIndex = fields.findIndex((f) => f.id === afterId);
      const insertIndex = insertAfterIndex >= 0 ? insertAfterIndex + 1 : fields.length;

      return {
        ...old,
        fields: [...fields.slice(0, insertIndex), field, ...fields.slice(insertIndex)],
      };
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
      fields: old.fields.map((field) =>
        field.id === fieldId
          ? ({ ...field, style: { ...field.style, ...styleUpdates } } as Field)
          : field
      ),
    }));
  }, []);

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
