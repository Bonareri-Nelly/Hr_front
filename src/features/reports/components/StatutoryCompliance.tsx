import { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ComplianceData {
  status: { category: string; filed: number; pending: number; total: number }[];
  trend: { month: string; amount: number }[];
  flags: { branch: string; issue: string; status: 'overdue' | 'pending' | 'completed' }[];
  overallScore: number;
}

export const StatutoryCompliance = ({ data }: { data: ComplianceData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-700" />
              Statutory Compliance
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Company-wide compliance status across all branches
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-700 hover:text-blue-800 transition"
          >
            View Details →
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Overall Score</span>
          <span className="text-lg font-bold text-green-600">{data.overallScore}%</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {data.status.map((item) => {
            const completionRate = Math.round((item.filed / item.total) * 100);
            const color = completionRate === 100 ? 'green' : completionRate >= 80 ? 'yellow' : 'red';
            const colorClasses = {
              green: 'border-green-200 bg-green-50',
              yellow: 'border-yellow-200 bg-yellow-50',
              red: 'border-red-200 bg-red-50',
            };
            const iconColors = {
              green: 'text-green-500',
              yellow: 'text-yellow-500',
              red: 'text-red-500',
            };
            return (
              <div
                key={item.category}
                className={`border rounded-lg p-3 ${colorClasses[color]}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-600">{item.category}</span>
                  {completionRate === 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${iconColors[color]}`} />
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">{completionRate}%</p>
                <p className="text-[10px] text-gray-500">
                  {item.filed} / {item.total} filed
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Branch Compliance Alerts
          </p>
          {data.flags.length === 0 ? (
            <p className="text-sm text-green-600">✓ All branches compliant</p>
          ) : (
            <div className="space-y-2">
              {data.flags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center text-xs p-2 rounded ${
                    flag.status === 'overdue'
                      ? 'bg-red-50 text-red-700'
                      : flag.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  <span className="font-medium">{flag.branch}</span>
                  <span>{flag.issue}</span>
                  <span className="capitalize">{flag.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-700" />
                Compliance – Full Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {data.status.map((item) => (
                <div key={item.category} className="bg-gray-50 p-3 rounded-lg flex justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm">{item.filed}/{item.total} filed</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Trend (KES)</p>
              <div className="grid grid-cols-6 gap-2">
                {data.trend.map((item) => (
                  <div key={item.month} className="text-center">
                    <p className="text-xs text-gray-600">{item.month.slice(0, 3)}</p>
                    <p className="text-xs font-semibold">{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};