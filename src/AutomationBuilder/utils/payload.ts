import type { Edge, Node } from 'reactflow';
import type {
    AutomationProductionPayload,
    AutomationProductionDefinition,
    AutomationProductionNode,
    AutomationProductionEdge,
    AutomationStatus,
} from '../types/automation';
import { TOOLBOX_ITEMS } from '../constants/toolbox';

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

function guessProductionNodeType(node: Node): string {
    // Try to use builder node.type when it matches PRD-ish values.
    const t = node.type || '';
    if (t === 'trigger') return 'trigger';
    if (t === 'delay') return 'delay';
    if (t === 'end') return 'end';
    if (t === 'loopBack') return 'loop_back';
    if (t === 'condition') {
        const label = (node.data as any)?.label;
        if (label === 'Split Test (A/B)') return 'logic_split_test';
        return 'logic_if_else';
    }
    if (t === 'action') {
        const label = (node.data as any)?.label;
        if (label === 'Send Email') return 'action_send_email';
        if (label === 'Send SMS' || label === 'Send Notification') return 'action_notification';
        if (label === 'Send To Automation') return 'action_send_to_automation';
        if (label === 'End Automation') return 'end';
        return 'action';
    }
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

export function buildProductionPayloadFromBuilder(params: {
    automationId: string;
    name: string;
    status: AutomationStatus;
    version: number;
    createdAt?: string;
    updatedAt?: string;
    nodes: Node[];
    edges: Edge[];
}): AutomationProductionPayload {
    const { automationId, name, status, version, createdAt, updatedAt } = params;
    const nodesById = new Map(params.nodes.map((n) => [n.id, n] as const));

    const productionNodes: AutomationProductionNode[] = params.nodes
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
                type: guessProductionNodeType(n),
                position: { x: n.position.x, y: n.position.y },
                data: {
                    ui: {
                        label: label || n.id,
                        subtitle,
                        icon: iconName,
                        color,
                    },
                    config,
                },
            };
        });

    const productionEdges: AutomationProductionEdge[] = params.edges
        .filter((e) => !isBuilderOnlyEdge(e, nodesById))
        .map((e) => {
            const label = (e.label as string | undefined) || (e.data as any)?.label;
            const isLoopBack = !!(e.data as any)?.isLoopBack;
            const isSplitTest = !!(e.data as any)?.isSplitTest;
            const edgeData: AutomationProductionEdge['data'] = {};
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

    const automation: AutomationProductionDefinition = {
        id: automationId,
        name,
        status,
        version,
        createdAt,
        updatedAt,
        nodes: productionNodes,
        edges: productionEdges,
    };

    return { automation };
}
