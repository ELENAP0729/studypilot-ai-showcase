"use client";

import type { FeatureFlags } from "@/components/settings-provider";
import { useSettings } from "@/components/settings-provider";

export function FeatureGate({ feature, children }: { feature: keyof FeatureFlags; children: React.ReactNode }) {
  const { settings } = useSettings();
  if (!settings.features[feature]) return null;
  return <>{children}</>;
}
