"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-provider";

export function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { settings } = useSettings();

  if (!settings.features.animations) {
    return <div className="glass rounded-[1.5rem] p-5">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="glass rounded-[1.5rem] p-5"
    >
      {children}
    </motion.div>
  );
}
