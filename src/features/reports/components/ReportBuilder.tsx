import { useState } from 'react';
import { BookOpen, Download, Filter, BarChart3, PieChart, Table, X, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ReportBuilderProps {
  data: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

export const ReportBuilder = ({ data }: ReportBuilderProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState<'table' | 'bar' | 'line' | 'pie'>('bar');
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const availableMetrics = [
    { key: 'headcount', label: 'Headcount' },
    { key: 'turnover', label: 'Turnover Rate' },
    { key: 'newHires', label: 'New Hires' },
    { key: 'exits', label: 'Exits' },
    { key: 'totalPayroll', label: 'Total Payroll' },
    { key: 'avgSalary', label: 'Avg Salary' },
    { key: 'budgetVariance', label: 'Budget Variance' },
    { key: 'complianceScore', label: 'Compliance Score' },
    { key: 'benefitsUtilization', label: 'Benefits Utilization' },
    { key: 'performanceScore', label: 'Performance Score' },
  ];

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricKey)
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const generateReport = () => {
    if (selectedMetrics.length === 0) {
      alert('Please select at least one metric.');
      return;
    }

    setGeneratedReport(generateReportData(selectedMetrics));
  };

  const generateReportData = (metrics: string[]) => {
    const headcount = data?.workforce?.headcount ?? [];
    const payroll = data?.payroll?.total ?? [];
    const performance = data?.performance?.trend ?? [];
    const labels = Array.from(new Set([
      ...headcount.map((item: any) => item.month),
      ...payroll.map((item: any) => item.month),
      ...performance.map((item: any) => item.cycle),
    ].filter(Boolean)));
    const rows = labels.length ? labels : ['Current'];

    return rows.map((month) => {
      const workforceRow = headcount.find((item: any) => item.month === month) ?? {};
      const payrollRow = payroll.find((item: any) => item.month === month) ?? {};
      const performanceRow = performance.find((item: any) => item.cycle === month) ?? {};
      const employeeCount = Number(workforceRow.total ?? data?.summary?.totalEmployees ?? 0);
      const payrollAmount = Number(payrollRow.amount ?? 0);
      const values: Record<string, number> = {
        headcount: employeeCount,
        turnover: Number(data?.summary?.turnoverRate ?? 0),
        newHires: Number(workforceRow.newHires ?? 0),
        exits: Number(workforceRow.exits ?? 0),
        totalPayroll: payrollAmount,
        avgSalary: employeeCount > 0 ? Math.round(payrollAmount / employeeCount) : 0,
        budgetVariance: Number(data?.payroll?.budget?.actual ?? 0) - Number(data?.payroll?.budget?.budget ?? 0),
        complianceScore: Number(data?.summary?.complianceScore ?? 0),
        benefitsUtilization: Number(data?.summary?.benefitsUtilization ?? 0),
        performanceScore: Number(performanceRow.avgScore ?? data?.summary?.avgPerformance ?? 0),
      };
      const row: Record<string, string | number> = { month };
      metrics.forEach((metric) => { row[metric] = values[metric] ?? 0; });
      return row;
    });
  };

  const renderChart = () => {
    if (!generatedReport || generatedReport.length === 0) {
      return (
        <div className="text-center text-gray-400 py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Select metrics and click "Generate Report"</p>
          <p className="text-xs mt-1">Charts will appear here</p>
        </div>
      );
    }

    const dataKeys = selectedMetrics;
    const hasMultipleMetrics = dataKeys.length > 1;

    switch (selectedVisualization) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">Month</th>
                  {dataKeys.map((key) => (
                    <th key={key} className="text-left py-2 font-medium text-gray-600">
                      {availableMetrics.find(m => m.key === key)?.label || key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedReport.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 font-medium text-gray-700">{row.month}</td>
                    {dataKeys.map((key) => (
                      <td key={key} className="py-2 text-gray-600">
                        {typeof row[key] === 'number' && key === 'totalPayroll'
                          ? `KES ${row[key].toLocaleString()}`
                          : typeof row[key] === 'number' && key === 'avgSalary'
                          ? `KES ${row[key].toLocaleString()}`
                          : row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generatedReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const label = availableMetrics.find(m => m.key === name)?.label || name;
                  return [value, label];
                }}
              />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generatedReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const label = availableMetrics.find(m => m.key === name)?.label || name;
                  return [value, label];
                }}
              />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        if (dataKeys.length === 0) return null;
        const pieData = generatedReport.map((row: any) => ({
          name: row.month,
          value: row[dataKeys[0]] || 0,
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            Custom Report Builder
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Build custom reports by selecting metrics and visualization types
          </p>
        </div>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metric Selector */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Select Metrics
          </p>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex justify-between items-center ${
                  selectedMetrics.includes(metric.key)
                    ? 'bg-blue-50 text-blue-700 border border-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span>{metric.label}</span>
                {selectedMetrics.includes(metric.key) && <X className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Visualization Builder */}
        <div className="lg:col-span-2 space-y-4">
          {/* Visualization Type */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-3">Visualization Type</p>
            <div className="flex gap-2">
              {[
                { id: 'table', icon: Table, label: 'Table' },
                { id: 'bar', icon: BarChart3, label: 'Bar Chart' },
                { id: 'line', icon: BarChart3, label: 'Line Chart' },
                { id: 'pie', icon: PieChart, label: 'Pie Chart' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedVisualization(type.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs transition flex items-center gap-2 ${
                    selectedVisualization === type.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">Preview</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-3 h-3" />
                <span>{selectedMetrics.length} metrics selected</span>
              </div>
            </div>
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};
