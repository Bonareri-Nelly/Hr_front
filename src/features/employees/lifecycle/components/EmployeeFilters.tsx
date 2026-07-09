import { Search, Filter, Building2, User, ChevronDown } from 'lucide-react';

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStage: string;
  setSelectedStage: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  loading: boolean;
}

const stages = ['all', 'onboarding', 'active', 'notice_period', 'offboarded'];
const departments = ['all', 'Engineering', 'Finance', 'HR', 'Sales', 'Operations', 'Legal'];

export const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  selectedStage,
  setSelectedStage,
  selectedDepartment,
  setSelectedDepartment,
  loading,
}: EmployeeFiltersProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              disabled={loading}
            />
          </div>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
            disabled={loading}
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage === 'all' ? 'All Stages' : stage.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
            disabled={loading}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 ml-auto">
          {selectedStage !== 'all' && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              Stage: {selectedStage.replace('_', ' ')}
            </span>
          )}
          {selectedDepartment !== 'all' && (
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
              Dept: {selectedDepartment}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};