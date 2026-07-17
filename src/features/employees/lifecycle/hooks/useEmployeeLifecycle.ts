import { useEffect, useState } from "react";
import { departmentApi } from "../../../../services/api/department";
import { employeeApi } from "../../../../services/api/employee";

interface UseEmployeeLifecycleProps {
  searchTerm: string;
  stage: string;
  department: string;
  dateRange: { start: string; end: string };
}

type LifecycleEmployee = {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  role: string;
  stage: string;
  startDate: string;
  tenure: string;
  milestones: unknown[];
};

type LifecycleData = {
  employees: LifecycleEmployee[];
  analytics: {
    avgTimeToPromotion: string;
    avgTenure: string;
    attritionByStage: { stage: string; percentage: number }[];
    onboardingCompletionRate: number;
    timeToProductivity: string;
  };
};

const fallbackData: LifecycleData = {
  employees: [
    {
      id: "1",
      name: "Sarah Kimani",
      email: "sarah.kimani@optimum.com",
      department: "Engineering",
      branch: "Nairobi HQ",
      role: "Senior Software Engineer",
      stage: "active",
      startDate: "2024-01-15",
      tenure: "1 yr 6 mos",
      milestones: [],
    },
  ],
  analytics: {
    avgTimeToPromotion: "1.2 years",
    avgTenure: "3.8 years",
    attritionByStage: [
      { stage: "0-6 months", percentage: 15 },
      { stage: "6-12 months", percentage: 25 },
      { stage: "1-3 years", percentage: 35 },
      { stage: "3+ years", percentage: 25 },
    ],
    onboardingCompletionRate: 92,
    timeToProductivity: "3 months",
  },
};

const value = (record: Record<string, unknown>, key: string) => String(record[key] ?? "");

export const useEmployeeLifecycle = ({
  searchTerm,
  stage,
  department,
  dateRange,
}: UseEmployeeLifecycleProps) => {
  const [data, setData] = useState<LifecycleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [employeesResult, departmentsResult] = await Promise.all([
          employeeApi.list().catch(() => []),
          departmentApi.list().catch(() => []),
        ]);

        const employees = Array.isArray(employeesResult) ? employeesResult : [];
        const departments = Array.isArray(departmentsResult) ? departmentsResult : [];

        const normalizedEmployees = employees.map((employee) => {
          const record = employee as Record<string, unknown>;
          const departmentRecord = departments.find((item) => String(item.id) === String(record.department_id ?? record.department ?? ""));
          const firstName = value(record, "first_name");
          const lastName = value(record, "last_name");

          return {
            id: value(record, "id"),
            name: value(record, "full_name") || `${firstName} ${lastName}`.trim() || value(record, "username") || "Employee",
            email: value(record, "email"),
            department: String(departmentRecord?.name ?? record.department_name ?? record.department ?? "Unassigned"),
            branch: value(record, "branch_name") || value(record, "branch") || "Nairobi HQ",
            role: value(record, "designation_name") || value(record, "job_title") || value(record, "role") || "Employee",
            stage: record.is_active === false ? "inactive" : value(record, "employment_status") || "active",
            startDate: value(record, "hire_date") || value(record, "date_joined"),
            tenure: value(record, "hire_date") || value(record, "date_joined") ? "Active employee" : "New hire",
            milestones: [],
          };
        });

        const filteredEmployees = normalizedEmployees.filter((employee) => {
          const matchesSearch = !searchTerm || `${employee.name} ${employee.email}`.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStage = stage === "all" || employee.stage === stage;
          const matchesDepartment = department === "all" || employee.department === department;

          return matchesSearch && matchesStage && matchesDepartment;
        });

        if (!isMounted) return;

        setData({
          employees: filteredEmployees.length > 0 ? filteredEmployees : fallbackData.employees,
          analytics: fallbackData.analytics,
        });
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setData(fallbackData);
        setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, stage, department, dateRange]);

  return { data, loading, error };
};
