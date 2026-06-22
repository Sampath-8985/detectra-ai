import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; name: string; email: string };

const USER_KEY = "detectra_user_v1";
const USERS_KEY = "detectra_users_v1";

type AuthCtx = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function readUsers(): Record<string, { id: string; name: string; email: string; password: string }> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}
function writeUsers(u: Record<string, { id: string; name: string; email: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    const onStorage = () => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        setUser(raw ? JSON.parse(raw) : null);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("detectra:auth", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("detectra:auth", onStorage);
    };
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
    setUser(u);
    window.dispatchEvent(new Event("detectra:auth"));
  };

  const signUp = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const e = email.trim().toLowerCase();
    if (!e || !password || !name.trim()) throw new Error("All fields are required");
    const users = readUsers();
    if (users[e]) throw new Error("An account with this email already exists");
    const u = { id: crypto.randomUUID(), name: name.trim(), email: e, password };
    users[e] = u;
    writeUsers(users);
    const pub = { id: u.id, name: u.name, email: u.email };
    persist(pub);
    return pub;
  };

  const signIn = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const e = email.trim().toLowerCase();
    const users = readUsers();
    const rec = users[e];
    if (!rec || rec.password !== password) throw new Error("Invalid email or password");
    const pub = { id: rec.id, name: rec.name, email: rec.email };
    persist(pub);
    return pub;
  };

  const signOut = () => persist(null);

  return <Ctx.Provider value={{ user, signIn, signUp, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

// Global event to open the login dialog from anywhere
export type LoginPromptDetail = { reason?: string };
export function openLoginDialog(detail: LoginPromptDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("detectra:login-prompt", { detail }));
}
