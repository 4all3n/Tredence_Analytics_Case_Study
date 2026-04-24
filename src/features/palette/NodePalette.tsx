import { Play, CheckSquare, UserCheck, Zap, Flag } from 'lucide-react';
import type { WorkflowNodeType } from '../../types/workflow';

export default function NodePalette() {
  // This function attaches the node type to the drag event
  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col shadow-sm z-10">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
        Node Palette
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Drag these onto the canvas to build your workflow.
      </p>

      <div className="flex flex-col gap-3">
        <div 
          className="border-2 border-slate-200 bg-slate-50 rounded-lg p-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
          onDragStart={(e) => onDragStart(e, 'startNode')}
          draggable
        >
          <div className="bg-green-100 p-1.5 rounded-full"><Play className="w-4 h-4 text-green-700" /></div>
          <span className="text-sm font-medium text-slate-700">Start Event</span>
        </div>

        <div 
          className="border-2 border-slate-200 bg-slate-50 rounded-lg p-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
          onDragStart={(e) => onDragStart(e, 'taskNode')}
          draggable
        >
          <CheckSquare className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-slate-700">Human Task</span>
        </div>

        <div 
          className="border-2 border-slate-200 bg-slate-50 rounded-lg p-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
          onDragStart={(e) => onDragStart(e, 'approvalNode')}
          draggable
        >
          <UserCheck className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-slate-700">Approval</span>
        </div>

        <div 
          className="border-2 border-slate-200 bg-slate-50 rounded-lg p-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
          onDragStart={(e) => onDragStart(e, 'automatedNode')}
          draggable
        >
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-slate-700">Automation</span>
        </div>

        <div 
          className="border-2 border-slate-200 bg-slate-50 rounded-lg p-3 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
          onDragStart={(e) => onDragStart(e, 'endNode')}
          draggable
        >
          <div className="bg-red-100 p-1.5 rounded-full"><Flag className="w-4 h-4 text-red-600" /></div>
          <span className="text-sm font-medium text-slate-700">End Event</span>
        </div>
      </div>
    </aside>
  );
}