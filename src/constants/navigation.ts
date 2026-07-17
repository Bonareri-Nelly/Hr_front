import type { NavigationItem, NavigationSection } from "../types/navigation";

export const navigationItems: NavigationItem[] = [
  // Executive Section
  { id: "executive-dashboard", label: "Executive Dashboard", path: "/dashboard/executive", section: "Executive", icon: "LayoutDashboard" },
  { id: "reports-analytics", label: "Reports & Analytics", path: "/reports-analytics", section: "Executive", icon: "BarChart3" },
  { id: "ai-assistant", label: "AI Assistant", path: "/ai-assistant", section: "Executive", icon: "Sparkles" },
  { id: "user-profile", label: "User Profile", path: "/user-profile", section: "Account", icon: "UserRound" },
  { id: "security-audit", label: "Security & Audit", path: "/security-audit", section: "Administration", icon: "ShieldCheck" },
  { id: "system-settings", label: "System Settings", path: "/system/settings", section: "Administration", icon: "Settings" },

  // HR Operations Section
  { id: "hr-dashboard", label: "HR Dashboard", path: "/dashboard/hr", section: "HR Operations", icon: "Users" },
  { id: "department-dashboard", label: "Department Dashboard", path: "/dashboard/department", section: "HR Operations", icon: "Building2" },
  { id: "employee-lifecycle", label: "Employee Lifecycle", path: "/employees/lifecycle", section: "HR Operations", icon: "UserCheck" },
  { id: "contract-management", label: "Contract Management", path: "/contracts", section: "HR Operations", icon: "FileCheck2" },
  { id: "performance-oversight", label: "Performance Oversight", path: "/performance", section: "HR Operations", icon: "TrendingUp" },
  { id: "offboarding", label: "Offboarding", path: "/employees/offboarding", section: "HR Operations", icon: "UserCog" },
  { id: "onboarding", label: "Onboarding", path: "/employees/onboarding", section: "HR Operations", icon: "Handshake" },
  { id: "attendance-management", label: "Attendance Management", path: "/attendance", section: "HR Operations", icon: "CalendarClock" },
  { id: "leave-workflow", label: "Leave Workflow", path: "/leave/workflow", section: "HR Operations", icon: "CalendarCheck" },
  { id: "leave-approvals", label: "Leave Approvals", path: "/leave/approvals", section: "HR Operations", icon: "ClipboardCheck" },
  { id: "disciplinary-cases", label: "Disciplinary Cases", path: "/disciplinary/cases", section: "HR Operations", icon: "Scale" },
  { id: "disciplinary-management", label: "Disciplinary Management", path: "/disciplinary/management", section: "HR Operations", icon: "ClipboardList" },
  { id: "announcements-training", label: "Announcements & Training", path: "/training/announcements", section: "HR Operations", icon: "GraduationCap" },
  { id: "benefits-management", label: "Benefits Management", path: "/benefits", section: "HR Operations", icon: "HandCoins" },

  // Branch Section
  { id: "branch-dashboard", label: "Branch Dashboard", path: "/dashboard/branch", section: "Branch", icon: "Building2" },
  { id: "branch-reports", label: "Branch Reports", path: "/branch-reports", section: "Branch", icon: "BarChart3" },

  // Payroll Section
  { id: "payroll", label: "Payroll", path: "/payroll", section: "Payroll", icon: "WalletCards" },
  { id: "payroll-creation", label: "Payroll Creation", path: "/payroll/creation", section: "Payroll", icon: "BadgeDollarSign" },
  { id: "payroll-approval", label: "Payroll Approval", path: "/payroll/approval", section: "Payroll", icon: "ClipboardCheck" },
  { id: "payroll-history", label: "Payroll History", path: "/payroll/history", section: "Payroll", icon: "ReceiptText" },
  { id: "tax-compliance", label: "Tax & Compliance", path: "/payroll/tax-compliance", section: "Payroll", icon: "FileText" },
  { id: "bank-integration", label: "Bank Integration", path: "/payroll/bank-integration", section: "Payroll", icon: "Landmark" },
  { id: "compensation-data", label: "Compensation Data", path: "/payroll/compensation", section: "Payroll", icon: "CreditCard" },
  { id: "multi-currency-gl-integration", label: "Multi-Currency & GL Integration", path: "/payroll/multi-currency-gl", section: "Payroll", icon: "ChartNoAxesCombined" },

  // Finance Section
  { id: "finance-dashboard", label: "Finance Dashboard", path: "/dashboard/finance", section: "Finance", icon: "Banknote" },
  { id: "bank-integration-accounts", label: "Bank Integration (Accounts)", path: "/finance/bank-integration", section: "Finance", icon: "Landmark" },
  { id: "tax-compliance-accounts", label: "Tax & Compliance (Accounts)", path: "/finance/tax-compliance", section: "Finance", icon: "FileText" },
  { id: "benefits-management-accounts", label: "Benefits Management (Accounts)", path: "/finance/benefits", section: "Finance", icon: "HandCoins" },
  { id: "employee-finance", label: "Employee Finance", path: "/finance/employee", section: "Finance", icon: "BriefcaseBusiness" },
  { id: "finance-grievances", label: "Finance Grievances", path: "/finance/finance-grievances", section: "Finance", icon: "MessageCircleQuestion" },

  // Employee Section
  { id: "employee-dashboard", label: "Employee Dashboard", path: "/dashboard/employee", section: "Employee", icon: "LayoutDashboard" },
  { id: "my-attendance", label: "My Attendance", path: "/self-service/attendance", section: "Employee", icon: "CalendarClock" },
  { id: "my-performance", label: "My Performance", path: "/self-service/performance", section: "Employee", icon: "TrendingUp" },
  { id: "my-benefits", label: "My Benefits", path: "/self-service/benefits", section: "Employee", icon: "HandCoins" },
  { id: "my-payslips", label: "My Payslips", path: "/self-service/payslips", section: "Employee", icon: "ReceiptText" },
  { id: "my-documents", label: "My Documents", path: "/self-service/documents", section: "Employee", icon: "FolderOpen" },
  { id: "my-announcements", label: "My Announcements", path: "/self-service/announcements", section: "Employee", icon: "Bell" },
  { id: "complaints", label: "Complaints", path: "/complaints", section: "Employee", icon: "MessageCircleQuestion" },
];

export const navigationSections: NavigationSection[] = Array.from(
  navigationItems.reduce((sections, item) => {
    const sectionItems = sections.get(item.section) ?? [];
    sectionItems.push(item);
    sections.set(item.section, sectionItems);

    return sections;
  }, new Map<string, NavigationItem[]>()),
).map(([label, items]) => ({ label, items }));
