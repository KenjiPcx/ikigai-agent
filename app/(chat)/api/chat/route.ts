import { streamText, tool } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are an AI career coach helping users find their purpose through Ikigai.
        Guide them through the 4 Ikigai questions one by one:
        1. What you love (passion) - Ask about activities they enjoy and lose track of time doing
        2. What you're good at (mission) - Ask about their skills, talents, and expertise
        3. What the world needs (vocation) - Help them identify problems they could solve
        4. What you can be paid for (profession) - Guide them to monetizable opportunities

        Keep responses concise and focused on one question at a time. Help users dig deeper into their answers with follow-up questions.
        Once all areas have sufficient information (at least 3 items per category) and the user confirms they're satisfied, mark as completed.`,
      },
      ...messages,
    ],
    tools: {
      updateIkigai: tool({
        description: "Update the Ikigai visualization with new information",
        parameters: z.object({
          whatYouLove: z
            .array(z.string())
            .describe("Activities and interests the user loves"),
          whatYouAreGoodAt: z
            .array(z.string())
            .describe("Skills and talents the user possesses"),
          whatTheWorldNeeds: z
            .array(z.string())
            .describe("Problems or needs the user could address"),
          whatYouCanBePaidFor: z
            .array(z.string())
            .describe("Potential ways to monetize their skills and interests"),
          completed: z
            .boolean()
            .optional()
            .describe("Set to true when all areas have sufficient information"),
        }),
        execute: async (params: z.infer<typeof ikigaiSchema>) => {
          return params;
        },
      }),
      suggestPathways: tool({
        description: "Suggest business pathways based on Ikigai analysis",
        parameters: z.object({
          pathways: z
            .array(
              z.object({
                name: z.string(),
                description: z.string(),
                requiredSkills: z.array(z.string()),
                timeline: z.string(),
                potentialEarnings: z.string(),
              })
            )
            .max(3),
        }),
        execute: async (params: z.infer<typeof pathwaysSchema>) => {
          return params;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

const ikigaiSchema = z.object({
  whatYouLove: z.array(z.string()),
  whatYouAreGoodAt: z.array(z.string()),
  whatTheWorldNeeds: z.array(z.string()),
  whatYouCanBePaidFor: z.array(z.string()),
  completed: z.boolean().optional(),
});

const pathwaysSchema = z.object({
  pathways: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        requiredSkills: z.array(z.string()),
        timeline: z.string(),
        potentialEarnings: z.string(),
      })
    )
    .max(3),
});
