import type { Node, Edge } from 'reactflow';

// --- 1. Node Type Definitions ---
export type WorkflowNodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

// --- 2. Specific Node Data Interfaces ---

// Start Node 
export interface StartNodeData {
  title: string;
  metadata?: Record<string, string>; // Optional key-value pairs
}

// Task Node 
export interface TaskNodeData {
  title: string; // Required
  description?: string;
  assignee?: string;
  dueDate?: string; 
  customFields?: Record<string, string>; // Optional key-value pairs
}

// Approval Node 
export interface ApprovalNodeData {
  title: string;
  approverRole?: string; // e.g., "Manager", "HRBP"
  autoApproveThreshold?: number;
}

// Automated Step Node 
export interface AutomatedNodeData {
  title: string;
  actionId?: string; // Chosen from mock API
  actionParams?: Record<string, string>; // Dynamic based on action definition
}

// End Node 
export interface EndNodeData {
  endMessage?: string;
  summaryFlag?: boolean;
}

// --- 3. React Flow Custom Node Type ---
// This combines the base React Flow Node with our custom data payloads
export type WorkflowNode = 
  | Node<StartNodeData, 'startNode'>
  | Node<TaskNodeData, 'taskNode'>
  | Node<ApprovalNodeData, 'approvalNode'>
  | Node<AutomatedNodeData, 'automatedNode'>
  | Node<EndNodeData, 'endNode'>;

export type WorkflowEdge = Edge;

// --- 4. Mock API Types ---
// For GET /automations 
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// For POST /simulate 
export interface SimulationResult {
  success: boolean;
  logs: string[];
  errors?: string[];
}