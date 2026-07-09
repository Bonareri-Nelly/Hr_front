import { Shield, CheckCircle, AlertCircle, Clock, FileCheck } from 'lucide-react';

interface ComplianceData {
  status: { category: string; filed: number; pending: number; total: number }[];
  trend: { month: string; amount: number }[];
  flags: { branch: string; issue: string; status: 'overdue' | 'pending' | 'completed' }[];
  overallScore: number;
}

export const StatutoryCompliance = ({ data }: { data: ComplianceData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Statutory Compliance
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide compliance status across all branches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Score:</span>
          <span className="text-lg font-bold text-green-600">{data.overallScore}%</span>
        </div>
      </div>

      {/* Compliance Status Grid */}
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

      {/* Flags / Alerts */}
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
  );
};