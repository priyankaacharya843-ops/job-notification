import { useState, useCallback, useMemo } from "react";
import { JOBS } from "../data/jobs";
import { getPreferences } from "../utils/preferences";
import { getStoredDigest, setStoredDigest, getTodayDateString } from "../utils/digestStorage";
import { generateDigest } from "../utils/generateDigest";
import { getMatchScoreBadgeClass } from "../utils/matchScore";
import { getStatusHistory } from "../utils/jobStatus";
import type { Job } from "../types/job";
import type { StoredDigest } from "../types/digest";
import "./Digest.css";

function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatStatusChangedAt(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function digestToPlainText(digest: StoredDigest, jobsById: Map<string, Job>): string {
  const lines: string[] = [
    "Top 10 Jobs For You — 9AM Digest",
    formatDisplayDate(digest.date),
    "",
  ];
  digest.entries.forEach((entry, i) => {
    const job = jobsById.get(entry.jobId);
    if (!job) return;
    lines.push(`${i + 1}. ${job.title} at ${job.company}`);
    lines.push(`   Location: ${job.location} | Experience: ${job.experience} | Match: ${entry.matchScore}`);
    lines.push(`   Apply: ${job.applyUrl}`);
    lines.push("");
  });
  lines.push("This digest was generated based on your preferences.");
  return lines.join("\n");
}

export default function Digest() {
  const today = useMemo(() => getTodayDateString(), []);
  const [digest, setDigest] = useState<StoredDigest | null>(() => getStoredDigest(today));
  const [copied, setCopied] = useState(false);

  const prefs = useMemo(() => getPreferences(), []);
  const hasPrefs = prefs && (
    prefs.roleKeywords.trim() !== "" ||
    prefs.preferredLocations.length > 0 ||
    prefs.preferredMode.length > 0 ||
    prefs.experienceLevel !== "" ||
    prefs.skills.trim() !== ""
  );

  const jobsById = useMemo(() => new Map(JOBS.map((j) => [j.id, j])), []);
  const statusHistory = getStatusHistory();

  const handleGenerate = useCallback(() => {
    // Always regenerate so changing preferences and clicking again produces a new digest
    const next = generateDigest(JOBS, prefs ?? null, today) ?? { date: today, entries: [] };
    setStoredDigest(next);
    setDigest(next);
  }, [today, prefs]);

  const handleCopy = useCallback(() => {
    if (!digest || digest.entries.length === 0) return;
    const text = digestToPlainText(digest, jobsById);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [digest, jobsById]);

  const handleEmailDraft = useCallback(() => {
    if (!digest || digest.entries.length === 0) return;
    const body = digestToPlainText(digest, jobsById);
    const mailto = `mailto:?subject=${encodeURIComponent("My 9AM Job Digest")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }, [digest, jobsById]);

  const digestJobs = useMemo(() => {
    if (!digest) return [];
    return digest.entries
      .map((e) => ({ job: jobsById.get(e.jobId), matchScore: e.matchScore }))
      .filter((x): x is { job: Job; matchScore: number } => x.job != null);
  }, [digest, jobsById]);

  if (!hasPrefs) {
    return (
      <div className="kn-digest">
        <h1 className="kn-heading kn-heading--page">Digest</h1>
        <p className="kn-subtext kn-digest__intro">
          Your daily digest, delivered at 9AM.
        </p>
        <div className="kn-digest__block" role="alert">
          Set preferences to generate a personalized digest.
        </div>
      </div>
    );
  }

  return (
    <div className="kn-digest">
      <h1 className="kn-heading kn-heading--page">Digest</h1>
      <p className="kn-subtext kn-digest__intro">
        Your daily digest, delivered at 9AM.
      </p>

      {statusHistory.length > 0 && (
        <section className="kn-digest__status-section" aria-label="Recent status updates">
          <h2 className="kn-digest__status-title">Recent Status Updates</h2>
          <ul className="kn-digest__status-list">
            {statusHistory.map((entry, i) => {
              const job = jobsById.get(entry.jobId);
              if (!job) return null;
              return (
                <li key={`${entry.jobId}-${entry.changedAt}-${i}`} className="kn-digest__status-item">
                  <span className="kn-digest__status-job">{job.title}</span>
                  <span className="kn-digest__status-company">{job.company}</span>
                  <span className={"kn-digest__status-badge kn-digest__status-badge--" + (entry.status === "Not Applied" ? "not-applied" : entry.status.toLowerCase())}>
                    {entry.status}
                  </span>
                  <span className="kn-digest__status-date">{formatStatusChangedAt(entry.changedAt)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="kn-digest__demo-note">
        Demo Mode: Daily 9AM trigger simulated manually.
      </p>

      <button
        type="button"
        className="kn-btn kn-btn--primary kn-digest__generate"
        onClick={handleGenerate}
      >
        Generate Today's 9AM Digest (Simulated)
      </button>

      {digest && digest.entries.length === 0 && (
        <div className="kn-digest__block kn-digest__empty" role="status">
          <p className="kn-digest__empty-title">Today's digest</p>
          <p className="kn-digest__empty-message">No matching roles today. Check again tomorrow.</p>
        </div>
      )}

      {digest && digestJobs.length > 0 && (
        <div className="kn-digest__card">
          <header className="kn-digest__header">
            <h2 className="kn-digest__title">Top 10 Jobs For You — 9AM Digest</h2>
            <p className="kn-digest__date">{formatDisplayDate(digest.date)}</p>
          </header>

          <ul className="kn-digest__list">
            {digestJobs.map(({ job, matchScore }) => (
              <li key={job.id} className="kn-digest__item">
                <div className="kn-digest__item-main">
                  <h3 className="kn-digest__item-title">{job.title}</h3>
                  <p className="kn-digest__item-company">{job.company}</p>
                  <p className="kn-digest__item-meta">
                    {job.location} · {job.experience}
                  </p>
                  <span className={`kn-match-badge ${getMatchScoreBadgeClass(matchScore)}`}>
                    Match: {matchScore}
                  </span>
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kn-btn kn-btn--primary kn-digest__apply"
                >
                  Apply
                </a>
              </li>
            ))}
          </ul>

          <footer className="kn-digest__footer">
            This digest was generated based on your preferences.
          </footer>

          <div className="kn-digest__actions">
            <button type="button" className="kn-btn kn-digest__action" onClick={handleCopy}>
              {copied ? "Copied" : "Copy Digest to Clipboard"}
            </button>
            <button type="button" className="kn-btn kn-digest__action" onClick={handleEmailDraft}>
              Create Email Draft
            </button>
          </div>
        </div>
      )}

      {!digest && (
        <p className="kn-subtext kn-digest__hint">
          Click the button above to generate today's digest.
        </p>
      )}
    </div>
  );
}
