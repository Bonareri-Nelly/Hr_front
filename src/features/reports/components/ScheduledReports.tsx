import { useCallback, useEffect, useState } from 'react';
import { Clock, Mail, Edit, Trash2, Plus, X, Calendar, Users } from 'lucide-react';
import { apiClient } from '../../../services/api/client';

type Schedule = {
  id: number;
  name: string;
  frequency: string;
  recipients: string[];
  lastRun: string;
  nextRun: string;
  status: string;
};

const titleCase = (value: string) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase() : '';

export const ScheduledReports = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'Monthly',
    recipients: '',
    status: 'Active',
  });

  const loadSchedules = useCallback(async () => {
    try {
      const response = await apiClient.get('/reporting/schedules/');
      const payload = response.data;
      const rows = Array.isArray(payload) ? payload : payload?.results ?? [];
      setSchedules(
        rows.map((row: any): Schedule => ({
          id: row.id,
          name: row.name,
          frequency: titleCase(row.frequency || ''),
          recipients: Array.isArray(row.recipients) ? row.recipients : [],
          lastRun: row.last_run ? String(row.last_run).slice(0, 10) : 'Never',
          nextRun: row.next_run || '-',
          status: titleCase(row.status || ''),
        })),
      );
    } catch {
      setSchedules([]);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleCreateSchedule = async () => {
    if (!newSchedule.name || !newSchedule.recipients) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await apiClient.post('/reporting/schedules/', {
        name: newSchedule.name,
        frequency: newSchedule.frequency.toUpperCase(),
        recipients: newSchedule.recipients
          .split(',')
          .map((recipient) => recipient.trim())
          .filter(Boolean),
        status: newSchedule.status.toUpperCase(),
        next_run: new Date().toISOString().slice(0, 10),
      });
      setIsModalOpen(false);
      setNewSchedule({ name: '', frequency: 'Monthly', recipients: '', status: 'Active' });
      await loadSchedules();
      alert('Schedule created successfully!');
    } catch (error: any) {
      const data = error?.response?.data;
      alert(
        data && typeof data === 'object'
          ? Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
          : 'Could not create the schedule.',
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await apiClient.delete(`/reporting/schedules/${id}/`);
      await loadSchedules();
    } catch {
      alert('Could not delete the schedule.');
    }
  };

  const handleEmail = (id: number) => {
    alert(`Emailing report for schedule ID: ${id}`);
  };

  // Toggling between Active and Paused is the only edit the panel exposes.
  const handleEdit = async (id: number) => {
    const schedule = schedules.find((item) => item.id === id);
    if (!schedule) return;

    const nextStatus = schedule.status === 'Active' ? 'PAUSED' : 'ACTIVE';
    try {
      await apiClient.patch(`/reporting/schedules/${id}/`, { status: nextStatus });
      await loadSchedules();
    } catch {
      alert('Could not update the schedule.');
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" />
              Scheduled Reports
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage automated report schedules and recipients
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2"
          >
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
              {schedules.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 last:border-0 hover:bg-white transition">
                  <td className="py-3 px-4 text-xs text-gray-900">{report.name}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{report.frequency}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{report.recipients.join(', ')}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{report.lastRun}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{report.nextRun}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${
                        report.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEmail(report.id)}
                        className="p-1 hover:bg-gray-100 rounded transition"
                      >
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEdit(report.id)}
                        className="p-1 hover:bg-gray-100 rounded transition"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-1 hover:bg-red-50 rounded transition"
                      >
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-700" />
                New Scheduled Report
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="e.g., Monthly Payroll Summary"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                  placeholder="email1@domain.com, email2@domain.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newSchedule.status}
                  onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateSchedule}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
              >
                Create Schedule
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};