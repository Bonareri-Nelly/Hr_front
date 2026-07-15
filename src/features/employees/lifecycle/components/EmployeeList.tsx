import { useState } from 'react';
import { 
  User, 
  Building2, 
  Calendar, 
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import { LifecycleStageBadge } from './LifecycleStageBadge';
import { TenureBadge } from './TenureBadge';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  role: string;
  stage: 'onboarding' | 'active' | 'notice_period' | 'offboarded';
  startDate: string;
  tenure: string;
  milestones: any[];
}

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (id: string) => void;
}

export const EmployeeList = ({ employees, onSelectEmployee }: EmployeeListProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stageColors = {
    onboarding: 'bg-amber-50 text-amber-700 border-amber-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    notice_period: 'bg-orange-50 text-orange-700 border-orange-200',
    offboarded: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const stageIcons = {
    onboarding: Clock,
    active: CheckCircle,
    notice_period: AlertCircle,
    offboarded: UserX,
  };

  if (employees.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No employees found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Employee</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Department</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Branch</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Role</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Start Date</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Tenure</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Stage</th>
              <th className="text-right text-xs text-gray-500 py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const StageIcon = stageIcons[employee.stage];
              const isHovered = hoveredId === employee.id;

              return (
                <tr
                  key={employee.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer"
                  onMouseEnter={() => setHoveredId(employee.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelectEmployee(employee.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{employee.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{employee.branch}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{employee.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(employee.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <TenureBadge startDate={employee.startDate} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${stageColors[employee.stage]}`}>
                        <StageIcon className="w-3 h-3 inline mr-1" />
                        {employee.stage.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-400">
                        {employee.milestones?.length || 0} milestones
                      </span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition ${isHovered ? 'translate-x-1 text-blue-700' : ''}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};