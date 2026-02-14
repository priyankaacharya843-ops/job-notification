import { Link } from "react-router-dom";
import { allTestsPassed } from "../utils/testChecklist";
import "./Ship.css";

export default function Ship() {
  const unlocked = allTestsPassed();

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

  return (
    <div className="kn-ship">
      <h1 className="kn-heading kn-heading--page">Ship</h1>
      <p className="kn-subtext kn-ship__intro">
        All tests passed. You're ready to ship.
      </p>
      <div className="kn-ship__content">
        <p className="kn-ship__message">
          This section is unlocked. Add your deployment or release steps here.
        </p>
      </div>
    </div>
  );
}
