import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanText, AlertTriangle, CheckCircle2, FileText, Loader2, History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeScamText, type ScamAnalysis } from "@/lib/ai-services";
import { saveHistory, loadHistory, clearHistory, type HistoryItem } from "@/lib/history";
import { openLoginDialog } from "@/lib/auth";
import { generateReportPDF } from "@/lib/report";
import { PageHeader, RiskMeter, SeverityBadge } from "@/components/page-bits";
import { useEffect } from "react";

export const Route = createFileRoute("/scam-analyzer")({
  head: () => ({
    meta: [
      { title: "Scam Analyzer — Detectra AI" },
      { name: "description", content: "Paste any SMS, WhatsApp, email or Telegram message to instantly detect scams." },
    ],
  }),
  component: ScamAnalyzer,
});

const SAMPLES = [
  { label: "Digital Arrest", text: "This is officer Sharma from CBI. A digital arrest warrant has been issued in your name for money laundering. Pay ₹50,000 immediately via UPI to avoid arrest. Do not disconnect this call." },
  { label: "KYC Update", text: "URGENT: Your bank account will be blocked today. Update KYC immediately by clicking http://bit.ly/kyc-update and entering your OTP." },
  { label: "Lottery Win", text: "Congratulations! You have won lottery of Rs. 25,00,000 from KBC. Send your bank account number and Aadhaar to claim your prize." },
];

function ScamAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(loadHistory().filter((h) => h.type === "scam"));
    refresh();
    window.addEventListener("detectra:history", refresh);
    return () => window.removeEventListener("detectra:history", refresh);
  }, []);

  const onAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please paste a message to analyze");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await analyzeScamText(text);
      setResult(r);
      const saved = saveHistory({ type: "scam", input: text, result: r });
      if (saved) {
        toast.success("Analysis complete · saved to history");
      } else {
        toast.success("Analysis complete");
        setTimeout(() => openLoginDialog({ reason: "Sign in to save this analysis to your history and access it from any device." }), 600);
      }
    } catch (e) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = () => {
    if (!result) return;
    generateReportPDF({
      title: "Scam Analysis Report",
      subtitle: `${result.fraud_type} — ${result.severity} severity`,
      scam: result,
      inputText: text,
    });
    toast.success("PDF report downloaded");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Module 01"
        title="Scam Analyzer"
        description="Paste any suspicious SMS, WhatsApp, email or Telegram message. Our AI engine returns a risk score, fraud category and a forensic explanation in seconds."
        icon={<ScanText className="w-6 h-6 text-white" />}
      />

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-xl p-5">
            <label className="text-sm font-semibold mb-2 block">Message to analyze</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste the suspicious message here…"
              className="w-full bg-background/40 rounded-lg p-4 text-sm outline-none border border-border focus:border-primary/60 resize-y"
            />
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground mr-1">Try a sample:</span>
              {SAMPLES.map((s) => (
                <button key={s.label} onClick={() => setText(s.text)}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-border">
                  {s.label}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button onClick={() => { setText(""); setResult(null); }}
                  className="text-xs px-3 py-1.5 rounded-md hover:bg-white/5">Clear</button>
                <button onClick={onAnalyze} disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)" }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanText className="w-4 h-4" />}
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </div>
          </div>

          {result && (
            <div className="glass rounded-xl p-6 space-y-5 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Fraud Category</div>
                  <div className="text-2xl font-bold mt-1">{result.fraud_type}</div>
                  <div className="mt-2"><SeverityBadge severity={result.severity} /></div>
                </div>
                <RiskMeter score={result.risk_score} label="Risk Score" />
              </div>

              <div>
                <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Red Flags Detected
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.red_flags.length === 0 && <span className="text-sm text-muted-foreground">No major red flags detected.</span>}
                  {result.red_flags.map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">AI Explanation</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Recommended Actions
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((r) => (
                    <li key={r} className="text-sm flex gap-2">
                      <span className="text-primary mt-0.5">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={onDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass hover:bg-white/10 text-sm font-medium">
                <FileText className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="glass rounded-xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-semibold"><History className="w-4 h-4" /> Recent Analyses</div>
              {history.length > 0 && (
                <button onClick={() => { clearHistory(); toast.success("History cleared"); }}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">No analyses yet.</div>
            ) : (
              <ul className="space-y-2 max-h-[500px] overflow-auto">
                {history.map((h) => (
                  h.type === "scam" && (
                    <li key={h.id} className="p-3 rounded-lg bg-white/5 border border-border text-sm cursor-pointer hover:bg-white/10"
                      onClick={() => { setText(h.input); setResult(h.result); }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{h.result.fraud_type}</span>
                        <SeverityBadge severity={h.result.severity} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{h.input}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{new Date(h.at).toLocaleString()}</div>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
