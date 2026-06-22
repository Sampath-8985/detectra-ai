import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield, ScanText, Image as ImageIcon, Banknote, BarChart3, FileText,
  Siren, ArrowRight, Sparkles, Lock, Eye, Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Detectra AI — AI-Powered Digital Public Safety Platform" },
      { name: "description", content: "Detect digital fraud, cyber scams and counterfeit currency before financial loss occurs." },
    ],
  }),
  component: Home,
});

const STATS = [
  { value: "1.6M+", label: "Cybercrime Complaints", sub: "Tracked nationally in 2025" },
  { value: "₹2,840Cr", label: "Fraud Cases Prevented", sub: "Estimated value protected" },
  { value: "94.2K", label: "Risk Assessments Generated", sub: "Last 30 days" },
];

const FEATURES = [
  { to: "/scam-analyzer", icon: ScanText, title: "Scam Detection", desc: "Analyze SMS, WhatsApp, email and Telegram messages instantly." },
  { to: "/screenshot-scanner", icon: ImageIcon, title: "Screenshot Scanner", desc: "Upload screenshots — OCR + AI extract and assess fraud signals." },
  { to: "/currency-detector", icon: Banknote, title: "Fake Currency Detection", desc: "Verify ₹100, ₹200, ₹500 & ₹2000 notes against RBI security features." },
  { to: "/dashboard", icon: BarChart3, title: "Fraud Dashboard", desc: "National intelligence dashboard with live trends and breakdowns." },
  { to: "/report", icon: FileText, title: "AI Report Generator", desc: "Download forensic PDF reports for filing with authorities." },
  { to: "/cyber-crime", icon: Siren, title: "Cyber Crime Reporting", desc: "One-tap reporting to 1930 and cybercrime.gov.in portal." },
];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 sm:pt-28 sm:pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            ET AI Hackathon 2026 · Digital Public Safety
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Detectra <span className="gradient-text">AI</span>
          </h1>
          <p className="mt-5 text-xl sm:text-2xl text-muted-foreground max-w-2xl">
            AI-Powered Digital Public Safety Platform
          </p>
          <p className="mt-3 text-base text-muted-foreground/80 max-w-xl">
            Detect. Analyze. Protect. Stop digital fraud, cyber scams and counterfeit currency before financial loss occurs.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/scam-analyzer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white glow hover:opacity-95 transition-opacity"
              style={{ background: "var(--gradient-primary)" }}>
              <ScanText className="w-4 h-4" /> Analyze Scam
            </Link>
            <Link to="/currency-detector"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold glass hover:bg-white/10 transition-colors">
              <Banknote className="w-4 h-4" /> Scan Currency
            </Link>
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold glass hover:bg-white/10 transition-colors">
              <BarChart3 className="w-4 h-4" /> View Dashboard
            </Link>
          </div>

          {/* Floating shield */}
          <div className="hidden lg:block absolute right-12 top-24 animate-float">
            <div className="w-64 h-64 rounded-3xl glass-strong flex items-center justify-center animate-pulse-glow">
              <Shield className="w-32 h-32 text-primary" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-xl p-6">
              <div className="text-3xl sm:text-4xl font-bold gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div className="mt-1 font-semibold">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">Capabilities</div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">A complete cyber intelligence suite</h2>
          </div>
          <div className="text-muted-foreground max-w-md text-sm">
            Each module is production-grade and built for citizens, banks and law-enforcement agencies.
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to}
              className="group glass rounded-xl p-6 hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="glass-strong rounded-2xl p-8 sm:p-12 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-bold">Built for national-scale public safety</h3>
            <p className="text-muted-foreground mt-3">
              Detectra AI combines large-language models, OCR and computer-vision to give citizens
              instant, explainable fraud assessments — and equips agencies with actionable intelligence.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ i: Lock, l: "Secure" }, { i: Eye, l: "Explainable" }, { i: Zap, l: "Realtime" }].map((x) => (
              <div key={x.l} className="text-center p-4 rounded-lg bg-white/5">
                <x.i className="w-5 h-5 mx-auto text-primary" />
                <div className="text-xs mt-2 text-muted-foreground">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
