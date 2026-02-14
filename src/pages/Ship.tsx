import { Link } from "react-router-dom";
import { allTestsPassed } from "../utils/testChecklist";
import { getProjectStatus } from "../utils/projectStatus";
import "./Ship.css";

export default function Ship() {
  const unlocked = allTestsPassed();
  const status = getProjectStatus();

  if (!unlocked) {
    return (
      <div className="kn-ship kn-ship--locked">
        <h1 className="kn-heading kn-heading--page">Ship</h1>
        <p className="kn-subtext kn-ship__intro">
          This step is locked until all built-in tests pass.
        </p>
        <div className="kn-ship__lock" role="alert">
          <p className="kn-ship__lock-title">Complete the test checklist</p>
          <p className="kn-ship__lock-text">
            All 10 items on the Test page must be checked before you can access Ship.
          </p>
          <Link to="/jt/07-test" className="kn-btn kn-btn--primary">
            Go to Test Checklist
          </Link>
        </div>
      </div>
    );
  }

  if (status === "Shipped") {
    return (
      <div className="kn-ship kn-ship--shipped">
        <h1 className="kn-heading kn-heading--page">Ship</h1>
        <p className="kn-subtext kn-ship__intro">
          Project 1 — Job Notification Tracker
        </p>
        <div className="kn-ship__status-badge" data-status="Shipped">
          Shipped
        </div>
        <p className="kn-ship__shipped-message">
          Project 1 Shipped Successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="kn-ship">
      <h1 className="kn-heading kn-heading--page">Ship</h1>
      <p className="kn-subtext kn-ship__intro">
        All tests passed. Provide proof artifacts to mark as Shipped.
      </p>
      <div className="kn-ship__status-badge" data-status={status}>
        {status}
      </div>
      <div className="kn-ship__content">
        <p className="kn-ship__message">
          Add your Lovable, GitHub, and Deployed URLs on the Proof page. When all 10 tests are checked and all 3 links are valid, status will become Shipped.
        </p>
        <Link to="/jt/proof" className="kn-btn kn-btn--primary">
          Go to Proof & Submission
        </Link>
      </div>
    </div>
  );
}
