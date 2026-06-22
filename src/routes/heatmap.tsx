import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, IndianRupee, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-bits";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "India Fraud Heatmap — Detectra AI" },
      { name: "description", content: "Geographic distribution of cyber fraud incidents across major Indian cities." },
    ],
  }),
  component: Heatmap,
});

type City = {
  name: string;
  x: number; y: number; // % position on map svg
  type: string;
  incidents: number;
  loss: string;
};

const CITIES: City[] = [
  { name: "Delhi",     x: 38, y: 26, type: "Digital Arrest Scam", incidents: 14820, loss: "₹318 Cr" },
  { name: "Mumbai",    x: 24, y: 56, type: "UPI Fraud",           incidents: 19340, loss: "₹412 Cr" },
  { name: "Hyderabad", x: 41, y: 67, type: "Investment Scam",     incidents: 11250, loss: "₹276 Cr" },
  { name: "Bengaluru", x: 38, y: 76, type: "Job Scam",            incidents: 13670, loss: "₹224 Cr" },
  { name: "Chennai",   x: 46, y: 82, type: "Courier Scam",        incidents: 9820,  loss: "₹158 Cr" },
  { name: "Kolkata",   x: 64, y: 47, type: "KYC Scam",            incidents: 10510, loss: "₹192 Cr" },
];

function Heatmap() {
  const [active, setActive] = useState<City>(CITIES[0]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Geography"
        title="India Fraud Heatmap"
        description="Click a city to view fraud type, incident count and estimated financial loss."
        icon={<MapPin className="w-6 h-6 text-white" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-4 relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-auto" style={{ maxHeight: 600 }}>
            <defs>
              <linearGradient id="indiafill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.3 0.12 270)" />
                <stop offset="100%" stopColor="oklch(0.2 0.08 250)" />
              </linearGradient>
            </defs>
            {/* Stylized India silhouette */}
            <path
              d="M30 8 L42 6 L55 10 L66 14 L72 22 L74 32 L80 38 L82 46 L78 54 L72 60 L68 70 L60 80 L52 88 L44 92 L38 88 L34 80 L28 72 L22 62 L20 52 L18 42 L22 30 L26 20 Z"
              fill="url(#indiafill)"
              stroke="oklch(0.6 0.22 270 / 60%)"
              strokeWidth="0.5"
            />
            {CITIES.map((c) => {
              const isActive = c.name === active.name;
              const r = isActive ? 2.4 : 1.6;
              return (
                <g key={c.name} onClick={() => setActive(c)} className="cursor-pointer">
                  <circle cx={c.x} cy={c.y} r={r + 2} fill="oklch(0.65 0.25 280 / 30%)">
                    <animate attributeName="r" values={`${r+1};${r+4};${r+1}`} dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={c.x} cy={c.y} r={r} fill={isActive ? "#f472b6" : "#a78bfa"} stroke="white" strokeWidth="0.3" />
                  <text x={c.x + 3} y={c.y + 1} fontSize="2.2" fill="white" fontWeight="600">{c.name}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-5 border border-primary/30">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">Selected City</div>
            <div className="text-3xl font-bold mt-1">{active.name}</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4" /> Dominant Fraud Type
                </div>
                <span className="font-semibold">{active.type}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="text-sm text-muted-foreground">Reported Incidents</div>
                <span className="font-bold text-xl gradient-text">{active.incidents.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <IndianRupee className="w-4 h-4" /> Estimated Loss
                </div>
                <span className="font-bold text-destructive">{active.loss}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3 text-sm">All Tracked Cities</div>
            <ul className="space-y-1">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <button onClick={() => setActive(c)}
                    className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      c.name === active.name ? "bg-primary/15" : "hover:bg-white/5"
                    }`}>
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" />{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.incidents.toLocaleString()}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
