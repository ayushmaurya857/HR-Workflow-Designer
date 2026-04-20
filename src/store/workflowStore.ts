import { create } from 'zustand';
import {
  type Node,
  type Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { WorkflowNodeData, NodeType, ValidationError } from '../types/workflow';

export type WorkflowNode = Node<WorkflowNodeData>;
// Alias to make applyNodeChanges compatible
type AnyNode = Node<Record<string, unknown>>;

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  theme: 'light' | 'dark';

  // Actions
  toggleTheme: () => void;

  // Canvas actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node management
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  setSelectedNode: (id: string | null) => void;

  // Validation
  setValidationErrors: (errors: ValidationError[]) => void;

  // Import
  importWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => void;

  // Reset
  clearCanvas: () => void;
}

const DEFAULT_DATA: Record<NodeType, WorkflowNodeData> = {
  start:     { type: 'start',     title: 'Start',              metadata: [] },
  task:      { type: 'task',      title: 'New Task',            description: '', assignee: '', dueDate: '', customFields: [] },
  approval:  { type: 'approval',  title: 'Approval Required',   approverRole: 'Manager', autoApproveThreshold: 0 },
  automated: { type: 'automated', title: 'Automated Step',      actionId: '', actionParams: {} },
  end:       { type: 'end',       endMessage: 'Workflow completed successfully.', showSummary: true },
};

// ─── Sample Onboarding Workflow ───────────────────────────────────────────────
const SAMPLE_NODES: WorkflowNode[] = [
  {
    id: 'start-demo', type: 'start', position: { x: 340, y: 60 },
    data: { type: 'start', title: 'Employee Onboarding', metadata: [{ key: 'department', value: 'Engineering' }, { key: 'priority', value: 'high' }] },
  },
  {
    id: 'task-demo1', type: 'task', position: { x: 340, y: 190 },
    data: { type: 'task', title: 'Collect Documents', description: 'Gather ID, address proof, and educational certificates from the new hire.', assignee: 'hr.team@company.com', dueDate: '2025-05-01', customFields: [{ key: 'checklist', value: 'ID, Degree, Address Proof' }] },
  },
  {
    id: 'approval-demo', type: 'approval', position: { x: 340, y: 340 },
    data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 },
  },
  {
    id: 'auto-demo', type: 'automated', position: { x: 340, y: 490 },
    data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new.hire@company.com', subject: 'Welcome to the team!', body: 'Your onboarding is complete.' } },
  },
  {
    id: 'end-demo', type: 'end', position: { x: 340, y: 630 },
    data: { type: 'end', endMessage: 'Onboarding completed! IT access will be provisioned within 24 hours.', showSummary: true },
  },
];

const SAMPLE_EDGES: Edge[] = [
  { id: 'e1', source: 'start-demo',    target: 'task-demo1',    type: 'smoothstep', animated: true },
  { id: 'e2', source: 'task-demo1',    target: 'approval-demo', type: 'smoothstep', animated: true },
  { id: 'e3', source: 'approval-demo', target: 'auto-demo',     type: 'smoothstep', animated: true },
  { id: 'e4', source: 'auto-demo',     target: 'end-demo',      type: 'smoothstep', animated: true },
];

let nodeIdCounter = 100; // start above demo IDs

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: SAMPLE_NODES,
  edges: SAMPLE_EDGES,
  selectedNodeId: null,
  validationErrors: [],
  theme: 'light',

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes as unknown as AnyNode[]) as unknown as WorkflowNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, state.edges),
    })),

  addNode: (type, position) => {
    const id = `${type}-${nodeIdCounter++}`;
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: { ...DEFAULT_DATA[type] } as WorkflowNodeData,
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNodeData: (id, patch) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...patch } as WorkflowNodeData } : node
      ),
    })),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  importWorkflow: (nodes, edges) => set({ nodes, edges, selectedNodeId: null }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null, validationErrors: [] }),
}));
