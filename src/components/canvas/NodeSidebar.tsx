import React from 'react';
import type { NodeType } from '../../types/workflow';
import { Play, ClipboardList, ShieldCheck, Zap, Flag, GripVertical } from 'lucide-react';

const NODE_TYPES: { type: NodeType; label: string; description: string; icon: React.ReactNode; colorClass: string }[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play size={18} />,
    colorClass: 'accent-start',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human task or action',
    icon: <ClipboardList size={18} />,
    colorClass: 'accent-task',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Manager / HR approval',
    icon: <ShieldCheck size={18} />,
    colorClass: 'accent-approval',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'System-triggered action',
    icon: <Zap size={18} />,
    colorClass: 'accent-automated',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    icon: <Flag size={18} />,
    colorClass: 'accent-end',
  },
];

export const NodeSidebar: React.FC = () => {
  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/reactflow-type', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="node-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Node Library</span>
        <span className="sidebar-hint">Drag onto canvas</span>
      </div>
      <div className="sidebar-nodes">
        {NODE_TYPES.map((nt) => (
          <div
            key={nt.type}
            className={`sidebar-node ${nt.colorClass}`}
            draggable
            onDragStart={(e) => onDragStart(e, nt.type)}
          >
            <div className="sidebar-node-icon">{nt.icon}</div>
            <div className="sidebar-node-info">
              <span className="sidebar-node-label">{nt.label}</span>
              <span className="sidebar-node-desc">{nt.description}</span>
            </div>
            <GripVertical size={14} className="drag-handle-icon" />
          </div>
        ))}
      </div>
      <div className="sidebar-tip">
        <p>💡 Connect nodes by dragging from a node's bottom handle to another's top handle.</p>
      </div>
    </aside>
  );
};
