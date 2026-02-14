import type { Job } from "../types/job";
import "./JobModal.css";

type Props = { job: Job | null; onClose: () => void };

export default function JobModal({ job, onClose }: Props) {
  if (!job) return null;

  return (
    <div className="kn-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
      <div className="kn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kn-modal__header">
          <h2 id="job-modal-title" className="kn-modal__title">{job.title}</h2>
          <p className="kn-modal__company">{job.company}</p>
          <button type="button" className="kn-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="kn-modal__body">
          <p className="kn-modal__description">{job.description}</p>
          <div className="kn-modal__skills">
            <span className="kn-modal__skills-label">Skills:</span>
            <div className="kn-modal__tags">
              {job.skills.map((s) => (
                <span key={s} className="kn-modal__tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
