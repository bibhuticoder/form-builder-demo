/**
 * Drag-and-drop type definitions for the form builder
 */

import { FieldType } from "./enums";

/**
 * Discriminator for drag item sources
 * - "palette-field": Item being dragged from the sidebar palette
 * - "canvas-field": Existing field being reordered within the canvas
 */
export type DragItemType = "palette-field" | "canvas-field";

/**
 * Data attached to draggable items for type-safe drag operations
 */
export interface DragData {
  /** Identifies the source of the drag operation */
  kind: DragItemType;
  /** Field type when dragging from palette */
  fieldType?: FieldType;
  /** Display label for palette items */
  label?: string;
  /** Field ID when dragging existing canvas fields */
  fieldId?: string;
}

/**
 * Unique ID for the canvas droppable zone
 * Used to identify drops onto empty canvas areas
 */
export const CANVAS_DROPPABLE_ID = "canvas-drop-zone";
