import type { Edge, Node } from 'reactflow';

export type ValidationIssue = {
  level: 'error' | 'warning';
  message: string;
  nodeId?: string;
  edgeId?: string;
};

function isLoopBackNode(node: Node) {
  // Support both UI builder type and PRD type naming.
  return node.type === 'loopBack' || node.type === 'loop_back' || node.data?.label === 'Loop Back To' || node.data?.label === 'Loop Back';
}

function isTriggerNode(node: Node) {
  return node.type === 'trigger' || node.data?.label === 'Form Submitted' || node.data?.label === 'Tag Added' || node.data?.label === 'Tag Removed';
}

function isLogicNode(node: Node) {
  // Builder uses `condition` for both If/Else and Split Test cards.
  const label = node.data?.label;
  return node.type === 'condition' || node.type === 'logic_if_else' || node.type === 'logic_split_test' || label === 'If / Else' || label === 'Split Test (A/B)';
}

function isAddStepOrPlaceholder(node: Node) {
  return node.type === 'addStep' || node.type === 'placeholder' || node.data?.label === 'Add Step' || node.data?.label === 'Add Branch';
}

function isFlowEdge(edge: Edge) {
  if (edge.data?.isLoopBack) return false;
  if (edge.sourceHandle === 'right-source') return false;
  return true;
}

export function validateAutomationGraph(nodes: Node[], edges: Edge[]) {
  const issues: ValidationIssue[] = [];

  const nodesById = new Map(nodes.map((n) => [n.id, n] as const));
  const incoming: Record<string, Edge[]> = {};
  const outgoingFlow: Record<string, Edge[]> = {};
  const outgoingAll: Record<string, Edge[]> = {};

  edges.forEach((e) => {
    (incoming[e.target] ||= []).push(e);
    (outgoingAll[e.source] ||= []).push(e);
    if (isFlowEdge(e)) (outgoingFlow[e.source] ||= []).push(e);
  });

  // Trigger rules
  nodes.filter((n) => isTriggerNode(n) && !isAddStepOrPlaceholder(n)).forEach((trigger) => {
    const inEdges = (incoming[trigger.id] || []).filter((e) => isFlowEdge(e));
    if (inEdges.length > 0) {
      issues.push({ level: 'error', nodeId: trigger.id, message: 'Trigger nodes cannot have incoming edges.' });
    }
    const outEdges = outgoingFlow[trigger.id] || [];
    if (outEdges.length !== 1) {
      issues.push({ level: 'error', nodeId: trigger.id, message: 'Trigger nodes must have exactly 1 outgoing path.' });
    }
  });

  // Nodes that must have at least 1 outgoing path
  nodes.forEach((n) => {
    if (isAddStepOrPlaceholder(n)) return;
    if (isTriggerNode(n) || isLogicNode(n) || isLoopBackNode(n)) {
      const out = outgoingFlow[n.id] || [];
      if (out.length < 1) {
        issues.push({ level: 'error', nodeId: n.id, message: 'This node must have at least 1 outgoing path.' });
      }
    }
  });

  // Loop back rules
  nodes.filter((n) => isLoopBackNode(n) && !isAddStepOrPlaceholder(n)).forEach((loopNode) => {
    const maxLoops = (loopNode.data as any)?.config?.maxLoops ?? (loopNode.data as any)?.maxLoops;
    if (!(Number.isInteger(maxLoops) && maxLoops > 0)) {
      issues.push({ level: 'error', nodeId: loopNode.id, message: 'Loop Back must define a positive integer maxLoops safety limit.' });
    }
    const loopEdges = (outgoingAll[loopNode.id] || []).filter((e) => e.data?.isLoopBack);
    if (loopEdges.length === 0) {
      issues.push({ level: 'error', nodeId: loopNode.id, message: 'Loop Back must have at least one loopback edge (isLoopBack=true).' });
    }
  });

  // Edge sanity checks
  edges.forEach((e) => {
    if (!nodesById.has(e.source)) issues.push({ level: 'error', edgeId: e.id, message: 'Edge source node does not exist.' });
    if (!nodesById.has(e.target)) issues.push({ level: 'error', edgeId: e.id, message: 'Edge target node does not exist.' });
    if (e.data?.isLoopBack) {
      const sourceNode = nodesById.get(e.source);
      if (sourceNode && !isLoopBackNode(sourceNode)) {
        issues.push({ level: 'error', edgeId: e.id, nodeId: e.source, message: 'Only Loop Back nodes can create loopback edges.' });
      }
    }
  });

  // Disallow cycles that are not explicitly loopback edges.
  // We run cycle detection on the flow edges only.
  const flowAdj: Record<string, string[]> = {};
  edges.filter(isFlowEdge).forEach((e) => {
    (flowAdj[e.source] ||= []).push(e.target);
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycleFrom = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of flowAdj[id] || []) {
      if (hasCycleFrom(next)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  const anyCycle = nodes.some((n) => !isAddStepOrPlaceholder(n) && hasCycleFrom(n.id));
  if (anyCycle) {
    issues.push({ level: 'error', message: 'Cycles without explicit loopback edges are not allowed.' });
  }

  return issues;
}
