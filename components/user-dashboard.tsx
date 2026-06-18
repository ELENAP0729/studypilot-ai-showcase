"use client";

import Link from "next/link";
import { Activity, Clock3, PackageCheck, ShoppingBag, Sparkles, UserRound, WandSparkles } from "lucide-react";
import clsx from "clsx";
import { AnimatedCard } from "@/components/animated-card";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { demoHistory, demoOrders } from "@/lib/demo-data";

function statusClass(status: string) {
  if (status === "Delivered" || status === "Paid") return "bg-emerald-500/10 text-emerald-700";
  if (status === "Processing") return "bg-amber-500/10 text-amber-700";
  if (status === "Refund requested") return "bg-red-500/10 text-red-600";
  return "bg-brand/10 text-brand";
}

export function UserDashboard() {
  const { session } = useAuth();
  const orders = demoOrders.filter((order) => order.ownerEmail === session?.email);
  const history = demoHistory.filter((item) => item.ownerEmail === session?.email);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <AuthGate roles={["student"]}>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-br from-brand/20 via-fuchsia-500/10 to-cyan-400/10 p-8 shadow-2xl">
          <div className="orb -left-16 -top-20 bg-fuchsia-400/30" />
          <div className="orb -right-10 bottom-0 bg-cyan-400/30" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand text-xl font-black text-white shadow-glow floaty-soft">
                {session?.avatar}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand">My page</p>
                <h1 className="mt-1 text-4xl font-black">Welcome back, {session?.name}</h1>
                <p className="mt-2 text-muted">{session?.email} · {session?.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/upload" className="rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-glow transition hover:scale-[1.02]">
                New analysis
              </Link>
              <Link href="/products" className="rounded-2xl border border-ink/10 bg-panel/80 px-5 py-3 font-bold transition hover:bg-panel">
                Browse products
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Orders", value: orders.length, icon: PackageCheck, tone: "from-emerald-400/25 to-cyan-400/10" },
                { label: "History", value: history.length, icon: Clock3, tone: "from-fuchsia-400/25 to-brand/10" },
                { label: "Total spent", value: `A$${totalSpent}`, icon: ShoppingBag, tone: "from-orange-400/25 to-yellow-300/10" },
                { label: "Latest score", value: "58", icon: Activity, tone: "from-brand/25 to-sky-400/10" }
              ].map((metric, index) => (
                <AnimatedCard key={metric.label} delay={index * 0.05}>
                  <div className={clsx("rounded-2xl bg-gradient-to-br p-3", metric.tone)}>
                    <metric.icon className="h-5 w-5 text-brand" />
                    <p className="mt-4 text-sm text-muted">{metric.label}</p>
                    <p className="mt-1 text-3xl font-black">{metric.value}</p>
                  </div>
                </AnimatedCard>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <AnimatedCard delay={0.08}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted">Orders</p>
                    <h2 className="text-2xl font-black">My order data</h2>
                  </div>
                  <PackageCheck className="h-6 w-6 text-brand" />
                </div>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="shine-card rounded-2xl border border-ink/10 bg-panel/60 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{order.item}</p>
                          <p className="mt-1 text-sm text-muted">{order.id} · {order.category} · {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black">A${order.total}</p>
                          <span className={clsx("mt-2 inline-block rounded-full px-3 py-1 text-xs font-black", statusClass(order.status))}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.14}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted">History</p>
                    <h2 className="text-2xl font-black">Analysis and activity</h2>
                  </div>
                  <Sparkles className="h-6 w-6 text-brand" />
                </div>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-ink/10 bg-panel/60 p-4 transition hover:-translate-y-1 hover:border-brand/30">
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                          {item.type === "Analysis" ? <Activity className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black">{item.title}</p>
                            {item.score && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-black text-white">{item.score}</span>}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted">{item.summary}</p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted">{item.date} · {item.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-br from-brand/25 via-fuchsia-400/15 to-cyan-300/20 p-5 shadow-2xl">
              <div className="orb -right-20 -top-24 bg-cyan-300/25" />
              <div className="orb -bottom-24 left-0 bg-fuchsia-400/25" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white shadow-glow">
                    <WandSparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted">Workspace pulse</p>
                    <h3 className="font-black">Your next best action</h3>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl border border-white/30 bg-panel/65 p-4 backdrop-blur-xl">
                  <p className="text-sm leading-6 text-muted">Review your newest product tools, then run a fresh project analysis to keep your roadmap updated.</p>
                  <div className="mt-4 grid gap-3">
                    <Link href="/products" className="rounded-2xl bg-brand px-4 py-3 text-center text-sm font-black text-white shadow-glow transition hover:scale-[1.02]">Explore product tools</Link>
                    <Link href="/settings" className="rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 text-center text-sm font-black transition hover:bg-ink/5">Open settings</Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </AuthGate>
  );
}
