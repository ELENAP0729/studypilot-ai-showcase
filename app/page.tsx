import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, LineChart, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatedCard } from "@/components/animated-card";

const features = [
  {
    icon: Sparkles,
    title: "Multi-agent analysis",
    text: "Ingest briefs, extract requirements, map skill gaps and generate a mentor-style project plan."
  },
  {
    icon: LineChart,
    title: "Deterministic scoring",
    text: "Combine deadline pressure, scope complexity, skill gaps and progress delay into transparent scores."
  },
  {
    icon: Layers3,
    title: "Product workspace",
    text: "Showcase tools, user orders, activity history, admin catalog edits and polished product cards."
  },
  {
    icon: ShieldCheck,
    title: "Role-aware local auth",
    text: "Frontend-only student/admin routing keeps the showcase easy to run without backend configuration."
  }
];


export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:pb-20 lg:pt-12">
      <section className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
            <Sparkles className="h-4 w-4" /> StudyPilot AI Product Studio
          </div>
          <h1 className="max-w-3xl text-[2.75rem] font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-[3.45rem] xl:text-[3.85rem]">
            Create a bright, interactive <span className="text-gradient">AI product showcase.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            A colorful workspace for product browsing, project analysis, user activity, and admin controls.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.02]">
              Start experience <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-2xl border border-ink/10 bg-panel/80 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-panel">
              <ShoppingBag className="h-4 w-4" /> Explore products
            </Link>
            <Link href="/upload" className="rounded-2xl border border-ink/10 bg-panel/80 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-panel">
              Analyze a project
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.75rem] border border-ink/10 bg-gradient-to-br from-brand/20 via-fuchsia-400/10 to-cyan-300/20 p-5 shadow-2xl sm:p-7">
          <div className="orb -left-16 -top-16 bg-fuchsia-400/35" />
          <div className="orb -right-10 top-24 bg-cyan-300/35" />
          <div className="relative grid gap-5 xl:grid-cols-[1.25fr_0.75fr] xl:items-stretch">
            <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/40 bg-white/25 p-3 backdrop-blur-xl dark:bg-slate-950/20">
              <Image src="/workspace-art.svg" alt="Colorful product workspace artwork" fill priority className="object-cover" />
            </div>
            <div className="grid gap-4">
              {[
                ["01", "Product cards", "Search, filter, sort and save tools"],
                ["02", "User profile", "Orders, history and quick actions"],
                ["03", "Admin studio", "View all data and edit catalog items"]
              ].map(([step, title, text]) => (
                <div key={step} className="shine-card rounded-[2rem] border border-white/35 bg-panel/70 p-5 backdrop-blur-xl">
                  <p className="text-sm font-black text-brand">{step}</p>
                  <h2 className="mt-2 text-xl font-black">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <AnimatedCard key={feature.title} delay={index * 0.07}>
            <feature.icon className="h-6 w-6 text-brand" />
            <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
          </AnimatedCard>
        ))}
      </section>
    </main>
  );
}
