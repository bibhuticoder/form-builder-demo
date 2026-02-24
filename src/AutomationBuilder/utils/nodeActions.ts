import type { Edge } from 'reactflow';

export function deleteNodeAndDescendants(
    id: string,
    deleteElements: (params: { nodes: { id: string }[] }) => void,
    getEdges: () => Edge[]
) {
    const edges = getEdges();
    const nodesToDelete = new Set<string>();

    const traverse = (nodeId: string) => {
        if (nodesToDelete.has(nodeId)) return;
        nodesToDelete.add(nodeId);

        const outgoingEdges = edges.filter((e) => e.source === nodeId);
        outgoingEdges.forEach((edge) => {
            if (edge.data?.isLoopBack) return;
            if (!nodesToDelete.has(edge.target)) traverse(edge.target);
        });
    };

    traverse(id);
    deleteElements({ nodes: Array.from(nodesToDelete).map((nodeId) => ({ id: nodeId })) });
}
