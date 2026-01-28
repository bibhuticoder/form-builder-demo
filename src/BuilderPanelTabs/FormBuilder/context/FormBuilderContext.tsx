import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { FormDefinition, Field, FormSettings } from "../../../types";
import { arrayMove } from "@dnd-kit/sortable";

interface FormBuilderContextType {
  // State
  jsonContent: FormDefinition;
  
  // Core setters
  setJsonContent: (content: FormDefinition) => void;
  
  // Form-level operations
  updateFormName: (name: string) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;
  updateCanvasWidth: (width: number) => void;
  
  // Field operations
  addField: (field: Field, afterId?: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  updateFieldStyleBatch: (fieldId: string, styleUpdates: Record<string, any>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  
  // Actions
  saveForm: () => void;
  publishForm: () => void;
  previewForm: () => void;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

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
  const [jsonContent, setJsonContentState] = useState<FormDefinition>(initialContent);

  // Core setter
  const setJsonContent = useCallback((content: FormDefinition) => {
    setJsonContentState(content);
  }, []);

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

  const updateCanvasWidth = useCallback((width: number) => {
    setJsonContentState((old) => ({
      ...old,
      formSettings: {
        ...old.formSettings,
        settings: {
          ...old.formSettings.settings,
          width: Math.round(width),
        },
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
  }, []);

  const reorderFields = useCallback((oldIndex: number, newIndex: number) => {
    setJsonContentState((old) => ({
      ...old,
      fields: arrayMove(old.fields, oldIndex, newIndex),
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
      setJsonContent,
      updateFormName,
      updateFormSettings,
      updateCanvasWidth,
      addField,
      updateField,
      updateFieldStyleBatch,
      deleteField,
      reorderFields,
      saveForm,
      publishForm,
      previewForm,
    }),
    [
      jsonContent,
      setJsonContent,
      updateFormName,
      updateFormSettings,
      updateCanvasWidth,
      addField,
      updateField,
      updateFieldStyleBatch,
      deleteField,
      reorderFields,
      saveForm,
      publishForm,
      previewForm,
    ]
  );

  return <FormBuilderContext.Provider value={value}>{children}</FormBuilderContext.Provider>;
};
