// Mock AI Services - structured to be swapped for Gemini/Lovable AI later

export type ScamAnalysis = {
  risk_score: number;
  fraud_type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  red_flags: string[];
  analysis: string;
  recommendations: string[];
};

export type CurrencyAnalysis = {
  authenticity_score: number;
  status: "Likely Genuine" | "Potential Counterfeit" | "Suspicious";
  confidence: "Low" | "Medium" | "High";
  detected_features: string[];
  suspicious_indicators: string[];
  analysis: string;
  denomination: string;
};

export type ScreenshotAnalysis = ScamAnalysis & {
  extracted_text: string;
};

const FRAUD_CATEGORIES = [
  "Digital Arrest Scam",
  "UPI Scam",
  "KYC Scam",
  "Job Scam",
  "Lottery Scam",
  "Investment Scam",
  "Courier Scam",
];

const KEYWORD_MAP: Record<string, { type: string; weight: number; flag: string }[]> = {
  "digital arrest": [{ type: "Digital Arrest Scam", weight: 95, flag: "Government Impersonation" }],
  "cbi": [{ type: "Digital Arrest Scam", weight: 80, flag: "Law Enforcement Impersonation" }],
  "police": [{ type: "Digital Arrest Scam", weight: 60, flag: "Authority Impersonation" }],
  "arrest warrant": [{ type: "Digital Arrest Scam", weight: 90, flag: "Threat of Arrest" }],
  "kyc": [{ type: "KYC Scam", weight: 75, flag: "KYC Update Request" }],
  "account block": [{ type: "KYC Scam", weight: 80, flag: "Account Blocking Threat" }],
  "upi": [{ type: "UPI Scam", weight: 60, flag: "UPI Reference" }],
  "scan this qr": [{ type: "UPI Scam", weight: 88, flag: "QR Code Payment Request" }],
  "click this link": [{ type: "UPI Scam", weight: 70, flag: "Suspicious Link" }],
  "won lottery": [{ type: "Lottery Scam", weight: 90, flag: "Lottery Winnings Claim" }],
  "lucky winner": [{ type: "Lottery Scam", weight: 85, flag: "Prize Notification" }],
  "job offer": [{ type: "Job Scam", weight: 70, flag: "Unsolicited Job Offer" }],
  "work from home": [{ type: "Job Scam", weight: 65, flag: "WFH Opportunity" }],
  "investment": [{ type: "Investment Scam", weight: 65, flag: "Investment Pitch" }],
  "guaranteed returns": [{ type: "Investment Scam", weight: 90, flag: "Guaranteed Returns Promise" }],
  "crypto": [{ type: "Investment Scam", weight: 70, flag: "Crypto Investment" }],
  "courier": [{ type: "Courier Scam", weight: 70, flag: "Courier/Parcel Reference" }],
  "fedex": [{ type: "Courier Scam", weight: 75, flag: "Courier Company Impersonation" }],
  "customs": [{ type: "Courier Scam", weight: 80, flag: "Customs Fee Demand" }],
  "urgent": [{ type: "", weight: 25, flag: "Urgency Tactics" }],
  "immediately": [{ type: "", weight: 20, flag: "Urgency Tactics" }],
  "otp": [{ type: "UPI Scam", weight: 80, flag: "OTP Request" }],
  "verify": [{ type: "", weight: 15, flag: "Verification Request" }],
  "transfer": [{ type: "", weight: 30, flag: "Money Transfer Request" }],
  "pay": [{ type: "", weight: 20, flag: "Payment Request" }],
  "₹": [{ type: "", weight: 15, flag: "Money Amount Mentioned" }],
  "rs.": [{ type: "", weight: 15, flag: "Money Amount Mentioned" }],
  "bank account": [{ type: "", weight: 25, flag: "Bank Account Reference" }],
  "aadhaar": [{ type: "KYC Scam", weight: 60, flag: "Aadhaar Reference" }],
  "pan card": [{ type: "KYC Scam", weight: 55, flag: "PAN Card Reference" }],
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function analyzeScamText(text: string): Promise<ScamAnalysis> {
  await delay(1100);
  const lower = text.toLowerCase();
  let score = 0;
  const flags = new Set<string>();
  const typeScores: Record<string, number> = {};

  for (const [kw, hits] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) {
      for (const h of hits) {
        score += h.weight;
        flags.add(h.flag);
        if (h.type) typeScores[h.type] = (typeScores[h.type] || 0) + h.weight;
      }
    }
  }

  // URL detection
  if (/https?:\/\/|bit\.ly|tinyurl|t\.me\//i.test(text)) {
    score += 25;
    flags.add("Suspicious Link Detected");
  }
  // Phone number
  if (/\+?\d{10,}/.test(text)) {
    score += 10;
    flags.add("Unknown Phone Number");
  }

  const risk_score = Math.min(100, Math.max(text.length > 0 ? 8 : 0, score));
  const fraud_type =
    Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    (risk_score > 40 ? "Generic Phishing Scam" : "No Clear Fraud Pattern");

  let severity: ScamAnalysis["severity"] = "Low";
  if (risk_score >= 80) severity = "Critical";
  else if (risk_score >= 60) severity = "High";
  else if (risk_score >= 35) severity = "Medium";

  const recommendations =
    risk_score >= 60
      ? [
          "Do NOT transfer any money or share OTP",
          "Block the sender immediately",
          "Report to National Cyber Crime Helpline 1930",
          "File a complaint at cybercrime.gov.in",
          "Inform family members to stay alert",
        ]
      : risk_score >= 35
      ? [
          "Verify sender identity through official channels",
          "Do not click on any links in the message",
          "Avoid sharing personal or financial information",
          "Monitor your bank account for suspicious activity",
        ]
      : [
          "Message appears low-risk but stay vigilant",
          "Never share OTP, CVV, or banking passwords",
          "Verify any payment request with the actual person",
        ];

  return {
    risk_score: Math.round(risk_score),
    fraud_type,
    severity,
    red_flags: Array.from(flags).slice(0, 8),
    analysis:
      risk_score >= 60
        ? `High probability fraud detected. The message exhibits multiple indicators consistent with ${fraud_type.toLowerCase()} patterns observed in recent cybercrime reports across India.`
        : risk_score >= 35
        ? `Moderate risk identified. The message contains some suspicious elements that warrant caution.`
        : `Low risk profile. No strong fraud indicators detected, but always verify before acting on any financial request.`,
    recommendations,
  };
}

export async function analyzeScreenshot(file: File): Promise<ScreenshotAnalysis> {
  await delay(900);
  // Mock OCR: derive pseudo-text from filename + simulated content
  const samples = [
    "URGENT: Your KYC has expired. Click here to update immediately or your account will be blocked: http://bit.ly/kyc-update-now. Verify with OTP.",
    "Congratulations! You have WON lottery of Rs. 25,00,000. Send your bank account details and Aadhaar to claim your prize.",
    "This is CBI. A digital arrest warrant has been issued against you. Pay ₹50,000 immediately to avoid arrest. Call +91-9999999999.",
    "FedEx Courier: Your parcel contains illegal items. Customs fee ₹15,000 pending. Pay via UPI to release the parcel.",
    "Hi, just confirming our meeting tomorrow at 3 PM. Let me know if that still works.",
  ];
  const text = samples[Math.floor(Math.random() * (samples.length - 1))];
  const analysis = await analyzeScamText(text);
  return { ...analysis, extracted_text: text };
}

export async function analyzeCurrency(file: File, denomination: string): Promise<CurrencyAnalysis> {
  await delay(1400);
  // Mock: deterministic from file size
  const seed = (file.size % 100) / 100;
  const score = Math.round(35 + seed * 60);
  const genuine = score >= 70;

  const allFeatures = [
    "Security Thread Visible",
    "Watermark Detected",
    "RBI Markings Found",
    "Mahatma Gandhi Portrait Recognized",
    "Latent Image Present",
    "Micro-lettering Detected",
    "Color-shifting Ink Confirmed",
  ];
  const allIssues = [
    "Missing or faded watermark",
    "Inconsistent print pattern",
    "Security thread not visible",
    "Color-shifting ink absent",
    "Misaligned serial numbers",
    "Poor paper quality detected",
  ];

  const detected = genuine ? allFeatures.slice(0, 4 + Math.floor(seed * 3)) : allFeatures.slice(0, 1);
  const issues = genuine ? [] : allIssues.slice(0, 3 + Math.floor(seed * 2));

  return {
    authenticity_score: score,
    status: genuine ? "Likely Genuine" : score >= 50 ? "Suspicious" : "Potential Counterfeit",
    confidence: score >= 80 || score < 40 ? "High" : score >= 60 ? "Medium" : "Low",
    detected_features: detected,
    suspicious_indicators: issues,
    analysis: genuine
      ? `The ${denomination} note appears authentic. All key security features expected by RBI guidelines were identified with high confidence.`
      : `The ${denomination} note shows multiple irregularities inconsistent with genuine RBI-issued currency. Recommend verification at a bank branch.`,
    denomination,
  };
}

export { FRAUD_CATEGORIES };
