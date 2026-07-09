import { Clock, Calendar, Mail, Edit, Trash2, Plus, Bell } from 'lucide-react';

export const ScheduledReports = () => {
  const scheduledReports = [
    {
      id: 1,
      name: 'Monthly Payroll Summary',
      frequency: 'Monthly',
      recipients: ['executives@optimum.com', 'finance@optimum.com'],
      lastRun: '2026-06-01',
      nextRun: '2026-07-01',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Quarterly Workforce Report',
      frequency: 'Quarterly',
      recipients: ['executives@optimum.com'],
      lastRun: '2026-04-01',
      nextRun: '2026-07-01',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Compliance Status Update',
      frequency: 'Weekly',
      recipients: ['compliance@optimum.com'],
      lastRun: '2026-06-28',
      nextRun: '2026-07-05',
      status: 'Paused',
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-700" />  {/* Changed to blue-700 */}
            Scheduled Reports
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage automated report schedules and recipients
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Report Name</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Frequency</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Recipients</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Last Run</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Next Run</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Status</th>
              <th className="text-right text-xs text-gray-500 py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-100 last:border-0 hover:bg-white transition">
                <td className="py-3 px-4 text-xs text-gray-900">{report.name}</td>
                <td className="py-3 px-4 text-xs text-gray-600">{report.frequency}</td>
                <td className="py-3 px-4 text-xs text-gray-600">
                  {report.recipients.join(', ')}
                </td>
                <td className="py-3 px-4 text-xs text-gray-600">{report.lastRun}</td>
                <td className="py-3 px-4 text-xs text-gray-600">{report.nextRun}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full ${
                    report.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};