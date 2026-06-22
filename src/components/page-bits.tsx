import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, icon }: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      {icon && (
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 glow"
          style={{ background: "var(--gradient-primary)" }}>
          {icon}
        </div>
      )}
      <div>
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-primary mb-1 font-semibold">{eyebrow}</div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      </div>
    </div>
  );
}

export function RiskMeter({ score, label }: { score: number; label?: string }) {
  const color =
    score >= 80 ? "oklch(0.62 0.25 25)" :
    score >= 60 ? "oklch(0.7 0.2 40)" :
    score >= 35 ? "oklch(0.78 0.17 75)" :
    "oklch(0.7 0.18 155)";
  const ringStyle = {
    background: `conic-gradient(${color} ${score * 3.6}deg, oklch(1 0 0 / 8%) 0)`,
  };
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 rounded-full flex items-center justify-center" style={ringStyle}>
        <div className="w-32 h-32 rounded-full bg-background flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">/ 100</div>
        </div>
      </div>
      {label && <div className="mt-3 text-sm font-medium" style={{ color }}>{label}</div>}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    Critical: "bg-destructive/20 text-destructive border-destructive/40",
    High: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    Medium: "bg-warning/20 text-warning border-warning/40",
    Low: "bg-success/20 text-success border-success/40",
  };
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", map[severity] || map.Low)}>
      {severity}
    </span>
  );
}
