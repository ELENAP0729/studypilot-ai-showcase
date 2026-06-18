"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-provider";

export function ProgressRing({ value, label }: { value: number; label: string }) {
  const { settings } = useSettings();
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid place-items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgb(var(--ink-rgb) / 0.10)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="rgb(var(--brand-rgb))"
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: settings.features.animations ? circumference : offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
