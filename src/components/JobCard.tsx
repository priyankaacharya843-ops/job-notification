import type { Job } from "../types/job";
import type { JobStatus } from "../types/status";
import { isJobSaved, saveJobId, unsaveJobId } from "../utils/savedJobs";
import { getJobStatus, setJobStatus } from "../utils/jobStatus";
import { getMatchScoreBadgeClass } from "../utils/matchScore";
import "./JobCard.css";

type Props = {
  job: Job;
  onView: (job: Job) => void;
  onSaveChange?: () => void;
  onStatusChange?: (status: JobStatus) => void;
  showUnsave?: boolean;
  matchScore?: number | null;
  status?: JobStatus;
};

function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const STATUS_OPTIONS: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];

function statusSlug(s: JobStatus): string {
  return s === "Not Applied" ? "not-applied" : s.toLowerCase();
}

export default function JobCard({ job, onView, onSaveChange, showUnsave, matchScore, status: statusProp, onStatusChange }: Props) {
  const saved = isJobSaved(job.id);
  const status = statusProp ?? getJobStatus(job.id);
  const scoreClass = matchScore != null ? getMatchScoreBadgeClass(matchScore) : null;

  const handleSave = () => {
    if (saved) unsaveJobId(job.id);
    else saveJobId(job.id);
    onSaveChange?.();
  };

  const handleApply = () => {
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    setJobStatus(job.id, newStatus);
    onStatusChange?.(newStatus);
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
          {scoreClass != null && (
            <span className={"kn-match-badge " + scoreClass} title="Match score">
              {matchScore}
            </span>
          )}
          <span className={"kn-job-card__status-badge kn-job-card__status-badge--" + statusSlug(status)}>
            {status}
          </span>
          <span className={"kn-job-card__source kn-job-card__source--" + job.source.toLowerCase()}>
            {job.source}
          </span>
          <span className="kn-job-card__posted">{postedLabel(job.postedDaysAgo)}</span>
        </div>
        <div className="kn-job-card__status-group">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={"kn-job-card__status-btn " + (status === s ? "kn-job-card__status-btn--active kn-job-card__status-btn--" + statusSlug(s) : "")}
              onClick={() => handleStatusChange(s)}
              aria-pressed={status === s}
              title="Status is saved automatically. Use Applied after you apply."
            >
              {s}
            </button>
          ))}
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
