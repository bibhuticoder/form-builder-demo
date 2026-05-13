export type AutomationEdgeData = {
    isLoopBack?: boolean;
    isSplitTest?: boolean;
    isCondition?: boolean;
    conditionType?: 'true' | 'false';
    branchId?: string;
    branchIndex?: number;
    branchType?: 'if' | 'else_if' | 'else';
    label?: string;
};
