"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/components/settings-provider";
import { AuthGate } from "@/components/auth-gate";

type AnalysisResponse = {
  risk: { score: number; level: string; reasons: string[] };
  roadmap: Record<string, string[]>;
  cluster: { label: string; confidence: number; insight: string };
};

export default function UploadPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [form, setForm] = useState({
    title: "AI Study Planner",
    deadline: "2026-07-20",
    brief: "Build a full-stack AI web app. Submit a working prototype, architecture explanation, database design, demo video and reflection report.",
    goal: "I want to build a Next.js and Supabase product with AI feedback, but I am unsure how to scope the backend.",
    skills: "React 70, TypeScript 55, Database 35, API design 45, AI integration 50",
    progress: "I have designed the UI and landing page, but database schema and API routes are not done yet."
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <AuthGate roles={["student", "admin"]}>
      <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Project analysis</p>
        <h1 className="mt-2 text-4xl font-black">Upload messy inputs, get structured guidance.</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={onSubmit} className="glass rounded-[2rem] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
            <Field label="Deadline" value={form.deadline} onChange={(deadline) => setForm({ ...form, deadline })} />
          </div>
          <TextArea label="Assignment brief" value={form.brief} onChange={(brief) => setForm({ ...form, brief })} />
          <TextArea label="Your goal" value={form.goal} onChange={(goal) => setForm({ ...form, goal })} />
          <TextArea label="Current skills" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
          <TextArea label="Weekly progress" value={form.progress} onChange={(progress) => setForm({ ...form, progress })} />

          <button
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <WandSparkles className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {loading ? "Running agents..." : "Run multi-agent analysis"}
          </button>
        </form>

        <aside className="glass min-h-[32rem] rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Live result</h2>
          {!result && !loading && (
            <div className="mt-8 rounded-3xl border border-dashed border-ink/15 p-6 text-sm leading-7 text-muted">
              Submit the sample form to see the generated project risk, weekly roadmap and learning cluster.
            </div>
          )}

          {loading && (
            <div className="mt-8 space-y-3">
              {["Parsing brief", "Mapping skill gaps", "Scoring risk", "Generating roadmap"].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="rounded-2xl bg-ink/5 p-4"
                >
                  <p className="font-semibold">{step}</p>
                </motion.div>
              ))}
            </div>
          )}

          {result && (
            <motion.div
              initial={settings.features.animations ? { opacity: 0, y: 15 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-3xl bg-brand/10 p-5">
                <p className="text-sm text-muted">Risk score</p>
                <p className="text-4xl font-black text-brand">{result.risk.score}</p>
                <p className="font-bold">{result.risk.level}</p>
              </div>
              <div className="rounded-3xl bg-ink/5 p-5">
                <p className="font-bold">Main reasons</p>
                <ul className="mt-2 list-inside list-disc text-sm leading-7 text-muted">
                  {result.risk.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl bg-ink/5 p-5">
                <p className="font-bold">Cluster: {result.cluster.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{result.cluster.insight}</p>
              </div>
              <button onClick={() => router.push("/dashboard")} className="rounded-2xl border border-ink/10 px-4 py-2 font-semibold">
                Open dashboard
              </button>
            </motion.div>
          )}
        </aside>
      </div>
      </main>
    </AuthGate>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/70 px-4 py-3 outline-none transition focus:border-brand"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-bold text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-ink/10 bg-panel/70 px-4 py-3 outline-none transition focus:border-brand"
      />
    </label>
  );
}
