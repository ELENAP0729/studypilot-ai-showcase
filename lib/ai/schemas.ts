import { z } from "zod";

export const analyzeInputSchema = z.object({
  title: z.string().min(2),
  deadline: z.string().min(4),
  brief: z.string().min(20),
  goal: z.string().min(10),
  skills: z.string().min(3),
  progress: z.string().min(3)
});

export const requirementSchema = z.object({
  deliverables: z.array(z.string()),
  markingCriteria: z.array(z.string()),
  hiddenRisks: z.array(z.string())
});

export const skillGapSchema = z.object({
  skill: z.string(),
  currentLevel: z.number().min(0).max(100),
  requiredLevel: z.number().min(0).max(100),
  priority: z.enum(["low", "medium", "high"])
});

export const analysisOutputSchema = z.object({
  requirements: requirementSchema,
  skillGaps: z.array(skillGapSchema),
  risk: z.object({
    score: z.number().min(0).max(100),
    level: z.enum(["Low", "Medium", "High"]),
    reasons: z.array(z.string())
  }),
  roadmap: z.record(z.string(), z.array(z.string())),
  cluster: z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1),
    insight: z.string()
  }),
  mentorMessage: z.string()
});

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;
export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type SkillGap = z.infer<typeof skillGapSchema>;
