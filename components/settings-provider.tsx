"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type FeatureFlags = {
  riskPanel: boolean;
  roadmapPanel: boolean;
  clusterPanel: boolean;
  mentorPanel: boolean;
  productFilters: boolean;
  productInsights: boolean;
  animations: boolean;
};

export type AppSettings = {
  accent: string;
  theme: "light" | "dark";
  features: FeatureFlags;
};

type SettingsContextValue = {
  settings: AppSettings;
  setAccent: (hex: string) => void;
  setTheme: (theme: AppSettings["theme"]) => void;
  toggleFeature: (key: keyof FeatureFlags) => void;
};

const defaultSettings: AppSettings = {
  accent: "#8b5cf6",
  theme: "light",
  features: {
    riskPanel: true,
    roadmapPanel: true,
    clusterPanel: true,
    mentorPanel: true,
    productFilters: true,
    productInsights: true,
    animations: true
  }
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `${r} ${g} ${b}`;
}

function mergeSettings(saved: string): AppSettings {
  try {
    const parsed = JSON.parse(saved) as Partial<AppSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      features: {
        ...defaultSettings.features,
        ...(parsed.features ?? {})
      }
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("studypilot-settings");
    if (saved) setSettings(mergeSettings(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-rgb", hexToRgb(settings.accent));
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.animations = settings.features.animations ? "on" : "off";
    localStorage.setItem("studypilot-settings", JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    setAccent: (accent) => setSettings((prev) => ({ ...prev, accent })),
    setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    toggleFeature: (key) => setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] }
    }))
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings must be used inside SettingsProvider");
  return value;
}
