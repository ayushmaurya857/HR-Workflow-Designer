import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { EndNodeData } from '../../types/workflow';
import { Flag, BarChart2, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const EndNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const d = data as unknown as EndNodeData;
  const validationErrors = useWorkflowStore((s) => s.validationErrors);
  const errors = validationErrors.filter((e) => e.nodeId === id);
  const hasError = errors.some((e) => e.severity === 'error');
  const hasWarning = !hasError && errors.some((e) => e.severity === 'warning');

  return (
    <div className={`workflow-node node-end ${selected ? 'node-selected' : ''} ${hasError ? 'node-has-error' : ''} ${hasWarning ? 'node-has-warning' : ''}`}>
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="node-header">
        <div className="node-icon"><Flag size={14} /></div>
        <span className="node-type-label">End</span>
        {(hasError || hasWarning) && (
          <div className={`node-error-badge ${hasError ? 'badge-error' : 'badge-warning'}`} title={errors.map(e => e.message).join('\n')}>
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      <div className="node-title">{d.endMessage || 'Workflow Complete'}</div>
      {d.showSummary && (
        <div className="node-detail-row" style={{ padding: '0 12px 8px', marginTop: '2px' }}>
          <BarChart2 size={11} />
          <span style={{ fontSize: '11px', opacity: 0.7 }}>Summary enabled</span>
        </div>
      )}
    </div>
  );
};
