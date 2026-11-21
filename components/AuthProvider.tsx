"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

type User = { id: string; name: string; email: string };
type Session = { token: string; user: User };
type Ctx = {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthCtx = createContext<Ctx>(null as unknown as Ctx);
export const useAuth = () => useContext(AuthCtx);
const KEY = "vanta_token";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(KEY);
    if (!t) { setLoading(false); return; }
    api<{ user: User }>("/auth/me", { token: t })
      .then((d) => { setUser(d.user); setToken(t); })
      .catch(() => localStorage.removeItem(KEY))
      .finally(() => setLoading(false));
  }, []);

  const save = (s: Session) => { localStorage.setItem(KEY, s.token); setToken(s.token); setUser(s.user); };
  const login = async (email: string, password: string) =>
    save(await api<Session>("/auth/login", { method: "POST", body: { email, password } }));
  const signup = async (name: string, email: string, password: string) =>
    save(await api<Session>("/auth/signup", { method: "POST", body: { name, email, password } }));
  const logout = () => { localStorage.removeItem(KEY); setToken(null); setUser(null); };

  return <AuthCtx.Provider value={{ user, token, loading, login, signup, logout }}>{children}</AuthCtx.Provider>;
}
