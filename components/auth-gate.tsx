"use client";

import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import type { DemoRole } from "@/lib/auth/demo-accounts";

export function AuthGate({
  roles,
  children
}: {
  roles: DemoRole[];
  children: React.ReactNode;
}) {
  const { hydrated, session } = useAuth();

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="glass rounded-[2rem] p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 text-3xl font-black">Checking local demo session...</h1>
          <p className="mt-3 text-muted">The app is reading your role from localStorage.</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="glass rounded-[2rem] p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 text-3xl font-black">Please log in first.</h1>
          <p className="mt-3 text-muted">This page is protected by a frontend-only demo session.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-glow">
              Go to login
            </Link>
            <Link href="/signup" className="rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-bold">
              Sign up demo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!roles.includes(session.role)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="glass rounded-[2rem] p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 text-3xl font-black">Role access denied.</h1>
          <p className="mt-3 text-muted">
            You are logged in as <span className="font-bold text-ink">{session.role}</span>, but this page requires {roles.join(" or ")} access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={session.role === "admin" ? "/admin" : "/user"} className="rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-glow">
              Back to my workspace
            </Link>
            <Link href="/login" className="rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-bold">
              Switch account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
