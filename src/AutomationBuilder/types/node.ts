export type AutomationNodeData = {
  label: string;
  subtitle?: string;
  icon?: any;
  /** PRD-style flexible config payload (type-specific). */
  config?: Record<string, unknown>;

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
