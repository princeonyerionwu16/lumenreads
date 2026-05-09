import { useCallback, useEffect, useState } from "react";

const KEY = "lumenreads.user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
};

function read(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}

function emit() {
  window.dispatchEvent(new Event("auth-updated"));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(read());
    setReady(true);
    const onChange = () => setUser(read());
    window.addEventListener("auth-updated", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("auth-updated", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const existing = read();
    const u: AuthUser = existing && existing.email === email
      ? existing
      : {
          id: crypto.randomUUID?.() || String(Date.now()),
          name: name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          createdAt: Date.now(),
        };
    localStorage.setItem(KEY, JSON.stringify(u));
    emit();
    return u;
  }, []);

  const register = useCallback((name: string, email: string) => {
    const u: AuthUser = {
      id: crypto.randomUUID?.() || String(Date.now()),
      name,
      email,
      createdAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    emit();
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    emit();
  }, []);

  return { user, ready, login, register, logout, isAuthenticated: !!user };
}

export function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
}
