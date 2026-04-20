import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '../store/workflowStore';
import type { SerializedWorkflow, NodeType } from '../types/workflow';

export function serializeWorkflow(nodes: WorkflowNode[], edges: Edge[]): SerializedWorkflow {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type as NodeType,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : undefined,
    })),
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
    },
  };
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
