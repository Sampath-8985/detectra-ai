import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Banknote, Upload, Loader2, FileText, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { analyzeCurrency, type CurrencyAnalysis } from "@/lib/ai-services";
import { saveHistory } from "@/lib/history";
import { generateReportPDF } from "@/lib/report";
import { PageHeader } from "@/components/page-bits";

export const Route = createFileRoute("/currency-detector")({
  head: () => ({
    meta: [
      { title: "Fake Currency Detector — Detectra AI" },
      { name: "description", content: "Verify ₹100, ₹200, ₹500 and ₹2000 notes against RBI security features." },
    ],
  }),
  component: CurrencyDetector;
});

const DENOMS = ["₹100", "₹200", "₹500", "₹2000"] as const;

function CurrencyDetector() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [denom, setDenom] = useState<string>("₹500");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CurrencyAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { toast.error("Please upload an image"); return; }
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  };

  const onAnalyze = async () => {
    if (!file) { toast.error("Please upload a currency note image"); return; }
    setLoading(true);
    try {
      const r = await analyzeCurrency(file, denom);
      setResult(r);
      saveHistory({ type: "currency", input: `${denom} (${file.name})`, result: r });
      toast.success("Currency analyzed");
    } catch {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = () => {
    if (!result) return;
    generateReportPDF({
      title: "Currency Authenticity Report",
      subtitle: `${result.denomination} — ${result.status}`,
      currency: result,
    });
    toast.success("PDF downloaded");
  };

  const genuine = result?.status === "Likely Genuine";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Module 03"
        title="Fake Currency Detector"
        description="Upload an image of an Indian currency note. Our vision AI examines RBI security features and returns an authenticity score."
        icon={<Banknote className="w-6 h-6 text-white" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <label className="text-sm font-semibold mb-2 block">Denomination</label>
            <div className="grid grid-cols-4 gap-2">
              {DENOMS.map((d) => (
                <button key={d} onClick={() => setDenom(d)}
                  className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                    denom === d
                      ? "bg-primary/20 border-primary text-foreground"
                      : "border-border hover:bg-white/5"
                  }`}>{d}</button>
              ))}
            </div>
          </div>

          <div onClick={() => inputRef.current?.click()}
            className="glass rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-8 text-center min-h-[280px] flex flex-col items-center justify-center cursor-pointer">
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {preview ? (
              <img src={preview} alt="note" className="max-h-[300px] rounded-lg" />
            ) : (
              <>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "var(--gradient-primary)" }}>
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold">Upload currency note image</div>
                <div className="text-sm text-muted-foreground mt-1">Front side, well-lit, full note in frame</div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={onAnalyze} disabled={loading || !file}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
              {loading ? "Verifying…" : "Verify Authenticity"}
            </button>
            {preview && (
              <button onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                className="px-4 py-2.5 rounded-md hover:bg-white/5">Reset</button>
            )}
          </div>
        </div>

        <div>
          {!result && !loading && (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground min-h-[280px] flex items-center justify-center">
              Upload a currency note to verify authenticity.
            </div>
          )}
          {loading && (
            <div className="glass rounded-xl p-8 min-h-[280px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="text-sm text-muted-foreground">Examining security features…</div>
            </div>
          )}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className={`glass rounded-xl p-6 border-2 ${genuine ? "border-success/40" : "border-destructive/40"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${genuine ? "bg-success/20" : "bg-destructive/20"}`}>
                    {genuine ? <ShieldCheck className="w-8 h-8 text-success" /> : <ShieldAlert className="w-8 h-8 text-destructive" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Status</div>
                    <div className={`text-2xl font-bold ${genuine ? "text-success" : "text-destructive"}`}>{result.status}</div>
                    <div className="text-xs text-muted-foreground mt-1">Confidence: {result.confidence}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold gradient-text">{result.authenticity_score}%</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Authenticity</div>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full transition-all"
                    style={{ width: `${result.authenticity_score}%`,
                      background: genuine ? "oklch(0.7 0.18 155)" : "oklch(0.62 0.25 25)" }} />
                </div>
              </div>

              {result.detected_features.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success" /> Detected Features
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {result.detected_features.map((f) => (
                      <li key={f} className="flex gap-2"><span className="text-success">✓</span>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suspicious_indicators.length > 0 && (
                <div className="glass rounded-xl p-5 border border-destructive/30">
                  <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-destructive" /> Suspicious Indicators
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {result.suspicious_indicators.map((f) => (
                      <li key={f} className="flex gap-2"><span className="text-destructive">✗</span>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass rounded-xl p-5">
                <div className="text-sm font-semibold mb-2">AI Analysis</div>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
              </div>

              <button onClick={onDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass hover:bg-white/10 text-sm font-medium">
                <FileText className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
