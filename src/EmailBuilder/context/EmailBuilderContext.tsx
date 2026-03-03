import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { EmailTemplate, EmailBlock, TemplateSettings, EmailBreakpointId, ResponsiveBlockStyle, BlockStyleObject } from "../types";
import { EditorView } from "../types/enums";
import { arrayMove } from "@dnd-kit/sortable";
import { useHistory } from "../hooks/useHistory";
import { resolveBreakpointStyle, getActiveBreakpoint } from "../utils/styleUtils";

interface EmailBuilderContextType {
  // State
  jsonContent: EmailTemplate;
  activeSubElement: string | null;
  canvasWidth: number;
  activeBreakpoint: EmailBreakpointId;
  activeView: EditorView;

  // Core setters
  setJsonContent: (content: EmailTemplate) => void;
  setActiveSubElement: (subElement: string | null) => void;
  setCanvasWidth: (width: number) => void;
  setActiveView: (view: EditorView) => void;

  // Template-level operations
  updateTemplateName: (name: string) => void;
  updateTemplateSettings: (settings: Partial<TemplateSettings>) => void;

  // Block operations
  addBlock: (block: EmailBlock, position?: string | number) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  updateBlockStyleBatch: (blockId: string, styleUpdates: Record<string, unknown>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;

  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyPointer: number;
}

export const EmailBuilderContext = createContext<EmailBuilderContextType | undefined>(undefined);

export const useEmailBuilder = () => {
  const context = useContext(EmailBuilderContext);
  if (!context) {
    throw new Error("useEmailBuilder must be used within an EmailBuilderProvider");
  }
  return context;
};

interface EmailBuilderProviderProps {
  initialContent: EmailTemplate;
  children: React.ReactNode;
}

export const EmailBuilderProvider: React.FC<EmailBuilderProviderProps> = ({ initialContent, children }) => {
  const {
    state: jsonContent,
    set: setJsonContentState,
    undo,
    redo,
    canUndo,
    canRedo,
    pointer
  } = useHistory<EmailTemplate>(initialContent);

  const [activeSubElement, setActiveSubElement] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(600);
  const [activeView, setActiveView] = useState<EditorView>(EditorView.DESIGN);

  const activeBreakpoint = useMemo<EmailBreakpointId>(() => getActiveBreakpoint(canvasWidth), [canvasWidth]);

  const setJsonContent = useCallback((content: EmailTemplate) => {
    setJsonContentState(content);
  }, [setJsonContentState]);

  const updateTemplateName = useCallback((name: string) => {
    setJsonContentState((old) => ({
      ...old,
      templateSettings: {
        ...old.templateSettings,
        name,
      },
    }));
  }, [setJsonContentState]);

  const updateTemplateSettings = useCallback((settings: Partial<TemplateSettings>) => {
    setJsonContentState((old) => ({
      ...old,
      templateSettings: {
        ...old.templateSettings,
        ...settings,
      },
    }));
  }, [setJsonContentState]);

  const addBlock = useCallback((block: EmailBlock, position?: string | number) => {
    setJsonContentState((old) => {
      const blocks = old.blocks ?? [];

      if (position === undefined || position === null) {
        return { ...old, blocks: [...blocks, block] };
      }

      if (typeof position === "string") {
        const insertAfterIndex = blocks.findIndex((b) => b.id === position);
        const insertIndex = insertAfterIndex >= 0 ? insertAfterIndex + 1 : blocks.length;
        return { ...old, blocks: [...blocks.slice(0, insertIndex), block, ...blocks.slice(insertIndex)] };
      }

      if (typeof position === "number") {
        const insertIndex = Math.max(0, Math.min(position, blocks.length));
        return { ...old, blocks: [...blocks.slice(0, insertIndex), block, ...blocks.slice(insertIndex)] };
      }

      return old;
    });
  }, [setJsonContentState]);

  // Recursive helpers
  const recursiveUpdate = (blocks: EmailBlock[], blockId: string, updates: Partial<EmailBlock>): EmailBlock[] => {
    return blocks.map((block) => {
      if (block.id === blockId) {
        return { ...block, ...updates } as EmailBlock;
      }
      if (block.type === 'columns') {
        const columnsBlock = block as any;
        return {
          ...block,
          columns: columnsBlock.columns.map((col: any) => ({
            ...col,
            blocks: recursiveUpdate(col.blocks, blockId, updates)
          }))
        } as EmailBlock;
      }
      return block;
    });
  };

  const recursiveStyleUpdate = (blocks: EmailBlock[], blockId: string, activeBreakpoint: EmailBreakpointId, styleUpdates: Record<string, unknown>): EmailBlock[] => {
    return blocks.map((block) => {
      if (block.id === blockId) {
        const currentStyle: ResponsiveBlockStyle = block.style || {};
        const currentBreakpointStyleOrRef = currentStyle[activeBreakpoint];
        let newBreakpointStyle: BlockStyleObject;

        if (typeof currentBreakpointStyleOrRef === 'string') {
          const resolved = resolveBreakpointStyle(currentStyle, activeBreakpoint);
          newBreakpointStyle = { ...resolved, ...styleUpdates };
        } else {
          newBreakpointStyle = { ...(currentBreakpointStyleOrRef || {}), ...styleUpdates };
        }

        return {
          ...block,
          style: {
            ...currentStyle,
            [activeBreakpoint]: newBreakpointStyle
          }
        } as EmailBlock;
      }
      if (block.type === 'columns') {
        const columnsBlock = block as any;
        return {
          ...block,
          columns: columnsBlock.columns.map((col: any) => ({
            ...col,
            blocks: recursiveStyleUpdate(col.blocks, blockId, activeBreakpoint, styleUpdates)
          }))
        } as EmailBlock;
      }
      return block;
    });
  };

  const recursiveDelete = (blocks: EmailBlock[], blockId: string): EmailBlock[] => {
    return blocks
      .filter((block) => block.id !== blockId)
      .map((block) => {
        if (block.type === 'columns') {
          const columnsBlock = block as any;
          return {
            ...block,
            columns: columnsBlock.columns.map((col: any) => ({
              ...col,
              blocks: recursiveDelete(col.blocks, blockId)
            }))
          } as EmailBlock;
        }
        return block;
      });
  };

  const updateBlock = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
    setJsonContentState((old) => ({
      ...old,
      blocks: recursiveUpdate(old.blocks, blockId, updates),
    }));
  }, [setJsonContentState]);

  const updateBlockStyleBatch = useCallback((blockId: string, styleUpdates: Record<string, unknown>) => {
    setJsonContentState((old) => ({
      ...old,
      blocks: recursiveStyleUpdate(old.blocks, blockId, activeBreakpoint, styleUpdates),
    }));
  }, [activeBreakpoint, setJsonContentState]);

  const deleteBlock = useCallback((blockId: string) => {
    setJsonContentState((old) => ({
      ...old,
      blocks: recursiveDelete(old.blocks, blockId),
    }));

    if (activeSubElement === blockId) {
      setActiveSubElement(null);
    }
  }, [activeSubElement, setJsonContentState]);

  const reorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
    setJsonContentState((old) => ({
      ...old,
      blocks: arrayMove(old.blocks, oldIndex, newIndex),
    }));
  }, [setJsonContentState]);

  const value = useMemo(
    () => ({
      jsonContent,
      activeSubElement,
      canvasWidth,
      activeBreakpoint,
      setJsonContent,
      setActiveSubElement,
      setCanvasWidth,
      updateTemplateName,
      updateTemplateSettings,
      addBlock,
      updateBlock,
      updateBlockStyleBatch,
      deleteBlock,
      reorderBlocks,
      undo,
      redo,
      canUndo,
      canRedo,
      historyPointer: pointer,
      activeView,
      setActiveView,
    }),
    [
      jsonContent,
      activeSubElement,
      canvasWidth,
      activeBreakpoint,
      setJsonContent,
      setActiveSubElement,
      setCanvasWidth,
      updateTemplateName,
      updateTemplateSettings,
      addBlock,
      updateBlock,
      updateBlockStyleBatch,
      deleteBlock,
      reorderBlocks,
      undo,
      redo,
      canUndo,
      canRedo,
      pointer,
      activeView,
    ]
  );

  return <EmailBuilderContext.Provider value={value}>{children}</EmailBuilderContext.Provider>;
};
