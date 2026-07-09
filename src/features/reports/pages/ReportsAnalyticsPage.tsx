import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Shield, 
  Gift, 
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Clock,
  BookOpen,
  PieChart,
  LineChart,
  Settings
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

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2026-01-01',
    end: '2026-06-30',
  });

  const { data, loading, error } = useReportsData({
    timeRange,
    branch: selectedBranch,
    department: selectedDepartment,
    dateRange,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-700" />  {/* Changed to blue-700 */}
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide executive insights across all branches and departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateRange.start} - {dateRange.end}
          </button>
          <ExportButton 
            data={data} 
            fileName="executive-report" 
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 text-sm transition border-b-2 ${
            viewMode === 'overview'
              ? 'border-blue-700 text-blue-700'  // Changed to blue-700
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setViewMode('builder')}
          className={`px-4 py-2 text-sm transition border-b-2 ${
            viewMode === 'builder'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1" />
          Report Builder
        </button>
        <button
          onClick={() => setViewMode('scheduled')}
          className={`px-4 py-2 text-sm transition border-b-2 ${
            viewMode === 'scheduled'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Scheduled Reports
        </button>
      </div>

      {/* Filter Bar */}
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>Error loading report data: {error.message}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {viewMode === 'overview' && (
            <>
              {/* Executive Summary KPIs */}
              <ExecutiveSummary data={data} />

              {/* Main Sections */}
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

          {viewMode === 'builder' && (
            <ReportBuilder data={data} />
          )}

          {viewMode === 'scheduled' && (
            <ScheduledReports />
          )}
        </div>
      )}
    </div>
  );
}

// Executive Summary Component - Dark Blue Theme
function ExecutiveSummary({ data }: { data: any }) {
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
      color: 'blue',
    },
    {
      label: 'Compliance Score',
      value: data?.summary?.complianceScore || '0%',
      change: '+2.1%',
      icon: Shield,
      color: 'blue',
    },
    {
      label: 'Benefits Utilisation',
      value: data?.summary?.benefitsUtilization || '0%',
      change: '+8.3%',
      icon: Gift,
      color: 'blue',
    },
    {
      label: 'Turnover Rate',
      value: data?.summary?.turnoverRate || '0%',
      change: '-0.8%',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Avg Performance Score',
      value: data?.summary?.avgPerformance || '0.0',
      change: '+0.3',
      icon: BarChart3,
      color: 'blue',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const isPositive = metric.change.startsWith('+');
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
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
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