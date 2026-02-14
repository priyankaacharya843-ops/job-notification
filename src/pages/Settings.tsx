import { useState, useEffect } from "react";
import type { JobTrackerPreferences } from "../types/preferences";
import { DEFAULT_PREFERENCES } from "../types/preferences";
import { getPreferences, savePreferences } from "../utils/preferences";
import "./Settings.css";

const LOCATIONS = [
  "Bangalore", "Hyderabad", "Mumbai", "Chennai", "Pune", "Gurgaon", "Noida",
  "Kolkata", "Ahmedabad", "Remote", "India",
];

const MODES: Array<"Remote" | "Hybrid" | "Onsite"> = ["Remote", "Hybrid", "Onsite"];

const EXPERIENCE_OPTIONS = ["", "Fresher", "0-1", "1-3", "3-5"];

export default function Settings() {
  const [form, setForm] = useState<JobTrackerPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getPreferences();
    if (stored) setForm(stored);
  }, []);

  const update = (part: Partial<JobTrackerPreferences>) => {
    setForm((prev) => ({ ...prev, ...part }));
    setSaved(false);
  };

  const handleLocationToggle = (loc: string) => {
    setForm((prev) => {
      const next = prev.preferredLocations.includes(loc)
        ? prev.preferredLocations.filter((l) => l !== loc)
        : [...prev.preferredLocations, loc];
      return { ...prev, preferredLocations: next };
    });
    setSaved(false);
  };

  const handleModeToggle = (mode: "Remote" | "Hybrid" | "Onsite") => {
    setForm((prev) => {
      const next = prev.preferredMode.includes(mode)
        ? prev.preferredMode.filter((m) => m !== mode)
        : [...prev.preferredMode, mode];
      return { ...prev, preferredMode: next };
    });
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePreferences(form);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("jobTrackerPreferencesSaved"));
  };

  return (
    <div className="kn-settings">
      <h1 className="kn-heading kn-heading--page">Preferences</h1>
      <p className="kn-subtext kn-settings__intro">
        Define what you're looking for. We'll handle the rest.
      </p>

      <form className="kn-card kn-settings__card" onSubmit={handleSubmit}>
        <h2 className="kn-heading kn-settings__card-title">Job Criteria</h2>
        <p className="kn-settings__card-subtext">
          These preferences shape your daily digest and match scores.
        </p>

        <div className="kn-field">
          <label className="kn-label" htmlFor="role-keywords">
            Role Keywords
          </label>
          <input
            id="role-keywords"
            type="text"
            className="kn-input"
            placeholder="e.g. Frontend Engineer, React Developer"
            value={form.roleKeywords}
            onChange={(e) => update({ roleKeywords: e.target.value })}
            aria-label="Role Keywords"
          />
        </div>

        <div className="kn-field">
          <label className="kn-label">Preferred Locations</label>
          <div className="kn-settings__multiselect">
            {LOCATIONS.map((loc) => (
              <label key={loc} className="kn-settings__checkbox">
                <input
                  type="checkbox"
                  checked={form.preferredLocations.includes(loc)}
                  onChange={() => handleLocationToggle(loc)}
                  aria-label={`Location ${loc}`}
                />
                <span>{loc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="kn-field">
          <label className="kn-label">Work Mode</label>
          <div className="kn-settings__checkboxes">
            {MODES.map((mode) => (
              <label key={mode} className="kn-settings__checkbox">
                <input
                  type="checkbox"
                  checked={form.preferredMode.includes(mode)}
                  onChange={() => handleModeToggle(mode)}
                  aria-label={`Mode ${mode}`}
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="experience">
            Experience Level
          </label>
          <select
            id="experience"
            className="kn-select"
            value={form.experienceLevel}
            onChange={(e) => update({ experienceLevel: e.target.value })}
            aria-label="Experience Level"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt || "any"} value={opt}>
                {opt || "Any"}
              </option>
            ))}
          </select>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="skills">
            Skills
          </label>
          <input
            id="skills"
            type="text"
            className="kn-input"
            placeholder="e.g. React, Java, Python"
            value={form.skills}
            onChange={(e) => update({ skills: e.target.value })}
            aria-label="Skills"
          />
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="min-match">
            Minimum match score: {form.minMatchScore}
          </label>
          <input
            id="min-match"
            type="range"
            min={0}
            max={100}
            value={form.minMatchScore}
            onChange={(e) => update({ minMatchScore: Number(e.target.value) })}
            className="kn-settings__slider"
            aria-label="Minimum match score"
          />
        </div>

        <button type="submit" className="kn-btn kn-btn--primary kn-settings__submit">
          Save Preferences
        </button>
        {saved && <p className="kn-settings__saved">Preferences saved.</p>}
      </form>
    </div>
  );
}
