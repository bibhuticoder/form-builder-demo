import type { Edge, Node } from 'reactflow';
import type {
    AutomationPayload,
    Automation,
    AutomationNode,
    AutomationEdge,
    AutomationStatus,
} from '../types/automation';
import { TOOLBOX_ITEMS } from '../constants';

function isBuilderOnlyNode(node: Node) {
    if (node.type === 'placeholder' || node.type === 'addStep') return true;
    const label = (node.data as any)?.label;
    if (label === 'Add Step' || label === 'Add Branch' || label === 'Start your automation') return true;
    if ((node.data as any)?.isBranchAdder) return true;
    return false;
}

function isBuilderOnlyEdge(edge: Edge, nodesById: Map<string, Node>) {
    if (edge.sourceHandle === 'right-source') return true;
    const source = nodesById.get(edge.source);
    const target = nodesById.get(edge.target);
    if (source && isBuilderOnlyNode(source)) return true;
    if (target && isBuilderOnlyNode(target)) return true;
    return false;
}

function guessNodeType(node: Node): string {
    const nodeType = (node.data as any)?.nodeType;
    if (nodeType) {
        if (node.type === 'trigger') return 'trigger';
        if (nodeType === 'if_else') return 'logic_if_else';
        if (nodeType === 'split_test') return 'logic_split_test';
        if (nodeType === 'wait') return 'delay';
        if (nodeType === 'loop_back') return 'loop_back';
        if (nodeType === 'end_automation') return 'end';
        return `action_${nodeType}`;
    }

    const t = node.type || '';
    if (t === 'trigger') return 'trigger';
    if (t === 'delay') return 'delay';
    if (t === 'end') return 'end';
    if (t === 'loopBack') return 'loop_back';

    const label = (node.data as any)?.label;
    if (label === 'Split Test (A/B)') return 'logic_split_test';
    if (label === 'If / Else') return 'logic_if_else';

    return t || 'action';
}

function getToolboxMetaByLabel(label: string | undefined) {
    if (!label) return null;
    for (const group of TOOLBOX_ITEMS) {
        const found = group.items.find((i) => i.label === label);
        if (found) return found;
    }
    return null;
}

export function buildPayloadFromBuilder(params: {
    automationId: string;
    name: string;
    status: AutomationStatus;
    settings?: Record<string, any>;
    version: number;
    createdAt?: string;
    updatedAt?: string;
    savedAt?: string;
    nodes: Node[];
    edges: Edge[];
}): AutomationPayload {
    const { automationId, name, status, settings, version, createdAt, updatedAt, savedAt } = params;
    const nodesById = new Map(params.nodes.map((n) => [n.id, n] as const));

    const finalNodes: AutomationNode[] = params.nodes
        .filter((n) => !isBuilderOnlyNode(n))
        .map((n) => {
            const label = (n.data as any)?.label as string | undefined;
            const subtitle = (n.data as any)?.subtitle as string | undefined;
            const config = ((n.data as any)?.config as Record<string, unknown> | undefined) || {};

            const toolboxMeta = getToolboxMetaByLabel(label);
            const iconName = toolboxMeta?.iconName || (n.data as any)?.ui?.icon;
            const color = toolboxMeta?.color || (n.data as any)?.ui?.color;

            return {
                id: n.id,
                type: guessNodeType(n),
                position: { x: n.position.x, y: n.position.y },
                data: {
                    ui: {
                        label: label || n.id,
                        subtitle,
                        icon: iconName,
                        color,
                        nodeType: (n.data as any)?.nodeType,
                    },
                    config,
                },
            };
        });

    const finalEdges: AutomationEdge[] = params.edges
        .filter((e) => !isBuilderOnlyEdge(e, nodesById))
        .map((e) => {
            const label = (e as any).label || (e.data as any)?.label;
            const isLoopBack = !!(e.data as any)?.isLoopBack;
            const isSplitTest = !!(e.data as any)?.isSplitTest;
            const edgeData: AutomationEdge['data'] = {};
            if (label) edgeData.label = label;
            if (isLoopBack) edgeData.isLoopBack = true;
            if (isSplitTest) edgeData.isSplitTest = true;
            return {
                id: e.id,
                source: e.source,
                target: e.target,
                data: Object.keys(edgeData).length ? edgeData : undefined,
            };
        });

    const automation: Automation = {
        id: automationId,
        name,
        status,
        settings,
        version,
        createdAt,
        updatedAt,
        savedAt,
        nodes: finalNodes,
        edges: finalEdges,
    };

    return { automation };
}
