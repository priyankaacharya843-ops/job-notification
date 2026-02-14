import { useState, useCallback, useMemo, useEffect } from "react";
import "./Dashboard.css";
import type { Job } from "../types/job";
import { JOBS } from "../data/jobs";
import { filterAndSortJobs } from "../utils/filterJobs";
import { getPreferences } from "../utils/preferences";
import { computeMatchScore } from "../utils/matchScore";
import { getStatusMap } from "../utils/jobStatus";
import FilterBar, { type FilterState, type SortOption } from "../components/FilterBar";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

const defaultFilters: FilterState = {
  keyword: "",
  location: "",
  mode: "",
  experience: "",
  source: "",
  status: "",
  sort: "Latest" as SortOption,
};

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [saveCounter, setSaveCounter] = useState(0);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [prefs, setPrefs] = useState(() => getPreferences());
  const [statusCounter, setStatusCounter] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const statusMap = useMemo(() => getStatusMap(), [statusCounter]);

  useEffect(() => {
    const handler = () => setPrefs(getPreferences());
    window.addEventListener("jobTrackerPreferencesSaved", handler);
    return () => window.removeEventListener("jobTrackerPreferencesSaved", handler);
  }, []);

  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    const p = getPreferences();
    JOBS.forEach((job) => map.set(job.id, computeMatchScore(job, p)));
    return map;
  }, [prefs, saveCounter]);

  const filteredByBar = useMemo(
    () => filterAndSortJobs(JOBS, filters, { scoreMap, statusMap }),
    [filters, scoreMap, statusMap]
  );

  const jobs = useMemo(() => {
    if (!showOnlyMatches || !prefs) return filteredByBar;
    const threshold = prefs.minMatchScore;
    return filteredByBar.filter((j) => (scoreMap.get(j.id) ?? 0) >= threshold);
  }, [filteredByBar, showOnlyMatches, prefs, scoreMap]);

  const handleSaveChange = useCallback(() => setSaveCounter((c) => c + 1), []);
  const handleStatusChange = useCallback((status: string) => {
    setStatusCounter((c) => c + 1);
    setToast(`Status updated: ${status}`);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const noPreferences = !prefs || (prefs && !hasAnyPreference(prefs));
  const emptyBecauseMatch = showOnlyMatches && prefs && filteredByBar.length > 0 && jobs.length === 0;

  return (
    <div className="kn-dashboard">
      <h1 className="kn-heading kn-heading--page">Dashboard</h1>
      <p className="kn-subtext kn-dashboard__intro">
        Browse jobs. Save the ones you like and apply when ready.
      </p>

      {noPreferences && (
        <div className="kn-dashboard__banner" role="status">
          Set your preferences to activate intelligent matching.
        </div>
      )}

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {!noPreferences && (
        <label className="kn-dashboard__toggle">
          <input
            type="checkbox"
            checked={showOnlyMatches}
            onChange={(e) => setShowOnlyMatches(e.target.checked)}
            aria-label="Show only jobs above my threshold"
          />
          <span>Show only jobs above my threshold</span>
        </label>
      )}

      <div className="kn-dashboard__list">
        {emptyBecauseMatch ? (
          <div className="kn-empty-state kn-empty-state--premium">
            <p className="kn-empty-state__text">
              No roles match your criteria. Adjust filters or lower threshold.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="kn-empty-state">
            <p className="kn-empty-state__text">
              No jobs match your filters. Try adjusting the filters above.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={setModalJob}
              onSaveChange={handleSaveChange}
              onStatusChange={handleStatusChange}
              matchScore={prefs ? scoreMap.get(job.id) ?? 0 : null}
              status={statusMap.get(job.id) ?? "Not Applied"}
            />
          ))
        )}
      </div>

      <JobModal job={modalJob} onClose={() => setModalJob(null)} />

      {toast && (
        <div className="kn-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

function hasAnyPreference(p: NonNullable<ReturnType<typeof getPreferences>>): boolean {
  return (
    p.roleKeywords.trim() !== "" ||
    p.preferredLocations.length > 0 ||
    p.preferredMode.length > 0 ||
    p.experienceLevel !== "" ||
    p.skills.trim() !== ""
  );
}
