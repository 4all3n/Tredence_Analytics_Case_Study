import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from './features/canvas/WorkflowCanvas';
import NodePalette from './features/palette/NodePalette';
import { useWorkflowStore } from './store/workflowStore';
import NodeConfigPanel from './features/forms/NodeConfigPanel';
import SimulationPanel from './features/sandbox/SimulationPanel';

function App() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* LEFT SIDEBAR */}
      <NodePalette />

      {/* CENTER CANVAS (Must be wrapped in provider for drag-and-drop coordinate math) */}
      {/* CENTER CANVAS */}
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <WorkflowCanvas />
          <SimulationPanel /> {/* <-- ADD THIS HERE */}
        </ReactFlowProvider>
      </main>

      {/* RIGHT SIDEBAR (Configuration) */}
     {/* RIGHT SIDEBAR (Configuration) */}
      <aside className="w-80 border-l border-slate-200 bg-white p-4 flex flex-col shadow-sm z-10 overflow-y-auto">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Configuration
        </h2>
        <NodeConfigPanel />
      </aside>

    </div>
  );
}

export default App;