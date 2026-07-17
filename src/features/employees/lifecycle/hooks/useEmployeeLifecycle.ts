import { useQuery } from "@tanstack/react-query";
import { resources } from "@/services/api/resources";

interface UseEmployeeLifecycleProps {
  searchTerm: string;
  stage: string;
  department: string;
  dateRange: { start: string; end: string };
}

const value = (record: Record<string, unknown>, key: string) => String(record[key] ?? "");

/** Maps the documented employee resource to the lifecycle page's display model. */
export const useEmployeeLifecycle = ({ searchTerm, stage, department }: UseEmployeeLifecycleProps) => {
  const query = useQuery({
    queryKey: ["employees", "lifecycle"],
    queryFn: () => resources.employees.list(),
    select: (employees) => employees.map((employee) => ({
      id: value(employee, "id"),
      name: value(employee, "full_name") || `${value(employee, "first_name")} ${value(employee, "last_name")}`.trim(),
      email: value(employee, "email"),
      department: value(employee, "department_name") || value(employee, "department"),
      branch: value(employee, "branch_name") || value(employee, "branch"),
      role: value(employee, "designation_name") || value(employee, "designation"),
      stage: value(employee, "employment_status") || "active",
      startDate: value(employee, "hire_date") || value(employee, "date_joined"),
      milestones: [],
    })),
  });

  const employees = (query.data ?? []).filter((employee) =>
    (!searchTerm || `${employee.name} ${employee.email}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (stage === "all" || employee.stage === stage) &&
    (department === "all" || employee.department === department),
  );

  return {
    data: query.data ? { employees, analytics: { avgTimeToPromotion: "—", avgTenure: "—", attritionByStage: [], onboardingCompletionRate: 0, timeToProductivity: "—" } } : null,
    loading: query.isLoading,
    error: query.error,
  };
};
