// ─── Node Type Enum ────────────────────────────────────────────────────────────
export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ─── Key-Value Pair ────────────────────────────────────────────────────────────
export interface KVPair {
  key: string;
  value: string;
}

// ─── Per-Node Data Shapes ──────────────────────────────────────────────────────
export interface StartNodeData {
  [key: string]: unknown;
  type: 'start';
  title: string;
  metadata: KVPair[];
}

export interface TaskNodeData {
  [key: string]: unknown;
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KVPair[];
}

export interface ApprovalNodeData {
  [key: string]: unknown;
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  [key: string]: unknown;
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  [key: string]: unknown;
  type: 'end';
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// ─── Mock Automation ───────────────────────────────────────────────────────────
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// ─── Simulation ────────────────────────────────────────────────────────────────
export type StepStatus = 'success' | 'warning' | 'error' | 'pending';

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: StepStatus;
  message: string;
  timestamp: number;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

// ─── Validation ────────────────────────────────────────────────────────────────
export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Serialized Workflow ───────────────────────────────────────────────────────
export interface SerializedWorkflow {
  nodes: {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: WorkflowNodeData;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    label?: string;
  }[];
  metadata: {
    exportedAt: string;
    version: '1.0';
  };
}
