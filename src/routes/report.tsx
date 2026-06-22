import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SeverityBadge } from "@/components/page-bits";
import { loadHistory, clearHistory, type HistoryItem } from "@/lib/history";
import { generateReportPDF } from "@/lib/report";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "AI Report Generator — Detectra AI" },
      { name: "description", content: "Generate downloadable PDF reports of all analyses for filing with authorities." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(loadHistory());
    refresh();
    window.addEventListener("detectra:history", refresh);
    return () => window.removeEventListener("detectra:history", refresh);
  }, []);

  const downloadAll = () => {
    if (history.length === 0) { toast.error("No analyses to report"); return; }
    // Combine: use most recent of each type
    const scam = history.find((h) => h.type === "scam" || h.type === "screenshot");
    const cur = history.find((h) => h.type === "currency");
    generateReportPDF({
      title: "Comprehensive Cyber Intelligence Report",
      subtitle: "Multi-module analysis summary",
      scam: scam?.type === "scam" || scam?.type === "screenshot" ? scam.result : undefined,
      currency: cur?.type === "currency" ? cur.result : undefined,
      inputText: scam?.type === "screenshot" ? scam.result.extracted_text : scam?.input,
    });
    toast.success("Comprehensive report downloaded");
  };

  const downloadOne = (h: HistoryItem) => {
    if (h.type === "currency") {
      generateReportPDF({ title: "Currency Authenticity Report", subtitle: h.result.status, currency: h.result });
    } else {
      generateReportPDF({
        title: h.type === "screenshot" ? "Screenshot Fraud Report" : "Scam Analysis Report",
        subtitle: `${h.result.fraud_type} — ${h.result.severity}`,
        scam: h.result,
        inputText: h.type === "screenshot" ? h.result.extracted_text : h.input,
      });
    }
    toast.success("PDF downloaded");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Module 04"
        title="AI Report Generator"
        description="Generate forensic-grade PDF reports from every analysis you've run, ready to file with banks and authorities."
        icon={<FileText className="w-6 h-6 text-white" />}
      />

      <div className="glass rounded-xl p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Comprehensive Report</div>
          <div className="text-sm text-muted-foreground">Combine your most recent scam + currency analyses into a single PDF.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-white"
            style={{ background: "var(--gradient-primary)" }}>
            <Download className="w-4 h-4" /> Download Combined PDF
          </button>
          {history.length > 0 && (
            <button onClick={() => { clearHistory(); toast.success("History cleared"); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md hover:bg-white/5 text-sm">
              <Trash2 className="w-4 h-4" /> Clear History
            </button>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="font-semibold mb-4">Analysis History ({history.length})</div>
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Run an analysis from any module to populate your report history.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((h) => (
              <li key={h.id} className="py-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/15 text-primary uppercase tracking-wider font-semibold">
                  {h.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {h.type === "currency" ? `${h.result.denomination} — ${h.result.status}` : h.result.fraud_type}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{h.input}</div>
                </div>
                {h.type !== "currency" && <SeverityBadge severity={h.result.severity} />}
                {h.type === "currency" && (
                  <span className="text-sm font-bold gradient-text">{h.result.authenticity_score}%</span>
                )}
                <span className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString()}</span>
                <button onClick={() => downloadOne(h)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md glass hover:bg-white/10 text-xs">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
