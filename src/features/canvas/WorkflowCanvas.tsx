import { useCallback, useMemo, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useReactFlow } from 'reactflow';
import { v4 as uuidv4 } from 'uuid'; // Generates unique IDs for new nodes
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import type { WorkflowNodeType } from '../../types/workflow';

import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../nodes/CustomNodes';

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow(); // Used to calculate drop coordinates
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, addNode } = useWorkflowStore();

  const nodeTypes = useMemo(() => ({
    startNode: StartNode,
    taskNode: TaskNode,
    approvalNode: ApprovalNode,
    automatedNode: AutomatedNode,
    endNode: EndNode,
  }), []);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // --- Drag and Drop Handlers ---
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!type) return;

      // Calculate exact drop position
      const position = project({
        x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left ?? 0),
        y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top ?? 0),
      });

      // Construct the new node data payload based on the type
      const newNode = {
        id: `${type}-${uuidv4()}`,
        type,
        position,
        data: { title: `New ${type.replace('Node', '')}` }, // Default title
      };

      addNode(newNode);
    },
    [project, addNode]
  );

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
        <MiniMap zoomable pannable className="border-2 border-slate-200 rounded-lg shadow-sm" />
      </ReactFlow>
    </div>
  );
}