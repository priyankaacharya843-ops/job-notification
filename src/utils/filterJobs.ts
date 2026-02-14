import type { Job } from "../types/job";
import type { FilterState, SortOption } from "../components/FilterBar";

function matchesKeyword(job: Job, keyword: string): boolean {
  if (!keyword.trim()) return true;
  const k = keyword.trim().toLowerCase();
  return (
    job.title.toLowerCase().includes(k) ||
    job.company.toLowerCase().includes(k)
  );
}

function matchesFilter(job: Job, f: FilterState): boolean {
  if (!matchesKeyword(job, f.keyword)) return false;
  if (f.location && job.location !== f.location) return false;
  if (f.mode && job.mode !== f.mode) return false;
  if (f.experience && job.experience !== f.experience) return false;
  if (f.source && job.source !== f.source) return false;
  return true;
}

/** Extract first number from salary string for sort (e.g. "3–5 LPA" -> 3, "₹15k–₹40k" -> 15) */
function salarySortValue(salaryRange: string): number {
  const match = salaryRange.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function compareBySort(
  a: Job,
  b: Job,
  sort: SortOption,
  scoreMap?: Map<string, number> | null
): number {
  switch (sort) {
    case "Latest":
      return a.postedDaysAgo - b.postedDaysAgo;
    case "Oldest":
      return b.postedDaysAgo - a.postedDaysAgo;
    case "Match Score": {
      if (!scoreMap) return a.postedDaysAgo - b.postedDaysAgo;
      const sa = scoreMap.get(a.id) ?? 0;
      const sb = scoreMap.get(b.id) ?? 0;
      return sb - sa;
    }
    case "Salary (high)":
      return salarySortValue(b.salaryRange) - salarySortValue(a.salaryRange);
    case "Salary (low)":
      return salarySortValue(a.salaryRange) - salarySortValue(b.salaryRange);
    default:
      return a.postedDaysAgo - b.postedDaysAgo;
  }
}

export interface FilterOptions {
  scoreMap?: Map<string, number> | null;
}

export function filterAndSortJobs(
  jobs: Job[],
  filters: FilterState,
  options?: FilterOptions
): Job[] {
  const filtered = jobs.filter((j) => matchesFilter(j, filters));
  return [...filtered].sort((a, b) =>
    compareBySort(a, b, filters.sort, options?.scoreMap)
  );
}
