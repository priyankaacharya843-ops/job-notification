import { useState, useCallback } from "react";
import "./Dashboard.css";
import type { Job } from "../types/job";
import { JOBS } from "../data/jobs";
import { filterAndSortJobs } from "../utils/filterJobs";
import FilterBar, { type FilterState, type SortOption } from "../components/FilterBar";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

const defaultFilters: FilterState = {
  keyword: "",
  location: "",
  mode: "",
  experience: "",
  source: "",
  sort: "Latest" as SortOption,
};

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [saveCounter, setSaveCounter] = useState(0);

  const jobs = filterAndSortJobs(JOBS, filters);
  const handleSaveChange = useCallback(() => setSaveCounter((c) => c + 1), []);

  return (
    <div className="kn-dashboard">
      <h1 className="kn-heading kn-heading--page">Dashboard</h1>
      <p className="kn-subtext kn-dashboard__intro">
        Browse jobs. Save the ones you like and apply when ready.
      </p>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <div className="kn-dashboard__list">
        {jobs.length === 0 ? (
          <div className="kn-empty-state">
            <p className="kn-empty-state__text">No jobs match your filters. Try adjusting the filters above.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={setModalJob}
              onSaveChange={handleSaveChange}
            />
          ))
        )}
      </div>

      <JobModal job={modalJob} onClose={() => setModalJob(null)} />
    </div>
  );
}
