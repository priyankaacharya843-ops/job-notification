import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getTestChecklist,
  setTestChecklistItem,
  resetTestChecklist,
  allTestsPassed,
  TEST_ITEMS,
} from "../utils/testChecklist";
import "./TestChecklist.css";

export default function TestChecklist() {
  const [checks, setChecks] = useState(() => getTestChecklist());
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const passed = useMemo(() => checks.filter(Boolean).length, [checks]);
  const allPassed = passed === 10;

  const handleToggle = useCallback((index: number) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      setTestChecklistItem(index, next[index]);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    resetTestChecklist();
    setChecks(getTestChecklist());
  }, []);

  return (
    <div className="kn-test">
      <h1 className="kn-heading kn-heading--page">Built-In Test Checklist</h1>
      <p className="kn-subtext kn-test__intro">
        Verify all features before shipping. All 10 must be checked to unlock Ship.
      </p>

      <div className="kn-test__summary">
        <span className="kn-test__count">Tests Passed: {passed} / 10</span>
        {!allPassed && (
          <p className="kn-test__warning" role="alert">
            Resolve all issues before shipping.
          </p>
        )}
      </div>

      <ul className="kn-test__list">
        {TEST_ITEMS.map((item, index) => (
          <li key={index} className="kn-test__item">
            <label className="kn-test__label">
              <input
                type="checkbox"
                checked={checks[index] ?? false}
                onChange={() => handleToggle(index)}
                aria-label={item.label}
              />
              <span className="kn-test__label-text">{item.label}</span>
            </label>
            <div className="kn-test__tooltip-wrap">
              <button
                type="button"
                className="kn-test__tooltip-btn"
                onClick={() => setTooltipIndex(tooltipIndex === index ? null : index)}
                aria-label="How to test"
              >
                How to test
              </button>
              {tooltipIndex === index && (
                <p className="kn-test__tooltip" role="tooltip">
                  {item.howToTest}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="kn-test__actions">
        <button type="button" className="kn-btn kn-test__reset" onClick={handleReset}>
          Reset Test Status
        </button>
        {allPassed ? (
          <Link to="/jt/08-ship" className="kn-btn kn-btn--primary">
            Go to Ship
          </Link>
        ) : (
          <span className="kn-test__locked">Complete all 10 tests to unlock Ship.</span>
        )}
      </div>
    </div>
  );
}
