import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ApprovalNodeData } from '../../types/workflow';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const ApprovalNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const d = data as unknown as ApprovalNodeData;
  const errors = useWorkflowStore((s) => s.validationErrors.filter((e) => e.nodeId === id));
  const hasError = errors.some((e) => e.severity === 'error');
  const hasWarning = !hasError && errors.some((e) => e.severity === 'warning');

  return (
    <div className={`workflow-node node-approval ${selected ? 'node-selected' : ''} ${hasError ? 'node-has-error' : ''} ${hasWarning ? 'node-has-warning' : ''}`}>
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="node-header">
        <div className="node-icon"><ShieldCheck size={14} /></div>
        <span className="node-type-label">Approval</span>
        {(hasError || hasWarning) && (
          <div className={`node-error-badge ${hasError ? 'badge-error' : 'badge-warning'}`} title={errors.map(e => e.message).join('\n')}>
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      <div className="node-title">{d.title || 'Approval Required'}</div>
      <div className="node-details">
        <div className="node-detail-row">
          <UserCheck size={11} />
          <span>{d.approverRole || 'Role not set'}</span>
        </div>
        {d.autoApproveThreshold > 0 && (
          <div className="node-pill">Auto after {d.autoApproveThreshold}d</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
    </div>
  );
};
