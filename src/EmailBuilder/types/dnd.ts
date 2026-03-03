/**
 * Drag-and-drop type definitions for the email builder
 */

import { EmailBlockType } from './enums';

export type DragItemType = 'palette-block' | 'canvas-block';

export interface DragData {
  kind: DragItemType;
  blockType?: EmailBlockType;
  label?: string;
  blockId?: string;
}

export const CANVAS_DROPPABLE_ID = 'email-canvas-drop-zone';
