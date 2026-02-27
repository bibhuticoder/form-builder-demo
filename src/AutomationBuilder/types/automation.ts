import type { Edge, Node } from 'reactflow';

export type AutomationStatus = 'draft' | 'active' | 'paused';

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

export type AutomationValidationError = {
    path: string;
    message: string;
    type: string;
};

export type AutomationValidationResult = {
    valid: boolean;
    errors: AutomationValidationError[];
};


/**
 * PRD-aligned production model (JSON payload) for automations.
 *
 * Notes
 * - `ui.icon` is stored as a string in the payload (e.g. "FileText").
 * - Builder runtime uses React components for icons; conversion happens at the edge of persistence.
 */

export type AutomationProductionPayload = {
    automation: AutomationProductionDefinition;
};

export type AutomationProductionDefinition = {
    id: string;
    name: string;
    status: AutomationStatus;
    version: number;
    createdAt?: string;
    updatedAt?: string;
    nodes: AutomationProductionNode[];
    edges: AutomationProductionEdge[];
};

export type AutomationProductionNode = {
    id: string;

    /**
     * PRD examples include: trigger, delay, end, loop_back, logic_if_else, action_notification, action_send_email, ...
     */
    type: string;

    position: { x: number; y: number };

    data: {
        ui: {
            label: string;
            subtitle?: string;
            icon?: string;
            color?: string;
        };

        /** Type-specific configuration; kept flexible by design. */
        config: Record<string, unknown>;
    };
};

export type AutomationProductionEdge = {
    id: string;
    source: string;
    target: string;
    data?: {
        label?: string;
        branchId?: string;
        isLoopBack?: boolean;
        isSplitTest?: boolean;
    };
};
