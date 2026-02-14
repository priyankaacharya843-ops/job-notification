import { useState, useCallback, useEffect } from "react";
import { JOBS } from "../data/jobs";
import { getSavedJobIds } from "../utils/savedJobs";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import type { Job } from "../types/job";
import "./Saved.css";

export default function Saved() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [modalJob, setModalJob] = useState<Job | null>(null);

  const refresh = useCallback(() => {
    const ids = getSavedJobIds();
    const byId = new Map(JOBS.map((j) => [j.id, j]));
    setSavedJobs(ids.map((id) => byId.get(id)).filter((j): j is Job => !!j));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSaveChange = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="kn-saved">
      <h1 className="kn-heading kn-heading--page">Saved</h1>
      <p className="kn-subtext kn-saved__intro">
        Jobs you saved for later. Unsave to remove from this list.
      </p>

      {savedJobs.length === 0 ? (
        <div className="kn-empty-state kn-empty-state--premium">
          <h2 className="kn-empty-state__heading">No saved jobs yet</h2>
          <p className="kn-empty-state__text">
            Save jobs from the Dashboard to see them here. You can apply or unsave anytime.
          </p>
        </div>
      ) : (
        <div className="kn-saved__list">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={setModalJob}
              onSaveChange={handleSaveChange}
              showUnsave
            />
          ))}
        </div>
      )}

      <JobModal job={modalJob} onClose={() => setModalJob(null)} />
    </div>
  );
}
