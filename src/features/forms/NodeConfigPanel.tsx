import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { mockApi } from '../../services/mockApi';
import type { AutomationAction } from '../../types/workflow';

export default function NodeConfigPanel() {
  const { selectedNodeId, nodes, updateNodeData, deleteNode } = useWorkflowStore();

  // Find the actual node object based on the selected ID
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // --- State for dynamic automated actions ---
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);

  // Fetch automations only when an automated node is selected
  useEffect(() => {
    if (selectedNode?.type === 'automatedNode' && automations.length === 0) {
      setIsLoadingActions(true);
      mockApi.getAutomations().then(data => {
        setAutomations(data);
        setIsLoadingActions(false);
      });
    }
  }, [selectedNode?.type, automations.length]);

  if (!selectedNode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
        <p className="text-sm">Select a node on the canvas to configure its properties.</p>
      </div>
    );
  }

  // Helper function to handle input changes elegantly
  const handleChange = (field: string, value: any) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header section showing node ID and delete button */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-200">
        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
          {selectedNode.id}
        </span>
        <button 
          onClick={() => deleteNode(selectedNode.id)}
          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Delete Node
        </button>
      </div>

      <div className="space-y-4">
        {/* ALL nodes have a Title field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedNode.data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter node title"
          />
        </div>

        {/* --- DYNAMIC FIELDS BASED ON NODE TYPE --- */}

        {/* Task Node Fields */}
        {selectedNode.type === 'taskNode' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedNode.data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Assignee</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedNode.data.assignee || ''}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="e.g. HR Manager"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Due Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedNode.data.dueDate || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Approval Node Fields */}
        {selectedNode.type === 'approvalNode' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Approver Role</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedNode.data.approverRole || ''}
                onChange={(e) => handleChange('approverRole', e.target.value)}
              >
                <option value="">Select a role...</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="HRBP">HRBP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Auto-Approve Threshold (Days)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedNode.data.autoApproveThreshold || ''}
                onChange={(e) => handleChange('autoApproveThreshold', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </>
        )}

        {/* Automated Node Fields */}
        {selectedNode.type === 'automatedNode' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">System Action</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
              value={selectedNode.data.actionId || ''}
              onChange={(e) => handleChange('actionId', e.target.value)}
              disabled={isLoadingActions}
            >
              <option value="">{isLoadingActions ? 'Loading actions...' : 'Select action...'}</option>
              {automations.map((action) => (
                <option key={action.id} value={action.id}>
                  {action.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-2">
              *Actions are fetched dynamically from the mock API.
            </p>
          </div>
        )}

        {/* End Node Fields */}
        {selectedNode.type === 'endNode' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">End Message</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedNode.data.endMessage || ''}
                onChange={(e) => handleChange('endMessage', e.target.value)}
                placeholder="Workflow completed successfully"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="summaryFlag"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={selectedNode.data.summaryFlag || false}
                onChange={(e) => handleChange('summaryFlag', e.target.checked)}
              />
              <label htmlFor="summaryFlag" className="text-sm text-slate-700 font-medium cursor-pointer">
                Generate final summary report
              </label>
            </div>
          </>
        )}

      </div>
    </div>
  );
}