import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { StartForm } from './StartForm';
import { TaskForm } from './TaskForm';
import { ApprovalForm } from './ApprovalForm';
import { AutomatedForm } from './AutomatedForm';
import { EndForm } from './EndForm';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData
} from '../../types/workflow';
import { X, Play, ClipboardList, ShieldCheck, Zap, Flag } from 'lucide-react';

const NODE_META: Record<string, { label: string; icon: React.ReactNode; colorClass: string }> = {
  start:     { label: 'Start',           icon: <Play size={15} />,        colorClass: 'accent-start' },
  task:      { label: 'Task',            icon: <ClipboardList size={15} />, colorClass: 'accent-task' },
  approval:  { label: 'Approval',        icon: <ShieldCheck size={15} />,  colorClass: 'accent-approval' },
  automated: { label: 'Automated Step',  icon: <Zap size={15} />,          colorClass: 'accent-automated' },
  end:       { label: 'End',             icon: <Flag size={15} />,          colorClass: 'accent-end' },
};

export const NodeFormPanel: React.FC = () => {
  const { nodes, selectedNodeId, setSelectedNode } = useWorkflowStore();

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const meta = NODE_META[node.type ?? ''] ?? { label: node.type, icon: null, colorClass: '' };

  return (
    <aside className="form-panel">
      <div className={`form-panel-header ${meta.colorClass}`}>
        <div className="form-panel-title">
          {meta.icon}
          <span>{meta.label} Configuration</span>
        </div>
        <button className="btn-icon" onClick={() => setSelectedNode(null)} title="Close panel">
          <X size={16} />
        </button>
      </div>

      <div className="form-panel-badge">
        <code className="node-id-badge">{node.id}</code>
      </div>

      <div className="form-panel-body">
        {node.type === 'start'     && <StartForm     nodeId={node.id} data={node.data as StartNodeData} />}
        {node.type === 'task'      && <TaskForm       nodeId={node.id} data={node.data as TaskNodeData} />}
        {node.type === 'approval'  && <ApprovalForm   nodeId={node.id} data={node.data as ApprovalNodeData} />}
        {node.type === 'automated' && <AutomatedForm  nodeId={node.id} data={node.data as AutomatedNodeData} />}
        {node.type === 'end'       && <EndForm         nodeId={node.id} data={node.data as EndNodeData} />}
      </div>
    </aside>
  );
};
