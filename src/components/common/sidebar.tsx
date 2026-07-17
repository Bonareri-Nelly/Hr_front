import {
  BadgeDollarSign,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  HandCoins,
  Handshake,
  Landmark,
  LayoutDashboard,
  MessageCircleQuestion,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getAllowedNavigationSections } from "../../services/permissions";
import LogoutButton from "./LogoutButton";

const iconMap: Record<string, LucideIcon> = {
  BadgeDollarSign,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  HandCoins,
  Handshake,
  Landmark,
  LayoutDashboard,
  MessageCircleQuestion,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  WalletCards,
};

export default function Sidebar() {
  const allowedSections = getAllowedNavigationSections();

  return (
    <nav className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="brand-mark">N</div>
        <div>
          <div className="brand-name">Nexus</div>
          <div className="brand-subtitle">HR &amp; Payroll</div>
        </div>
      </div>

      <div className="sidebar-sections">
        {allowedSections.map((section) => (
          <section className="nav-section" key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            <div className="nav-links">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;

                return (
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    key={item.path}
                    to={item.path}
                  >
                    <Icon aria-hidden="true" size={17} strokeWidth={1.9} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="sidebar-footer">
        <LogoutButton />
      </div>
    </nav>
  );
}
