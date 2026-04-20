import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '../store/workflowStore';
import type { ValidationError, ValidationResult } from '../types/workflow';

export function validateWorkflow(nodes: WorkflowNode[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have exactly one Start node.', severity: 'error' });
  } else if (startNodes.length > 1) {
    errors.push({ message: 'Workflow must have only one Start node.', severity: 'error' });
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Multiple Start nodes found.', severity: 'error' })
    );
  }

  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node.', severity: 'error' });
  }

  // Detect orphan nodes (no connections at all)
  if (nodes.length > 1) {
    nodes.forEach((node) => {
      const hasEdge = edges.some((e) => e.source === node.id || e.target === node.id);
      if (!hasEdge) {
        errors.push({
          nodeId: node.id,
          message: `Node "${(node.data as { title?: string; endMessage?: string }).title ?? node.id}" is not connected to any other node.`,
          severity: 'warning',
        });
      }
    });
  }

  // Detect cycle (simple DFS)
  const adjacency: Record<string, string[]> = {};
  nodes.forEach((n) => (adjacency[n.id] = []));
  edges.forEach((e) => adjacency[e.source]?.push(e.target));

  const visited = new Set<string>();
  const inStack = new Set<string>();
  let hasCycle = false;

  function dfs(id: string) {
    visited.add(id);
    inStack.add(id);
    for (const neighbor of adjacency[id] ?? []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (inStack.has(neighbor)) {
        hasCycle = true;
      }
    }
    inStack.delete(id);
  }

  nodes.forEach((n) => {
    if (!visited.has(n.id)) dfs(n.id);
  });

  if (hasCycle) {
    errors.push({ message: 'Workflow contains a cycle. Cycles are not allowed.', severity: 'error' });
  }

  return { valid: errors.filter((e) => e.severity === 'error').length === 0, errors };
}
