import { useState, useCallback } from "react";
import {
  getProofArtifacts,
  setProofArtifacts,
  isValidUrl,
  allArtifactsProvided,
} from "../utils/proofArtifacts";
import { getTestChecklist, allTestsPassed } from "../utils/testChecklist";
import { getPreferences } from "../utils/preferences";
import "./ProofFinal.css";

const STEP_LABELS = [
  "Preferences configured",
  "Match scoring active",
  "Show only matches toggle",
  "Save job & persist",
  "Status tracking & persist",
  "Digest generation & persist",
  "Test checklist (10/10)",
  "Artifact links (3/3)",
];

function hasAnyPreference(): boolean {
  const p = getPreferences();
  if (!p) return false;
  return (
    p.roleKeywords.trim() !== "" ||
    p.preferredLocations.length > 0 ||
    p.preferredMode.length > 0 ||
    p.experienceLevel !== "" ||
    p.skills.trim() !== ""
  );
}

function getStepStatuses(): ("Completed" | "Pending")[] {
  const prefs = hasAnyPreference();
  const checklist = getTestChecklist();
  const testsOk = allTestsPassed();
  const artifactsOk = allArtifactsProvided();

  return [
    prefs ? "Completed" : "Pending",
    prefs ? "Completed" : "Pending",
    checklist[2] ? "Completed" : "Pending",
    checklist[3] ? "Completed" : "Pending",
    checklist[5] ? "Completed" : "Pending",
    checklist[7] && checklist[8] ? "Completed" : "Pending",
    testsOk ? "Completed" : "Pending",
    artifactsOk ? "Completed" : "Pending",
  ];
}

function buildSubmissionText(artifacts: ReturnType<typeof getProofArtifacts>): string {
  return `------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${artifacts.lovableLink || "(not set)"}

GitHub Repository:
${artifacts.githubLink || "(not set)"}

Live Deployment:
${artifacts.deployedUrl || "(not set)"}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`;
}

export default function ProofFinal() {
  const [artifacts, setArtifacts] = useState(() => getProofArtifacts());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const stepStatuses = getStepStatuses();

  const handleChange = useCallback((field: keyof typeof artifacts, value: string) => {
    setArtifacts((prev) => ({ ...prev, [field]: value }));
    setProofArtifacts({ [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  }, [errors]);

  const validateAndSave = useCallback((field: keyof typeof artifacts, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrors((e) => ({ ...e, [field]: "" }));
      return;
    }
    if (!isValidUrl(trimmed)) {
      setErrors((e) => ({ ...e, [field]: "Enter a valid URL (e.g. https://...)" }));
      return;
    }
    setErrors((e) => ({ ...e, [field]: "" }));
    setProofArtifacts({ [field]: trimmed });
    setArtifacts((prev) => ({ ...prev, [field]: trimmed }));
  }, []);

  const handleCopySubmission = useCallback(() => {
    const text = buildSubmissionText(getProofArtifacts());
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="kn-proof-final">
      <h1 className="kn-heading kn-heading--page">Proof & Submission</h1>
      <p className="kn-subtext kn-proof-final__intro">
        Project 1 — Job Notification Tracker. Complete steps and provide links to finalize.
      </p>

      <section className="kn-proof-final__section" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="kn-proof-final__section-title">
          A) Step Completion Summary
        </h2>
        <ul className="kn-proof-final__steps">
          {STEP_LABELS.map((label, i) => (
            <li key={i} className="kn-proof-final__step">
              <span className="kn-proof-final__step-status" data-status={stepStatuses[i]}>
                {stepStatuses[i]}
              </span>
              <span className="kn-proof-final__step-label">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="kn-proof-final__section" aria-labelledby="artifacts-heading">
        <h2 id="artifacts-heading" className="kn-proof-final__section-title">
          B) Artifact Collection Inputs
        </h2>

        <div className="kn-proof-final__field">
          <label className="kn-label" htmlFor="lovable-link">
            Lovable Project Link
          </label>
          <input
            id="lovable-link"
            type="url"
            className="kn-input"
            placeholder="https://..."
            value={artifacts.lovableLink}
            onChange={(e) => handleChange("lovableLink", e.target.value)}
            onBlur={(e) => validateAndSave("lovableLink", e.target.value)}
          />
          {errors.lovableLink && <span className="kn-proof-final__error">{errors.lovableLink}</span>}
        </div>

        <div className="kn-proof-final__field">
          <label className="kn-label" htmlFor="github-link">
            GitHub Repository Link
          </label>
          <input
            id="github-link"
            type="url"
            className="kn-input"
            placeholder="https://github.com/..."
            value={artifacts.githubLink}
            onChange={(e) => handleChange("githubLink", e.target.value)}
            onBlur={(e) => validateAndSave("githubLink", e.target.value)}
          />
          {errors.githubLink && <span className="kn-proof-final__error">{errors.githubLink}</span>}
        </div>

        <div className="kn-proof-final__field">
          <label className="kn-label" htmlFor="deployed-url">
            Deployed URL (Vercel or equivalent)
          </label>
          <input
            id="deployed-url"
            type="url"
            className="kn-input"
            placeholder="https://..."
            value={artifacts.deployedUrl}
            onChange={(e) => handleChange("deployedUrl", e.target.value)}
            onBlur={(e) => validateAndSave("deployedUrl", e.target.value)}
          />
          {errors.deployedUrl && <span className="kn-proof-final__error">{errors.deployedUrl}</span>}
        </div>
      </section>

      <div className="kn-proof-final__actions">
        <button
          type="button"
          className="kn-btn kn-btn--primary"
          onClick={handleCopySubmission}
        >
          {copied ? "Copied" : "Copy Final Submission"}
        </button>
      </div>
    </div>
  );
}
