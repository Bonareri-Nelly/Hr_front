import { useState, type FormEvent } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  Shield,
  Gift,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Plus,
} from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { ReportBuilder } from '../components/ReportBuilder';
import { WorkforceAnalytics } from '../components/WorkforceAnalytics';
import { PayrollFinanceAnalytics } from '../components/PayrollFinanceAnalytics';
import { StatutoryCompliance } from '../components/StatutoryCompliance';
import { BenefitsUtilization } from '../components/BenefitsUtilization';
import { PerformanceRollup } from '../components/PerformanceRollup';
import { ScheduledReports } from '../components/ScheduledReports';
import { ExportButton } from '../components/ExportButton';
import { useReportsData } from '../../../hooks/useReportsData';

type TimeRange = 'monthly' | 'quarterly' | 'annual';
type ViewMode = 'overview' | 'builder' | 'scheduled';
type ReportCategory = 'headcount' | 'payroll' | 'compliance' | 'benefits' | 'performance';

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2026-01-01',
    end: '2026-06-30',
  });
  const [entryForm, setEntryForm] = useState({
    title: '',
    category: 'headcount' as ReportCategory,
    value: '',
    period: '',
    notes: '',
  });

  const { data, loading, error, addEntry } = useReportsData({
    timeRange,
    branch: selectedBranch,
    department: selectedDepartment,
    dateRange,
  });

  const scopeLabel = selectedBranch === 'all' ? 'All Branches' : selectedBranch;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!entryForm.title || !entryForm.period || !entryForm.value) {
      return;
    }

    addEntry({
      id: `entry-${Date.now()}`,
      title: entryForm.title,
      category: entryForm.category,
      value: Number(entryForm.value),
      period: entryForm.period,
      notes: entryForm.notes,
    });

    setEntryForm({
      title: '',
      category: 'headcount',
      value: '',
      period: '',
      notes: '',
    });
  };

  return (
    <div className="dashboard-page reports-analytics-page">
      <div className="dashboard-heading reports-analytics-heading">
        <div>
          <p className="page-kicker">Strategic reporting</p>
          <h1 className="page-title flex items-center gap-3">
            <BarChart3 className="w-6 h-6 reports-analytics-accent" />
            Reports & Analytics
          </h1>
          <p className="page-subtitle">
            {scopeLabel} – {selectedBranch === 'all' ? 'Company-wide' : 'Branch'} executive insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="button button-secondary">
            <Calendar className="w-4 h-4" />
            {dateRange.start} - {dateRange.end}
          </button>
          <ExportButton data={data} fileName={`executive-report-${selectedBranch}`} />
        </div>
      </div>

      <div className="reports-analytics-tabs">
        <button
          onClick={() => setViewMode('overview')}
          className={`reports-analytics-tab ${viewMode === 'overview' ? 'reports-analytics-tab-active' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setViewMode('builder')}
          className={`reports-analytics-tab ${viewMode === 'builder' ? 'reports-analytics-tab-active' : ''}`}
        >
          <BookOpen className="w-4 h-4 inline mr-1" />
          Report Builder
        </button>
        <button
          onClick={() => setViewMode('scheduled')}
          className={`reports-analytics-tab ${viewMode === 'scheduled' ? 'reports-analytics-tab-active' : ''}`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Scheduled Reports
        </button>
      </div>

      <FilterBar
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        dateRange={dateRange}
        setDateRange={setDateRange}
        loading={loading}
      />

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--bronze)]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>Error loading report data: {error.message}</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-[var(--bronze)]" />
              <h3 className="text-lg font-semibold">Add your own report data</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <input
                className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                placeholder="Title"
                value={entryForm.title}
                onChange={(event) => setEntryForm((current) => ({ ...current, title: event.target.value }))}
              />
              <select
                className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                value={entryForm.category}
                onChange={(event) => setEntryForm((current) => ({ ...current, category: event.target.value as ReportCategory }))}
              >
                <option value="headcount">Headcount</option>
                <option value="payroll">Payroll</option>
                <option value="compliance">Compliance</option>
                <option value="benefits">Benefits</option>
                <option value="performance">Performance</option>
              </select>
              <input
                className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                type="number"
                placeholder="Value"
                value={entryForm.value}
                onChange={(event) => setEntryForm((current) => ({ ...current, value: event.target.value }))}
              />
              <input
                className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                placeholder="Period"
                value={entryForm.period}
                onChange={(event) => setEntryForm((current) => ({ ...current, period: event.target.value }))}
              />
              <input
                className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                placeholder="Notes"
                value={entryForm.notes}
                onChange={(event) => setEntryForm((current) => ({ ...current, notes: event.target.value }))}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[var(--text-secondary)]">Entries are stored locally in your browser and will appear in the analytics cards immediately.</p>
              <button type="submit" className="rounded-lg bg-[var(--navy-deepest)] px-4 py-2 text-sm font-semibold text-white">
                Save entry
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Saved entries</h3>
              <span className="text-sm text-[var(--text-secondary)]">{data.customEntries?.length || 0} saved</span>
            </div>
            {data.customEntries?.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {data.customEntries.map((entry: any) => (
                  <div key={entry.id} className="rounded-lg border border-[var(--border)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{entry.title}</p>
                      <span className="rounded-full bg-[var(--gold-light)] px-2 py-1 text-xs text-[var(--bronze)]">{entry.category}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{entry.period}</p>
                    <p className="text-lg font-semibold">{entry.value}</p>
                    {entry.notes ? <p className="text-sm text-[var(--text-secondary)]">{entry.notes}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">No entries yet. Add one above to start populating your analytics.</p>
            )}
          </div>

          {viewMode === 'overview' && (
            <>
              <ExecutiveSummary data={data} scope={scopeLabel} />

              <div className="grid grid-cols-1 gap-6">
                <WorkforceAnalytics data={data.workforce} />
                <PayrollFinanceAnalytics data={data.payroll} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StatutoryCompliance data={data.compliance} />
                  <BenefitsUtilization data={data.benefits} />
                </div>
                <PerformanceRollup data={data.performance} />
              </div>
            </>
          )}

          {viewMode === 'builder' && <ReportBuilder data={data} />}
          {viewMode === 'scheduled' && <ScheduledReports />}
        </div>
      )}
    </div>
  );
}

function ExecutiveSummary({ data, scope }: any) {
  const metrics = [
    {
      label: 'Total Employees',
      value: data?.summary?.totalEmployees || 0,
      change: '+4.2%',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Total Payroll',
      value: data?.summary?.totalPayroll || 'KES 0',
      change: '+6.8%',
      icon: DollarSign,
      color: 'gold',
    },
    {
      label: 'Compliance Score',
      value: data?.summary?.complianceScore || '0%',
      change: '+2.1%',
      icon: Shield,
      color: 'green',
    },
    {
      label: 'Benefits Utilisation',
      value: data?.summary?.benefitsUtilization || '0%',
      change: '+8.3%',
      icon: Gift,
      color: 'purple',
    },
    {
      label: 'Turnover Rate',
      value: data?.summary?.turnoverRate || '0%',
      change: '-0.8%',
      icon: TrendingUp,
      color: 'orange',
    },
    {
      label: 'Avg Performance Score',
      value: data?.summary?.avgPerformance || '0.0',
      change: '+0.3',
      icon: BarChart3,
      color: 'teal',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const isPositive = metric.change.startsWith('+');
        const iconColors = {
          blue: 'bg-blue-50 text-blue-600',
          gold: 'bg-amber-50 text-amber-600',
          green: 'bg-green-50 text-green-600',
          purple: 'bg-purple-50 text-purple-600',
          orange: 'bg-orange-50 text-orange-600',
          teal: 'bg-teal-50 text-teal-600',
        };

        return (
          <div
            key={metric.label}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${iconColors[metric.color as keyof typeof iconColors]}`}>
                <metric.icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} {isPositive ? '↑' : '↓'} from previous period
            </p>
          </div>
        );
      })}
    </div>
  );
}
