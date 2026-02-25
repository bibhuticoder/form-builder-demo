import type { ComponentType } from 'react';
import type { NodeConfig } from './components';

export type AutomationNodeData = {
    label: string;
    subtitle?: string;
    icon?: ComponentType<{ className?: string }>;
    /** PRD-style flexible config payload (type-specific). */
    config?: NodeConfig;

    isRoot?: boolean;
    isDragging?: boolean;

    // Branching
    isBranchAdder?: boolean;
    isLastBranchNode?: boolean;
    siblingId?: string;

    // Loop-back UX
    isConnecting?: boolean;
    isTargetable?: boolean;

    onStartConnect?: (nodeId: string) => void;
    onClearConnection?: (nodeId: string) => void;
};
