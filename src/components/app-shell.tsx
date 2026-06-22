import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";
import { LoginDialog } from "@/components/login-dialog";
import logoUrl from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/scam-analyzer", label: "Scam Analyzer" },
  { to: "/screenshot-scanner", label: "Screenshot Scanner" },
  { to: "/currency-detector", label: "Currency Detector" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/report", label: "Report Generator" },
  { to: "/cyber-crime", label: "Cyber Crime" },
] as const;

function AuthButton() {
  const { user, signOut } = useAuth();
  const [menu, setMenu] = useState(false);

  if (!user) {
    return (
      <button
        onClick={() => window.dispatchEvent(new Event("detectra:login-open"))}
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-semibold text-white"
        style={{ background: "var(--gradient-primary)" }}
      >
        <LogIn className="w-3.5 h-3.5" /> Sign in
      </button>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  return (
    <div className="relative">
      <button onClick={() => setMenu((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "var(--gradient-primary)" }}>{initial}</div>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user.name}</span>
      </button>
      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 glass-strong rounded-lg border border-border/60 p-2 z-50 shadow-xl">
            <div className="px-3 py-2 border-b border-border/40">
              <div className="text-sm font-semibold flex items-center gap-2"><UserIcon className="w-3.5 h-3.5" /> {user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <button onClick={() => { signOut(); setMenu(false); }}
              className="w-full text-left mt-1 px-3 py-2 rounded-md text-sm hover:bg-white/5 flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img src={logoUrl} alt="Detectra AI logo" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(60,120,255,0.45)]" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-base">DETECTRA <span className="gradient-text">AI</span></div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Digital Public Safety</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <AuthButton />
            <button
              className="xl:hidden p-2 rounded-md hover:bg-white/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-border/50 px-4 py-3 grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${
                  pathname === n.to ? "bg-primary/20" : "hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Detectra AI" className="w-6 h-6 object-contain" />
            <span><b className="text-foreground">Detectra AI</b> — Detect. Analyze. Protect.</span>
          </div>
          <div>Digital Public Safety Platform · © {new Date().getFullYear()}</div>
        </div>
      </footer>

      <Toaster richColors position="top-right" theme="dark" />
      <LoginDialog />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
