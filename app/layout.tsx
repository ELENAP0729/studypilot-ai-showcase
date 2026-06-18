import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/components/settings-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "StudyPilot AI",
  description: "Multi-agent learning and project planning workspace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SettingsProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
