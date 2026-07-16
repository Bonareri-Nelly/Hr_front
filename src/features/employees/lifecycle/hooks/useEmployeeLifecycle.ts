import { useEffect, useState } from 'react';
import { departmentApi } from '../../../../services/api/department';
import { employeeApi } from '../../../../services/api/employee';

interface UseEmployeeLifecycleProps {
  searchTerm: string;
  stage: string;
  department: string;
  dateRange: { start: string; end: string };
}

const fallbackData = {
  employees: [
    {
      id: '1',
      name: 'Sarah Kimani',
      email: 'sarah.kimani@optimum.com',
      department: 'Engineering',
      branch: 'Nairobi HQ',
      role: 'Senior Software Engineer',
      stage: 'active',
      startDate: '2024-01-15',
      tenure: '1 yr 6 mos',
      milestones: [],
    },
  ],
  analytics: {
    avgTimeToPromotion: '1.2 years',
    avgTenure: '3.8 years',
    attritionByStage: [
      { stage: '0-6 months', percentage: 15 },
      { stage: '6-12 months', percentage: 25 },
      { stage: '1-3 years', percentage: 35 },
      { stage: '3+ years', percentage: 25 },
    ],
    onboardingCompletionRate: 92,
    timeToProductivity: '3 months',
  },
};

export const useEmployeeLifecycle = ({
  searchTerm,
  stage,
  department,
  dateRange,
}: UseEmployeeLifecycleProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employees, departments] = await Promise.all([
          employeeApi.list().catch(() => []),
          departmentApi.list().catch(() => []),
        ]);

        const normalizedEmployees = (employees as Array<Record<string, unknown>>).map((employee) => ({
          id: String(employee.id ?? ''),
          name: [employee.first_name, employee.last_name].filter(Boolean).join(' ') || String(employee.username ?? 'Employee'),
          email: String(employee.email ?? ''),
          department: departments.find((dept: Record<string, unknown>) => String(dept.id) === String(employee.department_id ?? employee.department ?? ''))?.name ?? String(employee.department ?? 'Unassigned'),
          branch: String(employee.branch ?? 'Nairobi HQ'),
          role: String(employee.role ?? employee.job_title ?? 'Employee'),
          stage: employee.is_active ? 'active' : 'inactive',
          startDate: String(employee.hire_date ?? ''),
          tenure: employee.hire_date ? 'Active employee' : 'New hire',
          milestones: [],
        }));

        let filteredEmployees = normalizedEmployees;

        if (searchTerm) {
          filteredEmployees = filteredEmployees.filter((e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (stage !== 'all') {
          filteredEmployees = filteredEmployees.filter((e) => e.stage === stage);
        }

        if (department !== 'all') {
          filteredEmployees = filteredEmployees.filter((e) => e.department === department);
        }

        setData({
          employees: filteredEmployees,
          analytics: fallbackData.analytics,
        });
        setError(null);
      } catch (err) {
        setData(fallbackData);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, stage, department, dateRange]);

  return { data, loading, error };
};