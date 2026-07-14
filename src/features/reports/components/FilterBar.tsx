import { Filter, Calendar } from 'lucide-react';

interface FilterBarProps {
  timeRange: 'monthly' | 'quarterly' | 'annual';
  setTimeRange: (value: 'monthly' | 'quarterly' | 'annual') => void;
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (value: { start: string; end: string }) => void;
  loading: boolean;
}

const branches = ['all', 'Nairobi HQ', 'Mombasa', 'Kisumu', 'Remote Units', 'Eldoret'];
const departments = ['all', 'Engineering', 'Finance', 'HR', 'Sales', 'Operations', 'Legal', 'R&D', 'Customer Support'];

export const FilterBar = ({
  timeRange,
  setTimeRange,
  selectedBranch,
  setSelectedBranch,
  selectedDepartment,
  setSelectedDepartment,
  dateRange,
  setDateRange,
  loading,
}: FilterBarProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
          {(['monthly', 'quarterly', 'annual'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTimeRange(option)}
              className={`px-3 py-1.5 text-xs rounded-lg transition capitalize ${
                timeRange === option
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
          disabled={loading}
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch === 'all' ? 'All Branches' : branch}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
          disabled={loading}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'all' ? 'All Departments' : dept}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-400">Active Filters:</span>
        {selectedBranch !== 'all' && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            Branch: {selectedBranch}
          </span>
        )}
        {selectedDepartment !== 'all' && (
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            Dept: {selectedDepartment}
          </span>
        )}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {timeRange} view
        </span>
      </div>
    </div>
  );
};