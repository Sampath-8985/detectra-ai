import { useEffect, useState } from "react";
import { X, LogIn, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, type LoginPromptDetail } from "@/lib/auth";
import logoUrl from "@/assets/logo.png";

export function LoginDialog() {
  const { user, signIn, signUp } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      const detail = (e as CustomEvent<LoginPromptDetail>).detail || {};
      if (user) return; // already signed in
      setReason(detail.reason);
      setOpen(true);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("detectra:login-prompt", onPrompt);
    window.addEventListener("detectra:login-open", onOpen);
    return () => {
      window.removeEventListener("detectra:login-prompt", onPrompt);
      window.removeEventListener("detectra:login-open", onOpen);
    };
  }, [user]);

  // Auto-close if user becomes authenticated
  useEffect(() => { if (user) setOpen(false); }, [user]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(name, email, password);
        toast.success(`Welcome to Detectra AI, ${name.split(" ")[0]}`);
      } else {
        const u = await signIn(email, password);
        toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      }
      setOpen(false);
      setName(""); setPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md glass-strong rounded-2xl border border-border/60 p-6 shadow-2xl">
        <button onClick={() => setOpen(false)}
          className="absolute right-3 top-3 p-1.5 rounded-md hover:bg-white/10"
          aria-label="Close">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img src={logoUrl} alt="Detectra AI" className="w-12 h-12 rounded-lg object-contain" />
          <div>
            <div className="font-bold text-lg leading-tight">{mode === "signup" ? "Create your account" : "Sign in to Detectra AI"}</div>
            <div className="text-xs text-muted-foreground">Detect. Analyze. Protect.</div>
          </div>
        </div>

        {reason && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm flex gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="mt-1 w-full bg-background/40 rounded-lg p-2.5 text-sm outline-none border border-border focus:border-primary/60"
                placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 w-full bg-background/40 rounded-lg p-2.5 text-sm outline-none border border-border focus:border-primary/60"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4}
              className="mt-1 w-full bg-background/40 rounded-lg p-2.5 text-sm outline-none border border-border focus:border-primary/60"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signup" ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-4">
          {mode === "signin" ? (
            <>New here?{" "}
              <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Create an account</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-primary font-semibold hover:underline">Sign in</button>
            </>
          )}
        </div>

        <div className="mt-4 text-[10px] text-center text-muted-foreground/70">
          Demo authentication — credentials are stored locally in your browser.
        </div>
      </div>
    </div>
  );
}
