const STATUS_KEY = "jobTrackerStatus";
const HISTORY_KEY = "jobTrackerStatusHistory";
const HISTORY_MAX = 50;

import type { JobStatus } from "../types/status";
import type { StatusHistoryEntry } from "../types/status";

function getStatusRaw(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, string> = {};
    for (const [id, s] of Object.entries(parsed)) {
      if (typeof id === "string" && typeof s === "string" && isValidStatus(s)) out[id] = s;
    }
    return out;
  } catch {
    return {};
  }
}

function isValidStatus(s: string): s is JobStatus {
  return s === "Not Applied" || s === "Applied" || s === "Rejected" || s === "Selected";
}

export function getJobStatus(jobId: string): JobStatus {
  const s = getStatusRaw()[jobId];
  return s && isValidStatus(s) ? s : "Not Applied";
}

export function getStatusMap(): Map<string, JobStatus> {
  const raw = getStatusRaw();
  const map = new Map<string, JobStatus>();
  for (const [id, s] of Object.entries(raw)) {
    if (isValidStatus(s)) map.set(id, s);
  }
  return map;
}

export function setJobStatus(jobId: string, status: JobStatus): void {
  const raw = getStatusRaw();
  raw[jobId] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(raw));
  if (status !== "Not Applied") {
    appendHistory({ jobId, status, changedAt: new Date().toISOString() });
  }
}

function appendHistory(entry: StatusHistoryEntry): void {
  let list: StatusHistoryEntry[] = [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) list = JSON.parse(raw) as StatusHistoryEntry[];
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }
  list.unshift(entry);
  list = list.slice(0, HISTORY_MAX);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function getStatusHistory(): StatusHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown;
    if (!Array.isArray(list)) return [];
    return list.filter(
      (e): e is StatusHistoryEntry =>
        e != null &&
        typeof e === "object" &&
        typeof (e as StatusHistoryEntry).jobId === "string" &&
        isValidStatus((e as StatusHistoryEntry).status) &&
        typeof (e as StatusHistoryEntry).changedAt === "string"
    );
  } catch {
    return [];
  }
}
