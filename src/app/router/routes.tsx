import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { navigationItems } from "../../constants/navigation";
import ModulePlaceholderPage from "../../components/shared/ModulePlaceholderPage";
import type { NavigationItem } from "../../types/navigation";

export type AppRoute = NavigationItem & {
  Component: LazyExoticComponent<ComponentType>;
};

// Fix the lazy loading for each module
const routeComponents: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  "executive-dashboard": lazy(() => import("../../features/dashboards/executive")),
  "reports-analytics": lazy(() => import("../../features/reports")),
  "branch-reports": lazy(() => import("../../features/reports-branch")),
  "ai-assistant": lazy(() => import("../../features/ai-assistant")),
  "security-audit": lazy(() => import("../../features/security-audit")),
  "user-profile": lazy(() => import("../../features/user-profile")),
  "hr-dashboard": lazy(() => import("../../features/dashboards/hr")),
  "department-dashboard": lazy(() => import("../../features/dashboards/department")),
  "employee-lifecycle": lazy(() => import("../../features/employees/lifecycle")),
  "contract-management": lazy(() => import("../../features/contracts")),
  "performance-oversight": lazy(() => import("../../features/performance")),
  "offboarding": lazy(() => import("../../features/employees/offboarding")),
  "onboarding": lazy(() => import("../../features/employees/onboarding")),
  "attendance-management": lazy(() => import("../../features/attendance/management")),
  "leave-workflow": lazy(() => import("../../features/leave-workflow")),
  "leave-approvals": lazy(() => import("../../features/leave-approvals")),
  "disciplinary-cases": lazy(() => import("../../features/disciplinary-cases")),
  "disciplinary-management": lazy(() => import("../../features/disciplinary-management")),

  
  // FIX: Use the correct import path and ensure default export
  "announcements-training": lazy(() => 
    import("../../features/training/announcements/pages/AnnouncementsTrainingPage")
      .then((module) => ({
        default: module.default || module.AnnouncementsTrainingPage
      }))
  ),
  
  "benefits-management": lazy(() => 
    import("../../features/benefits/management").then((module) => ({
      default: module.default || module.Dashboard
    }))
  ),
  
  "branch-dashboard": lazy(() => import("../../features/dashboards/branch")),
  "payroll": lazy(() => import("../../features/payroll/overview")),
  "payroll-creation": lazy(() => import("../../features/payroll/creation")),
  "payroll-approval": lazy(() => import("../../features/payroll/approval")),
  "payroll-history": lazy(() => import("../../features/payroll/history")),
  "tax-compliance": lazy(() => import("../../features/payroll/tax-compliance")),
  "bank-integration": lazy(() => import("../../features/payroll/bank-integration")),
  "compensation-data": lazy(() => import("../../features/payroll/compensation-data")),
  "multi-currency-gl-integration": lazy(() => import("../../features/payroll/multi-currency-gl")),
  "finance-dashboard": lazy(() => import("../../features/dashboards/finance")),
  "bank-integration-accounts": lazy(() => import("../../features/finance/bank-integration")),
  "tax-compliance-accounts": lazy(() => import("../../features/finance/tax-compliance")),
  "benefits-management-accounts": lazy(() => import("../../features/finance/benefits-management")),
  "employee-finance": lazy(() => import("../../features/finance/employee-finance")),
  "finance-grievances": lazy(() => import("../../features/finance/finance-grievances")),
  "employee-dashboard": lazy(() => import("../../features/dashboards/employee")),
  "my-attendance": lazy(() => import("../../features/employee-self-service/attendance")),
  "my-performance": lazy(() => import("../../features/employee-self-service/performance")),
  "my-benefits": lazy(() => import("../../features/employee-self-service/benefits")),
  "my-documents": lazy(() => import("../../features/employee-self-service/documents")),

  "my-payslips": lazy(() =>
    Promise.resolve({
      default: () => <ModulePlaceholderPage title="Payslips" />,
    })
  ),

  
  // FIX: Employee self-service announcements
  "my-announcements": lazy(() => 
    import("../../features/employee-self-service/announcements/pages/MyAnnouncementsPage")
      .then((module) => ({
        default: module.default
      }))
  ),
  
  "complaints": lazy(() => import("../../features/complaints")),
};

const createFallbackRoute = (item: NavigationItem): LazyExoticComponent<ComponentType> =>
  lazy(async () => ({
    default: () => <ModulePlaceholderPage title={item.label} />,
  }));

export const appRoutes: AppRoute[] = navigationItems.map((item) => ({
  ...item,
  Component: routeComponents[item.id] ?? createFallbackRoute(item),
}));



