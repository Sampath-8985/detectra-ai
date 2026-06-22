import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}>
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-base">DETECTRA <span className="gradient-text">AI</span></div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Digital Public Safety</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
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

          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/50 px-4 py-3 grid gap-1">
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
            <Shield className="w-4 h-4" />
            <span><b className="text-foreground">Detectra AI</b> — Detect. Analyze. Protect.</span>
          </div>
          <div>ET AI Hackathon 2026 · Digital Public Safety</div>
        </div>
      </footer>

      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}
