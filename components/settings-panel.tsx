"use client";

import { Moon, Palette, Power, Sparkles, Sun } from "lucide-react";
import { useSettings, type FeatureFlags } from "@/components/settings-provider";

const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f97316", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];

const featureLabels: Record<keyof FeatureFlags, string> = {
  riskPanel: "Risk panel",
  roadmapPanel: "Roadmap panel",
  clusterPanel: "Clustering panel",
  mentorPanel: "AI mentor panel",
  productFilters: "Product filters",
  productInsights: "Product insight panel",
  animations: "UI animations"
};

export function SettingsPanel({ compact = false }: { compact?: boolean }) {
  const { settings, setAccent, setTheme, toggleFeature } = useSettings();

  return (
    <div className="glass rounded-[2rem] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-brand">Settings</p>
          <h2 className={compact ? "mt-1 text-2xl font-black" : "mt-2 text-3xl font-black"}>Personalize UI</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Change colors, theme and which modules are visible. Saved in localStorage.</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-brand" />
            <h3 className="font-black">Accent color</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setAccent(color)}
                className="h-10 w-10 rounded-2xl border-4 transition hover:scale-110"
                style={{ background: color, borderColor: settings.accent === color ? "rgb(var(--ink-rgb))" : "transparent" }}
                aria-label={`Set accent ${color}`}
              />
            ))}
            <input
              type="color"
              value={settings.accent}
              onChange={(event) => setAccent(event.target.value)}
              className="h-10 w-14 cursor-pointer rounded-2xl bg-transparent"
              aria-label="Custom accent color"
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            {settings.theme === "dark" ? <Moon className="h-4 w-4 text-brand" /> : <Sun className="h-4 w-4 text-brand" />}
            <h3 className="font-black">Appearance</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${settings.theme === "light" ? "border-brand bg-brand text-white" : "border-ink/10 bg-panel/70 hover:bg-ink/5"}`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${settings.theme === "dark" ? "border-brand bg-brand text-white" : "border-ink/10 bg-panel/70 hover:bg-ink/5"}`}
            >
              Dark
            </button>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Power className="h-4 w-4 text-brand" />
            <h3 className="font-black">Feature visibility</h3>
          </div>
          <div className="grid gap-2">
            {(Object.keys(settings.features) as Array<keyof FeatureFlags>).map((key) => (
              <button
                key={key}
                onClick={() => toggleFeature(key)}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-panel/60 p-3 text-left transition hover:bg-ink/5"
              >
                <span className="text-sm font-semibold">{featureLabels[key]}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${settings.features[key] ? "bg-brand text-white" : "bg-ink/10 text-muted"}`}>
                  {settings.features[key] ? "On" : "Off"}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
