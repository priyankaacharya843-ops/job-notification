import type { Job } from "../types/job";
import { isJobSaved, saveJobId, unsaveJobId } from "../utils/savedJobs";
import "./JobCard.css";

type Props = {
  job: Job;
  onView: (job: Job) => void;
  onSaveChange?: () => void;
  showUnsave?: boolean;
};

function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function JobCard({ job, onView, onSaveChange, showUnsave }: Props) {
  const saved = isJobSaved(job.id);

  const handleSave = () => {
    if (saved) unsaveJobId(job.id);
    else saveJobId(job.id);
    onSaveChange?.();
  };

  const handleApply = () => {
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="kn-job-card">
      <div className="kn-job-card__main">
        <h3 className="kn-job-card__title">{job.title}</h3>
        <p className="kn-job-card__company">{job.company}</p>
        <div className="kn-job-card__meta">
          <span>{job.location}</span>
          <span className="kn-job-card__dot">·</span>
          <span>{job.mode}</span>
          <span className="kn-job-card__dot">·</span>
          <span>{job.experience}</span>
        </div>
        <p className="kn-job-card__salary">{job.salaryRange}</p>
        <div className="kn-job-card__footer">
          <span className={"kn-job-card__source kn-job-card__source--" + job.source.toLowerCase()}>
            {job.source}
          </span>
          <span className="kn-job-card__posted">{postedLabel(job.postedDaysAgo)}</span>
        </div>
      </div>
      <div className="kn-job-card__actions">
        <button type="button" className="kn-btn kn-job-card__btn" onClick={() => onView(job)}>
          View
        </button>
        <button
          type="button"
          className="kn-btn kn-job-card__btn"
          onClick={handleSave}
          aria-pressed={saved}
        >
          {saved && showUnsave ? "Unsave" : saved ? "Saved" : "Save"}
        </button>
        <button type="button" className="kn-btn kn-btn--primary kn-job-card__btn" onClick={handleApply}>
          Apply
        </button>
      </div>
    </article>
  );
}
