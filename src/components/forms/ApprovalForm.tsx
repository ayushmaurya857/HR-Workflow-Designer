import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ApprovalNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const ROLES = ['Manager', 'HRBP', 'Director', 'VP People', 'CEO'];

interface Props { nodeId: string; data: ApprovalNodeData; }

export const ApprovalForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, formState: { errors } } = useForm<ApprovalNodeData>({ defaultValues: data });

  useEffect(() => {
    const sub = watch((formData) => updateNodeData(nodeId, formData as Partial<ApprovalNodeData>));
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="field-label" htmlFor="appr-title">Title *</label>
        <input
          id="appr-title"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g. Manager Approval"
          {...register('title', { required: true })}
        />
        {errors.title && <span className="error-text">Title is required</span>}
      </div>
      <div className="form-group">
        <label className="field-label" htmlFor="appr-role">Approver Role</label>
        <select id="appr-role" className="form-input form-select" {...register('approverRole')}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="field-label" htmlFor="appr-threshold">
          Auto-Approve Threshold (days)
          <span className="field-hint"> — 0 = disabled</span>
        </label>
        <input
          id="appr-threshold"
          className="form-input"
          type="number"
          min={0}
          max={90}
          {...register('autoApproveThreshold', { valueAsNumber: true, min: 0, max: 90 })}
        />
      </div>
    </div>
  );
};
