"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardCheck, ShieldCheck, Sparkles, UserRound, XCircle } from "lucide-react";
import clsx from "clsx";
import { AnimatedCard } from "@/components/animated-card";
import { useAuth } from "@/components/auth-provider";
import { demoCredentials, type DemoRole } from "@/lib/auth/demo-accounts";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<DemoRole>("student");
  const [name, setName] = useState("Elena");
  const [email, setEmail] = useState("student@studypilot.ai");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [shake, setShake] = useState(false);

  const selectedCredential = useMemo(() => demoCredentials.find((item) => item.role === role)!, [role]);

  const changeRole = (nextRole: DemoRole) => {
    const credential = demoCredentials.find((item) => item.role === nextRole)!;
    setRole(nextRole);
    setName(credential.name);
    setEmail(credential.email);
    setPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = register({ role, name, email, password, confirmPassword });
    setMessage({ type: result.ok ? "success" : "error", text: result.message });

    if (!result.ok) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }

    window.setTimeout(() => {
      router.push(result.session?.role === "admin" ? "/admin" : "/user");
    }, 450);
  };

  return (
    <main className="mx-auto grid max-w-6xl items-center gap-6 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-br from-cyan-400/15 via-brand/20 to-fuchsia-400/15 p-8 shadow-2xl">
        <div className="orb left-10 top-10 bg-brand/30" />
        <div className="orb -right-16 bottom-0 bg-pink-400/30" />
        <div className="relative">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-brand">Create local access</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight">
            Register into a <span className="text-gradient">frontend-only role demo.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-muted">
            This signup screen keeps the project lightweight for local testing while still showing role selection, validation, routing and session storage.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "No backend", value: "Local" },
              { label: "Role aware", value: "2 roles" },
              { label: "Secure UX", value: "Errors" }
            ].map((item) => (
              <div key={item.label} className="shine-card rounded-3xl border border-ink/10 bg-panel/60 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedCard delay={0.08}>
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black">Signup</h2>
            <p className="text-sm text-muted">Frontend validation only</p>
          </div>
        </div>

        <form onSubmit={submit} className={clsx("space-y-4", shake && "animate-shake")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["student", "admin"] as DemoRole[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeRole(item)}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black capitalize transition",
                  role === item ? "border-brand bg-brand text-white shadow-glow" : "border-ink/10 bg-panel/70 hover:bg-ink/5"
                )}
              >
                {item === "admin" ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                {item}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-bold text-muted">Display name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
              placeholder={selectedCredential.name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-muted">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
              placeholder={selectedCredential.email}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="Enter password"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-muted">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="Repeat password"
              />
            </label>
          </div>

          {message && (
            <div className={clsx(
              "flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold",
              message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-600"
            )}>
              {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-black text-white shadow-glow transition hover:scale-[1.02]">
              <Sparkles className="h-5 w-5" />
              Create local session
            </button>
            <Link href="/login" className="rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-black transition hover:bg-ink/5">
              Already have an account
            </Link>
          </div>
        </form>
      </AnimatedCard>
    </main>
  );
}
