import { Link } from "react-router-dom";

export default function Proof() {
  return (
    <div className="kn-empty">
      <h1 className="kn-heading kn-heading--page">Proof</h1>
      <p className="kn-subtext kn-empty__message">
        Project 1 — Job Notification Tracker. Proof and final submission (step completion summary, Lovable/GitHub/Deployed links, Copy Final Submission) are on the dedicated Proof & Submission page.
      </p>
      <p className="kn-empty__action">
        <Link to="/jt/proof" className="kn-btn kn-btn--primary">
          Go to Proof & Submission
        </Link>
      </p>
    </div>
  );
}
