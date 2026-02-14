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

function compareBySort(a: Job, b: Job, sort: SortOption): number {
  switch (sort) {
    case "Latest":
      return a.postedDaysAgo - b.postedDaysAgo;
    case "Oldest":
      return b.postedDaysAgo - a.postedDaysAgo;
    case "Salary (high)":
      return (b.salaryRange || "").localeCompare(a.salaryRange || "", undefined, { numeric: true });
    case "Salary (low)":
      return (a.salaryRange || "").localeCompare(b.salaryRange || "", undefined, { numeric: true });
    default:
      return a.postedDaysAgo - b.postedDaysAgo;
  }
}

export function filterAndSortJobs(jobs: Job[], filters: FilterState): Job[] {
  const filtered = jobs.filter((j) => matchesFilter(j, filters));
  return [...filtered].sort((a, b) => compareBySort(a, b, filters.sort));
}
