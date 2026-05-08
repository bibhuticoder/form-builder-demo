import type { Edge, Node } from 'reactflow';
import { MarkerType } from 'reactflow';
import { generateEdgeId } from './hash';
import { SPLIT_TEST_MIN_BRANCHES } from '../constants';

const X_GAP = 60;
const Y_GAP = 150;
const NODE_WIDTH = 256;

function getNodeDimensions() {
    return { width: 256, height: 92 };
}

function buildEvenWeights(count: number) {
    const evenValue = Math.floor(100 / count);
    const weights = Array(count).fill(evenValue);
    weights[count - 1] = 100 - evenValue * (count - 1);
    return weights;
}

function truncateToTwo(value: number) {
    return Math.trunc(value * 100) / 100;
}

function resolveSplitTestWeights(raw: unknown, count: number) {
    if (Array.isArray(raw) && raw.length === count && raw.every((w) => typeof w === 'number')) {
        const normalized = (raw as number[]).map((w) => truncateToTwo(w));
        const sum = normalized.reduce((total, value) => total + value, 0);
        const delta = truncateToTwo(100 - sum);
        normalized[normalized.length - 1] = truncateToTwo(normalized[normalized.length - 1] + delta);
        return normalized;
    }
    return buildEvenWeights(count);
}

export function restoreNodeIcons(nodes: Node[], toolboxGroups: Array<{ items: Array<any> }>) {
    nodes.forEach((node) => {
        if (!node.data) return;

        // Strategy 1: Match iconName explicitly
        // Strategy 2: Match by label as fallback
        for (const group of toolboxGroups) {
            const byName = group.items.find((i) => i.iconName === node.data.iconName);
            if (byName) {
                node.data.icon = byName.icon;
                return;
            }

            const byLabel = group.items.find((i) => i.label === node.data.label);
            if (byLabel) {
                node.data.icon = byLabel.icon;
                node.data.iconName = byLabel.iconName;
                return;
            }
        }
    });
}


export function ensureStepSlots(nodes: Node[], edges: Edge[]) {
    const nonTerminalNodes = nodes.filter((n) => {
        if (n.type === 'addStep') return false;
        if (n.type === 'placeholder') return false;
        if (['End Automation', 'Send To Automation', 'Loop Back To'].includes(n.data?.label)) return false;
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
                const trueLabel = (node.data?.trueLabel || 'YES').toUpperCase();
                const falseLabel = (node.data?.falseLabel || 'NO').toUpperCase();

                const hasTrueBranch = childrenEdges.some(e => {
                    if (e.data?.conditionType === 'true') return true;
                    if (e.sourceHandle === 'true') return true;
                    const label = String(e.label || e.data?.label || '').toUpperCase();
                    return label === 'YES' || label === 'TRUE' || label === 'SUCCESS' || label === trueLabel;
                });
                const hasFalseBranch = childrenEdges.some(e => {
                    if (e.data?.conditionType === 'false') return true;
                    if (e.sourceHandle === 'false') return true;
                    const label = String(e.label || e.data?.label || '').toUpperCase();
                    return label === 'NO' || label === 'FALSE' || label === 'FAIL' || label === falseLabel;
                });

                if (!hasTrueBranch) {
                    const slotId = `add-step-${node.id}-true-${Date.now()}`;
                    nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + Y_GAP }, data: { label: 'Add Step' }, draggable: false, width: NODE_WIDTH, height: 92 });
                    edges.push({
                        id: generateEdgeId(node.id, slotId),
                        source: node.id,
                        target: slotId,
                        type: 'custom',
                        markerEnd: { type: MarkerType.ArrowClosed },
                        label: node.data?.trueLabel || 'YES',
                        data: { isCondition: true, conditionType: 'true' }
                    });
                }
                if (!hasFalseBranch) {
                    const slotId = `add-step-${node.id}-false-${Date.now()}`;
                    nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + Y_GAP }, data: { label: 'Add Step' }, draggable: false, width: NODE_WIDTH, height: 92 });
                    edges.push({
                        id: generateEdgeId(node.id, slotId),
                        source: node.id,
                        target: slotId,
                        type: 'custom',
                        markerEnd: { type: MarkerType.ArrowClosed },
                        label: node.data?.falseLabel || 'NO',
                        data: { isCondition: true, conditionType: 'false' }
                    });
                }

                // Update existing labels if data changed, and also fix missing conditionType/sourceHandle
                edges.forEach(e => {
                    if (e.source === node.id) {
                        const label = String(e.label || e.data?.label || '').toUpperCase();
                        if (e.data?.conditionType === 'true' || e.sourceHandle === 'true' || label === 'YES' || label === 'TRUE' || label === trueLabel) {
                            e.data = { ...(e.data || {}), isCondition: true, conditionType: 'true' };
                            e.label = node.data?.trueLabel || 'YES';
                            e.sourceHandle = 'true';
                        } else if (e.data?.conditionType === 'false' || e.sourceHandle === 'false' || label === 'NO' || label === 'FALSE' || label === falseLabel) {
                            e.data = { ...(e.data || {}), isCondition: true, conditionType: 'false' };
                            e.label = node.data?.falseLabel || 'NO';
                            e.sourceHandle = 'false';
                        }
                    }
                });
            } else if (isSplitTest) {
                const rawWeights = Array.isArray(node.data?.weights)
                    ? node.data?.weights
                    : Array.isArray(node.data?.config?.weights)
                        ? node.data?.config?.weights
                        : undefined;
                const desiredCount = Math.max(SPLIT_TEST_MIN_BRANCHES, childrenEdges.length, Array.isArray(rawWeights) ? rawWeights.length : 0);
                const appliedWeights = resolveSplitTestWeights(rawWeights, desiredCount);

                if (childrenEdges.length < desiredCount) {
                    const missingCount = desiredCount - childrenEdges.length;
                    for (let i = 0; i < missingCount; i++) {
                        const slotId = `add-step-${node.id}-split-${Date.now()}-${i}`;
                        nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + 150 }, data: { label: 'Add Step' }, draggable: false, width: 256, height: 92 });
                        edges.push({
                            id: generateEdgeId(node.id, slotId),
                            source: node.id,
                            target: slotId,
                            type: 'smoothstep',
                            markerEnd: { type: MarkerType.ArrowClosed },
                            label: `${appliedWeights[childrenEdges.length + i]}%`,
                            data: { label: `${appliedWeights[childrenEdges.length + i]}%`, isSplitTest: true }
                        });
                    }
                }

                const splitEdges = edges
                    .filter((e) => e.source === node.id && e.sourceHandle !== 'right-source' && !e.data?.isLoopBack)
                    .sort((a, b) => a.id.localeCompare(b.id));
                splitEdges.forEach((edge, idx) => {
                    const weight = appliedWeights[idx] ?? 0;
                    const label = `${weight}%`;
                    edge.label = label;
                    edge.data = { ...(edge.data || {}), label, isSplitTest: true };
                });
            }
        } else {
            // Standard nodes must have exactly one child edge
            if (childrenEdges.length === 0) {
                const slotId = `add-step-${node.id}-auto`;
                nodes.push({ id: slotId, type: 'addStep', position: { x: node.position.x, y: node.position.y + 150 }, data: { label: 'Add Step' }, draggable: false, width: 256, height: 92 });
                edges.push({ id: generateEdgeId(node.id, slotId), source: node.id, target: slotId, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } });
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

        const parent = nodes.find(n => n.id === nodeId);
        const isIfElse = parent?.data?.label === 'If / Else';

        structuralChildren.sort((a, b) => {
            if (isIfElse) {
                const edgeA = edges.find(e => e.source === nodeId && e.target === a.id);
                const edgeB = edges.find(e => e.source === nodeId && e.target === b.id);
                const typeA = edgeA?.data?.conditionType || '';
                const typeB = edgeB?.data?.conditionType || '';
                if (typeA === 'true' && typeB === 'false') return -1;
                if (typeA === 'false' && typeB === 'true') return 1;
            }
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

        const selfWidth = getNodeDimensions().width;
        const effectiveSelfWidth = selfWidth + rightAttachmentWidth;


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
                totalChildrenWidth += X_GAP;
            }
        });

        let currentX = 0;
        let sumCenters = 0;
        childMetricsList.forEach((m) => {
            sumCenters += currentX + m.centerOffset;
            currentX += m.width + X_GAP;
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

        const parentWidth = getNodeDimensions().width;
        let currentRightX = x + parentWidth + 20;
        const rightNodes = rightChildrenIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as Node[];
        rightNodes.forEach((rn) => {
            assignPosition(rn.id, currentRightX, y);
            const rnWidth = getNodeDimensions().width;
            const m = subtreeMetrics.get(rn.id) || { width: rnWidth, centerOffset: rnWidth / 2 };
            currentRightX += m.width + 20;
        });

        const structuralChildren = standardChildrenIds.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as Node[];
        if (structuralChildren.length === 0) return;

        const parent = nodes.find(n => n.id === nodeId);
        const isIfElse = parent?.data?.label === 'If / Else';

        structuralChildren.sort((a, b) => {
            if (isIfElse) {
                const edgeA = edges.find(e => e.source === nodeId && e.target === a.id);
                const edgeB = edges.find(e => e.source === nodeId && e.target === b.id);
                const typeA = edgeA?.data?.conditionType || '';
                const typeB = edgeB?.data?.conditionType || '';
                // 'true' first (left), then 'false' (right)
                if (typeA === 'true' && typeB === 'false') return -1;
                if (typeA === 'false' && typeB === 'true') return 1;
            }
            if (Math.abs(a.position.x - b.position.x) > 10) return a.position.x - b.position.x;
            return a.id.localeCompare(b.id);
        });


        const parentCenter = x + parentWidth / 2;
        let totalW = 0;
        let sumC = 0;
        structuralChildren.forEach((child) => {
            const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions().width, centerOffset: getNodeDimensions().width / 2 };
            sumC += totalW + m.centerOffset;
            totalW += m.width + (structuralChildren.indexOf(child) < structuralChildren.length - 1 ? X_GAP : 0);
        });
        const avgCenterOffset = sumC / structuralChildren.length;
        let startX = parentCenter - avgCenterOffset;

        let currentX = startX;
        structuralChildren.forEach((child) => {
            const m = subtreeMetrics.get(child.id) || { width: getNodeDimensions().width, centerOffset: getNodeDimensions().width / 2 };
            const childCenterX = currentX + m.centerOffset;
            const childWidth = getNodeDimensions().width;
            const childTopLeftX = childCenterX - childWidth / 2;
            assignPosition(child.id, childTopLeftX, y + Y_GAP);
            currentX += m.width + X_GAP;
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

            const rootsPackedWidth = cluster.reduce((acc, _, idx) => {
                const rootWidth = getNodeDimensions().width;
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
                const rootWidth = getNodeDimensions().width;
                assignPosition(root.id, currentRootX, 50);
                const gap = idx < cluster.length - 1 ? 60 : 0;
                currentRootX += rootWidth + gap;
            });
            clusterStartX += totalWidth + cm.clusterGap;
        });
    }

    const incomingEdgesMap = new Map<string, string[]>();
    edges.forEach((e) => {
        if (e.data?.isLoopBack) return; // Skip loopbacks for horizontal centering math
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
    const finalNodes = nodes.map((n) => {
        const pos = newPositions.get(n.id);
        const isRoot = rootIds.has(n.id);
        const data = { ...n.data, isRoot };
        if (pos) return { ...n, position: pos, data };
        return { ...n, data };
    });

    return { nodes: finalNodes, edges };
}
