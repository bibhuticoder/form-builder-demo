import type { Edge, Node } from 'reactflow';
import { MarkerType } from 'reactflow';

const X_GAP = 60;
const Y_GAP = 150;
const NODE_WIDTH = 256;
const BRANCH_BUTTON_WIDTH = 100;
const BRANCH_BUTTON_SPACING = 120;

function getNodeDimensions(node: Node) {
    if (node.type === 'addStep' && node.data?.isBranchAdder) {
        return { width: 0, height: 0 };
    }
    return { width: 256, height: 92 };
}

export function restoreNodeIcons(nodes: Node[], toolboxItems: Array<{ items: Array<{ label: string; icon: any }> }>) {
    nodes.forEach((node) => {
        if (!node.data) return;
        for (const group of toolboxItems) {
            const found = group.items.find((i) => i.label === node.data.label);
            if (found) {
                node.data.icon = found.icon;
                break;
            }
        }
    });
}

export function ensureBranchAdders(nodes: Node[], edges: Edge[]) {
    const branchParents = nodes.filter((n) => ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(n.data?.label));

    branchParents.forEach((parent) => {
        const childrenEdges = edges.filter((e) => e.source === parent.id && e.sourceHandle !== 'right-source' && !e.data?.isLoopBack);
        const childrenIds = childrenEdges.map((e) => e.target);
        const children = nodes.filter((n) => childrenIds.includes(n.id) && !n.data?.isBranchAdder);
        if (children.length === 0) return;

        children.sort((a, b) => a.position.x - b.position.x);
        const lastChild = children[children.length - 1];

        const existingAdderEdge = edges.find(
            (e) => e.source === lastChild.id && nodes.find((n) => n.id === e.target)?.data?.isBranchAdder
        );
        if (existingAdderEdge) return;

        const addBranchNodeId = `add-branch-${parent.id}-restored`;
        let addBranchNode = nodes.find((n) => n.id === addBranchNodeId);
        if (!addBranchNode) {
            addBranchNode = {
                id: addBranchNodeId,
                type: 'addStep',
                position: { x: 0, y: 0 },
                data: { label: 'Add Branch', isBranchAdder: true, siblingId: lastChild.id },
                draggable: false,
                width: 60,
                height: 60,
            };
            nodes.push(addBranchNode);
        }

        edges.push({
            id: `e-${lastChild.id}-${addBranchNode.id}`,
            source: lastChild.id,
            sourceHandle: 'right-source',
            target: addBranchNode.id,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeDasharray: '5,5', opacity: 0.5 },
        });
    });
}

export function performAutoLayout(nodes: Node[], edges: Edge[]) {
    ensureBranchAdders(nodes, edges);

    const targets = new Set(edges.map((e) => e.target));
    const roots = nodes.filter((n) => !targets.has(n.id));

    if (roots.length === 0 && nodes.length > 0) {
        nodes.sort((a, b) => a.position.y - b.position.y);
        roots.push(nodes[0]);
    }

    const childrenMap = new Map<string, string[]>();
    edges.forEach((e) => {
        if (e.data?.isLoopBack) return;
        if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
        childrenMap.get(e.source)!.push(e.target);
    });

    const subtreeMetrics = new Map<string, { width: number; centerOffset: number }>();
    const visitedMetrics = new Set<string>();

    function calculateMetrics(nodeId: string): { width: number; centerOffset: number } {
        if (visitedMetrics.has(nodeId)) return subtreeMetrics.get(nodeId) || { width: NODE_WIDTH, centerOffset: NODE_WIDTH / 2 };
        visitedMetrics.add(nodeId);

        const children = childrenMap.get(nodeId) || [];
        const standardChildrenIds: string[] = [];
        const rightChildrenIds: string[] = [];
        children.forEach((childId) => {
            const edge = edges.find((e) => e.source === nodeId && e.target === childId);
            if (edge?.sourceHandle === 'right-source') rightChildrenIds.push(childId);
            else standardChildrenIds.push(childId);
        });

        const structuralChildren = standardChildrenIds
            .map((id) => nodes.find((n) => n.id === id))
            .filter(Boolean) as Node[];
        structuralChildren.sort((a, b) => {
            if (Math.abs(a.position.x - b.position.x) > 10) return a.position.x - b.position.x;
            return a.id.localeCompare(b.id);
        });

        const rightNodes = rightChildrenIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as Node[];
        let rightAttachmentWidth = 0;
        rightNodes.forEach((rn) => {
            if (rn.data?.isBranchAdder) return;
            const m = calculateMetrics(rn.id);
            rightAttachmentWidth += m.width + 20;
        });

        const node = nodes.find((n) => n.id === nodeId);
        const selfWidth = node ? getNodeDimensions(node).width : NODE_WIDTH;
        const effectiveSelfWidth = selfWidth + rightAttachmentWidth;

        const isBranchingParent = !!node && ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(node.data?.label);
        if (isBranchingParent && structuralChildren.length > 0) {
            structuralChildren.forEach((child, idx) => {
                if (child.data) child.data.isLastBranchNode = idx === structuralChildren.length - 1;
            });
        }

        if (structuralChildren.length === 0) {
            const metrics = { width: effectiveSelfWidth, centerOffset: selfWidth / 2 };
            subtreeMetrics.set(nodeId, metrics);
            return metrics;
        }

        let totalChildrenWidth = 0;
        const childMetricsList: Array<{ width: number; centerOffset: number }> = [];
        structuralChildren.forEach((child, index) => {
            const m = calculateMetrics(child.id);
            childMetricsList.push(m);
            totalChildrenWidth += m.width;
            if (index < structuralChildren.length - 1) {
                let gap = X_GAP;
                if (child.data?.isLastBranchNode) gap += BRANCH_BUTTON_SPACING;
                totalChildrenWidth += gap;
            }
        });
        if (isBranchingParent && structuralChildren.length > 0) totalChildrenWidth += BRANCH_BUTTON_WIDTH;

        let currentX = 0;
        let sumCenters = 0;
        childMetricsList.forEach((m, idx) => {
            sumCenters += currentX + m.centerOffset;
            let gap = X_GAP;
            const childNode = structuralChildren[idx];
            if (childNode?.data?.isLastBranchNode && idx < structuralChildren.length - 1) gap += BRANCH_BUTTON_SPACING;
            currentX += m.width + gap;
        });
        const averageChildrenCenter = sumCenters / childMetricsList.length;

        const width = Math.max(effectiveSelfWidth, totalChildrenWidth);
        const centerOffset = totalChildrenWidth > effectiveSelfWidth ? averageChildrenCenter : width / 2;
        const metrics = { width, centerOffset };
        subtreeMetrics.set(nodeId, metrics);
        return metrics;
    }

    roots.forEach((r) => calculateMetrics(r.id));
    nodes.forEach((n) => {
        if (!subtreeMetrics.has(n.id)) calculateMetrics(n.id);
    });

    const newPositions = new Map<string, { x: number; y: number }>();
    const visitedPos = new Set<string>();

    function assignPosition(nodeId: string, x: number, y: number) {
        if (visitedPos.has(nodeId)) return;
        visitedPos.add(nodeId);
        newPositions.set(nodeId, { x, y });

        const children = childrenMap.get(nodeId) || [];
        if (children.length === 0) return;

        const standardChildrenIds: string[] = [];
        const rightChildrenIds: string[] = [];
        children.forEach((childId) => {
            const edge = edges.find((e) => e.source === nodeId && e.target === childId);
            if (edge?.sourceHandle === 'right-source') rightChildrenIds.push(childId);
            else standardChildrenIds.push(childId);
        });

        const parentNode = nodes.find((n) => n.id === nodeId);
        const parentWidth = parentNode ? getNodeDimensions(parentNode).width : NODE_WIDTH;
        let currentRightX = x + parentWidth + 20;
        const rightNodes = rightChildrenIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as Node[];
        rightNodes.forEach((rn) => {
            assignPosition(rn.id, currentRightX, y);
            const rnWidth = getNodeDimensions(rn).width;
            const m = subtreeMetrics.get(rn.id) || { width: rnWidth, centerOffset: rnWidth / 2 };
            currentRightX += m.width + 20;
        });

        const structuralChildren = standardChildrenIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as Node[];
        if (structuralChildren.length === 0) return;
        structuralChildren.sort((a, b) => {
            if (Math.abs(a.position.x - b.position.x) > 10) return a.position.x - b.position.x;
            return a.id.localeCompare(b.id);
        });

        const isBranchingParent = !!parentNode && ['If / Else', 'Split Test (A/B)', 'Switch Case', 'Parallel'].includes(parentNode.data?.label);
        if (isBranchingParent) {
            const lastChild = structuralChildren[structuralChildren.length - 1];
            if (lastChild.data && !lastChild.data.isLastBranchNode) lastChild.data.isLastBranchNode = true;
        }

        const parentCenter = x + parentWidth / 2;
        let totalW = 0;
        let sumC = 0;
        structuralChildren.forEach((child, idx) => {
            const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions(child).width, centerOffset: getNodeDimensions(child).width / 2 };
            sumC += totalW + m.centerOffset;
            let gap = X_GAP;
            if (child.data?.isLastBranchNode && idx < structuralChildren.length - 1) gap += BRANCH_BUTTON_SPACING;
            totalW += m.width;
            if (idx < structuralChildren.length - 1) totalW += gap;
        });
        const avgCenterOffset = sumC / structuralChildren.length;
        let startX = parentCenter - avgCenterOffset;

        let currentX = startX;
        structuralChildren.forEach((child, idx) => {
            const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions(child).width, centerOffset: getNodeDimensions(child).width / 2 };
            const childCenterX = currentX + m.centerOffset;
            const childWidth = getNodeDimensions(child).width;
            const childTopLeftX = childCenterX - childWidth / 2;
            assignPosition(child.id, childTopLeftX, y + Y_GAP);
            let gap = X_GAP;
            if (child.data?.isLastBranchNode && idx < structuralChildren.length - 1) gap += BRANCH_BUTTON_SPACING;
            currentX += m.width + gap;
        });
    }

    if (roots.length > 0) {
        roots.sort((a, b) => a.position.x - b.position.x);
        const startRootX = 425 - roots.length * 170;
        roots.forEach((root, idx) => assignPosition(root.id, startRootX + idx * 340, 50));
    }

    const incomingEdgesMap = new Map<string, string[]>();
    edges.forEach((e) => {
        if (!incomingEdgesMap.has(e.target)) incomingEdgesMap.set(e.target, []);
        incomingEdgesMap.get(e.target)!.push(e.source);
    });

    incomingEdgesMap.forEach((parentIds, nodeId) => {
        if (parentIds.length <= 1) return;
        let sumX = 0;
        let count = 0;
        parentIds.forEach((pid) => {
            const pos = newPositions.get(pid) || nodes.find((n) => n.id === pid)?.position;
            if (!pos) return;
            const parentNode = nodes.find((n) => n.id === pid);
            const width = parentNode ? (parentNode.type === 'addStep' && parentNode.data?.isBranchAdder ? 60 : 280) : 280;
            sumX += pos.x + width / 2;
            count++;
        });
        if (count === 0) return;
        const avgCenterX = sumX / count;
        const currentNodePos = newPositions.get(nodeId) || nodes.find((n) => n.id === nodeId)?.position;
        if (!currentNodePos) return;
        const node = nodes.find((n) => n.id === nodeId);
        const nodeWidth = node ? (node.type === 'addStep' && node.data?.isBranchAdder ? 60 : 280) : 280;
        const targetX = avgCenterX - nodeWidth / 2;
        const deltaX = targetX - currentNodePos.x;
        newPositions.set(nodeId, { x: targetX, y: currentNodePos.y });

        const queue = [nodeId];
        const visited = new Set<string>([nodeId]);
        while (queue.length > 0) {
            const curr = queue.shift()!;
            const kids = childrenMap.get(curr) || [];
            kids.forEach((kid) => {
                if (visited.has(kid)) return;
                visited.add(kid);
                queue.push(kid);
                const kidPos = newPositions.get(kid);
                const kidNode = nodes.find((n) => n.id === kid);
                if (kidPos) newPositions.set(kid, { x: kidPos.x + deltaX, y: kidPos.y });
                else if (kidNode) newPositions.set(kid, { x: kidNode.position.x + deltaX, y: kidNode.position.y });
            });
        }
    });

    const rootIds = new Set(roots.map((r) => r.id));
    return nodes.map((n) => {
        const pos = newPositions.get(n.id);
        const isRoot = rootIds.has(n.id);
        const data = { ...n.data, isRoot };
        if (pos) return { ...n, position: pos, data };
        return { ...n, data };
    });
}
