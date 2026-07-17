import { useState, useMemo } from 'react';
import { useDashboard } from '../../../../hooks';
import { MetricCard } from '../components/MetricCard';
import { BranchTable } from '../components/BranchTable';
import { ProgressSection } from '../components/ProgressSection';
import { ActivityFeed } from '../components/ActivityFeed';
import { ChatAssistant } from '../components/ChatAssistant';
import { DistributionChart } from '../components/DistributionChart';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { QuickActions } from '../components/QuickActions';
import { QuickStats } from '../components/QuickStats';
import { Users, DollarSign, Clock, ShieldCheck } from 'lucide-react';

const mockUser = { branch: 'Nairobi HQ' };

export default function HrDashboardPage() {
  const [userBranch] = useState(mockUser.branch);
  const { getHRDashboard } = useDashboard();
  const { data: dashboardData, isLoading, error } = getHRDashboard(userBranch);

  const branchData = useMemo(() => {
    if (!dashboardData) return {
      employees: 0, payroll: 'KES 0', approvals: 0, compliance: 0,
      branches: [], progress: [], activity: [],
    };
    return {
      employees: dashboardData.employees || 0,
      payroll: dashboardData.payroll || 'KES 0',
      approvals: dashboardData.approvals || 0,
      compliance: dashboardData.compliance || 0,
      branches: dashboardData.branches || [],
      progress: dashboardData.progress || [],
      activity: dashboardData.activity || [],
    };
  }, [dashboardData]);

  const metricsData = [
    { title: 'Active Employees', value: branchData.employees, change: '+12%', icon: Users, color: 'blue' as const },
    { title: 'Payroll Value', value: branchData.payroll, change: '+5.2%', icon: DollarSign, color: 'green' as const },
    { title: 'Pending Approvals', value: branchData.approvals, change: '-3', icon: Clock, color: 'orange' as const },
    { title: 'Compliance Score', value: branchData.compliance + '%', change: '+0.4%', icon: ShieldCheck, color: 'purple' as const },
  ];

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">Error loading dashboard: {(error as any)?.message}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HR Dashboard – {userBranch}</h1>
          <p className="text-xs text-gray-500">Overview of payroll and employee metrics for your branch</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">Export Report</button>
      </div>

      <QuickStats branch={userBranch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><BranchTable branches={branchData.branches} /></div>
        <div className="lg:col-span-1"><ProgressSection steps={branchData.progress} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistributionChart branch={userBranch} />
        <UpcomingEvents branch={userBranch} />
      </div>

      <ActivityFeed activities={branchData.activity} />
      <QuickActions />
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Access Scope</h3>
        <p className="text-xs text-gray-500">You have full access to HR payroll data, employee records, and compliance reports for <strong>{userBranch}</strong>.</p>
      </div>
      <ChatAssistant />
    </div>
  );
}