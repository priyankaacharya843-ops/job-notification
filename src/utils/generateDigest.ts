import type { Job } from "../types/job";
import type { JobTrackerPreferences } from "../types/preferences";
import type { StoredDigest } from "../types/digest";
import { computeMatchScore } from "./matchScore";

/**
 * Select top 10 jobs with matchScore >= minMatchScore, sorted by:
 * 1) matchScore descending
 * 2) postedDaysAgo ascending
 * If no jobs meet the threshold, returns 0 entries (so UI can show "No matching roles today").
 */
export function generateDigest(
  jobs: Job[],
  prefs: JobTrackerPreferences | null,
  date: string
): StoredDigest | null {
  if (!prefs) return null;

  const threshold = prefs.minMatchScore;
  const withScores = jobs
    .map((job) => ({ job, matchScore: computeMatchScore(job, prefs) }))
    .filter((x) => x.matchScore >= threshold);

  const sorted = [...withScores].sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.job.postedDaysAgo - b.job.postedDaysAgo;
  });

  const top10 = sorted.slice(0, 10);
  return {
    date,
    entries: top10.map(({ job, matchScore }) => ({ jobId: job.id, matchScore })),
  };
}
