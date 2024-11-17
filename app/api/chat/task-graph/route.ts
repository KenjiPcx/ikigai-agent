import { streamText, tool } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { opportunity, gettingStarted } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    description: z.string().optional(),
    status: z.enum(['pending', 'completed']).default('pending'),
  }),
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string(),
  animated: z.boolean().optional(),
  style: z.object({
    strokeDasharray: z.string().optional(),
  }).optional(),
});

const graphSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export async function POST(req: Request) {
  const { messages, opportunityId } = await req.json();

  // Fetch opportunity data
  const [opportunityData] = await db
    .select()
    .from(opportunity)
    .where(eq(opportunity.id, opportunityId))
    .leftJoin(
      gettingStarted,
      eq(opportunity.id, gettingStarted.opportunityId)
    );

  const result = await streamText({
    model: openai("gpt-4"),
    messages: [
      {
        role: "system",
        content: `You are an AI task planner helping users break down their business goals into actionable steps.
        Create a graph of interconnected tasks that lead to successfully starting their business.
        
        Current Opportunity:
        Name: ${opportunityData.opportunity.name}
        Description: ${opportunityData.opportunity.description}
        Type: ${opportunityData.opportunity.type}
        Initial Steps: ${opportunityData.gettingStarted?.steps || []}
        Required Skills: ${opportunityData.gettingStarted?.keySkillsNeeded || []}
        Required Resources: ${opportunityData.gettingStarted?.resourcesNeeded || []}
        
        Guidelines for creating the graph:
        1. Break down the main goal into 5-8 major milestones based on the opportunity data
        2. Each milestone should have 2-3 subtasks
        3. Tasks should be connected logically showing dependencies
        4. Position nodes in a way that shows progression (earlier tasks on left/top)
        5. Include specific, actionable items
        6. Add brief descriptions to each task
        
        The graph should be motivating but realistic, showing a clear path to success.`,
      },
      ...messages,
    ],
    tools: {
      updateGraph: tool({
        description: "Update the task graph visualization",
        parameters: graphSchema,
        execute: async (params) => params,
      }),
      completeTask: tool({
        description: "Mark a task as completed",
        parameters: z.object({
          taskId: z.string(),
          completed: z.boolean(),
        }),
        execute: async (params) => params,
      }),
    },
  });

  return result.toDataStreamResponse();
} 