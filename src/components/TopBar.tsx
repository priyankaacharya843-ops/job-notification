import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./TopBar.css";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/saved", label: "Saved" },
  { path: "/digest", label: "Digest" },
  { path: "/settings", label: "Settings" },
  { path: "/proof", label: "Proof" },
];

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="kn-topbar">
      <NavLink to="/" className="kn-topbar__brand" onClick={() => setMenuOpen(false)}>
        KodNest Premium
      </NavLink>

      <nav className={`kn-topbar__nav ${menuOpen ? "kn-topbar__nav--open" : ""}`}>
        {NAV_ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `kn-topbar__link ${isActive ? "kn-topbar__link--active" : ""}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="kn-topbar__menu-btn"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {menuOpen ? (
            <>
              <path d="M18 6L6 18M6 6l12 12" />
            </>
          ) : (
            <>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </>
          )}
        </svg>
      </button>
    </header>
  );
}
