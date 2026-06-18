"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoAccounts, type DemoAccount, type DemoRole } from "@/lib/auth/demo-accounts";

export type DemoSession = Omit<DemoAccount, "password">;

type AuthResult = {
  ok: boolean;
  message: string;
  session?: DemoSession;
};

type CredentialInput = {
  role: DemoRole;
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

type AuthContextValue = {
  session: DemoSession | null;
  hydrated: boolean;
  login: (input: CredentialInput) => AuthResult;
  register: (input: CredentialInput) => AuthResult;
  logout: () => void;
};

const STORAGE_KEY = "studypilot-demo-session";
const AuthContext = createContext<AuthContextValue | null>(null);

function withoutPassword(account: DemoAccount): DemoSession {
  const { password: _password, ...session } = account;
  return session;
}

function validateCredentials(input: CredentialInput, mode: "login" | "register"): AuthResult {
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  const expected = demoAccounts[input.role];

  if (!email || !password) {
    return { ok: false, message: "Please enter both email and password." };
  }

  if (mode === "register") {
    if (!input.name?.trim()) {
      return { ok: false, message: "Please enter a display name." };
    }
    if (input.confirmPassword !== input.password) {
      return { ok: false, message: "Passwords do not match." };
    }
  }

  if (email !== expected.email) {
    return {
      ok: false,
      message: "Account does not exist, or the selected role does not match."
    };
  }

  if (password !== expected.password) {
    return {
      ok: false,
      message: "Incorrect password. Please try again."
    };
  }

  return {
    ok: true,
    message: mode === "register" ? "Sign up successful. Opening your workspace..." : "Login successful. Opening your workspace...",
    session: withoutPassword(expected)
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSession(JSON.parse(saved) as DemoSession);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  const persistSession = (nextSession: DemoSession) => {
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const value = useMemo<AuthContextValue>(() => ({
    session,
    hydrated,
    login: (input) => {
      const result = validateCredentials(input, "login");
      if (result.ok && result.session) persistSession(result.session);
      return result;
    },
    register: (input) => {
      const result = validateCredentials(input, "register");
      if (result.ok && result.session) persistSession(result.session);
      return result;
    },
    logout: () => {
      setSession(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }), [session, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
