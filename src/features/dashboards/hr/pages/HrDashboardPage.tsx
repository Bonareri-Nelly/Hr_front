import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../services/api/api';
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

const list = <T,>(value: T[] | { results?: T[] }) => Array.isArray(value) ? value : value.results ?? [];
const user = () => { try { return JSON.parse(localStorage.getItem('current_user') ?? localStorage.getItem('user') ?? '{}'); } catch { return {}; } };

export default function HrDashboardPage() {
  const currentUser = user(); const userBranch = currentUser.branch_name || 'All branches';
  const employees = useQuery({ queryKey: ['hr-dashboard-employees'], queryFn: async () => list((await api.get('/employees/')).data) });
  const departments = useQuery({ queryKey: ['hr-dashboard-departments'], queryFn: async () => list((await api.get('/departments/')).data) });
  const runs = useQuery({ queryKey: ['hr-dashboard-payroll'], queryFn: async () => list((await api.get('/payroll/runs/')).data) });
  const leaves = useQuery({ queryKey: ['hr-dashboard-leave'], queryFn: async () => list((await api.get('/leave/requests/')).data) });
  const branchData = useMemo(() => {
    const people = employees.data ?? []; const payroll = runs.data ?? []; const pending = (leaves.data ?? []).filter((item: any) => String(item.status).toLowerCase().includes('pending')).length;
    const latest = payroll[0] as any; const total = Number(latest?.total_gross ?? 0); const published = latest?.status === 'Finalized' ? 100 : 0;
    return { employees: people.length, payroll: total, approvals: pending, branches: [{ name: userBranch, employees: people.length, amount: `KES ${total.toLocaleString()}`, status: latest?.status ?? 'No payroll run' }], progress: [{ label: 'Payroll run status', value: published }, { label: 'Leave requests reviewed', value: pending ? 0 : 100 }, { label: 'Payslips published', value: published }], activity: latest ? [{ time: new Date(latest.updated_at ?? latest.created_at).toLocaleDateString(), text: `${latest.name} is ${latest.status}` }] : [] };
  }, [employees.data, leaves.data, runs.data, userBranch]);

  const metricsData = [
    { title: 'Active Employees', value: branchData.employees, change: 'Live', icon: Users, color: 'blue' as const },
    { title: 'Payroll Value', value: `KES ${branchData.payroll.toLocaleString()}`, change: 'Latest run', icon: DollarSign, color: 'green' as const },
    { title: 'Pending Approvals', value: branchData.approvals, change: 'Live', icon: Clock, color: 'orange' as const },
    { title: 'Payroll Status', value: branchData.branches[0].status, change: 'Latest run', icon: ShieldCheck, color: 'purple' as const },
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

      <QuickStats stats={[{ label: 'Departments', value: departments.data?.length ?? 0 }, { label: 'Payroll runs', value: runs.data?.length ?? 0 }, { label: 'Leave requests', value: leaves.data?.length ?? 0 }, { label: 'Branches', value: new Set((employees.data ?? []).map((item: any) => item.branch)).size }]} />

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
