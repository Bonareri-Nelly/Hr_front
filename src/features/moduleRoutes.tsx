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
  ReceiptText,
  Scale,
  Settings, // ← ADD THIS
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
import type { ReactElement } from "react";
import AiAssistant from "./ai-assistant";
import AnnouncementsTraining from "./announcements-training";
import AttendanceManagement from "./attendance-management";
import BankIntegration from "./bank-integration";
import BankIntegrationAccounts from "./bank-integration-accounts";
import BenefitsManagement from "./benefits-management";
import BenefitsManagementAccounts from "./benefits-management-accounts";
import BranchDashboard from "./branch-dashboard";
import CompensationData from "./compensation-data";
import Complaints from "./complaints";
import ContractManagement from "./contract-management";
import DepartmentDashboard from "./department-dashboard";
import DisciplinaryCases from "./disciplinary-cases";
import DisciplinaryManagement from "./disciplinary-management";
import EmployeeDashboard from "./employee-dashboard";
import EmployeeFinance from "./employee-finance";
import EmployeeLifecycle from "./employee-lifecycle";
import ExecutiveDashboard from "./executive-dashboard";
import FinanceDashboard from "./finance-dashboard";
import HrDashboard from "./hr-dashboard";
import LeaveApprovals from "./leave-approvals";
import LeaveWorkflow from "./leave-workflow";
import MultiCurrencyGlIntegration from "./multi-currency-gl-integration";
import MyAnnouncements from "./my-announcements";
import MyAttendance from "./my-attendance";
import MyBenefits from "./my-benefits";
import MyDocuments from "./my-documents";
import MyPerformance from "./my-performance";
import Offboarding from "./offboarding";
import Onboarding from "./onboarding";
import Payroll from "./payroll";
import PayrollApproval from "./payroll-approval";
import PayrollCreation from "./payroll-creation";
import PayrollHistory from "./payroll-history";
import PerformanceOversight from "./performance-oversight";
import ReportsAnalytics from "./reports-analytics";
import SecurityAudit from "./security-audit";
import TaxCompliance from "./tax-compliance";
import TaxComplianceAccounts from "./tax-compliance-accounts";
import UserProfile from "./user-profile";

// Import System Settings
import SystemSettings from "../system/SystemSettings";

export type ModuleRoute = {
  title: string;
  path: string;
  section: string;
  icon: LucideIcon;
  Component: () => ReactElement;
};

export const moduleRoutes: ModuleRoute[] = [
  {
    title: "Executive Dashboard",
    path: "/executive-dashboard",
    section: "Executive",
    icon: LayoutDashboard,
    Component: ExecutiveDashboard,
  },
  // ... all your existing routes ...

  // ADD SYSTEM SETTINGS AT THE END
  {
    title: "System Settings",
    path: "/system",
    section: "System",
    icon: Settings,
    Component: SystemSettings,
  },
  {
    title: "System Settings",
    path: "/system-settings",
    section: "System",
    icon: Settings,
    Component: SystemSettings,
  },
  {
    title: "Settings",
    path: "/settings",
    section: "System",
    icon: Settings,
    Component: SystemSettings,
  },
];

export const moduleSections = Array.from(
  moduleRoutes.reduce((sections, moduleRoute) => {
    const sectionItems = sections.get(moduleRoute.section) ?? [];
    sectionItems.push(moduleRoute);
    sections.set(moduleRoute.section, sectionItems);

    return sections;
  }, new Map<string, ModuleRoute[]>()),
).map(([label, items]) => ({ label, items }));