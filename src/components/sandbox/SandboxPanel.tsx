import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { serializeWorkflow } from '../../utils/serializer';
import { validateWorkflow } from '../../utils/graphValidator';
import { useSimulate } from '../../hooks/useSimulate';
import type { SimulationStep } from '../../types/workflow';
import {
  X, Play, CheckCircle2, XCircle, AlertCircle, Clock, Loader2, ChevronRight
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

const STATUS_ICON: Record<SimulationStep['status'], React.ReactNode> = {
  success: <CheckCircle2 size={16} className="step-icon step-success" />,
  warning: <AlertCircle size={16} className="step-icon step-warning" />,
  error:   <XCircle size={16} className="step-icon step-error" />,
  pending: <Clock size={16} className="step-icon step-pending" />,
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const SandboxPanel: React.FC<Props> = ({ onClose }) => {
  const { nodes, edges } = useWorkflowStore();
  const { simulate, result, loading, error, reset } = useSimulate();
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const handleRun = async () => {
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      setValidationIssues(validation.errors.filter((e) => e.severity === 'error').map((e) => e.message));
      return;
    }
    setValidationIssues([]);
    reset();
    setVisibleSteps(0);
    const workflow = serializeWorkflow(nodes, edges);
    await simulate(workflow);
  };

  // Animate step reveals
  useEffect(() => {
    if (!result) return;
    setVisibleSteps(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleSteps(i);
      if (i >= result.steps.length) clearInterval(timer);
    }, 350);
    return () => clearInterval(timer);
  }, [result]);

  return (
    <div className="sandbox-overlay">
      <div className="sandbox-panel">
        {/* Header */}
        <div className="sandbox-header">
          <div className="sandbox-title">
            <Play size={18} />
            <span>Workflow Simulation Sandbox</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Summary bar */}
        <div className="sandbox-meta">
          <div className="sandbox-stat">
            <span className="stat-number">{nodes.length}</span>
            <span className="stat-label">Nodes</span>
          </div>
          <div className="sandbox-stat">
            <span className="stat-number">{edges.length}</span>
            <span className="stat-label">Edges</span>
          </div>
          {result && (
            <div className={`sandbox-result-badge ${result.success ? 'badge-success' : 'badge-error'}`}>
              {result.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {result.success ? 'Simulation Passed' : 'Simulation Failed'}
            </div>
          )}
        </div>

        {/* Validation errors */}
        {validationIssues.length > 0 && (
          <div className="sandbox-errors">
            <div className="sandbox-error-title"><AlertCircle size={14} /> Validation Failed</div>
            {validationIssues.map((msg, i) => (
              <div key={i} className="sandbox-error-item">
                <ChevronRight size={12} /> {msg}
              </div>
            ))}
          </div>
        )}

        {/* API error */}
        {error && <div className="sandbox-errors"><div className="sandbox-error-title">API Error: {error}</div></div>}

        {/* Steps */}
        <div className="sandbox-body">
          {loading && (
            <div className="sandbox-loading">
              <Loader2 size={24} className="spin" />
              <span>Running simulation…</span>
            </div>
          )}
          {result && !loading && (
            <>
              <div className="exec-log-header">Execution Log</div>
              <div className="exec-timeline">
                {result.steps.slice(0, visibleSteps).map((step, i) => (
                  <div key={step.nodeId + i} className={`exec-step exec-step-${step.status} step-appear`}>
                    <div className="step-connector-line" />
                    <div className="step-icon-wrap">{STATUS_ICON[step.status]}</div>
                    <div className="step-content">
                      <div className="step-header-row">
                        <span className="step-label">{step.label}</span>
                        <span className={`step-type-badge type-${step.nodeType}`}>{step.nodeType}</span>
                        <span className="step-time">{formatTime(step.timestamp)}</span>
                      </div>
                      <div className="step-message">{step.message}</div>
                    </div>
                  </div>
                ))}
              </div>

              {result.errors.length > 0 && (
                <div className="sandbox-errors" style={{ marginTop: '12px' }}>
                  <div className="sandbox-error-title">Simulation Errors</div>
                  {result.errors.map((msg, i) => (
                    <div key={i} className="sandbox-error-item"><ChevronRight size={12} /> {msg}</div>
                  ))}
                </div>
              )}
            </>
          )}
          {!loading && !result && validationIssues.length === 0 && !error && (
            <div className="sandbox-empty">
              <Play size={40} className="sandbox-empty-icon" />
              <p>Click <strong>Run</strong> to simulate your workflow</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sandbox-footer">
          <button className="toolbar-btn" onClick={reset}>Reset</button>
          <button
            className="toolbar-btn toolbar-btn-primary"
            onClick={handleRun}
            disabled={loading || nodes.length === 0}
          >
            {loading ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
            Run
          </button>
        </div>
      </div>
    </div>
  );
};
