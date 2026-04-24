import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Play, CheckSquare, UserCheck, Zap, Flag } from 'lucide-react';import type { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomatedNodeData, 
  EndNodeData 
} from '../../types/workflow';

// --- 1. Start Node ---
export function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-sm rounded-lg bg-white border-2 min-w-[150px] ${selected ? 'border-blue-500' : 'border-green-400'}`}>
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-green-100 p-1.5">
          <Play className="w-4 h-4 text-green-700" />
        </div>
        <div className="font-bold text-sm text-slate-800">{data.title || 'Start'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-slate-400" />
    </div>
  );
}

// --- 2. Task Node ---
export function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-sm rounded-lg bg-white border-2 min-w-[180px] ${selected ? 'border-blue-500' : 'border-slate-200'}`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400" />
      <div className="flex items-center gap-2 mb-1">
        <CheckSquare className="w-4 h-4 text-blue-500" />
        <div className="font-bold text-sm text-slate-800">{data.title || 'New Task'}</div>
      </div>
      {data.assignee && <div className="text-xs text-slate-500">👤 {data.assignee}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-slate-400" />
    </div>
  );
}

// --- 3. Approval Node ---
export function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-sm rounded-lg bg-white border-2 min-w-[180px] ${selected ? 'border-blue-500' : 'border-amber-300'}`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400" />
      <div className="flex items-center gap-2 mb-1">
        <UserCheck className="w-4 h-4 text-amber-600" />
        <div className="font-bold text-sm text-slate-800">{data.title || 'Approval'}</div>
      </div>
      {data.approverRole && <div className="text-xs text-slate-500">Role: {data.approverRole}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-slate-400" />
    </div>
  );
}

// --- 4. Automated Step Node ---
export function AutomatedNode({ data, selected }: NodeProps<AutomatedNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-sm rounded-lg bg-white border-2 min-w-[180px] ${selected ? 'border-blue-500' : 'border-purple-300'}`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400" />
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-purple-600" />
        <div className="font-bold text-sm text-slate-800">{data.title || 'Automation'}</div>
      </div>
      {data.actionId && <div className="text-xs text-slate-500 font-mono">{data.actionId}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-slate-400" />
    </div>
  );
}

// --- 5. End Node ---
export function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  return (
    <div className={`px-4 py-3 shadow-sm rounded-lg bg-white border-2 min-w-[150px] ${selected ? 'border-blue-500' : 'border-red-400'}`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400" />
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-red-100 p-1.5">
          <Flag className="w-4 h-4 text-red-600" />
        </div>
        <div className="font-bold text-sm text-slate-800">End</div>
      </div>
    </div>
  );
}