import { useState } from 'react';
import { useEmployees } from '../../../../hooks';
import { User, Building2, Calendar, ChevronRight, Mail, Phone, Briefcase } from 'lucide-react';

export default function EmployeeLifecyclePage() {
  const { employees, isLoading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Filter employees based on search and department
  const filteredEmployees = (employees || []).filter((emp: any) => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // Get unique departments for filter dropdown
  const departments: string[] = ['all', ...Array.from(new Set<string>((employees || []).map((e: any) => String(e.department || '')).filter(Boolean)))];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 m-6">
        <p>Error loading employees: {(error as any)?.message || 'Unknown error'}</p>
        <p className="text-sm mt-2">Please ensure you are logged in and the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <User className="w-7 h-7 text-blue-700" />
              Employee Lifecycle
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {employees?.length || 0} employees found in the system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition">
              Analytics
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Employee</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Department</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Branch</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Role</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Email</th>
                    <th className="text-right text-xs text-gray-500 py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp: any) => (
                    <tr key={emp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.name || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{emp.department || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{emp.branch || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{emp.role || '—'}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{emp.email || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center gap-1 ml-auto">
                          View <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
