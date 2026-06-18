import { AnimatedCard } from "@/components/animated-card";
import { FeatureGate } from "@/components/feature-gate";
import { ProgressRing } from "@/components/progress-ring";
import { AuthGate } from "@/components/auth-gate";
import { AlertTriangle, Brain, CalendarCheck, Route, Sparkles } from "lucide-react";

const skills = [
  { name: "Frontend execution", value: 76 },
  { name: "Database design", value: 42 },
  { name: "API design", value: 51 },
  { name: "AI integration", value: 62 },
  { name: "Evaluation planning", value: 38 }
];

const roadmap = {
  "Week 1": ["Freeze prototype scope", "Create Supabase schema", "Add auth and protected dashboard"],
  "Week 2": ["Build analyze API route", "Connect deterministic risk scoring", "Create animated results page"],
  "Week 3": ["Add clustering module", "Seed pilot data", "Record demo and write architecture notes"]
};

export default function DashboardPage() {
  return (
    <AuthGate roles={["student", "admin"]}>
      <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Student dashboard</p>
          <h1 className="mt-2 text-4xl font-black">AI Study Planner</h1>
        </div>
        <div className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-glow">Updated after latest check-in</div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureGate feature="riskPanel">
          <AnimatedCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Project risk</p>
                <h2 className="mt-1 text-3xl font-black">Medium</h2>
              </div>
              <AlertTriangle className="h-6 w-6 text-brand" />
            </div>
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={67} label="risk" />
              <div className="space-y-2 text-sm text-muted">
                <p>Deadline pressure: High</p>
                <p>Backend clarity: Low</p>
                <p>Scope control: Medium</p>
              </div>
            </div>
          </AnimatedCard>
        </FeatureGate>

        <FeatureGate feature="clusterPanel">
          <AnimatedCard delay={0.08}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Learning cluster</p>
                <h2 className="mt-1 text-3xl font-black">Technical Explorer</h2>
              </div>
              <Brain className="h-6 w-6 text-brand" />
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Uses advanced tools early, but needs stronger scope control and a smaller first milestone.
            </p>
          </AnimatedCard>
        </FeatureGate>

        <FeatureGate feature="mentorPanel">
          <AnimatedCard delay={0.16}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">AI mentor</p>
                <h2 className="mt-1 text-3xl font-black">Next best action</h2>
              </div>
              <Sparkles className="h-6 w-6 text-brand" />
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Define database entities and API boundaries before adding more AI features. This reduces delivery risk fastest.
            </p>
          </AnimatedCard>
        </FeatureGate>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AnimatedCard delay={0.1}>
          <div className="mb-5 flex items-center gap-3">
            <CalendarCheck className="h-5 w-5 text-brand" />
            <h2 className="text-2xl font-black">Skill gap analysis</h2>
          </div>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span>{skill.name}</span>
                  <span>{skill.value}/100</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <FeatureGate feature="roadmapPanel">
          <AnimatedCard delay={0.18}>
            <div className="mb-5 flex items-center gap-3">
              <Route className="h-5 w-5 text-brand" />
              <h2 className="text-2xl font-black">Generated roadmap</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(roadmap).map(([week, tasks]) => (
                <div key={week} className="rounded-3xl bg-ink/5 p-4">
                  <p className="font-black text-brand">{week}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                    {tasks.map((task) => <li key={task}>- {task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </FeatureGate>
      </section>
      </main>
    </AuthGate>
  );
}
