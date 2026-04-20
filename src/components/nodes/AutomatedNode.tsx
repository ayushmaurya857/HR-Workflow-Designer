import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AutomatedNodeData } from '../../types/workflow';
import { Zap, Bot, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const AutomatedNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const d = data as unknown as AutomatedNodeData;
  const errors = useWorkflowStore((s) => s.validationErrors.filter((e) => e.nodeId === id));
  const hasError = errors.some((e) => e.severity === 'error');
  const hasWarning = !hasError && errors.some((e) => e.severity === 'warning');

  return (
    <div className={`workflow-node node-automated ${selected ? 'node-selected' : ''} ${hasError ? 'node-has-error' : ''} ${hasWarning ? 'node-has-warning' : ''}`}>
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="node-header">
        <div className="node-icon"><Zap size={14} /></div>
        <span className="node-type-label">Automated</span>
        {(hasError || hasWarning) && (
          <div className={`node-error-badge ${hasError ? 'badge-error' : 'badge-warning'}`} title={errors.map(e => e.message).join('\n')}>
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      <div className="node-title">{d.title || 'Automated Step'}</div>
      <div className="node-details">
        <div className="node-detail-row">
          <Bot size={11} />
          <span className="node-action-label">
            {d.actionId ? d.actionId.replace(/_/g, ' ') : 'No action selected'}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
    </div>
  );
};
