import "./Settings.css";

export default function Settings() {
  return (
    <div className="kn-settings">
      <h1 className="kn-heading kn-heading--page">Preferences</h1>
      <p className="kn-subtext kn-settings__intro">
        Define what you're looking for. We'll handle the rest.
      </p>

      <div className="kn-card kn-settings__card">
        <h2 className="kn-heading kn-settings__card-title">Job Criteria</h2>
        <p className="kn-settings__card-subtext">
          These preferences shape your daily digest.
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
            aria-label="Role Keywords"
          />
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="locations">
            Preferred Locations
          </label>
          <input
            id="locations"
            type="text"
            className="kn-input"
            placeholder="e.g. Bangalore, Hyderabad, Mumbai"
            aria-label="Preferred Locations"
          />
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="mode">
            Work Mode
          </label>
          <select id="mode" className="kn-select" aria-label="Work Mode">
            <option value="">Select mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="experience">
            Experience Level
          </label>
          <select id="experience" className="kn-select" aria-label="Experience Level">
            <option value="">Select level</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <button type="button" className="kn-btn kn-btn--primary kn-settings__submit">
          Save Preferences
        </button>
        <p className="kn-settings__hint">Logic will be connected in the next step.</p>
      </div>
    </div>
  );
}
