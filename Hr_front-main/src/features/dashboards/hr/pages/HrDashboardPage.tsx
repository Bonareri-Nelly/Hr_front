import { MetricCard } from '../components/MetricCard';
import { BranchTable } from '../components/BranchTable';
import { ProgressSection } from '../components/ProgressSection';
import { ActivityFeed } from '../components/ActivityFeed';
import { ChatAssistant } from '../components/ChatAssistant';
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
      {/* Page Header - Smaller Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900">HR Dashboard</h1>
          
          <p className="text-sm text-gray-500">Overview of payroll and employee metrics</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Export Report
        </button>
      </div>

      {/* Metrics Grid - Smaller Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Main Grid: Table + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <BranchTable />
        </div>
        <div className="lg:col-span-1">
          <ProgressSection />
        </div>
      </div>

      {/* Activity Feed + Access Scope */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Access Scope</h3>
          <p className="text-sm text-gray-500">
            You have full access to HR payroll data, employee records, and compliance reports.
          </p>
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
}