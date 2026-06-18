import type { AnalyzeInput, SkillGap } from "@/lib/ai/schemas";

type RiskFactors = {
  deadlinePressure: number;
  requirementComplexity: number;
  skillGapSeverity: number;
  progressDelay: number;
  uncertaintyLevel: number;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function daysUntil(deadline: string) {
  const target = new Date(deadline);
  if (Number.isNaN(target.getTime())) return 30;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateRisk(input: AnalyzeInput, skillGaps: SkillGap[]) {
  const text = `${input.brief} ${input.goal} ${input.progress}`.toLowerCase();
  const deadlineDays = daysUntil(input.deadline);
  const highGapCount = skillGaps.filter((gap) => gap.priority === "high").length;

  const factors: RiskFactors = {
    deadlinePressure: deadlineDays <= 14 ? 88 : deadlineDays <= 28 ? 65 : 38,
    requirementComplexity: clamp((input.brief.split(/\s+/).length / 120) * 45 + (text.includes("ai") ? 20 : 0) + (text.includes("database") ? 15 : 0)),
    skillGapSeverity: clamp(skillGaps.reduce((sum, gap) => sum + Math.max(0, gap.requiredLevel - gap.currentLevel), 0) / Math.max(1, skillGaps.length)),
    progressDelay: text.includes("not done") || text.includes("not yet") || text.includes("unsure") ? 78 : 42,
    uncertaintyLevel: text.includes("unclear") || text.includes("unsure") || text.includes("scope") ? 74 : 36
  };

  const rawScore =
    factors.deadlinePressure * 0.25 +
    factors.requirementComplexity * 0.25 +
    factors.skillGapSeverity * 0.25 +
    factors.progressDelay * 0.15 +
    factors.uncertaintyLevel * 0.1 +
    highGapCount * 4;

  const score = clamp(rawScore);
  const level = score >= 75 ? "High" : score >= 45 ? "Medium" : "Low";

  const reasons = [
    factors.deadlinePressure > 65 ? "Deadline pressure is high or approaching quickly." : "Deadline pressure is currently manageable.",
    factors.requirementComplexity > 65 ? "The assignment brief contains multiple complex deliverables." : "The requirement scope is moderate.",
    factors.skillGapSeverity > 45 ? "Skill gaps are significant for the required implementation level." : "Skill gaps are present but manageable.",
    factors.progressDelay > 65 ? "Progress update suggests important backend or architecture tasks are still incomplete." : "Progress update does not show a major execution delay."
  ];

  return { score, level: level as "Low" | "Medium" | "High", reasons, factors };
}
