import { Bell, HelpCircle, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../../constants/navigation";
import { authApi, type CurrentUser } from "../../services/api/auth";
import { getCurrentUserRole } from "../../services/permissions";

const readUser = (): CurrentUser | null => {
  try { return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "null") as CurrentUser | null; } catch { return null; }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(readUser);
  useEffect(() => {
    let active = true;
    authApi.me().then((current) => { if (active) setUser(current); }).catch(() => undefined);
    const sync = () => setUser(readUser()); window.addEventListener("storage", sync); return () => { active = false; window.removeEventListener("storage", sync); };
  }, []);
  const pageTitle = useMemo(() => navigationItems.find((item) => item.path === location.pathname)?.label ?? "HR & Payroll", [location.pathname]);
  const role = getCurrentUserRole() ?? "Role pending";
  const initials = (user?.username ?? "User").split(/[._\s-]+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return <div className="topbar">
    <span className="branch-selector" aria-label="Assigned branch">{user?.branch_name ?? "All branches"}</span>
    <div className="breadcrumb">{pageTitle}</div><div className="topbar-spacer" />
    <span className="role-badge">{role}</span>
    <button className="icon-button" type="button" aria-label="Search"><Search aria-hidden="true" size={17} /></button>
    <button className="icon-button notification-button" type="button" aria-label="Notifications"><Bell aria-hidden="true" size={17} /><span className="notification-dot" /></button>
    <button className="icon-button" type="button" aria-label="Help"><HelpCircle aria-hidden="true" size={17} /></button>
    <button className="icon-button" type="button" aria-label="System settings" onClick={() => navigate("/system/settings")}><Settings aria-hidden="true" size={17} /></button>
    <div className="avatar" aria-label={user?.username ?? "Current user"}>{initials || "U"}</div>
  </div>;
}
