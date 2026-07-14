// src/features/employees/onboarding/services/onboarding.service.ts
import type { 
  OnboardingCase, 
  OnboardingStats, 
  OnboardingFilter, 
  OnboardingEmployee,
  OnboardingStep,
  OnboardingTask,
  OnboardingDocument,
  OnboardingEquipment,
  OnboardingFormData
} from '../types';

// Mock employees data
const MOCK_EMPLOYEES: OnboardingEmployee[] = [
  { id: 'emp-001', name: 'Jane Doe', email: 'jane.doe@optimum.com', department: 'Engineering', position: 'Senior Software Engineer', branchId: 'branch-1', branchName: 'Headquarters', startDate: '2025-01-15', managerId: 'mgr-001', managerName: 'John Manager', status: 'in-progress' },
  { id: 'emp-002', name: 'John Smith', email: 'john.smith@optimum.com', department: 'Sales', position: 'Sales Manager', branchId: 'branch-2', branchName: 'North Region', startDate: '2025-02-01', managerId: 'mgr-002', managerName: 'Sarah HR', status: 'not-started' },
  { id: 'emp-003', name: 'Mary Johnson', email: 'mary.johnson@optimum.com', department: 'Marketing', position: 'Marketing Specialist', branchId: 'branch-3', branchName: 'South Region', startDate: '2024-12-01', managerId: 'mgr-003', managerName: 'HR Admin', status: 'completed' },
];

// Mock onboarding cases
const mockOnboardingCases: OnboardingCase[] = [
  {
    id: 'onb-001',
    employeeId: 'emp-001',
    employeeName: 'Jane Doe',
    employeeEmail: 'jane.doe@optimum.com',
    branchId: 'branch-1',
    branchName: 'Headquarters',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    startDate: '2025-01-15',
    managerId: 'mgr-001',
    managerName: 'John Manager',
    status: 'in-progress',
    progress: {
      totalSteps: 12,
      completedSteps: 7,
      percentage: 58
    },
    caseCreated: '2024-12-01',
    caseUpdated: '2024-12-10',
    hasOverdueTasks: false,
    daysUntilStart: 36,
    tasks: [
      { id: 'task-001', onboardingId: 'onb-001', title: 'Complete Employment Contract', description: 'Sign and return employment contract', assignedTo: 'emp-001', assignedToName: 'Jane Doe', dueDate: '2025-01-10', status: 'completed', priority: 'high', category: 'hr' },
      { id: 'task-002', onboardingId: 'onb-001', title: 'Submit Tax Documents', description: 'Provide tax ID and relevant documents', assignedTo: 'emp-001', assignedToName: 'Jane Doe', dueDate: '2025-01-12', status: 'in-progress', priority: 'high', category: 'finance' },
      { id: 'task-003', onboardingId: 'onb-001', title: 'Setup Workstation', description: 'Prepare laptop and workspace', assignedTo: 'it-001', assignedToName: 'IT Team', dueDate: '2025-01-14', status: 'pending', priority: 'medium', category: 'it' },
    ],
    steps: [
      { id: 'step-001', onboardingId: 'onb-001', name: 'Submit Personal Details', category: 'hr', status: 'completed', order: 1, assignedTo: 'emp-001', assignedToName: 'Jane Doe', required: true },
      { id: 'step-002', onboardingId: 'onb-001', name: 'Complete HR Forms', category: 'hr', status: 'completed', order: 2, assignedTo: 'emp-001', assignedToName: 'Jane Doe', required: true },
      { id: 'step-003', onboardingId: 'onb-001', name: 'IT Account Setup', category: 'it', status: 'in-progress', order: 3, assignedTo: 'it-001', assignedToName: 'IT Team', required: true },
      { id: 'step-004', onboardingId: 'onb-001', name: 'Equipment Assignment', category: 'equipment', status: 'pending', order: 4, assignedTo: 'facilities-001', assignedToName: 'Facilities Team', required: true },
    ],
    documents: [
      { id: 'doc-001', onboardingId: 'onb-001', employeeId: 'emp-001', documentType: 'id', documentName: 'Government ID', status: 'uploaded' },
      { id: 'doc-002', onboardingId: 'onb-001', employeeId: 'emp-001', documentType: 'tax-id', documentName: 'Tax ID Number', status: 'pending' },
    ],
    equipment: [
      { id: 'eq-001', onboardingId: 'onb-001', employeeId: 'emp-001', equipmentType: 'laptop', itemName: 'MacBook Pro 16"', serialNumber: 'LAP-2025-001', status: 'assigned' },
      { id: 'eq-002', onboardingId: 'onb-001', employeeId: 'emp-001', equipmentType: 'monitor', itemName: 'External Monitor 27"', serialNumber: 'MON-2025-001', status: 'pending' },
    ]
  },
  {
    id: 'onb-002',
    employeeId: 'emp-002',
    employeeName: 'John Smith',
    employeeEmail: 'john.smith@optimum.com',
    branchId: 'branch-2',
    branchName: 'North Region',
    department: 'Sales',
    position: 'Sales Manager',
    startDate: '2025-02-01',
    managerId: 'mgr-002',
    managerName: 'Sarah HR',
    status: 'not-started',
    progress: {
      totalSteps: 10,
      completedSteps: 0,
      percentage: 0
    },
    caseCreated: '2024-12-15',
    caseUpdated: '2024-12-15',
    hasOverdueTasks: false,
    daysUntilStart: 60,
    tasks: [],
    steps: [
      { id: 'step-005', onboardingId: 'onb-002', name: 'Welcome Email', category: 'hr', status: 'pending', order: 1, assignedTo: 'hr-001', assignedToName: 'HR Team', required: false },
    ],
    documents: [],
    equipment: []
  },
  {
    id: 'onb-003',
    employeeId: 'emp-003',
    employeeName: 'Mary Johnson',
    employeeEmail: 'mary.johnson@optimum.com',
    branchId: 'branch-3',
    branchName: 'South Region',
    department: 'Marketing',
    position: 'Marketing Specialist',
    startDate: '2024-12-01',
    managerId: 'mgr-003',
    managerName: 'HR Admin',
    status: 'completed',
    progress: {
      totalSteps: 10,
      completedSteps: 10,
      percentage: 100
    },
    caseCreated: '2024-11-01',
    caseUpdated: '2024-12-05',
    dateCompleted: '2024-12-05',
    hasOverdueTasks: false,
    daysUntilStart: -15,
    tasks: [
      { id: 'task-004', onboardingId: 'onb-003', title: 'Complete Onboarding', description: 'All onboarding tasks completed', assignedTo: 'hr-001', assignedToName: 'HR Team', status: 'completed', priority: 'high', category: 'hr' },
    ],
    steps: [
      { id: 'step-006', onboardingId: 'onb-003', name: 'Orientation', category: 'hr', status: 'completed', order: 1, assignedTo: 'hr-001', assignedToName: 'HR Team', required: true },
    ],
    documents: [],
    equipment: []
  }
];

export const onboardingService = {
  async getCases(filters: OnboardingFilter = {}): Promise<OnboardingCase[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockOnboardingCases];
    
    if (filters.branchId && filters.branchId !== 'all') {
      filtered = filtered.filter(c => c.branchId === filters.branchId);
    }
    if (filters.department) {
      filtered = filtered.filter(c => c.department === filters.department);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.employeeName.toLowerCase().includes(term) ||
        c.department.toLowerCase().includes(term) ||
        c.position.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  },

  async getStats(filters: OnboardingFilter = {}): Promise<OnboardingStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cases = await this.getCases(filters);
    
    const byBranch = cases.reduce((acc, c) => {
      const existing = acc.find(b => b.branchId === c.branchId);
      if (existing) {
        existing.total++;
        if (c.status === 'in-progress') existing.inProgress++;
        if (c.status === 'completed') existing.completed++;
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
      const existing = acc.find(d => d.department === c.department);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ department: c.department, count: 1 });
      }
      return acc;
    }, [] as { department: string; count: number; }[]);

    const byStatus = cases.reduce((acc: { status: any; count: number }[], c) => {
      const existing = acc.find(s => s.status === c.status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ status: c.status, count: 1 });
      }
      return acc;
    }, [] as { status: any; count: number; }[]);

    return {
      totalCases: cases.length,
      notStarted: cases.filter(c => c.status === 'not-started').length,
      inProgress: cases.filter(c => c.status === 'in-progress').length,
      completed: cases.filter(c => c.status === 'completed').length,
      overdue: cases.filter(c => c.status === 'overdue').length,
      onHold: cases.filter(c => c.status === 'on-hold').length,
      byBranch,
      byDepartment,
      byStatus,
      avgTimeToComplete: 30,
      monthlyTrend: [],
    };
  },

  async getCaseDetails(caseId: string): Promise<OnboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const caseItem = mockOnboardingCases.find(c => c.id === caseId);
    if (!caseItem) {
      throw new Error('Case not found');
    }
    return caseItem;
  },

  async getEmployees(query: string = ''): Promise<OnboardingEmployee[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!query || query.length < 2) {
      return MOCK_EMPLOYEES.slice(0, 5);
    }
    const term = query.toLowerCase();
    return MOCK_EMPLOYEES.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  },

  async initiateOnboarding(data: OnboardingFormData): Promise<OnboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employee = MOCK_EMPLOYEES.find(e => e.id === data.employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const newCase: OnboardingCase = {
      id: `onb-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeEmail: employee.email,
      branchId: data.branchId,
      branchName: employee.branchName,
      department: data.department,
      position: data.position,
      startDate: data.startDate,
      managerId: data.managerId,
      managerName: employee.managerName || 'TBD',
      status: 'not-started',
      progress: {
        totalSteps: 10,
        completedSteps: 0,
        percentage: 0
      },
      caseCreated: new Date().toISOString().split('T')[0],
      caseUpdated: new Date().toISOString().split('T')[0],
      hasOverdueTasks: false,
      daysUntilStart: 30,
      notes: data.notes,
      tasks: [],
      steps: [],
      documents: [],
      equipment: []
    };
    
    mockOnboardingCases.push(newCase);
    return newCase;
  },

  async updateStep(caseId: string, stepId: string, status: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const caseItem = mockOnboardingCases.find(c => c.id === caseId);
    if (caseItem && caseItem.steps) {
      const step = caseItem.steps.find(s => s.id === stepId);
      if (step) {
        step.status = status as any;
        if (status === 'completed') {
          step.completedDate = new Date().toISOString().split('T')[0];
        }
        // Update progress
        const completed = caseItem.steps.filter(s => s.status === 'completed').length;
        caseItem.progress.completedSteps = completed;
        caseItem.progress.percentage = Math.round((completed / caseItem.progress.totalSteps) * 100);
        caseItem.caseUpdated = new Date().toISOString().split('T')[0];
      }
    }
  }
};

export default onboardingService;