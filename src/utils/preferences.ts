const STORAGE_KEY = "jobTrackerPreferences";

import type { JobTrackerPreferences } from "../types/preferences";
import { DEFAULT_PREFERENCES } from "../types/preferences";

export function getPreferences(): JobTrackerPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      roleKeywords: typeof parsed.roleKeywords === "string" ? parsed.roleKeywords : DEFAULT_PREFERENCES.roleKeywords,
      preferredLocations: Array.isArray(parsed.preferredLocations)
        ? parsed.preferredLocations.filter((x): x is string => typeof x === "string")
        : DEFAULT_PREFERENCES.preferredLocations,
      preferredMode: Array.isArray(parsed.preferredMode)
        ? parsed.preferredMode.filter((x): x is "Remote" | "Hybrid" | "Onsite" =>
            x === "Remote" || x === "Hybrid" || x === "Onsite")
        : DEFAULT_PREFERENCES.preferredMode,
      experienceLevel: typeof parsed.experienceLevel === "string" ? parsed.experienceLevel : DEFAULT_PREFERENCES.experienceLevel,
      skills: typeof parsed.skills === "string" ? parsed.skills : DEFAULT_PREFERENCES.skills,
      minMatchScore: typeof parsed.minMatchScore === "number" && parsed.minMatchScore >= 0 && parsed.minMatchScore <= 100
        ? parsed.minMatchScore
        : DEFAULT_PREFERENCES.minMatchScore,
    };
  } catch {
    return null;
  }
}

export function savePreferences(prefs: JobTrackerPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function hasPreferences(): boolean {
  const p = getPreferences();
  if (!p) return false;
  return true;
}
