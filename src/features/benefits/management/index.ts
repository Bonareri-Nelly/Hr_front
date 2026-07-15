// src/features/benefits/management/index.ts
export { Dashboard } from './pages/Dashboard';
export { BenefitsOverviewWrapper } from './components/BenefitsOverviewWrapper';
export { DashboardStatCard } from './components/dashboard/DashboardStatCard';
export { ExportButton } from './components/ExportButton';
export { useBenefitsData } from './hooks/UseBenefitsData';
export * from './types';

// Default export for lazy loading
import { Dashboard } from './pages/Dashboard';
export default Dashboard;
