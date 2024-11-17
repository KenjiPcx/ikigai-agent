import { streamText, tool } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { searchOpportunitiesByVector } from "@/lib/db/queries";
import { TavilyClient } from "@agentic/tavily";
import { groq } from "@ai-sdk/groq";

export const maxDuration = 30;

// Add Tavily client initialization
const tavily = new TavilyClient();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are a business pathway recommender that helps users explore potential business opportunities based on their background.

        Your job is to:
        1. Review the user's background provided in their first message
        2. You must use the 'searchOpportunities' tool to find relevant business opportunities, and display the results to the user, you can call it again if the user asks for more opportunities
        3. In your initial response, just tell them the name of the opportunity and why you think its a good fit for them, tell them to only click on the card to find out more information and let them ask questions about it
        4. Answer any questions about the suggested pathways, you have access to the results from the 'searchOpportunities' tool and a search tool to search the internet for additional information
        5. Help users understand how they can get started

        Keep responses super concise and conversational as if youre talking to a friend and focused on helping users understand why specific opportunities match their background and interests.`,
      },
      ...messages,
    ],
    tools: {
      searchOpportunities: tool({
        description:
          "Search for business opportunities based on user background and interests",
        parameters: z.object({
          query: z
            .string()
            .describe(
              "Natural language description of user background and interests"
            ),
        }),
      }),
      tavily: tool({
        description:
          "Search the internet for additional information about careers, skills, or opportunities",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async (params: z.infer<typeof searchInternetSchema>) => {
          const results = await tavily.search(params.query);
          return results;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

const searchOpportunitiesSchema = z.object({
  query: z
    .string()
    .describe(
      "Search query to search for business opportunities based on user background and interests"
    ),
});

const searchInternetSchema = z.object({
  query: z
    .string()
    .describe("Search query to search the internet for information"),
});
