// src/features/employees/onboarding/services/onboarding.service.ts
import type {
  OnboardingCase,
  OnboardingStats,
  OnboardingFilter,
  OnboardingEmployee,
  OnboardingFormData,
} from '../types';
import { employeeApi, type EmployeePayload } from '../../../../services/api/employee';

const toOnboardingCase = (employee: Record<string, unknown>): OnboardingCase => {
  const employeeName = [employee.first_name, employee.last_name].filter(Boolean).join(' ') || 'Unnamed employee';
  const hireDate = String(employee.hire_date ?? '');
  const startDate = hireDate || new Date().toISOString().split('T')[0];
  const departmentName = String(employee.department_name ?? 'Unassigned');
  const designation = String(employee.designation_name ?? employee.job_title ?? '');
  const branchName = String(employee.branch_name ?? 'Unassigned');

  return {
    id: `employee-${employee.id}`,
    employeeId: String(employee.id ?? ''),
    employeeName,
    employeeEmail: String(employee.work_email ?? employee.personal_email ?? employee.email ?? ''),
    branchId: String(employee.branch_id ?? ''),
    branchName,
    department: departmentName,
    position: designation,
    startDate,
    managerId: String(employee.manager_id ?? ''),
    managerName: String(employee.manager_name ?? 'TBD'),
    status: 'in-progress',
    progress: {
      totalSteps: 10,
      completedSteps: 0,
      percentage: 0,
    },
    caseCreated: String(employee.created_at ?? startDate),
    caseUpdated: String(employee.updated_at ?? startDate),
    hasOverdueTasks: false,
    daysUntilStart: 0,
    tasks: [],
    steps: [],
    documents: [],
    equipment: [],
  };
};

export const onboardingService = {
  async getCases(filters: OnboardingFilter = {}): Promise<OnboardingCase[]> {
    const employees = await employeeApi.list({ employment_status: 'ONBOARDING', page_size: '100' }).catch(() => []);

    const cases = employees.map((employee) => toOnboardingCase(employee as Record<string, unknown>));

    return cases.filter((caseItem) => {
      if (filters.branchId && filters.branchId !== 'all' && caseItem.branchId !== filters.branchId) return false;
      if (filters.department && caseItem.department !== filters.department) return false;
      if (filters.status && caseItem.status !== filters.status) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          caseItem.employeeName.toLowerCase().includes(term) ||
          caseItem.department.toLowerCase().includes(term) ||
          caseItem.position.toLowerCase().includes(term)
        );
      }
      return true;
    });
  },

  async getStats(filters: OnboardingFilter = {}): Promise<OnboardingStats> {
    const cases = await this.getCases(filters);

    const byBranch = cases.reduce((acc, c) => {
      const existing = acc.find((b) => b.branchId === c.branchId);
      if (existing) {
        existing.total += 1;
        if (c.status === 'in-progress') existing.inProgress += 1;
        if (c.status === 'completed') existing.completed += 1;
      } else {
        acc.push({
          branchId: c.branchId,
          branchName: c.branchName,
          total: 1,
          inProgress: c.status === 'in-progress' ? 1 : 0,
          completed: c.status === 'completed' ? 1 : 0,
        });
      }
      return acc;
    }, [] as { branchId: string; branchName: string; total: number; inProgress: number; completed: number; }[]);

    const byDepartment = cases.reduce((acc, c) => {
      const existing = acc.find((d) => d.department === c.department);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ department: c.department, count: 1 });
      }
      return acc;
    }, [] as { department: string; count: number; }[]);

    const byStatus = cases.reduce<Array<{ status: import('../types').OnboardingStatus; count: number }>>((acc, c) => {
      const existing = acc.find((s) => s.status === c.status);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ status: c.status as import('../types').OnboardingStatus, count: 1 });
      }
      return acc;
    }, []);

    return {
      totalCases: cases.length,
      notStarted: cases.filter((c) => c.status === 'not-started').length,
      inProgress: cases.filter((c) => c.status === 'in-progress').length,
      completed: cases.filter((c) => c.status === 'completed').length,
      overdue: cases.filter((c) => c.status === 'overdue').length,
      onHold: cases.filter((c) => c.status === 'on-hold').length,
      byBranch,
      byDepartment,
      byStatus,
      avgTimeToComplete: 30,
      monthlyTrend: [],
    };
  },

  async getCaseDetails(caseId: string): Promise<OnboardingCase> {
    const employeeId = caseId.replace('employee-', '');
    const employee = await employeeApi.get(employeeId).catch(() => null);
    if (!employee) throw new Error('Case not found');
    return toOnboardingCase(employee as Record<string, unknown>);
  },

  async getEmployees(query: string = ''): Promise<OnboardingEmployee[]> {
    const employees = await employeeApi.list({ employment_status: 'ONBOARDING', page_size: '100' }).catch(() => []);

    const normalized = employees.map((employee) => {
      const name = [employee.first_name, employee.last_name].filter(Boolean).join(' ') || 'Unnamed employee';
      return {
        id: String(employee.id ?? ''),
        name,
        email: String(employee.work_email ?? employee.personal_email ?? employee.email ?? ''),
        phone: String(employee.phone_number ?? ''),
        department: String(employee.department_name ?? 'Unassigned'),
        position: String(employee.designation_name ?? employee.job_title ?? ''),
        branchId: String(employee.branch_id ?? ''),
        branchName: String(employee.branch_name ?? 'Unassigned'),
        startDate: String(employee.hire_date ?? ''),
        managerId: String(employee.manager_id ?? ''),
        managerName: String(employee.manager_name ?? 'TBD'),
        status: employee.employment_status === 'ACTIVE' ? 'completed' : 'in-progress',
      } as OnboardingEmployee;
    });

    if (!query || query.length < 2) return normalized.slice(0, 5);

    const term = query.toLowerCase();
    return normalized.filter((emp) =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term),
    );
  },

  async initiateOnboarding(data: OnboardingFormData): Promise<OnboardingCase> {
    // Branch, department and designation are foreign keys, and basic salary must
    // be greater than zero, so the form supplies real ids and an amount. Sending
    // names or a zero salary is rejected with a 400.
    const firstName = (data.employeeId || '').trim();
    const lastName = (data.lastName || '').trim();
    const emailSlug = [firstName, lastName]
      .filter(Boolean)
      .join('.')
      .toLowerCase()
      .replace(/\s+/g, '.');

    const payload: EmployeePayload = {
      employee_number: `EMP-${Date.now().toString().slice(-6)}`,
      first_name: firstName,
      last_name: lastName,
      personal_email: `${emailSlug}@optimum.local`,
      work_email: `${emailSlug}@optimum.local`,
      hire_date: data.startDate,
      employment_status: 'ONBOARDING',
      branch: Number(data.branchId),
      department: Number(data.department),
      designation: Number(data.position),
      basic_salary: Number(data.basicSalary || 0),
      employment_type: 'CONTRACT',
    };

    // The manager field is an Employee id; omit it unless a numeric one is given.
    const managerId = Number(data.managerId);
    if (Number.isInteger(managerId) && managerId > 0) {
      payload.manager = managerId;
    }

    const response = await employeeApi.create(payload);
    return toOnboardingCase((response as any)?.data ?? response);
  },
};

export default onboardingService;
