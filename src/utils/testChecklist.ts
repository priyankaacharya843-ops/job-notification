const STORAGE_KEY = "jobTrackerTestChecklist";
const ITEM_COUNT = 10;

export function getTestChecklist(): boolean[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Array(ITEM_COUNT).fill(false);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Array(ITEM_COUNT).fill(false);
    return Array.from({ length: ITEM_COUNT }, (_, i) => Boolean(parsed[i]));
  } catch {
    return new Array(ITEM_COUNT).fill(false);
  }
}

export function setTestChecklistItem(index: number, checked: boolean): void {
  const list = getTestChecklist();
  if (index < 0 || index >= ITEM_COUNT) return;
  list[index] = checked;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function setTestChecklist(list: boolean[]): void {
  const next = list.slice(0, ITEM_COUNT);
  while (next.length < ITEM_COUNT) next.push(false);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, ITEM_COUNT)));
}

export function resetTestChecklist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(new Array(ITEM_COUNT).fill(false)));
}

export function allTestsPassed(): boolean {
  const list = getTestChecklist();
  return list.length >= ITEM_COUNT && list.every(Boolean);
}

export const TEST_ITEMS: { label: string; howToTest: string }[] = [
  { label: "Preferences persist after refresh", howToTest: "Set preferences on Settings, refresh the page. Form should show your saved values." },
  { label: "Match score calculates correctly", howToTest: "Set role keywords in Settings. On Dashboard, job cards should show a match score badge; higher for jobs matching your keywords." },
  { label: '"Show only matches" toggle works', howToTest: "Enable the toggle on Dashboard. Only jobs with score ≥ your minimum should appear." },
  { label: "Save job persists after refresh", howToTest: "Click Save on a job card, then refresh. The job should still show Saved and appear on the Saved page." },
  { label: "Apply opens in new tab", howToTest: "Click Apply on a job card. A new browser tab should open with the apply URL." },
  { label: "Status update persists after refresh", howToTest: "Change a job's status to Applied (or another). Refresh the page. The status should remain Applied." },
  { label: "Status filter works correctly", howToTest: "On Dashboard, set Status filter to Applied. Only jobs you marked Applied should appear." },
  { label: "Digest generates top 10 by score", howToTest: "Set preferences, go to Digest, click Generate. You should see up to 10 jobs, ordered by match score then recency." },
  { label: "Digest persists for the day", howToTest: "Generate a digest, then refresh the page. The same digest should load without regenerating." },
  { label: "No console errors on main pages", howToTest: "Open Dashboard, Saved, Digest, Settings. Open browser DevTools Console (F12). There should be no red errors." },
];
