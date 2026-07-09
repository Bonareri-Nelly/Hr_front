import { Plus, Users, FileText, Settings, Bell, Calendar, BarChart } from 'lucide-react';

const actions = [
  { label: 'Add Employee', icon: Plus },
  { label: 'Run Payroll', icon: FileText },
  { label: 'Send Announcement', icon: Bell },
  { label: 'View All Employees', icon: Users },
  { label: 'Calendar', icon: Calendar },
  { label: 'Reports', icon: BarChart },
  { label: 'Settings', icon: Settings },
];

export const QuickActions = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};