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
  {
    title: "Reports & Analytics",
    path: "/reports-analytics",
    section: "Executive",
    icon: BarChart3,
    Component: ReportsAnalytics,
  },
  {
    title: "AI Assistant",
    path: "/ai-assistant",
    section: "Executive",
    icon: Sparkles,
    Component: AiAssistant,
  },
  {
    title: "Security & Audit",
    path: "/security-audit",
    section: "Executive",
    icon: ShieldCheck,
    Component: SecurityAudit,
  },
  {
    title: "User Profile",
    path: "/user-profile",
    section: "Executive",
    icon: UserRound,
    Component: UserProfile,
  },
  {
    title: "HR Dashboard",
    path: "/hr-dashboard",
    section: "HR Operations",
    icon: Users,
    Component: HrDashboard,
  },
  {
    title: "Department Dashboard",
    path: "/department-dashboard",
    section: "HR Operations",
    icon: Building2,
    Component: DepartmentDashboard,
  },
  {
    title: "Employee Lifecycle",
    path: "/employee-lifecycle",
    section: "HR Operations",
    icon: UserCheck,
    Component: EmployeeLifecycle,
  },
  {
    title: "Contract Management",
    path: "/contract-management",
    section: "HR Operations",
    icon: FileCheck2,
    Component: ContractManagement,
  },
  {
    title: "Performance Oversight",
    path: "/performance-oversight",
    section: "HR Operations",
    icon: TrendingUp,
    Component: PerformanceOversight,
  },
  {
    title: "Offboarding",
    path: "/offboarding",
    section: "HR Operations",
    icon: UserCog,
    Component: Offboarding,
  },
  {
    title: "Onboarding",
    path: "/onboarding",
    section: "HR Operations",
    icon: Handshake,
    Component: Onboarding,
  },
  {
    title: "Attendance Management",
    path: "/attendance-management",
    section: "HR Operations",
    icon: CalendarClock,
    Component: AttendanceManagement,
  },
  {
    title: "Leave Workflow",
    path: "/leave-workflow",
    section: "HR Operations",
    icon: CalendarCheck,
    Component: LeaveWorkflow,
  },
  {
    title: "Leave Approvals",
    path: "/leave-approvals",
    section: "HR Operations",
    icon: ClipboardCheck,
    Component: LeaveApprovals,
  },
  {
    title: "Disciplinary Cases",
    path: "/disciplinary-cases",
    section: "HR Operations",
    icon: Scale,
    Component: DisciplinaryCases,
  },
  {
    title: "Disciplinary Management",
    path: "/disciplinary-management",
    section: "HR Operations",
    icon: ClipboardList,
    Component: DisciplinaryManagement,
  },
  {
    title: "Announcements & Training",
    path: "/announcements-training",
    section: "HR Operations",
    icon: GraduationCap,
    Component: AnnouncementsTraining,
  },
  {
    title: "Benefits Management",
    path: "/benefits-management",
    section: "HR Operations",
    icon: HandCoins,
    Component: BenefitsManagement,
  },
  {
    title: "Branch Dashboard",
    path: "/branch-dashboard",
    section: "Branch",
    icon: Building2,
    Component: BranchDashboard,
  },
  {
    title: "Payroll",
    path: "/payroll",
    section: "Payroll",
    icon: WalletCards,
    Component: Payroll,
  },
  {
    title: "Payroll Creation",
    path: "/payroll-creation",
    section: "Payroll",
    icon: BadgeDollarSign,
    Component: PayrollCreation,
  },
  {
    title: "Payroll Approval",
    path: "/payroll-approval",
    section: "Payroll",
    icon: ClipboardCheck,
    Component: PayrollApproval,
  },
  {
    title: "Payroll History",
    path: "/payroll-history",
    section: "Payroll",
    icon: ReceiptText,
    Component: PayrollHistory,
  },
  {
    title: "Tax & Compliance",
    path: "/tax-compliance",
    section: "Payroll",
    icon: FileText,
    Component: TaxCompliance,
  },
  {
    title: "Bank Integration",
    path: "/bank-integration",
    section: "Payroll",
    icon: Landmark,
    Component: BankIntegration,
  },
  {
    title: "Compensation Data",
    path: "/compensation-data",
    section: "Payroll",
    icon: CreditCard,
    Component: CompensationData,
  },
  {
    title: "Multi-Currency & GL Integration",
    path: "/multi-currency-gl-integration",
    section: "Payroll",
    icon: ChartNoAxesCombined,
    Component: MultiCurrencyGlIntegration,
  },
  {
    title: "Finance Dashboard",
    path: "/finance-dashboard",
    section: "Finance",
    icon: Banknote,
    Component: FinanceDashboard,
  },
  {
    title: "Bank Integration (Accounts)",
    path: "/bank-integration-accounts",
    section: "Finance",
    icon: Landmark,
    Component: BankIntegrationAccounts,
  },
  {
    title: "Tax & Compliance (Accounts)",
    path: "/tax-compliance-accounts",
    section: "Finance",
    icon: FileText,
    Component: TaxComplianceAccounts,
  },
  {
    title: "Benefits Management (Accounts)",
    path: "/benefits-management-accounts",
    section: "Finance",
    icon: HandCoins,
    Component: BenefitsManagementAccounts,
  },
  {
    title: "Employee Finance",
    path: "/employee-finance",
    section: "Finance",
    icon: BriefcaseBusiness,
    Component: EmployeeFinance,
  },
  {
    title: "Employee Dashboard",
    path: "/employee-dashboard",
    section: "Employee",
    icon: LayoutDashboard,
    Component: EmployeeDashboard,
  },
  {
    title: "My Attendance",
    path: "/my-attendance",
    section: "Employee",
    icon: CalendarClock,
    Component: MyAttendance,
  },
  {
    title: "My Performance",
    path: "/my-performance",
    section: "Employee",
    icon: TrendingUp,
    Component: MyPerformance,
  },
  {
    title: "My Benefits",
    path: "/my-benefits",
    section: "Employee",
    icon: HandCoins,
    Component: MyBenefits,
  },
  {
    title: "My Documents",
    path: "/my-documents",
    section: "Employee",
    icon: FolderOpen,
    Component: MyDocuments,
  },
  {
    title: "My Announcements",
    path: "/my-announcements",
    section: "Employee",
    icon: Bell,
    Component: MyAnnouncements,
  },
  {
    title: "Complaints",
    path: "/complaints",
    section: "Employee",
    icon: MessageCircleQuestion,
    Component: Complaints,
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
