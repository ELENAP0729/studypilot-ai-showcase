"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BrainCircuit,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  ShoppingBag,
  Upload,
  UserRound,
  UsersRound
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/auth-provider";

const publicNav = [
  { href: "/", label: "Home", icon: BrainCircuit },
  { href: "/products", label: "Products", icon: ShoppingBag }
];

const workspaceNav = [
  { href: "/upload", label: "Analyze", icon: Upload },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hydrated, logout } = useAuth();

  const roleNav = session?.role === "admin"
    ? [{ href: "/admin", label: "Admin", icon: UsersRound }]
    : session?.role === "student"
      ? [{ href: "/user", label: "My page", icon: UserRound }]
      : [];

  const nav = [
    ...publicNav,
    ...(session ? workspaceNav : []),
    ...roleNav,
    ...(session ? [{ href: "/settings", label: "Settings", icon: Settings }] : [])
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-panel/80 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white shadow-glow floaty-soft">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">StudyPilot AI</span>
          </Link>
          <div className="hidden gap-2 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-brand text-white shadow-glow" : "text-muted hover:bg-ink/5 hover:text-ink"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {hydrated && session ? (
              <>
                <span className="hidden rounded-2xl border border-ink/10 bg-panel/80 px-3 py-2 text-sm font-bold text-muted lg:inline-flex">
                  {session.avatar} · {session.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-ink/10 bg-panel/80 px-3 py-2 text-sm font-bold transition hover:bg-ink/5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
