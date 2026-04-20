import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StartNodeData } from '../../types/workflow';
import { Play, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const StartNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const d = data as unknown as StartNodeData;
  const validationErrors = useWorkflowStore((s) => s.validationErrors);
  const errors = validationErrors.filter((e) => e.nodeId === id);
  const hasError = errors.some((e) => e.severity === 'error');
  const hasWarning = !hasError && errors.some((e) => e.severity === 'warning');

  return (
    <div className={`workflow-node node-start ${selected ? 'node-selected' : ''} ${hasError ? 'node-has-error' : ''} ${hasWarning ? 'node-has-warning' : ''}`}>
      <div className="node-header">
        <div className="node-icon"><Play size={14} /></div>
        <span className="node-type-label">Start</span>
        {(hasError || hasWarning) && (
          <div className={`node-error-badge ${hasError ? 'badge-error' : 'badge-warning'}`} title={errors.map(e => e.message).join('\n')}>
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      <div className="node-title">{d.title || 'Start'}</div>
      {d.metadata?.length > 0 && (
        <div className="node-meta-count" style={{ padding: '0 12px 8px' }}>
          {d.metadata.length} metadata field{d.metadata.length > 1 ? 's' : ''}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
    </div>
  );
};
