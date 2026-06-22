// Analysis history persisted per signed-in user to localStorage
import type { ScamAnalysis, CurrencyAnalysis, ScreenshotAnalysis } from "./ai-services";

export type HistoryItem =
  | { id: string; type: "scam"; at: number; input: string; result: ScamAnalysis }
  | { id: string; type: "screenshot"; at: number; input: string; result: ScreenshotAnalysis }
  | { id: string; type: "currency"; at: number; input: string; result: CurrencyAnalysis };

const USER_KEY = "detectra_user_v1";
const PREFIX = "detectra_history_v2:";

function currentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.id ?? null;
  } catch { return null; }
}

export function isSignedIn(): boolean {
  return currentUserId() !== null;
}

export function loadHistory(): HistoryItem[] {
  const uid = currentUserId();
  if (!uid) return [];
  try {
    return JSON.parse(localStorage.getItem(PREFIX + uid) || "[]");
  } catch {
    return [];
  }
}

/** Returns true if the analysis was saved, false if the user is not signed in. */
export function saveHistory(item: Omit<HistoryItem, "id" | "at">): boolean {
  if (typeof window === "undefined") return false;
  const uid = currentUserId();
  if (!uid) return false;
  const all = loadHistory();
  const next = [{ ...item, id: crypto.randomUUID(), at: Date.now() } as HistoryItem, ...all].slice(0, 50);
  localStorage.setItem(PREFIX + uid, JSON.stringify(next));
  window.dispatchEvent(new Event("detectra:history"));
  return true;
}

export function clearHistory() {
  const uid = currentUserId();
  if (!uid) return;
  localStorage.removeItem(PREFIX + uid);
  window.dispatchEvent(new Event("detectra:history"));
}
