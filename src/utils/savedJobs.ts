const STORAGE_KEY = "job-notification-tracker-saved";

export function getSavedJobIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveJobId(id: string): void {
  const ids = getSavedJobIds();
  if (ids.includes(id)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
}

export function unsaveJobId(id: string): void {
  const ids = getSavedJobIds().filter((x) => x !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isJobSaved(id: string): boolean {
  return getSavedJobIds().includes(id);
}
