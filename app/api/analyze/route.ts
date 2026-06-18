import { NextResponse } from "next/server";
import { runRuleBasedPipeline } from "@/lib/ai/pipeline";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = runRuleBasedPipeline(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid analysis request",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}
