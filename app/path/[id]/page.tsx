"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Node, Edge } from "@xyflow/react";
import { use } from "react";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type PageParams = {
  params: {
    id: string;
  };
};

export default function PathPage({ params }: PageParams) {
  const unwrappedParams = use(params);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat/task-graph",
    initialMessages: [
      {
        id: "init",
        role: "system",
        content: `Generate a task graph for opportunity ID: ${unwrappedParams.id}`,
      },
    ],
    body: {
      opportunityId: unwrappedParams.id,
    },
    onResponse(response) {
      // Check for tool calls in the response
      const toolRegex = /<tool>updateGraph(.*?)<\/tool>/;
      const match = response.match(toolRegex);
      
      if (match && match[1]) {
        try {
          const graphData = JSON.parse(match[1]);
          setNodes(graphData.nodes);
          setEdges(graphData.edges);
        } catch (e) {
          console.error('Failed to parse graph data:', e);
        }
      }

      // Check for task completion
      const completeRegex = /<tool>completeTask(.*?)<\/tool>/;
      const completeMatch = response.match(completeRegex);
      
      if (completeMatch && completeMatch[1]) {
        try {
          const taskData = JSON.parse(completeMatch[1]);
          if (taskData.completed) {
            onComplete(taskData.taskId);
          }
        } catch (e) {
          console.error('Failed to parse task completion data:', e);
        }
      }
    },
  });

  const onComplete = useCallback((taskId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === taskId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: "completed",
            },
          };
        }
        return node;
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === taskId || edge.target === taskId) {
          return {
            ...edge,
            style: { strokeDasharray: "0" },
            animated: false,
          };
        }
        return edge;
      })
    );
  }, []);

  return (
    <div className="h-screen flex">
      {/* Flow Chart */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-left">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="font-bold text-lg mb-2">Your Path to Success</h2>
              <p className="text-sm text-neutral-600">
                Complete tasks by discussing your progress with the AI
              </p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Chat Interface */}
      <div className="w-96 border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${
                m.role === "user" ? "text-blue-600" : "text-green-600"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Discuss your progress..."
            className="mb-2"
          />
          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
