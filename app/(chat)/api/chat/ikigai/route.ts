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

        - Keep responses concise and focused on one question at a time. Help users dig deeper into their answers with follow-up questions.
        - Respond concisely as you are in a conversation, you can't bore the user.
        - You don't have to dive too deep into the questions, we just want to fill this up with information as fast as possible. 
        - You must call the 'updateIkigai' tool every time the user provides new information that is can be put into one of the categories. 
        - Once all areas have sufficient information (at least 1 items per category), ask the user if they would like to confirm and proceed to the next step, and once they confirm, call the 'completeIkigai' tool, and provide a paragraph of what the user is like based on the answers.
        `,
      },
      ...messages,
    ],
    tools: {
      updateIkigai: tool({
        description: "Update the Ikigai visualization with new information",
        parameters: ikigaiSchema,
      }),
      completeIkigai: tool({
        description: "Mark the Ikigai as completed",
        parameters: z.object({
          paragraph: z
            .string()
            .describe(
              "A paragraph of what the user is like based on the answers. Be descriptive, answer in the form of the ikigai telling a story about the user. A person who likes to do X, Y and Z because..., they are good at A, B and C because..., the world needs D, E and F because..., they can be paid for G, H and I because..."
            ),
        }),
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
});
