import { useState } from 'react';
import { Play, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { mockApi } from '../../services/mockApi';

export default function SimulationPanel() {
  const { nodes, edges } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setErrors([]);

    // Client-Side Structural Validation
    const localErrors: string[] = [];
    
    if (nodes.length === 0) {
      localErrors.push("The workflow canvas is empty.");
    }
    
    const hasStartNode = nodes.some(n => n.type === 'startNode');
    if (!hasStartNode && nodes.length > 0) {
      localErrors.push("Workflow is missing a Start Node.");
    }

    // Check for "floating" disconnected nodes
    if (nodes.length > 1) {
      nodes.forEach(node => {
        const isConnected = edges.some(e => e.source === node.id || e.target === node.id);
        if (!isConnected) {
          localErrors.push(`Node "${node.data.title || node.type}" has no connections.`);
        }
      });
    }

    // If validation fails, halt immediately
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setIsRunning(false);
      return;
    }

    // Serialize and Send to API 
    try {
      const graphPayload = { nodes, edges }; 
      
      const result = await mockApi.simulateWorkflow(graphPayload.nodes, graphPayload.edges);
      
      if (result.success) {
        setLogs(result.logs);
      } else {
        setErrors(result.errors || ["Unknown simulation error."]);
      }
    } catch (err) {
      setErrors(["Network error: Failed to reach simulation engine."]);
    } finally {
      setIsRunning(false);
    }
  };

  // The Floating Action Button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 right-86 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 font-medium text-sm"
      >
        <Play className="w-4 h-4" />
        Test Workflow
      </button>
    );
  }

  // The Sandbox Modal
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-600" />
            Simulation Sandbox
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
          {errors.length === 0 && logs.length === 0 && !isRunning && (
            <div className="text-center text-slate-500 py-8">
              <p className="text-sm">Ready to test the current workflow structure.</p>
              <p className="text-xs mt-2 text-slate-400">Total Nodes: {nodes.length} | Edges: {edges.length}</p>
            </div>
          )}

          {isRunning && (
            <div className="flex flex-col items-center justify-center py-8 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-medium animate-pulse">Running simulation engine...</p>
            </div>
          )}

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>Simulation Failed</span>
              </div>
              {errors.map((err, i) => (
                <div key={i} className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">
                  {err}
                </div>
              ))}
            </div>
          )}

          {/* Success Logs */}
          {logs.length > 0 && (
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <div className="flex items-center gap-2 text-green-600 font-bold mb-6 justify-center">
                <CheckCircle className="w-5 h-5" />
                <span>Execution Timeline</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded border border-slate-200 shadow-sm text-sm text-slate-600">
                    {log}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>

      </div>
    </div>
  );
}