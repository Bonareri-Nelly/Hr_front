// src/features/employees/onboarding/services/onboarding.service.ts
import type {
  OnboardingCase,
  OnboardingStats,
  OnboardingFilter,
  OnboardingEmployee,
  OnboardingFormData,
} from '../types';
import { employeeApi, type EmployeePayload } from '../../../../services/api/employee';
import { apiClient } from '@/services/api/client';

const getOnboardingEmployees = async (): Promise<Record<string, unknown>[]> => {
  const { data } = await apiClient.get('/employees/', {
    params: { employment_status: 'ONBOARDING', page_size: 100 },
  });
  return Array.isArray(data) ? data : data?.results ?? [];
};

const slug = (value: string, prefix: string) =>
  `${prefix}-${value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 14) || Date.now()}`;

const list = (payload: any) => Array.isArray(payload) ? payload : payload?.results ?? [];

const resolveOnboardingReferences = async (data: OnboardingFormData) => {
  const [branchResponse, departmentResponse, designationResponse] = await Promise.all([
    apiClient.get('/branches/', { params: { page_size: 100 } }),
    apiClient.get('/departments/', { params: { page_size: 100 } }),
    apiClient.get('/designations/', { params: { page_size: 100 } }),
  ]);

  const branchInput = data.branchId.trim();
  let branch = list(branchResponse.data).find((item: any) =>
    String(item.id) === branchInput || item.name.toLowerCase() === branchInput.toLowerCase(),
  );
  if (!branch) {
    ({ data: branch } = await apiClient.post('/branches/', {
      name: branchInput,
      code: slug(branchInput, 'BR'),
    }));
  }

  const departmentInput = data.department.trim();
  let department = list(departmentResponse.data).find((item: any) =>
    (String(item.id) === departmentInput || item.name.toLowerCase() === departmentInput.toLowerCase())
    && String(item.branch) === String(branch.id),
  );
  if (!department) {
    ({ data: department } = await apiClient.post('/departments/', {
      branch: branch.id,
      name: departmentInput,
      code: slug(departmentInput, 'DEPT'),
    }));
  }

  const designationInput = data.position.trim();
  let designation = list(designationResponse.data).find((item: any) =>
    (String(item.id) === designationInput || item.title.toLowerCase() === designationInput.toLowerCase())
    && String(item.department) === String(department.id),
  );
  if (!designation) {
    ({ data: designation } = await apiClient.post('/designations/', {
      department: department.id,
      title: designationInput,
    }));
  }

  return { branchId: Number(branch.id), departmentId: Number(department.id), designationId: Number(designation.id) };
};

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
    const employees = await getOnboardingEmployees().catch(() => []);

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
    const employees = await getOnboardingEmployees().catch(() => []);

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

    const references = await resolveOnboardingReferences(data);
    const payload: EmployeePayload = {
      employee_number: `EMP-${Date.now().toString().slice(-6)}`,
      first_name: firstName,
      last_name: lastName,
      personal_email: `${emailSlug}@optimum.local`,
      work_email: `${emailSlug}@optimum.local`,
      hire_date: data.startDate,
      employment_status: 'ONBOARDING',
      branch: references.branchId,
      department: references.departmentId,
      designation: references.designationId,
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
