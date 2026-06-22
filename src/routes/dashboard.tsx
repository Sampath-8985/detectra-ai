import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3, Shield, AlertTriangle, Banknote, TrendingUp,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { PageHeader } from "@/components/page-bits";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Fraud Intelligence Dashboard — Detectra AI" },
      { name: "description", content: "National fraud intelligence with live trends, categories and risk levels." },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Total Reports", value: "94,237", icon: Shield, color: "oklch(0.65 0.22 270)", delta: "+12.4%" },
  { label: "High Risk Alerts", value: "8,419", icon: AlertTriangle, color: "oklch(0.62 0.25 25)", delta: "+5.1%" },
  { label: "Fraud Categories", value: "7", icon: BarChart3, color: "oklch(0.62 0.22 250)", delta: "Active" },
  { label: "Currency Scans", value: "31,508", icon: Banknote, color: "oklch(0.7 0.18 155)", delta: "+18.2%" },
];

const CATEGORIES = [
  { name: "Digital Arrest", value: 28 },
  { name: "UPI Scam", value: 22 },
  { name: "KYC Scam", value: 15 },
  { name: "Investment", value: 12 },
  { name: "Job Scam", value: 9 },
  { name: "Courier", value: 8 },
  { name: "Lottery", value: 6 },
];

const TREND = [
  { m: "Jan", r: 4200, c: 320 },
  { m: "Feb", r: 4900, c: 410 },
  { m: "Mar", r: 5600, c: 380 },
  { m: "Apr", r: 6100, c: 520 },
  { m: "May", r: 7400, c: 610 },
  { m: "Jun", r: 8200, c: 670 },
  { m: "Jul", r: 9100, c: 750 },
  { m: "Aug", r: 10400, c: 820 },
  { m: "Sep", r: 11200, c: 890 },
  { m: "Oct", r: 12800, c: 940 },
  { m: "Nov", r: 13900, c: 1020 },
  { m: "Dec", r: 15200, c: 1180 },
];

const RISK = [
  { name: "Critical", value: 18 },
  { name: "High", value: 27 },
  { name: "Medium", value: 34 },
  { name: "Low", value: 21 },
];

const COUNTERFEIT = [
  { d: "₹100", auth: 12400, fake: 320 },
  { d: "₹200", auth: 9200, fake: 240 },
  { d: "₹500", auth: 8900, fake: 540 },
  { d: "₹2000", auth: 1100, fake: 410 },
];

const PIE_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#fb7185", "#22d3ee"];
const RISK_COLORS = ["oklch(0.62 0.25 25)", "oklch(0.7 0.2 40)", "oklch(0.78 0.17 75)", "oklch(0.7 0.18 155)"];

const tooltipStyle = {
  background: "oklch(0.16 0.04 270)",
  border: "1px solid oklch(1 0 0 / 12%)",
  borderRadius: 8,
  color: "white",
} as const;

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Intelligence"
        title="Fraud Intelligence Dashboard"
        description="National view of cyber fraud activity across India. Live mock data simulating production telemetry."
        icon={<BarChart3 className="w-6 h-6 text-white" />}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}25` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{s.delta}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-5">
          <div className="font-semibold mb-1">Fraud Category Distribution</div>
          <div className="text-xs text-muted-foreground mb-4">Share of total complaints (last 30 days)</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CATEGORIES} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {CATEGORIES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="font-semibold mb-1">Monthly Fraud Trend</div>
          <div className="text-xs text-muted-foreground mb-4">Reports vs counterfeit detections</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={TREND}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" strokeDasharray="3 3" />
              <XAxis dataKey="m" stroke="oklch(0.7 0.04 260)" fontSize={12} />
              <YAxis stroke="oklch(0.7 0.04 260)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="r" name="Fraud Reports" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="c" name="Counterfeit Cases" stroke="#34d399" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <div className="font-semibold mb-1">Risk Levels</div>
          <div className="text-xs text-muted-foreground mb-4">Severity breakdown of recent assessments</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={RISK} dataKey="value" nameKey="name" outerRadius={100} label>
                {RISK.map((_, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="font-semibold mb-1">Counterfeit Detection Statistics</div>
          <div className="text-xs text-muted-foreground mb-4">Authentic vs counterfeit by denomination</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={COUNTERFEIT}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" strokeDasharray="3 3" />
              <XAxis dataKey="d" stroke="oklch(0.7 0.04 260)" fontSize={12} />
              <YAxis stroke="oklch(0.7 0.04 260)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="auth" name="Authentic" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              <Bar dataKey="fake" name="Counterfeit" fill="#fb7185" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
