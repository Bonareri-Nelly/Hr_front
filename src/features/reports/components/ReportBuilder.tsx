import { useState } from 'react';
import { BookOpen, Plus, X, Download, Calendar, Filter, BarChart3, PieChart, Table } from 'lucide-react';

interface ReportBuilderProps {
  data: any;
}

export const ReportBuilder = ({ data }: ReportBuilderProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState<'table' | 'bar' | 'line' | 'pie'>('table');

  const availableMetrics = [
    'Headcount', 'Turnover Rate', 'New Hires', 'Exits', 
    'Total Payroll', 'Avg Salary', 'Budget Variance',
    'Compliance Score', 'Benefits Utilization',
    'Performance Score'
  ];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Custom Report Builder
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Build custom reports by selecting metrics and visualization types
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2">
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metric Selector */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3">Select Metrics</p>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex justify-between items-center ${
                  selectedMetrics.includes(metric)
                    ? 'bg-blue-50 text-blue-700 border border-blue-300'  // Changed to blue
                    : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span>{metric}</span>
                {selectedMetrics.includes(metric) && <X className="w-3 h-3" />}
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
                      ? 'bg-blue-50 text-blue-700 border border-blue-300'  // Changed to blue
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
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">Preview</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-3 h-3" />
                <span>{selectedMetrics.length} metrics selected</span>
              </div>
            </div>
            {selectedMetrics.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select metrics to build your report</p>
                <p className="text-xs mt-1">Choose from the metrics on the left</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Selected:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedMetrics.map((metric) => (
                      <span
                        key={metric}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                  <p className="text-sm">Report preview will appear here</p>
                  <p className="text-xs mt-1">Click "Generate Report" to build</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};