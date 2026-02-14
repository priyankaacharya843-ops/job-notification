import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="kn-not-found">
      <h1 className="kn-not-found__title">404 – Page Not Found</h1>
      <p className="kn-not-found__subtext">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="kn-not-found__link">
        Back to home
      </Link>
    </div>
  );
}
