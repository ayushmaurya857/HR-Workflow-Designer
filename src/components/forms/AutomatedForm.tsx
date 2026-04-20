import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { AutomatedNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAutomations } from '../../hooks/useAutomations';
import { Loader2 } from 'lucide-react';

interface Props { nodeId: string; data: AutomatedNodeData; }

export const AutomatedForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { automations, loading } = useAutomations();
  const { register, watch, setValue } = useForm<AutomatedNodeData>({ defaultValues: data });

  const selectedActionId = watch('actionId');
  const selectedAction = automations.find((a) => a.id === selectedActionId);
  const actionParams = watch('actionParams') ?? {};

  useEffect(() => {
    const sub = watch((formData) => updateNodeData(nodeId, formData as Partial<AutomatedNodeData>));
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setValue('actionId', newId);
    setValue('actionParams', {});
    updateNodeData(nodeId, { actionId: newId, actionParams: {} });
  };

  const handleParamChange = (param: string, value: string) => {
    const updated = { ...actionParams, [param]: value };
    setValue('actionParams', updated);
    updateNodeData(nodeId, { actionParams: updated });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="field-label" htmlFor="auto-title">Title *</label>
        <input id="auto-title" className="form-input" placeholder="e.g. Send Welcome Email" {...register('title')} />
      </div>
      <div className="form-group">
        <label className="field-label" htmlFor="auto-action">Action</label>
        {loading ? (
          <div className="loading-row"><Loader2 size={14} className="spin" /> Loading actions…</div>
        ) : (
          <select id="auto-action" className="form-input form-select" value={selectedActionId} onChange={handleActionChange}>
            <option value="">— Select an action —</option>
            {automations.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label className="field-label">Action Parameters</label>
          <div className="dynamic-params">
            {selectedAction.params.map((param) => (
              <div key={param} className="form-group" style={{ marginBottom: '8px' }}>
                <label className="field-label param-label">{param}</label>
                <input
                  className="form-input"
                  placeholder={`Enter ${param}…`}
                  value={actionParams[param] ?? ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
