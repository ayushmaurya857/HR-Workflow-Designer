import React, { useRef } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../utils/graphValidator';
import { serializeWorkflow, downloadJSON } from '../../utils/serializer';
import type { WorkflowNode } from '../../store/workflowStore';
import type { Edge } from '@xyflow/react';
import {
  Play, Download, Upload, Trash2, AlertTriangle, Sun, Moon
} from 'lucide-react';

interface Props {
  onSimulate: () => void;
}

export const CanvasToolbar: React.FC<Props> = ({ onSimulate }) => {
  const { nodes, edges, setValidationErrors, importWorkflow, clearCanvas, theme, toggleTheme } = useWorkflowStore();
  const importRef = useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    const result = validateWorkflow(nodes, edges);
    setValidationErrors(result.errors);
    if (result.valid) {
      alert('✅ Workflow is valid! No structural issues found.');
    } else {
      const msgs = result.errors.map((e) => `• ${e.message}`).join('\n');
      alert(`⚠️ Validation issues found:\n\n${msgs}`);
    }
  };

  const handleExport = () => {
    const data = serializeWorkflow(nodes, edges);
    downloadJSON(data, `workflow-${Date.now()}.json`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        importWorkflow(parsed.nodes as WorkflowNode[], parsed.edges as Edge[]);
      } catch {
        alert('❌ Invalid workflow JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="canvas-toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-title">HR Workflow Designer</span>
        <span className="toolbar-badge">{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="toolbar-actions">
        <button className="toolbar-btn" onClick={handleValidate} title="Validate structure">
          <AlertTriangle size={15} />
          Validate
        </button>
        <button className="toolbar-btn toolbar-btn-primary" onClick={onSimulate} title="Run simulation">
          <Play size={15} />
          Run Simulation
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="toolbar-btn" onClick={handleExport} title="Export as JSON">
          <Download size={15} />
          Export
        </button>
        <button className="toolbar-btn" onClick={() => importRef.current?.click()} title="Import JSON">
          <Upload size={15} />
          Import
        </button>
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        <div className="toolbar-divider" />
        <button className="toolbar-btn toolbar-btn-danger" onClick={clearCanvas} title="Clear canvas">
          <Trash2 size={15} />
          Clear
        </button>
      </div>
    </header>
  );
};
