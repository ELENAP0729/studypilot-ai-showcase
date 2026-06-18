"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, Sparkles, UserRound, XCircle } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/auth-provider";
import { demoCredentials, type DemoRole } from "@/lib/auth/demo-accounts";

const roleCopy = {
  student: {
    title: "Student workspace",
    text: "Orders, history, products and personal project tools."
  },
  admin: {
    title: "Admin workspace",
    text: "All demo data, catalog editing and upload controls."
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<DemoRole>("student");
  const [email, setEmail] = useState("student@studypilot.ai");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [shake, setShake] = useState(false);

  const selectedCredential = useMemo(() => demoCredentials.find((item) => item.role === role)!, [role]);

  const changeRole = (nextRole: DemoRole) => {
    const credential = demoCredentials.find((item) => item.role === nextRole)!;
    setRole(nextRole);
    setEmail(credential.email);
    setPassword("");
    setMessage(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login({ role, email, password });
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
    <main className="relative isolate overflow-hidden px-5 py-8 lg:min-h-[calc(100vh-80px)] lg:px-8 lg:py-10">
      <div className="orb -left-20 top-10 bg-fuchsia-400/25" />
      <div className="orb right-10 top-20 bg-cyan-400/25" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-panel/70 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/15 via-fuchsia-400/10 to-cyan-300/20" />
          <div className="relative grid gap-6 xl:grid-cols-[0.88fr_1.12fr] xl:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-brand shadow-sm dark:bg-slate-900/45">
                <Sparkles className="h-4 w-4" /> Welcome back
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Open your <span className="text-gradient">AI product workspace.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-muted">
                Choose a role, sign in, and jump into a colorful workspace for products, orders, history, analysis and admin tools.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {(["student", "admin"] as DemoRole[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeRole(item)}
                    className={clsx(
                      "group shine-card flex items-start gap-4 rounded-3xl border p-4 text-left transition hover:-translate-y-1",
                      role === item ? "border-brand bg-panel/85 shadow-glow" : "border-ink/10 bg-panel/55 hover:border-brand/30"
                    )}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand transition group-hover:scale-110">
                      {item === "admin" ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                    </span>
                    <span>
                      <span className="block text-lg font-black">{roleCopy[item].title}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted">{roleCopy[item].text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[420px] xl:block">
              <Image
                src="/workspace-art.svg"
                alt="Colorful AI product workspace illustration"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-brand/20 via-fuchsia-400/10 to-cyan-300/20 blur-2xl" />
          <div className="relative rounded-[2.25rem] border border-ink/10 bg-panel/85 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 p-3 text-brand">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Login</h2>
                  <p className="text-sm font-semibold text-muted">Current role: {role}</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-brand/10 px-4 py-2 text-sm font-black text-brand sm:inline-flex">
                {selectedCredential.avatar}
              </span>
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
                <span className="text-sm font-bold text-muted">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder={selectedCredential.email}
                />
              </label>

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

              {message && (
                <div className={clsx(
                  "flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold",
                  message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-600"
                )}>
                  {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-black text-white shadow-glow transition hover:scale-[1.02]">
                  <KeyRound className="h-5 w-5" />
                  Login
                </button>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-black transition hover:bg-ink/5">
                  Go to sign up <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
