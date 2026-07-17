import { useState } from 'react';
import { useReports } from '../../../hooks';
import { 
  BarChart3, Users, DollarSign, Shield, Gift, TrendingUp,
  Calendar, Clock, BookOpen
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

type TimeRange = 'monthly' | 'quarterly' | 'annual';
type ViewMode = 'overview' | 'builder' | 'scheduled';

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-06-30' });

  const { getWorkforce, getPayroll, getCompliance, getBenefits, getPerformance } = useReports();
  const { data: workforceData, isLoading: wLoading, error: wError } = getWorkforce({ branch: selectedBranch, department: selectedDepartment, dateRange, timeRange });
  const { data: payrollData, isLoading: pLoading, error: pError } = getPayroll({ branch: selectedBranch, department: selectedDepartment, dateRange, timeRange });
  const { data: complianceData, isLoading: cLoading, error: cError } = getCompliance({ branch: selectedBranch, department: selectedDepartment, dateRange, timeRange });
  const { data: benefitsData, isLoading: bLoading, error: bError } = getBenefits({ branch: selectedBranch, department: selectedDepartment, dateRange, timeRange });
  const { data: performanceData, isLoading: perfLoading, error: perfError } = getPerformance({ branch: selectedBranch, department: selectedDepartment, dateRange, timeRange });

  const loading = wLoading || pLoading || cLoading || bLoading || perfLoading;
  const error = wError || pError || cError || bError || perfError;

  const data = {
    summary: {
      totalEmployees: workforceData?.totalEmployees || 0,
      totalPayroll: payrollData?.totalPayroll || 'KES 0',
      complianceScore: complianceData?.overallScore || 0,
      benefitsUtilization: benefitsData?.avgUtilization || 0,
      turnoverRate: workforceData?.turnoverRate || 0,
      avgPerformance: performanceData?.overallAvg || 0,
    },
    workforce: workforceData || {},
    payroll: payrollData || {},
    compliance: complianceData || {},
    benefits: benefitsData || {},
    performance: performanceData || {},
  };

  const scopeLabel = selectedBranch === 'all' ? 'All Branches' : selectedBranch;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><BarChart3 className="w-7 h-7 text-blue-700" /> Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">{scopeLabel} – {selectedBranch === 'all' ? 'Company-wide' : 'Branch'} executive insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition flex items-center gap-2"><Calendar className="w-4 h-4" />{dateRange.start} - {dateRange.end}</button>
          <ExportButton data={data} fileName={`executive-report-${selectedBranch}`} />
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'builder', label: 'Report Builder', icon: BookOpen },
          { id: 'scheduled', label: 'Scheduled Reports', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => setViewMode(tab.id as ViewMode)} className={`px-4 py-2 text-sm transition border-b-2 ${viewMode === tab.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Icon className="w-4 h-4 inline mr-1" />{tab.label}</button>;
        })}
      </div>

      <FilterBar
        timeRange={timeRange} setTimeRange={setTimeRange}
        selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}
        selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}
        dateRange={dateRange} setDateRange={setDateRange}
        loading={loading}
      />

      {loading && <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div></div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600"><p>Error loading report data: {(error as any)?.message}</p></div>}

      {!loading && !error && data && (
        <div className="space-y-6">
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
    { label: 'Total Employees', value: data?.summary?.totalEmployees || 0, change: '+4.2%', icon: Users, color: 'blue' },
    { label: 'Total Payroll', value: data?.summary?.totalPayroll || 'KES 0', change: '+6.8%', icon: DollarSign, color: 'gold' },
    { label: 'Compliance Score', value: data?.summary?.complianceScore || '0%', change: '+2.1%', icon: Shield, color: 'green' },
    { label: 'Benefits Utilisation', value: data?.summary?.benefitsUtilization || '0%', change: '+8.3%', icon: Gift, color: 'purple' },
    { label: 'Turnover Rate', value: data?.summary?.turnoverRate || '0%', change: '-0.8%', icon: TrendingUp, color: 'orange' },
    { label: 'Avg Performance Score', value: data?.summary?.avgPerformance || '0.0', change: '+0.3', icon: BarChart3, color: 'teal' },
  ];
  const iconColors = { blue: 'bg-blue-50 text-blue-600', gold: 'bg-amber-50 text-amber-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600', teal: 'bg-teal-50 text-teal-600' };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map(metric => {
        const isPositive = metric.change.startsWith('+');
        return <div key={metric.label} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div><p className="text-xs text-gray-500">{metric.label}</p><p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p></div>
            <div className={`p-2 rounded-lg ${iconColors[metric.color as keyof typeof iconColors]}`}><metric.icon className="w-4 h-4" /></div>
          </div>
          <p className={`text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{metric.change} {isPositive ? '↑' : '↓'} from previous period</p>
        </div>;
      })}
    </div>
  );
}