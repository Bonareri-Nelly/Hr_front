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

const metricsData = [
  { title: 'Active Employees', value: '1,248', change: '+12%', icon: Users, color: 'blue' as const },
  { title: 'Payroll Value', value: 'KES 84.6M', change: '+5.2%', icon: DollarSign, color: 'green' as const },
  { title: 'Pending Approvals', value: '17', change: '-3', icon: Clock, color: 'orange' as const },
  { title: 'Compliance Score', value: '98.2%', change: '+0.4%', icon: ShieldCheck, color: 'purple' as const },
];

export default function HrDashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-xs text-gray-500">Overview of payroll, employees, and HR metrics</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
          Export Report
        </button>
      </div>

      {/* 1. Quick Stats Row */}
      <QuickStats />

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* 3. Main Grid: Table + Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BranchTable />
        </div>
        <div className="lg:col-span-1">
          <ProgressSection />
        </div>
      </div>

      {/* 4. Bottom Grid: Chart + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistributionChart />
        <UpcomingEvents />
      </div>

      {/* 5. Activity Feed */}
      <ActivityFeed />

      {/* 6. Quick Actions - Now at the Bottom */}
      <QuickActions />

      {/* 7. Access Scope */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Access Scope</h3>
        <p className="text-xs text-gray-500">
          You have full access to HR payroll data, employee records, and compliance reports.
        </p>
      </div>

      <ChatAssistant />
    </div>
  );
}