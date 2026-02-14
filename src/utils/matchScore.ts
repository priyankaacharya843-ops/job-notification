import type { Job } from "../types/job";
import type { JobTrackerPreferences } from "../types/preferences";

function parseKeywords(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseSkills(s: string): string[] {
  return parseKeywords(s);
}

/**
 * Match score rules (cap at 100):
 * +25 if any roleKeyword in job.title (case-insensitive)
 * +15 if any roleKeyword in job.description
 * +15 if job.location in preferredLocations
 * +10 if job.mode in preferredMode
 * +10 if job.experience === experienceLevel
 * +15 if overlap between job.skills and user skills (any match)
 * +5 if postedDaysAgo <= 2
 * +5 if source is LinkedIn
 */
export function computeMatchScore(job: Job, prefs: JobTrackerPreferences | null): number {
  if (!prefs) return 0;

  let score = 0;
  const roleKeywords = parseKeywords(prefs.roleKeywords);
  const userSkills = parseSkills(prefs.skills);
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  if (roleKeywords.length > 0) {
    const inTitle = roleKeywords.some((kw) => titleLower.includes(kw.toLowerCase()));
    if (inTitle) score += 25;
    const inDesc = roleKeywords.some((kw) => descLower.includes(kw.toLowerCase()));
    if (inDesc) score += 15;
  }

  if (prefs.preferredLocations.length > 0 && prefs.preferredLocations.includes(job.location)) {
    score += 15;
  }

  if (prefs.preferredMode.length > 0 && prefs.preferredMode.includes(job.mode)) {
    score += 10;
  }

  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
    score += 10;
  }

  if (userSkills.length > 0 && job.skills.length > 0) {
    const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
    const hasOverlap = userSkills.some((us) =>
      jobSkillsLower.some((js) => js.includes(us.toLowerCase()) || us.toLowerCase().includes(js))
    );
    if (hasOverlap) score += 15;
  }

  if (job.postedDaysAgo <= 2) score += 5;
  if (job.source === "LinkedIn") score += 5;

  return Math.min(100, score);
}

export function getMatchScoreBadgeClass(score: number): string {
  if (score >= 80) return "kn-match-badge--high";
  if (score >= 60) return "kn-match-badge--medium";
  if (score >= 40) return "kn-match-badge--neutral";
  return "kn-match-badge--low";
}
