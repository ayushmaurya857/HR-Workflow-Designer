import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { StartNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { KeyValueEditor } from '../ui/KeyValueEditor';

interface Props { nodeId: string; data: StartNodeData; }

export const StartForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, setValue } = useForm<StartNodeData>({ defaultValues: data });

  useEffect(() => {
    const sub = watch((formData) => updateNodeData(nodeId, formData as Partial<StartNodeData>));
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="field-label" htmlFor="start-title">Workflow Title *</label>
        <input id="start-title" className="form-input" placeholder="e.g. Employee Onboarding" {...register('title')} />
      </div>
      <div className="form-group">
        <label className="field-label">Metadata</label>
        <KeyValueEditor
          value={watch('metadata') ?? []}
          onChange={(pairs) => { setValue('metadata', pairs); updateNodeData(nodeId, { metadata: pairs }); }}
          keyPlaceholder="e.g. department"
          valuePlaceholder="e.g. Engineering"
        />
      </div>
    </div>
  );
};
