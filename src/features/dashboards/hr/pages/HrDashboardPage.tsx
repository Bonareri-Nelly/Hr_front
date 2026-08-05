import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../../../hooks';
import { apiClient } from '@/services/api/client';
import { MetricCard } from '../components/MetricCard';
import { BranchTable } from '../components/BranchTable';
import { ProgressSection } from '../components/ProgressSection';
import { ActivityFeed } from '../components/ActivityFeed';
import { ChatAssistant } from '../components/ChatAssistant';
import { DistributionChart } from '../components/DistributionChart';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { QuickActions } from '../components/QuickActions';
import { QuickStats } from '../components/QuickStats';
import { Users, DollarSign, Clock, ShieldCheck, Download } from 'lucide-react';

export default function HrDashboardPage() {
  const [userBranch] = useState("");
  const { getHRDashboard } = useDashboard();
  const { data: dashboardData, isLoading, error } = getHRDashboard(userBranch);
  const [payrollRuns, setPayrollRuns] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/payroll/history/')
      .then(({ data }) => setPayrollRuns(Array.isArray(data) ? data : data?.results ?? []))
      .catch(() => setPayrollRuns([]));
  }, []);

  const payrollSnapshot = useMemo(() => {
    const current = payrollRuns[0];
    const currentNet = current?.payslips?.reduce(
      (sum: number, payslip: any) => sum + Number(payslip.net_pay || 0), 0,
    ) ?? 0;
    return {
      current,
      currentNet,
      pending: payrollRuns.filter((entry) => entry.run?.status === 'PENDING_APPROVAL').length,
      completed: payrollRuns.filter((entry) => entry.run?.status === 'FINALIZED').length,
    };
  }, [payrollRuns]);

  const currentRunProgress = useMemo(() => {
    const current = payrollSnapshot.current;
    if (!current) return [];

    const payslips = current.payslips ?? [];
    const reviewed = payslips.filter((item: any) =>
      item.approval_status === 'APPROVED' || item.approval_status === 'REJECTED',
    ).length;
    const reviewPercent = payslips.length ? Math.round((reviewed / payslips.length) * 100) : 0;
    const status = current.run?.status;

    return [
      { label: 'Payroll generated', value: 100 },
      { label: 'Submitted for review', value: status === 'DRAFT' ? 0 : 100 },
      { label: 'Payroll items reviewed', value: reviewPercent },
      { label: 'Final approval', value: ['APPROVED', 'FINALIZED'].includes(status) ? 100 : 0 },
      { label: 'Bank release complete', value: status === 'FINALIZED' ? 100 : 0 },
    ];
  }, [payrollSnapshot.current]);

  const branchData = useMemo(() => {
    if (!dashboardData) {
      return {
        employees: 0,
        payroll: 0,
        approvals: 0,
        compliance: null,
        branches: [],
        progress: [],
        activity: [],
        events: [],
      };
    }
    return {
      employees: dashboardData.employees || 0,
      payroll: dashboardData.payroll || 0,
      approvals: dashboardData.approvals || 0,
      compliance: dashboardData.compliance || null,
      branches: dashboardData.branches || [],
      progress: dashboardData.progress || [],
      activity: dashboardData.activity || [],
      events: dashboardData.events || [],
    };
  }, [dashboardData]);

  const metricsData = [
    { title: 'Active Employees', value: branchData.employees, change: '+12%', icon: Users, color: 'blue' as const },
    { title: 'Current Payroll', value: `KES ${payrollSnapshot.currentNet.toLocaleString()}`, change: payrollSnapshot.current ? `Run ${payrollSnapshot.current.run.month}/${payrollSnapshot.current.run.year}` : 'No current run', icon: DollarSign, color: 'green' as const },
    { title: 'Pending Approvals', value: payrollSnapshot.pending, change: payrollSnapshot.pending ? 'Action needed' : 'Up to date', icon: Clock, color: 'orange' as const },
    { title: 'Compliance Score', value: branchData.compliance !== null ? `${branchData.compliance}%` : 'N/A', change: '+0.4%', icon: ShieldCheck, color: 'purple' as const },
  ];

  const handleExport = () => {
    try {
      const rows = [
        ['HR Dashboard Export', ''],
        ['Date', new Date().toLocaleString()],
        ['Branch', userBranch || 'All branches'],
        [''],
        ['Metric', 'Value'],
        ['Total Employees', branchData.employees],
        ['Total Payroll', typeof branchData.payroll === 'number' ? `KES ${branchData.payroll.toLocaleString()}` : branchData.payroll],
        ['Pending Approvals', branchData.approvals],
        ['Compliance Score', branchData.compliance !== null ? `${branchData.compliance}%` : 'N/A'],
        [''],
        ['Branch', 'Employees', 'Payroll', 'Status'],
      ];

      branchData.branches.forEach((b: any) => {
        rows.push([b.name, b.employees, b.amount || 'N/A', b.status || 'N/A']);
      });

      const csvContent = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hr_dashboard_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export report. Please try again.');
      console.error('Export error:', err);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">Error loading dashboard: {(error as any)?.message}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HR Dashboard – {userBranch}</h1>
          <p className="text-xs text-gray-500">Overview of payroll and employee metrics for your branch</p>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <QuickStats branch={userBranch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Payroll workflow</h2>
            <p className="mt-1 text-xs text-gray-500">
              {payrollSnapshot.current
                ? `Latest run: ${payrollSnapshot.current.run.month}/${payrollSnapshot.current.run.year} — ${payrollSnapshot.current.run.status.replaceAll('_', ' ')}.`
                : 'No payroll run has been created yet.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/payroll/creation" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Create payroll</Link>
            <Link to="/payroll/approval" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100">Review approvals ({payrollSnapshot.pending})</Link>
            <Link to="/payroll/history" className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">View history ({payrollSnapshot.completed} completed)</Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><BranchTable branches={branchData.branches} /></div>
        <div className="lg:col-span-1"><ProgressSection steps={currentRunProgress} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistributionChart branches={branchData.branches} />
        <UpcomingEvents events={branchData.events} />
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
