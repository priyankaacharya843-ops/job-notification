import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="kn-layout">
      <TopBar />
      <main className="kn-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
