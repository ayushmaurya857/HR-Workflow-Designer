import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { EndNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { BarChart2 } from 'lucide-react';

interface Props { nodeId: string; data: EndNodeData; }

export const EndForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, control, watch } = useForm<EndNodeData>({ defaultValues: data });
  const showSummary = useWatch({ control, name: 'showSummary' });

  useEffect(() => {
    const sub = watch((formData) => updateNodeData(nodeId, formData as Partial<EndNodeData>));
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="field-label" htmlFor="end-msg">End Message</label>
        <textarea
          id="end-msg"
          className="form-input form-textarea"
          placeholder="e.g. Onboarding completed successfully!"
          {...register('endMessage')}
        />
      </div>
      <div className="form-group">
        <label className="toggle-label" htmlFor="end-summary">
          <div className="toggle-wrapper">
            <input
              id="end-summary"
              type="checkbox"
              className="toggle-input"
              {...register('showSummary')}
            />
            <div className={`toggle-track ${showSummary ? 'toggle-track--on' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </div>
          <div className="toggle-text">
            <span>Show Workflow Summary</span>
            <BarChart2 size={13} style={{ opacity: showSummary ? 1 : 0.3 }} />
          </div>
        </label>
        <p className="field-hint" style={{ marginTop: '4px' }}>
          Displays an execution summary report when the workflow ends.
        </p>
      </div>
    </div>
  );
};
