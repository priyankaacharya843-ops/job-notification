export type PreferredMode = "Remote" | "Hybrid" | "Onsite";

export interface JobTrackerPreferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: PreferredMode[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const DEFAULT_PREFERENCES: JobTrackerPreferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};
