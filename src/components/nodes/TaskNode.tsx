import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { TaskNodeData } from '../../types/workflow';
import { ClipboardList, User, Calendar, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const TaskNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const d = data as unknown as TaskNodeData;
  const validationErrors = useWorkflowStore((s) => s.validationErrors);
  const errors = validationErrors.filter((e) => e.nodeId === id);
  const hasError = errors.some((e) => e.severity === 'error');
  const hasWarning = !hasError && errors.some((e) => e.severity === 'warning');

  return (
    <div className={`workflow-node node-task ${selected ? 'node-selected' : ''} ${hasError ? 'node-has-error' : ''} ${hasWarning ? 'node-has-warning' : ''}`}>
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="node-header">
        <div className="node-icon"><ClipboardList size={14} /></div>
        <span className="node-type-label">Task</span>
        {(hasError || hasWarning) && (
          <div className={`node-error-badge ${hasError ? 'badge-error' : 'badge-warning'}`} title={errors.map(e => e.message).join('\n')}>
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      <div className="node-title">{d.title || 'New Task'}</div>
      <div className="node-details">
        {d.assignee && (
          <div className="node-detail-row">
            <User size={11} />
            <span>{d.assignee}</span>
          </div>
        )}
        {d.dueDate && (
          <div className="node-detail-row">
            <Calendar size={11} />
            <span>{d.dueDate}</span>
          </div>
        )}
        {d.customFields?.length > 0 && (
          <div className="node-meta-count">{d.customFields.length} custom field{d.customFields.length > 1 ? 's' : ''}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
    </div>
  );
};
