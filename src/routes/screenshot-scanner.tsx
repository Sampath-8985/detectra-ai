import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Image as ImageIcon, Upload, Loader2, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeScreenshot, type ScreenshotAnalysis } from "@/lib/ai-services";
import { saveHistory } from "@/lib/history";
import { generateReportPDF } from "@/lib/report";
import { PageHeader, RiskMeter, SeverityBadge } from "@/components/page-bits";

export const Route = createFileRoute("/screenshot-scanner")({
  head: () => ({
    meta: [
      { title: "Screenshot Fraud Scanner — Detectra AI" },
      { name: "description", content: "Upload screenshots — OCR extracts the text and our AI assesses fraud risk." },
    ],
  }),
  component: ScreenshotScanner,
});

function ScreenshotScanner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreenshotAnalysis | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { toast.error("Please upload an image"); return; }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const onAnalyze = async () => {
    if (!file) { toast.error("Please upload a screenshot first"); return; }
    setLoading(true);
    try {
      const r = await analyzeScreenshot(file);
      setResult(r);
      saveHistory({ type: "screenshot", input: file.name, result: r });
      toast.success("Screenshot analyzed");
    } catch {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = () => {
    if (!result) return;
    generateReportPDF({
      title: "Screenshot Fraud Analysis",
      subtitle: `${result.fraud_type} — ${result.severity}`,
      scam: result,
      inputText: result.extracted_text,
    });
    toast.success("PDF downloaded");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Module 02"
        title="Screenshot Fraud Scanner"
        description="Drop a screenshot of a suspicious chat, email or website. OCR extracts text and AI flags fraud signals."
        icon={<ImageIcon className="w-6 h-6 text-white" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`glass rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              drag ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            } p-8 text-center min-h-[280px] flex flex-col items-center justify-center`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {preview ? (
              <img src={preview} alt="upload preview" className="max-h-[400px] rounded-lg" />
            ) : (
              <>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "var(--gradient-primary)" }}>
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold">Drop screenshot here</div>
                <div className="text-sm text-muted-foreground mt-1">or click to browse · PNG, JPG, WEBP</div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onAnalyze} disabled={loading || !file}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {loading ? "Scanning…" : "Scan Screenshot"}
            </button>
            {preview && (
              <button onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                className="px-4 py-2.5 rounded-md hover:bg-white/5">Reset</button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!result && !loading && (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground min-h-[280px] flex items-center justify-center">
              Upload a screenshot to begin analysis.
            </div>
          )}
          {loading && (
            <div className="glass rounded-xl p-8 text-center min-h-[280px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="text-sm text-muted-foreground">Running OCR + AI fraud analysis…</div>
            </div>
          )}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Fraud Category</div>
                    <div className="text-xl font-bold mt-1">{result.fraud_type}</div>
                    <div className="mt-2"><SeverityBadge severity={result.severity} /></div>
                  </div>
                  <RiskMeter score={result.risk_score} />
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="text-sm font-semibold mb-2">OCR Extracted Text</div>
                <div className="text-sm bg-background/40 p-3 rounded-lg border border-border max-h-40 overflow-auto whitespace-pre-wrap">
                  {result.extracted_text}
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Red Flags
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.red_flags.map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">{f}</span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-4">{result.analysis}</div>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Recommendations
                </div>
                <ul className="space-y-1.5 text-sm">
                  {result.recommendations.map((r) => (
                    <li key={r} className="flex gap-2"><span className="text-primary">▸</span>{r}</li>
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
      </div>
    </div>
  );
}
