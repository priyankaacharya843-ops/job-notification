import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Saved from "./pages/Saved";
import Digest from "./pages/Digest";
import Settings from "./pages/Settings";
import Proof from "./pages/Proof";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="saved" element={<Saved />} />
          <Route path="digest" element={<Digest />} />
          <Route path="settings" element={<Settings />} />
          <Route path="proof" element={<Proof />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
