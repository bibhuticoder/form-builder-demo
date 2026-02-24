import type { Edge, Node } from 'reactflow';
import type { AutomationStatus } from './status';

/**
 * Builder-facing definition (React Flow graph). This is what the UI manipulates.
 * Persistence conversion is handled separately.
 */
export interface AutomationDefinition {
  version: number;
  id: string;
  name: string;
  status?: AutomationStatus;
  createdAt?: string;
  updatedAt?: string;
  nodes: Node[];
  edges: Edge[];
}
