/**
 * PRD-aligned production model (JSON payload) for automations.
 *
 * Notes
 * - `ui.icon` is stored as a string in the payload (e.g. "FileText").
 * - Builder runtime uses React components for icons; conversion happens at the edge of persistence.
 */

import type { AutomationStatus } from './status';

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
