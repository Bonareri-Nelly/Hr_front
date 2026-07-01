import { Outlet } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Sidebar />
      </aside>

      <header className="app-topbar">
        <Navbar />
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
