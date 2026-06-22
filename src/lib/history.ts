// Analysis history persisted to localStorage
import type { ScamAnalysis, CurrencyAnalysis, ScreenshotAnalysis } from "./ai-services";

export type HistoryItem =
  | { id: string; type: "scam"; at: number; input: string; result: ScamAnalysis }
  | { id: string; type: "screenshot"; at: number; input: string; result: ScreenshotAnalysis }
  | { id: string; type: "currency"; at: number; input: string; result: CurrencyAnalysis };

const KEY = "detectra_history_v1";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(item: Omit<HistoryItem, "id" | "at">) {
  if (typeof window === "undefined") return;
  const all = loadHistory();
  const next = [{ ...item, id: crypto.randomUUID(), at: Date.now() } as HistoryItem, ...all].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("detectra:history"));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("detectra:history"));
}
