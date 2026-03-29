import type { Edge, Node } from 'reactflow';

/**
 * Deletes a node and all its descending path.
 * This ensures the flow remains valid by removing downstream dependencies.
 */
export function deleteNodeAndDescendants(
    id: string,
    deleteElements: (params: { nodes: { id: string }[] }) => void,
    getEdges: () => Edge[]
) {
    const edges = getEdges();
    
    const nodesToDelete = new Set<string>();
    const queue = [id];
    nodesToDelete.add(id);

    // Iterative approach:
    // For each node in the deletion set, check its children.
    // A child should be added to the deletion set if ALL its non-loopback incoming edges 
    // come from nodes that are already in the nodesToDelete set.
    
    let index = 0;
    while (index < queue.length) {
        const nodeId = queue[index++];
        
        // Find all outgoing children of the current node
        const children = edges.filter(e => e.source === nodeId && !e.data?.isLoopBack).map(e => e.target);
        
        for (const childId of children) {
            if (nodesToDelete.has(childId)) continue;
            
            // Check all incoming parents of this child
            const parents = edges.filter(e => e.target === childId && !e.data?.isLoopBack);
            const allParentsAreDeleted = parents.every(p => nodesToDelete.has(p.source));
            
            if (allParentsAreDeleted) {
                nodesToDelete.add(childId);
                queue.push(childId);
            }
        }
    }

    deleteElements({ nodes: Array.from(nodesToDelete).map((nodeId) => ({ id: nodeId })) });
}

/**
 * Duplicates a specific node.
 * For now, it creates a shallow copy with a slight visual offset.
 */
export function duplicateNode(
    id: string,
    getNodes: () => Node[],
    addNodes: (nodes: Node[]) => void
) {
    const nodes = getNodes();
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    const newNodeId = `${node.type}-${Date.now()}`;
    const newNode: Node = {
        ...node,
        id: newNodeId,
        position: {
            x: node.position.x + 40,
            y: node.position.y + 40,
        },
        selected: true,
        data: {
            ...node.data,
            // Ensure any unique state is reset
            isRoot: false,
            isTargetable: false,
        }
    };

    addNodes([newNode]);
}
