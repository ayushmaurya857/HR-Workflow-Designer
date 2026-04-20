import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { TaskNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { KeyValueEditor } from '../ui/KeyValueEditor';

interface Props { nodeId: string; data: TaskNodeData; }

export const TaskForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, setValue, formState: { errors } } = useForm<TaskNodeData>({
    defaultValues: data,
  });

  useEffect(() => {
    const sub = watch((formData) => updateNodeData(nodeId, formData as Partial<TaskNodeData>));
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="field-label" htmlFor="task-title">Title *</label>
        <input
          id="task-title"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          placeholder="Task name"
          {...register('title', { required: true })}
        />
        {errors.title && <span className="error-text">Title is required</span>}
      </div>
      <div className="form-group">
        <label className="field-label" htmlFor="task-desc">Description</label>
        <textarea id="task-desc" className="form-input form-textarea" placeholder="Describe the task..." {...register('description')} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="field-label" htmlFor="task-assignee">Assignee</label>
          <input id="task-assignee" className="form-input" placeholder="e.g. john.doe" {...register('assignee')} />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="task-due">Due Date</label>
          <input id="task-due" className="form-input" type="date" {...register('dueDate')} />
        </div>
      </div>
      <div className="form-group">
        <label className="field-label">Custom Fields</label>
        <KeyValueEditor
          value={watch('customFields') ?? []}
          onChange={(pairs) => { setValue('customFields', pairs); updateNodeData(nodeId, { customFields: pairs }); }}
          keyPlaceholder="Field name"
          valuePlaceholder="Value"
        />
      </div>
    </div>
  );
};
