"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  DatabaseZap,
  FileUp,
  Gauge,
  PackageCheck,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Target,
  UploadCloud,
  UsersRound
} from "lucide-react";
import clsx from "clsx";
import { AnimatedCard } from "@/components/animated-card";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { demoCatalogItems, demoHistory, demoOrders, demoUsers } from "@/lib/demo-data";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
};

const initialForm = {
  name: "",
  category: "AI Tools",
  price: "",
  status: "Published"
};

function statusClass(status: string) {
  if (status === "Published" || status === "Delivered" || status === "Active") return "bg-emerald-500/10 text-emerald-700";
  if (status === "Draft" || status === "Processing" || status === "Review") return "bg-amber-500/10 text-amber-700";
  if (status === "Refund requested") return "bg-red-500/10 text-red-600";
  return "bg-brand/10 text-brand";
}

export function AdminDashboard() {
  const { session } = useAuth();
  const [catalog, setCatalog] = useState<CatalogItem[]>(demoCatalogItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("Upload or edit a catalog item. This is stored in frontend state only.");

  const selectedItem = useMemo(() => catalog.find((item) => item.id === editingId), [catalog, editingId]);
  const revenue = demoOrders.reduce((sum, order) => sum + order.total, 0);
  const averageRisk = Math.round(
    demoHistory.filter((item) => item.score).reduce((sum, item) => sum + (item.score ?? 0), 0) /
      demoHistory.filter((item) => item.score).length
  );

  const editItem = (item: CatalogItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, price: String(item.price), status: item.status });
    setNotice(`Editing ${item.name}. Change fields and click Save changes.`);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setNotice("Ready to upload a new local demo item.");
  };

  const submitCatalog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);

    if (!form.name.trim() || !form.category.trim() || Number.isNaN(price) || price <= 0) {
      setNotice("Please enter a valid name, category and positive price before saving.");
      return;
    }

    if (editingId) {
      setCatalog((current) => current.map((item) => item.id === editingId
        ? { ...item, name: form.name.trim(), category: form.category.trim(), price, status: form.status }
        : item
      ));
      setNotice(`Saved changes for ${form.name.trim()}.`);
    } else {
      const nextItem: CatalogItem = {
        id: `CAT-${String(catalog.length + 1).padStart(2, "0")}`,
        name: form.name.trim(),
        category: form.category.trim(),
        price,
        status: form.status
      };
      setCatalog((current) => [nextItem, ...current]);
      setNotice(`Uploaded local demo item: ${nextItem.name}.`);
    }

    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <AuthGate roles={["admin"]}>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="glass overflow-hidden rounded-[2rem] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand text-xl font-black text-white shadow-glow">
                {session?.avatar}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Admin workspace</p>
                <h1 className="mt-1 text-4xl font-black">All data and upload controls.</h1>
                <p className="mt-2 text-muted">Logged in as {session?.email}.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/upload" className="rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-glow">
                Use analysis tool
              </Link>
              <Link href="/products" className="rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-bold">
                View products
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: "Users", value: demoUsers.length, icon: UsersRound },
            { label: "Orders", value: demoOrders.length, icon: PackageCheck },
            { label: "Revenue", value: `A$${revenue}`, icon: ShoppingBag },
            { label: "Avg. risk", value: averageRisk, icon: Gauge }
          ].map((metric, index) => (
            <AnimatedCard key={metric.label} delay={index * 0.05}>
              <metric.icon className="h-5 w-5 text-brand" />
              <p className="mt-4 text-sm text-muted">{metric.label}</p>
              <p className="mt-1 text-3xl font-black">{metric.value}</p>
            </AnimatedCard>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedCard delay={0.08}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">All users</p>
                <h2 className="text-2xl font-black">User data overview</h2>
              </div>
              <DatabaseZap className="h-6 w-6 text-brand" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-muted">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Orders</th>
                    <th className="px-3 py-2">Analyses</th>
                    <th className="px-3 py-2">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {demoUsers.map((user) => (
                    <tr key={user.id} className="bg-panel/60">
                      <td className="rounded-l-2xl px-3 py-3">
                        <p className="font-black">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </td>
                      <td className="px-3 py-3 capitalize">{user.role}</td>
                      <td className="px-3 py-3">
                        <span className={clsx("rounded-full px-3 py-1 text-xs font-black", statusClass(user.status))}>{user.status}</span>
                      </td>
                      <td className="px-3 py-3 font-bold">{user.orders}</td>
                      <td className="px-3 py-3 font-bold">{user.analyses}</td>
                      <td className="rounded-r-2xl px-3 py-3 text-muted">{user.lastSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.14}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">Upload / modify</p>
                <h2 className="text-2xl font-black">Catalog management</h2>
              </div>
              <FileUp className="h-6 w-6 text-brand" />
            </div>
            <form onSubmit={submitCatalog} className="space-y-3">
              <label className="block">
                <span className="text-sm font-bold text-muted">Product name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="e.g. Roadmap Builder Pack"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-muted">Category</span>
                  <input
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-muted">Price</span>
                  <input
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    placeholder="49"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-bold text-muted">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-panel/80 px-4 py-3 font-semibold outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                >
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/40 bg-brand/10 p-4 font-bold text-brand">
                <UploadCloud className="h-5 w-5" />
                Mock upload image/file
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const fileName = event.currentTarget.files?.[0]?.name;
                    if (fileName) setNotice(`Selected local file: ${fileName}`);
                  }}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-black text-white shadow-glow">
                  {editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingId ? "Save changes" : "Upload item"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-2xl border border-ink/10 bg-panel/70 px-5 py-3 font-black">
                    Cancel edit
                  </button>
                )}
              </div>
              <p className="rounded-2xl bg-ink/5 p-3 text-sm font-semibold text-muted">{notice}</p>
              {selectedItem && <p className="text-xs font-bold uppercase tracking-widest text-muted">Currently editing {selectedItem.id}</p>}
            </form>
          </AnimatedCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <AnimatedCard delay={0.12}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">Catalog</p>
                <h2 className="text-2xl font-black">Editable local items</h2>
              </div>
              <Pencil className="h-6 w-6 text-brand" />
            </div>
            <div className="space-y-3">
              {catalog.map((item) => (
                <div key={item.id} className="rounded-2xl border border-ink/10 bg-panel/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="mt-1 text-sm text-muted">{item.id} · {item.category} · A${item.price}</p>
                    </div>
                    <div className="text-right">
                      <span className={clsx("rounded-full px-3 py-1 text-xs font-black", statusClass(item.status))}>{item.status}</span>
                      <button onClick={() => editItem(item)} className="mt-2 block rounded-xl bg-brand/10 px-3 py-1 text-xs font-black text-brand">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.16}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">All orders and history</p>
                <h2 className="text-2xl font-black">Admin can see everything</h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-brand" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-black">Orders</h3>
                {demoOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-ink/10 bg-panel/60 p-3">
                    <p className="font-black">{order.item}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{order.id} · {order.ownerEmail} · A${order.total}</p>
                    <span className={clsx("mt-2 inline-block rounded-full px-3 py-1 text-xs font-black", statusClass(order.status))}>{order.status}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-black">History</h3>
                {demoHistory.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-ink/10 bg-panel/60 p-3">
                    <p className="font-black">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{item.ownerEmail} · {item.date} · {item.type}</p>
                    {item.score && <span className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-black text-white">Risk {item.score}</span>}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Analyze page", text: "Admin can use the same project analysis flow as normal users.", href: "/upload", icon: Activity },
            { title: "Dashboard", text: "Admin can still view the learning dashboard and configurable panels.", href: "/dashboard", icon: Target },
            { title: "Products", text: "Admin can inspect the public product showcase experience.", href: "/products", icon: ShoppingBag }
          ].map((item, index) => (
            <AnimatedCard key={item.title} delay={index * 0.06}>
              <item.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-4 text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              <Link href={item.href} className="mt-4 inline-block rounded-2xl border border-ink/10 bg-panel/70 px-4 py-2 text-sm font-black hover:bg-ink/5">
                Open
              </Link>
            </AnimatedCard>
          ))}
        </section>
      </main>
    </AuthGate>
  );
}
