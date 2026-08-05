import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../../services/api/client';
import {
  Plus,
  Users,
  FileText,
  Settings,
  Bell,
  Calendar,
  BarChart,
  X,
  Send,
} from 'lucide-react';

interface QuickActionsProps {
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const QuickActions = ({ onShowToast }: QuickActionsProps) => {
  const navigate = useNavigate();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', department: '' });
  const [announcementText, setAnnouncementText] = useState('');

  const actions = [
    {
      label: 'Add Employee',
      icon: Plus,
      action: () => setShowAddEmployeeModal(true),
    },
    {
      label: 'Run Payroll',
      icon: FileText,
      action: () => {
        if (onShowToast) onShowToast('Payroll run started!', 'success');
        else alert('Payroll run started!');
      },
    },
    {
      label: 'Send Announcement',
      icon: Bell,
      action: () => setShowAnnouncementModal(true),
    },
    {
      label: 'View All Employees',
      icon: Users,
      action: () => navigate('/employees'),
    },
    {
      label: 'Calendar',
      icon: Calendar,
      action: () => navigate('/calendar'),
    },
    {
      label: 'Reports',
      icon: BarChart,
      action: () => navigate('/reports-analytics'),
    },
    {
      label: 'Settings',
      icon: Settings,
      action: () => navigate('/settings'),
    },
  ];

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    if (onShowToast) onShowToast(message, type);
    else alert(message);
  };

  const describeError = (error: any, fallback: string) => {
    const data = error?.response?.data;
    if (data && typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
    }
    return fallback;
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      notify('Please fill in all required fields.', 'error');
      return;
    }

    const [firstName, ...rest] = newEmployee.name.trim().split(/\s+/);

    try {
      // Created as ONBOARDING, which the API accepts without a branch,
      // department, designation or salary yet. Those are set when the employee
      // is placed and moved off onboarding.
      await apiClient.post('/employees/', {
        employee_number: `EMP-${Date.now().toString().slice(-6)}`,
        first_name: firstName,
        last_name: rest.join(' ') || firstName,
        work_email: newEmployee.email,
        hire_date: new Date().toISOString().split('T')[0],
        employment_type: 'PERMANENT',
        employment_status: 'ONBOARDING',
      });
      notify(`Employee ${newEmployee.name} added successfully!`, 'success');
      setNewEmployee({ name: '', email: '', department: '' });
      setShowAddEmployeeModal(false);
    } catch (error) {
      notify(describeError(error, 'Could not add the employee.'), 'error');
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) {
      notify('Please enter an announcement.', 'error');
      return;
    }

    const text = announcementText.trim();

    try {
      await apiClient.post('/hr-operations/announcements/', {
        // The composer is a single text box, so use its opening line as a title.
        title: text.split('\n')[0].slice(0, 120),
        body: text,
        audience: 'ALL',
      });
      notify('Announcement sent!', 'success');
      setAnnouncementText('');
      setShowAnnouncementModal(false);
    } catch (error) {
      notify(describeError(error, 'Could not send the announcement.'), 'error');
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddEmployeeModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Employee</h3>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="john.doe@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAnnouncementModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Send Announcement</h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="Type your announcement here..."
              />
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSendAnnouncement}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Announcement
              </button>
              <button
                onClick={() => setShowAnnouncementModal(false)}
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