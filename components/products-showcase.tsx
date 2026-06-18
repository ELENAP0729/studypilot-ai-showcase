"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Heart,
  LayoutGrid,
  List,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-provider";

const products = [
  {
    id: "focus-flow",
    name: "Focus Flow Planner",
    category: "Productivity",
    price: 29,
    rating: 4.9,
    tag: "Best for deadline control",
    description: "A weekly planning kit that converts project milestones into daily focus blocks and progress checkpoints.",
    features: ["Auto weekly plan", "Deadline reminders", "Progress reflection prompts"],
    match: 94,
    accent: "from-brand/30 to-sky-400/20"
  },
  {
    id: "brief-parser",
    name: "Assignment Brief Parser",
    category: "AI Tools",
    price: 49,
    rating: 4.8,
    tag: "Most requested",
    description: "Extracts deliverables, marking criteria, hidden risks and required evidence from messy assignment briefs.",
    features: ["Requirement extraction", "Risk hints", "Rubric mapping"],
    match: 91,
    accent: "from-emerald-400/25 to-brand/20"
  },
  {
    id: "schema-studio",
    name: "Supabase Schema Studio",
    category: "Developer Kit",
    price: 39,
    rating: 4.7,
    tag: "For technical projects",
    description: "A guided schema design workspace for turning app ideas into tables, relationships, policies and RLS checks.",
    features: ["Schema templates", "RLS checklist", "PII separation guide"],
    match: 88,
    accent: "from-violet-400/25 to-fuchsia-400/20"
  },
  {
    id: "demo-polish",
    name: "Demo Polish Pack",
    category: "Presentation",
    price: 19,
    rating: 4.6,
    tag: "Fast visual upgrade",
    description: "A UI and storytelling pack for making product demos look clearer, smoother and more convincing.",
    features: ["Demo script", "Landing blocks", "Dashboard polish"],
    match: 83,
    accent: "from-orange-400/25 to-pink-400/20"
  },
  {
    id: "mentor-agent",
    name: "AI Mentor Agent",
    category: "AI Tools",
    price: 59,
    rating: 4.9,
    tag: "Advanced feedback",
    description: "An agentic feedback module that turns student progress updates into blockers, next actions and confidence scores.",
    features: ["Blocker detection", "Next-step coaching", "Confidence scoring"],
    match: 96,
    accent: "from-cyan-400/25 to-brand/20"
  },
  {
    id: "pilot-analytics",
    name: "Pilot Analytics Board",
    category: "Analytics",
    price: 45,
    rating: 4.8,
    tag: "For validation",
    description: "A cohort dashboard that visualizes user segments, engagement signals and project risk distribution.",
    features: ["Cluster summary", "Risk distribution", "Usage insights"],
    match: 89,
    accent: "from-lime-400/20 to-emerald-400/20"
  }
];

const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

type ViewMode = "grid" | "list";
type SortMode = "recommended" | "price-low" | "rating";

export function ProductsShowcase() {
  const { settings } = useSettings();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortMode>("recommended");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory = category === "All" || product.category === category;
        const matchesQuery =
          !normalizedQuery ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.features.some((feature) => feature.toLowerCase().includes(normalizedQuery));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.match - a.match;
      });
  }, [category, query, sort]);

  const toggleSaved = (productId: string) => {
    setSavedIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const heroAnimation = settings.features.animations
    ? { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } }
    : { initial: false };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          {...heroAnimation}
          className="glass overflow-hidden rounded-[2rem] p-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
            <ShoppingBag className="h-4 w-4" />
            Product showcase
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Explore add-on products for a smarter student project workflow.
          </h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["6", "demo products"],
              ["4.8", "average rating"],
              [`${savedIds.length}`, "saved items"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-ink/10 bg-panel/60 p-4">
                <p className="text-3xl font-black">{value}</p>
                <p className="text-sm font-semibold text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {settings.features.productInsights && (
          <motion.section
            {...(settings.features.animations
              ? { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.08 } }
              : { initial: false })}
            className={clsx("glass relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-7", selectedProduct.accent)}
          >
            <div className="absolute right-6 top-6 rounded-full bg-panel/70 p-3 text-brand backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted">Selected product</p>
            <h2 className="mt-3 text-3xl font-black">{selectedProduct.name}</h2>
            <p className="mt-3 leading-7 text-muted">{selectedProduct.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">{selectedProduct.match}% AI fit</span>
              <span className="rounded-full bg-panel/70 px-3 py-1 text-sm font-bold">A${selectedProduct.price}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-panel/70 px-3 py-1 text-sm font-bold">
                <Star className="h-4 w-4 fill-current" /> {selectedProduct.rating}
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {selectedProduct.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-panel/60 p-3">
                  <CheckCircle2 className="h-5 w-5 text-brand" />
                  <span className="font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </section>

      {settings.features.productFilters && (
        <section className="mt-6 rounded-[2rem] border border-ink/10 bg-panel/60 p-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, features or use cases..."
                className="w-full rounded-2xl border border-ink/10 bg-panel/80 py-3 pl-12 pr-4 font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-ink/10 bg-panel/70 px-3 py-2 text-sm font-bold text-muted">
                <SlidersHorizontal className="h-4 w-4" /> Sort
              </div>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none focus:border-brand"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="rating">Highest rating</option>
              </select>
              <button
                onClick={() => setView("grid")}
                className={clsx("rounded-2xl border border-ink/10 p-3 transition", view === "grid" ? "bg-brand text-white" : "bg-panel/70 hover:bg-ink/5")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={clsx("rounded-2xl border border-ink/10 p-3 transition", view === "list" ? "bg-brand text-white" : "bg-panel/70 hover:bg-ink/5")}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  category === item ? "bg-brand text-white shadow-glow" : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className={clsx("mt-6 grid gap-4", view === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
        {filteredProducts.map((product, index) => {
          const isSaved = savedIds.includes(product.id);
          const isSelected = selectedProduct.id === product.id;
          return (
            <motion.article
              key={product.id}
              {...(settings.features.animations
                ? {
                    initial: { opacity: 0, y: 18, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    transition: { duration: 0.38, delay: index * 0.04 },
                    whileHover: { y: -6, scale: 1.01 }
                  }
                : { initial: false })}
              className={clsx(
                "group overflow-hidden rounded-[1.5rem] border bg-panel/70 p-5 backdrop-blur transition",
                isSelected ? "border-brand shadow-glow" : "border-ink/10 hover:border-brand/50",
                view === "list" && "grid gap-4 sm:grid-cols-[0.75fr_1.25fr] sm:items-center"
              )}
            >
              <button
                onClick={() => setSelectedId(product.id)}
                className={clsx("w-full rounded-[1.25rem] bg-gradient-to-br p-5 text-left", product.accent)}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-panel/75 px-3 py-1 text-xs font-black uppercase tracking-widest text-brand">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-panel/75 px-3 py-1 text-sm font-black">A${product.price}</span>
                </div>
                <div className="mt-10 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black">{product.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-muted">{product.tag}</p>
                  </div>
                  <CheckCircle2 className="h-7 w-7 text-brand" />
                </div>
              </button>

              <div className="mt-5">
                <p className="leading-7 text-muted">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.slice(0, view === "grid" ? 2 : 3).map((feature) => (
                    <span key={feature} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-muted">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 font-bold">
                    <Star className="h-4 w-4 fill-current text-brand" />
                    {product.rating}
                    <span className="ml-2 text-sm text-muted">{product.match}% fit</span>
                  </div>
                  <button
                    onClick={() => toggleSaved(product.id)}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition",
                      isSaved ? "bg-brand text-white" : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
                    )}
                  >
                    <Heart className={clsx("h-4 w-4", isSaved && "fill-current")} />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {filteredProducts.length === 0 && (
        <section className="mt-6 rounded-[2rem] border border-dashed border-ink/20 bg-panel/60 p-10 text-center">
          <h2 className="text-2xl font-black">No products found</h2>
          <p className="mt-2 text-muted">Try a different keyword or category filter.</p>
        </section>
      )}
    </main>
  );
}
