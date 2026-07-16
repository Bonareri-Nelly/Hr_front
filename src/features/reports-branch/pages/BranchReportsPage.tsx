import { useState } from 'react';
import { 
  BarChart3, 
  Building2,
  Calendar,
  Download,
  Clock,
  TrendingUp
} from 'lucide-react';
import { BranchSnapshot } from '../components/BranchSnapshot';
import { WorkforceOverview } from '../components/WorkforceOverview';
import { PayrollOverview } from '../components/PayrollOverview';
import { ComplianceSnapshot } from '../components/ComplianceSnapshot';
import { BenefitsSnapshot } from '../components/BenefitsSnapshot';
import { PerformanceSnapshot } from '../components/PerformanceSnapshot';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ExportButton } from '../components/ExportButton';

import { useBranchReportsData } from "../../../hooks/useBranchReportsData";

export default function BranchReportsPage() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2026-01-01',
    end: '2026-06-30',
  });
 
  const { data, loading, error } = useBranchReportsData({
    dateRange,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-700" />
            Branch Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Branch overview — {data?.branchName || 'Nairobi HQ'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton 
            data={data} 
            fileName={`branch-report-${data?.branchName || 'branch'}`} 
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter
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
          <p>Error loading branch data: {error.message}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <div className="space-y-6">
          {/* Branch Snapshot - Top KPI Row */}
          <BranchSnapshot data={data.snapshot} />

          {/* Workforce Overview */}
          <WorkforceOverview data={data.workforce} />

          {/* Payroll Overview */}
          <PayrollOverview data={data.payroll} />

          {/* Compliance + Benefits + Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ComplianceSnapshot data={data.compliance} />
            <BenefitsSnapshot data={data.benefits} />
            <PerformanceSnapshot data={data.performance} />
          </div>
        </div>
      )}
    </div>
  );
}