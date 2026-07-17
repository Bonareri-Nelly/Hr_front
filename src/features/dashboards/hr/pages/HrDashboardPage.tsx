import { useState, useMemo } from 'react';
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

const allBranchData = {
  'Nairobi HQ': {
    employees: 420,
    payroll: 'KES 28.4M',
    approvals: 5,
    compliance: 98.2,
    branches: [
      { name: 'Nairobi HQ', employees: 420, amount: 'KES 28.4M', status: 'Ready' },
    ],
    progress: [
      { label: 'Gross payroll validation', value: 86 },
      { label: 'Statutory deductions', value: 72 },
      { label: 'Payslip publishing', value: 41 },
    ],
    activity: [
      { time: '10:30 AM', text: 'Payroll for Nairobi HQ approved by Finance' },
      { time: '09:15 AM', text: 'John Doe submitted timesheet adjustments' },
      { time: 'Yesterday', text: 'New employee onboarding completed (5 staff)' },
    ],
  },
  'Mombasa': {
    employees: 310,
    payroll: 'KES 21.2M',
    approvals: 3,
    compliance: 95.5,
    branches: [
      { name: 'Mombasa', employees: 310, amount: 'KES 21.2M', status: 'Pending' },
    ],
    progress: [
      { label: 'Gross payroll validation', value: 78 },
      { label: 'Statutory deductions', value: 65 },
      { label: 'Payslip publishing', value: 30 },
    ],
    activity: [
      { time: '11:00 AM', text: 'Mombasa payroll submitted for approval' },
      { time: 'Yesterday', text: 'New hire onboarded in Mombasa' },
    ],
  },
};

type BranchName = keyof typeof allBranchData;

const mockUser: { branch: BranchName } = {
  branch: 'Nairobi HQ',
};

export default function HrDashboardPage() {
  const [userBranch] = useState<BranchName>(mockUser.branch);

  const branchData = useMemo(() => {
    return allBranchData[userBranch] || allBranchData['Nairobi HQ'];
  }, [userBranch]);

  const metricsData = [
    { title: 'Active Employees', value: branchData.employees, change: '+12%', icon: Users, color: 'blue' as const },
    { title: 'Payroll Value', value: branchData.payroll, change: '+5.2%', icon: DollarSign, color: 'green' as const },
    { title: 'Pending Approvals', value: branchData.approvals, change: '-3', icon: Clock, color: 'orange' as const },
    { title: 'Compliance Score', value: branchData.compliance + '%', change: '+0.4%', icon: ShieldCheck, color: 'purple' as const },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HR Dashboard – {userBranch}</h1>
          <p className="text-xs text-gray-500">Overview of payroll and employee metrics for your branch</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
          Export Report
        </button>
      </div>

      <QuickStats branch={userBranch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BranchTable branches={branchData.branches} />
        </div>
        <div className="lg:col-span-1">
          <ProgressSection steps={branchData.progress} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistributionChart branch={userBranch} />
        <UpcomingEvents branch={userBranch} />
      </div>

      <ActivityFeed activities={branchData.activity} />

      <QuickActions />

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Access Scope</h3>
        <p className="text-xs text-gray-500">
          You have full access to HR payroll data, employee records, and compliance reports for <strong>{userBranch}</strong>.
        </p>
      </div>

      <ChatAssistant />
    </div>
  );
}