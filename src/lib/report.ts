import { jsPDF } from "jspdf";
import type { ScamAnalysis, CurrencyAnalysis } from "./ai-services";

type ReportInput = {
  title: string;
  subtitle?: string;
  scam?: ScamAnalysis;
  currency?: CurrencyAnalysis;
  inputText?: string;
};

export function generateReportPDF(data: ReportInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 50;

  // Header band
  doc.setFillColor(70, 50, 180);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("DETECTRA AI", 40, 45);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Digital Public Safety Platform", 40, 64);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 78);

  y = 130;
  doc.setTextColor(20, 20, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.title, 40, y);
  y += 20;
  if (data.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 110);
    doc.text(data.subtitle, 40, y);
    y += 20;
  }

  const section = (label: string) => {
    y += 10;
    doc.setFillColor(240, 238, 252);
    doc.rect(40, y - 12, W - 80, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 40, 160);
    doc.text(label, 50, y + 3);
    y += 28;
    doc.setTextColor(30, 30, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
  };

  const writeMulti = (text: string) => {
    const lines = doc.splitTextToSize(text, W - 80);
    for (const line of lines) {
      if (y > 780) { doc.addPage(); y = 50; }
      doc.text(line, 40, y);
      y += 15;
    }
  };

  if (data.inputText) {
    section("Analyzed Input");
    writeMulti(data.inputText);
  }

  if (data.scam) {
    section("Risk Assessment");
    writeMulti(`Risk Score: ${data.scam.risk_score}/100`);
    writeMulti(`Fraud Category: ${data.scam.fraud_type}`);
    writeMulti(`Severity: ${data.scam.severity}`);

    section("Red Flags Identified");
    data.scam.red_flags.forEach((f) => writeMulti(`• ${f}`));

    section("AI Analysis");
    writeMulti(data.scam.analysis);

    section("Recommended Actions");
    data.scam.recommendations.forEach((r) => writeMulti(`• ${r}`));
  }

  if (data.currency) {
    section("Currency Analysis");
    writeMulti(`Denomination: ${data.currency.denomination}`);
    writeMulti(`Authenticity Score: ${data.currency.authenticity_score}%`);
    writeMulti(`Status: ${data.currency.status}`);
    writeMulti(`Confidence: ${data.currency.confidence}`);

    if (data.currency.detected_features.length) {
      section("Detected Security Features");
      data.currency.detected_features.forEach((f) => writeMulti(`• ${f}`));
    }
    if (data.currency.suspicious_indicators.length) {
      section("Suspicious Indicators");
      data.currency.suspicious_indicators.forEach((f) => writeMulti(`• ${f}`));
    }
    section("AI Analysis");
    writeMulti(data.currency.analysis);
  }

  section("Citizen Guidance");
  [
    "Never share OTP, CVV, UPI PIN or banking passwords with anyone.",
    "Government agencies do NOT conduct arrests over video calls.",
    "Verify any suspicious communication via official channels.",
    "Report cyber crimes immediately to National Helpline 1930.",
    "File complaints online at https://cybercrime.gov.in",
  ].forEach((g) => writeMulti(`• ${g}`));

  // Footer
  if (y > 770) { doc.addPage(); y = 50; }
  y = Math.max(y + 20, 780);
  doc.setDrawColor(200, 200, 220);
  doc.line(40, y, W - 40, y);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 140);
  doc.text("Detectra AI — Detect. Analyze. Protect.   |   ET AI Hackathon 2026", 40, y + 15);

  doc.save(`detectra-report-${Date.now()}.pdf`);
}
