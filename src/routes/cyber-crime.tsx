import { createFileRoute } from "@tanstack/react-router";
import { Siren, Phone, ExternalLink, Mail, ShieldAlert, Clock, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/page-bits";

export const Route = createFileRoute("/cyber-crime")({
  head: () => ({
    meta: [
      { title: "Cyber Crime Reporting — Detectra AI" },
      { name: "description", content: "Report cyber crime to India's National Cyber Crime Portal and helpline 1930." },
    ],
  }),
  component: CyberCrime,
});

const STEPS = [
  { t: "Stop & Document", d: "Don't transact further. Take screenshots of the messages, transaction IDs and any caller numbers." },
  { t: "Call Helpline 1930", d: "Call within the golden hour to enable quick freeze of fraudulent transactions." },
  { t: "File Online", d: "Submit a complaint at cybercrime.gov.in with all evidence attached." },
  { t: "Notify Your Bank", d: "Inform your bank's fraud helpline; request to block cards and freeze accounts." },
  { t: "Track Status", d: "Follow up using your acknowledgement number on the portal." },
];

function CyberCrime() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Module 05"
        title="Cyber Crime Reporting"
        description="If you've been targeted by digital fraud, act fast. Use the official channels below."
        icon={<Siren className="w-6 h-6 text-white" />}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 border border-destructive/30 animate-pulse-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-destructive font-bold">Emergency Helpline</div>
              <div className="text-sm text-muted-foreground">24×7 · Toll-free</div>
            </div>
          </div>
          <div className="text-6xl font-bold gradient-text my-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>1930</div>
          <a href="tel:1930"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white w-full justify-center"
            style={{ background: "var(--gradient-primary)" }}>
            <Phone className="w-4 h-4" /> Call 1930 Now
          </a>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-bold">National Portal</div>
              <div className="text-sm text-muted-foreground">Ministry of Home Affairs</div>
            </div>
          </div>
          <div className="font-semibold text-lg mb-1">National Cyber Crime Reporting Portal</div>
          <div className="text-sm text-muted-foreground mb-4">
            File complaints related to financial fraud, women & child safety, and other cyber crimes.
          </div>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold glass hover:bg-white/10 w-full justify-center">
            <ExternalLink className="w-4 h-4" /> Report Cyber Crime
          </a>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="font-semibold text-lg mb-1 flex items-center gap-2"><Clock className="w-5 h-5 text-warning" /> The Golden Hour</div>
        <p className="text-sm text-muted-foreground">
          Reporting within the first hour dramatically improves the chance of freezing the fraudster's accounts and recovering your money.
          Acting fast is the single most important factor.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="font-semibold text-lg mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Reporting Process</div>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                style={{ background: "var(--gradient-primary)" }}>{i + 1}</div>
              <div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Other Contacts</div>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Women's Helpline: <b>181</b></li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Child Helpline: <b>1098</b></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> complaint@cybercrime.gov.in</li>
          </ul>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-success font-semibold mb-2">Stay Protected</div>
          <ul className="text-sm space-y-2">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> Never share OTP, CVV or PIN.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> No agency arrests via video calls.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> Verify via official channels only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
