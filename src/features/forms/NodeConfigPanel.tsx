import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { mockApi } from '../../services/mockApi';
import type { AutomationAction } from '../../types/workflow';

export default function NodeConfigPanel() {
  const { selectedNodeId, nodes, updateNodeData, deleteNode } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // State for dynamic automated actions
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);

  // State for Key-Value Pair Builders
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

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

  // Reset KV inputs when switching nodes
  useEffect(() => {
    setNewKey('');
    setNewValue('');
  }, [selectedNodeId]);

  if (!selectedNode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
        <p className="text-sm">Select a node on the canvas to configure its properties.</p>
      </div>
    );
  }

  // Helper to handle standard input changes
  const handleChange = (field: string, value: any) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  // Helpers for Key-Value dictionaries
  const handleAddKV = (field: 'metadata' | 'customFields') => {
    if (!newKey.trim()) return;
    const currentDict = selectedNode.data[field] || {};
    handleChange(field, { ...currentDict, [newKey.trim()]: newValue.trim() });
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveKV = (field: 'metadata' | 'customFields', keyToRemove: string) => {
    const currentDict = { ...selectedNode.data[field] };
    delete currentDict[keyToRemove];
    handleChange(field, currentDict);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header section */}
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

        {/* DYNAMIC FIELDS BASED ON NODE TYPE */}

        {/* Start Node Fields */}
        {selectedNode.type === 'startNode' && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Metadata (Optional)</label>
            
            {/* Existing Pairs */}
            {Object.entries(selectedNode.data.metadata || {}).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-xs font-mono bg-white px-2 py-1 border border-slate-200 rounded flex-1 truncate">{k}</span>
                <span className="text-xs text-slate-600 flex-1 truncate">{v as string}</span>
                <button onClick={() => handleRemoveKV('metadata', k)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
              </div>
            ))}
            
            {/* Add New Pair */}
            <div className="flex gap-2 items-center mt-2">
              <input type="text" placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-1/3 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={(e) => e.key === 'Enter' && handleAddKV('metadata')} />
              <button onClick={() => handleAddKV('metadata')} className="bg-slate-800 text-white p-1.5 rounded hover:bg-slate-700 transition-colors"><Plus size={16} /></button>
            </div>
          </div>
        )}

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

            <div className="mt-4 border-t border-slate-200 pt-4">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Custom Fields</label>
              {Object.entries(selectedNode.data.customFields || {}).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-xs font-mono bg-white px-2 py-1 border border-slate-200 rounded flex-1 truncate">{k}</span>
                  <span className="text-xs text-slate-600 flex-1 truncate">{v as string}</span>
                  <button onClick={() => handleRemoveKV('customFields', k)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
                </div>
              ))}
              <div className="flex gap-2 items-center mt-2">
                <input type="text" placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-1/3 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={(e) => e.key === 'Enter' && handleAddKV('customFields')} />
                <button onClick={() => handleAddKV('customFields')} className="bg-slate-800 text-white p-1.5 rounded hover:bg-slate-700 transition-colors"><Plus size={16} /></button>
              </div>
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
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">System Action</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                value={selectedNode.data.actionId || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { actionId: e.target.value, actionParams: {} })}
                disabled={isLoadingActions}
              >
                <option value="">{isLoadingActions ? 'Loading actions...' : 'Select action...'}</option>
                {automations.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedNode.data.actionId && automations.find(a => a.id === selectedNode.data.actionId)?.params.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Action Parameters</h4>
                {automations.find(a => a.id === selectedNode.data.actionId)?.params.map((paramName) => (
                  <div key={paramName}>
                    <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">
                      {paramName.replace('_', ' ')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedNode.data.actionParams?.[paramName] || ''}
                      onChange={(e) => handleChange('actionParams', { ...(selectedNode.data.actionParams || {}), [paramName]: e.target.value })}
                      placeholder={`Enter ${paramName}...`}
                    />
                  </div>
                ))}
              </div>
            )}
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