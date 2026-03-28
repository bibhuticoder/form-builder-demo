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


export function ensureStepSlots(nodes: Node[], edges: Edge[]) {
    const nonTerminalNodes = nodes.filter((n) => {
        if (n.type === 'addStep') return false;
        if (n.type === 'placeholder') return false;
        if (['End Automation', 'Send To Automation'].includes(n.data?.label)) return false;
        return true;
    });

    nonTerminalNodes.forEach((node) => {
        const title = node.data?.label;
        const isIfElse = title === 'If / Else';
        const isSplitTest = title === 'Split Test (A/B)';
        const isBranching = isIfElse || isSplitTest || ['Switch Case', 'Parallel'].includes(title);
        
        const childrenEdges = edges.filter((e) => e.source === node.id && e.sourceHandle !== 'right-source' && !e.data?.isLoopBack);
        
        if (isBranching) {
            if (isIfElse) {
                const hasYes = childrenEdges.some(e => e.label === 'YES');
                const hasNo = childrenEdges.some(e => e.label === 'NO');
                
                if (!hasYes) {
                    const slotId = `add-step-${node.id}-yes`;
                    nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x - 140, y: node.position.y + 150 }, data: { label: 'Add Step' }, draggable: false, width: 256, height: 92 });
                    edges.push({ id: `e-${node.id}-${slotId}`, source: node.id, target: slotId, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, label: 'YES', data: { isCondition: true } });
                }
                if (!hasNo) {
                    const slotId = `add-step-${node.id}-no`;
                    nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x + 140, y: node.position.y + 150 }, data: { label: 'Add Step', isLastBranchNode: true }, draggable: false, width: 256, height: 92 });
                    edges.push({ id: `e-${node.id}-${slotId}`, source: node.id, target: slotId, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, label: 'NO', data: { isCondition: true } });
                }
            } else if (isSplitTest) {
                // For Split Test, we need at least 2 branches.
                if (childrenEdges.length < 2) {
                    const missingCount = 2 - childrenEdges.length;
                    for (let i = 0; i < missingCount; i++) {
                        const slotId = `add-step-${node.id}-split-${Date.now()}-${i}`;
                        nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + 150 }, data: { label: 'Add Step' }, draggable: false, width: 256, height: 92 });
                        edges.push({ id: `e-${node.id}-${slotId}`, source: node.id, target: slotId, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, label: '50%', data: { isSplitTest: true } });
                    }
                }
            }
        } else {
            // Standard nodes must have exactly one child edge
            if (childrenEdges.length === 0) {
                const slotId = `add-step-${node.id}-auto`;
                nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + 150 }, data: { label: 'Add Step' }, draggable: false, width: 256, height: 92 });
                edges.push({ id: `e-${node.id}-${slotId}`, source: node.id, target: slotId, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } });
            }
        }
    });
}

export function performAutoLayout(nodes: Node[], edges: Edge[]) {
    // 1. Ensure minimal structural nodes exist
    ensureStepSlots(nodes, edges);

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

    // 4. Assign positions for all roots (Centered & Clustered)
    if (roots.length > 0) {
        // Sort roots by X to maintain left-to-right order (if they had prev positions)
        roots.sort((a, b) => a.position.x - b.position.x);

        // --- ROOT CLUSTERING LOGIC ---
        // Group roots that share the same first child (Multiplexing Triggers)
        // This prevents triggers from spreading apart when they feed into the same wide tree.
        const rootClusters: Node[][] = [];
        const processedRoots = new Set<string>();

        roots.forEach((root) => {
            if (processedRoots.has(root.id)) return;

            // Start a new cluster
            const cluster = [root];
            processedRoots.add(root.id);

            // Find siblings that share children with this root
            const rootChildren = childrenMap.get(root.id) || [];
            roots.forEach((otherRoot) => {
                if (processedRoots.has(otherRoot.id)) return;
                const otherChildren = childrenMap.get(otherRoot.id) || [];
                // Check intersection
                const sharesChild = rootChildren.some((childId) => otherChildren.includes(childId));
                if (sharesChild) {
                    cluster.push(otherRoot);
                    processedRoots.add(otherRoot.id);
                }
            });
            rootClusters.push(cluster);
        });

        // Layout Clusters
        const globalCenterX = 425;
        const clusterMetrics = rootClusters.map((cluster, i) => {
            let maxSubtreeWidth = 0;
            let maxCenterOffset = 0;

            cluster.forEach((root) => {
                const m = subtreeMetrics.get(root.id) || { width: NODE_WIDTH, centerOffset: NODE_WIDTH / 2 };
                if (m.width > maxSubtreeWidth) maxSubtreeWidth = m.width;
                if (m.centerOffset > maxCenterOffset) maxCenterOffset = m.centerOffset;
            });

            const rootsPackedWidth = cluster.reduce((acc, root, idx) => {
                const rootWidth = getNodeDimensions(root).width;
                const gap = idx < cluster.length - 1 ? 60 : 0;
                return acc + rootWidth + gap;
            }, 0);

            const clusterTotalWidth = Math.max(maxSubtreeWidth, rootsPackedWidth);
            const clusterGap = i < rootClusters.length - 1 ? 100 : 0;

            return {
                cluster,
                totalWidth: clusterTotalWidth,
                rootsPackedWidth,
                maxCenterOffset,
                clusterGap,
            };
        });

        const totalAllClustersWidth = clusterMetrics.reduce((acc, c) => acc + c.totalWidth + c.clusterGap, 0);
        let clusterStartX = globalCenterX - totalAllClustersWidth / 2;

        clusterMetrics.forEach((cm) => {
            const { cluster, totalWidth, rootsPackedWidth, maxCenterOffset } = cm;
            const treeStemX = clusterStartX + maxCenterOffset;
            let currentRootX = treeStemX - rootsPackedWidth / 2;

            cluster.forEach((root, idx) => {
                const rootWidth = getNodeDimensions(root).width;
                assignPosition(root.id, currentRootX, 50);
                const gap = idx < cluster.length - 1 ? 60 : 0;
                currentRootX += rootWidth + gap;
            });
            clusterStartX += totalWidth + cm.clusterGap;
        });
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
