import { analyzeInputSchema, type AnalyzeInput, type AnalysisOutput, type SkillGap } from "@/lib/ai/schemas";
import { calculateRisk } from "@/lib/ai/risk";

export function ingestInput(payload: unknown): AnalyzeInput {
  return analyzeInputSchema.parse(payload);
}

export function extractRequirements(input: AnalyzeInput) {
  const text = input.brief.toLowerCase();
  const deliverables = [
    "Working prototype",
    text.includes("architecture") ? "Architecture explanation" : "Technical explanation",
    text.includes("database") ? "Database design" : "Implementation notes",
    text.includes("demo") ? "Demo video" : "Demo walkthrough",
    text.includes("reflection") ? "Reflection report" : "Evaluation notes"
  ];

  return {
    deliverables: Array.from(new Set(deliverables)),
    markingCriteria: ["Functionality", "Technical depth", "Documentation", "Evaluation quality"],
    hiddenRisks: [
      "Scope may expand beyond prototype capacity.",
      "Database design may block backend implementation.",
      "AI feature quality may be hard to evaluate without a clear rubric."
    ]
  };
}

export function mapSkillGaps(input: AnalyzeInput): SkillGap[] {
  const skillText = input.skills.toLowerCase();

  const parse = (name: string, fallback: number) => {
    const regex = new RegExp(`${name.toLowerCase()}\\s*(\\d{1,3})`);
    const match = skillText.match(regex);
    return match ? Math.min(100, Number(match[1])) : fallback;
  };

  const gaps: SkillGap[] = [
    { skill: "Database schema design", currentLevel: parse("database", 35), requiredLevel: 78, priority: "high" },
    { skill: "API design", currentLevel: parse("api design", 45), requiredLevel: 75, priority: "high" },
    { skill: "TypeScript", currentLevel: parse("typescript", 55), requiredLevel: 72, priority: "medium" },
    { skill: "AI integration", currentLevel: parse("ai integration", 50), requiredLevel: 70, priority: "medium" },
    { skill: "Evaluation planning", currentLevel: 38, requiredLevel: 68, priority: "medium" }
  ];

  return gaps.map((gap) => ({
    ...gap,
    priority: gap.requiredLevel - gap.currentLevel >= 30 ? "high" : gap.priority
  }));
}

export function generateRoadmap(input: AnalyzeInput, skillGaps: SkillGap[]) {
  const firstGap = skillGaps.sort((a, b) => (b.requiredLevel - b.currentLevel) - (a.requiredLevel - a.currentLevel))[0];

  return {
    "Week 1": [
      "Freeze the prototype user flow and remove non-essential features.",
      `Address the largest gap first: ${firstGap.skill}.`,
      "Create Supabase tables, RLS policies and seed data."
    ],
    "Week 2": [
      "Build the Next.js route handler for analysis.",
      "Connect deterministic risk scoring and save results.",
      "Create animated dashboard cards and settings-based feature toggles."
    ],
    "Week 3": [
      "Add clustering logic for pilot-level analytics.",
      "Run 5 to 10 sample student profiles through the system.",
      "Prepare demo video, README and architecture diagram."
    ]
  };
}

export function clusterStudent(input: AnalyzeInput, riskScore: number) {
  const text = `${input.goal} ${input.progress} ${input.skills}`.toLowerCase();

  if (text.includes("too many") || text.includes("advanced") || text.includes("ai") && text.includes("unsure")) {
    return {
      label: "Technical Explorer",
      confidence: 0.84,
      insight: "This student is attracted to advanced tools early and should reduce scope before adding extra AI features."
    };
  }

  if (text.includes("plan") && riskScore > 60) {
    return {
      label: "Over-Planner",
      confidence: 0.78,
      insight: "This student thinks clearly but needs execution checkpoints and smaller implementation milestones."
    };
  }

  if (riskScore < 45) {
    return {
      label: "Fast Builder",
      confidence: 0.74,
      insight: "This student is likely to move quickly and should focus on documentation and evaluation quality."
    };
  }

  return {
    label: "Balanced Builder",
    confidence: 0.7,
    insight: "This student has a balanced profile and should focus on validating the prototype against the assignment rubric."
  };
}

export function runRuleBasedPipeline(payload: unknown): AnalysisOutput {
  const input = ingestInput(payload);
  const requirements = extractRequirements(input);
  const skillGaps = mapSkillGaps(input);
  const risk = calculateRisk(input, skillGaps);
  const roadmap = generateRoadmap(input, skillGaps);
  const cluster = clusterStudent(input, risk.score);

  return {
    requirements,
    skillGaps,
    risk: {
      score: risk.score,
      level: risk.level,
      reasons: risk.reasons
    },
    roadmap,
    cluster,
    mentorMessage: `Your highest leverage step is to define ${skillGaps[0].skill.toLowerCase()} before expanding the AI feature set.`
  };
}
