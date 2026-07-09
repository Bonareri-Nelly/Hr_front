import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ComplianceData {
  status: { category: string; filed: number; pending: number; total: number }[];
  flags: { issue: string; status: 'overdue' | 'pending' | 'completed' }[];
  overallScore: number;
}

export const ComplianceSnapshot = ({ data }: { data: ComplianceData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-700" />
          Compliance Snapshot
        </h3>
        <span className="text-sm font-bold text-green-600">{data.overallScore}%</span>
      </div>

      <div className="space-y-3">
        {data.status.map((item) => {
          const completionRate = Math.round((item.filed / item.total) * 100);
          const color = completionRate === 100 ? 'green' : completionRate >= 80 ? 'yellow' : 'red';
          const colorClasses = {
            green: 'border-green-200 bg-green-50',
            yellow: 'border-yellow-200 bg-yellow-50',
            red: 'border-red-200 bg-red-50',
          };
          return (
            <div
              key={item.category}
              className={`border rounded-lg p-3 ${colorClasses[color]}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">{item.category}</span>
                <div className="flex items-center gap-2">
                  {completionRate === 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${color === 'red' ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                  <span className="text-xs font-medium text-gray-900">{completionRate}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                <div
                  className={`h-1.5 rounded-full ${color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Flags */}
      {data.flags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Alerts
          </p>
          {data.flags.map((flag, idx) => (
            <div
              key={idx}
              className={`text-xs p-2 rounded ${
                flag.status === 'overdue'
                  ? 'bg-red-50 text-red-700'
                  : flag.status === 'pending'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {flag.issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};