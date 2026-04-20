import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeSidebar } from './components/canvas/NodeSidebar';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { NodeFormPanel } from './components/forms/NodeFormPanel';
import { SandboxPanel } from './components/sandbox/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';

function AppContent() {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const theme = useWorkflowStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app-root">
      <CanvasToolbar onSimulate={() => setSandboxOpen(true)} />
      <div className="app-body">
        <NodeSidebar />
        <main className="canvas-area">
          <WorkflowCanvas />
        </main>
        {selectedNodeId && (
          <NodeFormPanel />
        )}
      </div>
      {sandboxOpen && <SandboxPanel onClose={() => setSandboxOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
