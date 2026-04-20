import { http, HttpResponse, delay } from 'msw';
import type { SerializedWorkflow, SimulationResult, SimulationStep } from '../types/workflow';

const AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_jira', label: 'Create Jira Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'send_sms', label: 'Send SMS', params: ['phone', 'message'] },
  { id: 'update_hrms', label: 'Update HRMS Record', params: ['employeeId', 'field', 'value'] },
];

function simulateGraph(workflow: SerializedWorkflow): SimulationResult {
  const steps: SimulationStep[] = [];
  const errors: string[] = [];

  const { nodes, edges } = workflow;

  if (!nodes.length) {
    return { success: false, steps: [], errors: ['Workflow has no nodes.'] };
  }

  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    return { success: false, steps: [], errors: ['No Start node found.'] };
  }

  // Topological traversal
  const adjacency: Record<string, string[]> = {};
  nodes.forEach((n) => (adjacency[n.id] = []));
  edges.forEach((e) => adjacency[e.source]?.push(e.target));

  const visited = new Set<string>();
  const queue = [startNode.id];
  let ts = Date.now();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const data = node.data as unknown as Record<string, unknown>;
    const label = (data.title as string) ?? (data.endMessage as string) ?? node.id;

    let status: SimulationStep['status'] = 'success';
    let message = '';

    switch (node.type) {
      case 'start':
        message = `Workflow initiated: "${label}"`;
        break;
      case 'task':
        message = `Task "${label}" assigned to ${(data.assignee as string) || 'Unassigned'}. Due: ${(data.dueDate as string) || 'No deadline'}.`;
        if (!data.assignee) { status = 'warning'; message += ' ⚠ No assignee set.'; }
        break;
      case 'approval':
        message = `Approval requested from ${(data.approverRole as string) || 'Unknown role'}. Threshold: ${data.autoApproveThreshold ?? 0} days.`;
        break;
      case 'automated': {
        const actionId = data.actionId as string;
        const action = AUTOMATIONS.find((a) => a.id === actionId);
        if (!action) {
          status = 'error';
          message = `No action selected for automated step "${label}".`;
          errors.push(message);
        } else {
          message = `Executing "${action.label}" with params: ${action.params.map((p) => `${p}="${(data.actionParams as Record<string,string>)[p] ?? ''}`).join(', ')}.`;
        }
        break;
      }
      case 'end':
        message = `Workflow ended: "${(data.endMessage as string) || 'Done'}". Summary: ${data.showSummary ? 'Enabled' : 'Disabled'}.`;
        break;
      default:
        message = `Processing node "${currentId}"`;
    }

    steps.push({ nodeId: currentId, nodeType: node.type, label, status, message, timestamp: ts });
    ts += 800;

    for (const next of adjacency[currentId]) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  const unvisited = nodes.filter((n) => !visited.has(n.id));
  unvisited.forEach((n) => {
    const data = n.data as Record<string, unknown>;
    errors.push(`Node "${(data.title as string) ?? n.id}" is unreachable from Start.`);
  });

  return {
    success: errors.length === 0,
    steps,
    errors,
  };
}

export const handlers = [
  http.get('/api/automations', async () => {
    await delay(300);
    return HttpResponse.json(AUTOMATIONS);
  }),

  http.post('/api/simulate', async ({ request }) => {
    await delay(800);
    const workflow = (await request.json()) as SerializedWorkflow;
    const result = simulateGraph(workflow);
    return HttpResponse.json(result);
  }),
];
