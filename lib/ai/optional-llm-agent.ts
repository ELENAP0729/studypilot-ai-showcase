import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { requirementSchema, type AnalyzeInput } from "@/lib/ai/schemas";

// Optional upgrade: call this inside the route handler if OPENAI_API_KEY is set.
// The current prototype uses the deterministic rule-based pipeline so the demo runs locally without API keys.
export async function extractRequirementsWithLLM(input: AnalyzeInput) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: requirementSchema,
    prompt: `Extract structured project requirements from this assignment brief.\n\nBrief: ${input.brief}\n\nGoal: ${input.goal}`
  });

  return object;
}
