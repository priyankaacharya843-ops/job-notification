import type { StoredDigest } from "../types/digest";
import { getDigestStorageKey } from "../types/digest";

export function getStoredDigest(date: string): StoredDigest | null {
  try {
    const raw = localStorage.getItem(getDigestStorageKey(date));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || typeof (parsed as StoredDigest).date !== "string") return null;
    const d = parsed as StoredDigest;
    if (!Array.isArray(d.entries)) return null;
    return {
      date: d.date,
      entries: d.entries.filter(
        (e): e is { jobId: string; matchScore: number } =>
          typeof e === "object" && e !== null && typeof (e as { jobId: string }).jobId === "string" && typeof (e as { matchScore: number }).matchScore === "number"
      ),
    };
  } catch {
    return null;
  }
}

export function setStoredDigest(digest: StoredDigest): void {
  localStorage.setItem(getDigestStorageKey(digest.date), JSON.stringify(digest));
}

export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
