import type { WorkflowNode, WorkflowEdge } from "../types/workflow";

export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
) => {
  const errors: string[] = [];

  // 1. Connectivity Check
  // Every node (except potentially the Start node in an empty graph)
  // should have at least one connection.
  if (nodes.length > 1) {
    nodes.forEach((node) => {
      const isConnected = edges.some(
        (e) => e.source === node.id || e.target === node.id,
      );
      if (!isConnected) {
        errors.push(`Node "${node.data.title || node.type}" is disconnected.`);
      }
    });
  }

  // 2. Start/End Node Constraints
  const startNodes = nodes.filter((n) => n.type === "startNode");
  const endNodes = nodes.filter((n) => n.type === "endNode");

  if (startNodes.length === 0) errors.push("Workflow must have a Start Node.");
  if (startNodes.length > 1)
    errors.push("Workflow cannot have more than one Start Node.");
  if (endNodes.length === 0) errors.push("Workflow must have an End Node.");
  // Workflows should generally be Directed Acyclic Graphs (DAGs).
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push("Structural Error: The workflow contains a loop (cycle).");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Depth-First Search to detect cycles in a directed graph
function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjList = new Map<string, string[]>();
  nodes.forEach((node) => adjList.set(node.id, []));
  edges.forEach((edge) => adjList.get(edge.source)?.push(edge.target));

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const isCyclic = (v: string): boolean => {
    if (!visited.has(v)) {
      visited.add(v);
      recStack.add(v);

      const neighbors = adjList.get(v) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && isCyclic(neighbor)) return true;
        if (recStack.has(neighbor)) return true;
      }
    }
    recStack.delete(v);
    return false;
  };

  for (const node of nodes) {
    if (isCyclic(node.id)) return true;
  }
  return false;
}
