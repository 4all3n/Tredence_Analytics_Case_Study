import type { 
  AutomationAction, 
  SimulationResult, 
  WorkflowNode, 
  WorkflowEdge 
} from '../types/workflow';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * GET /automations
   * Returns a list of available system actions [cite: 107-114]
   */
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(400); // 400ms fake delay
    return [
      { id: "send_email", label: "Send Email", params: ["to", "subject"] },
      { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
      { id: "update_db", label: "Update Database", params: ["table", "recordId"] },
      { id: "slack_msg", label: "Send Slack Notification", params: ["channel", "message"] }
    ];
  },

  /**
   * POST /simulate
   * Accepts workflow JSON and returns a mock step-by-step execution result [cite: 116-117]
   */
  simulateWorkflow: async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<SimulationResult> => {
    await delay(800); // 800ms fake delay

    const logs: string[] = [];
    const errors: string[] = [];

    // Validation 1: Is it empty?
    if (nodes.length === 0) {
        return { success: false, logs, errors: ["Workflow is completely empty."] };
    }

    // Validation 2: Does it have a start node? [cite: 78]
    const startNode = nodes.find(n => n.type === 'startNode');
    if (!startNode) {
        return { success: false, logs, errors: ["Structural Error: Missing a Start Node."] };
    }

    // Generate mock execution logs
    logs.push(`[System] Initializing workflow simulation...`);
    logs.push(`[System] Graph parsed: ${nodes.length} nodes, ${edges.length} edges.`);
    
    // Simulate walking through the nodes
    nodes.forEach(node => {
        logs.push(`[Execute] Running step: ${node.data.title || node.type}`);
    });

    logs.push(`[System] Workflow executed successfully.`);

    return { 
      success: true, 
      logs 
    };
  }
};