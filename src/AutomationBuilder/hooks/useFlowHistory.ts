import { useCallback, useState } from 'react';
import type { Edge, Node } from 'reactflow';

export function useFlowHistory() {
    const [past, setPast] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
    const [future, setFuture] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);

    const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
        setPast((p) => [...p.slice(-19), { nodes, edges }]);
        setFuture([]);
    }, []);

    const undo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        if (past.length === 0) return null;
        const newPast = [...past];
        const previousState = newPast.pop();
        if (!previousState) return null;
        setFuture((f) => [{ nodes: currentNodes, edges: currentEdges }, ...f]);
        setPast(newPast);
        return previousState;
    }, [past]);

    const redo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        if (future.length === 0) return null;
        const newFuture = [...future];
        const nextState = newFuture.shift();
        if (!nextState) return null;
        setPast((p) => [...p, { nodes: currentNodes, edges: currentEdges }]);
        setFuture(newFuture);
        return nextState;
    }, [future]);

    return {
        past,
        future,
        takeSnapshot,
        undo,
        redo,
    };
}
