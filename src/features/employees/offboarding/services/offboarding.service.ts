// src/features/employees/offboarding/services/offboarding.service.ts
import type { ExitType, OffboardingCase, OffboardingStats, OffboardingFilter } from '../types';

// Mock data for development
const mockCases: OffboardingCase[] = [
  {
    id: 'off-001',
    employeeId: 'emp-001',
    employeeName: 'Jane Doe',
    employeeEmail: 'jane.doe@optimum.com',
    branchId: 'branch-1',
    branchName: 'Headquarters',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    exitType: 'resignation',
    reason: 'Career growth opportunity',
    lastWorkingDay: '2024-12-15',
    noticePeriodStatus: 'full',
    initiatedBy: 'user-001',
    initiatedByName: 'John Manager',
    initiatedDate: '2024-11-15',
    status: 'in-progress',
    progress: {
      total: 7,
      completed: 4,
      percentage: 57
    },
    caseCreated: '2024-11-15',
    caseUpdated: '2024-12-01',
    hasOverdueItems: false,
    daysUntilLastDay: 14,
  },
  {
    id: 'off-002',
    employeeId: 'emp-002',
    employeeName: 'John Smith',
    employeeEmail: 'john.smith@optimum.com',
    branchId: 'branch-2',
    branchName: 'North Region',
    department: 'Sales',
    position: 'Sales Manager',
    exitType: 'termination',
    reason: 'Performance issues',
    lastWorkingDay: '2024-11-30',
    noticePeriodStatus: 'partial',
    initiatedBy: 'user-002',
    initiatedByName: 'Sarah HR',
    initiatedDate: '2024-11-10',
    status: 'completed',
    progress: {
      total: 7,
      completed: 7,
      percentage: 100
    },
    caseCreated: '2024-11-10',
    caseUpdated: '2024-12-01',
    dateCompleted: '2024-12-01',
    hasOverdueItems: false,
    daysUntilLastDay: -15,
  },
  {
    id: 'off-003',
    employeeId: 'emp-003',
    employeeName: 'Mary Johnson',
    employeeEmail: 'mary.johnson@optimum.com',
    branchId: 'branch-3',
    branchName: 'South Region',
    department: 'Marketing',
    position: 'Marketing Specialist',
    exitType: 'end-of-contract',
    reason: 'Contract completion',
    lastWorkingDay: '2024-12-20',
    noticePeriodStatus: 'full',
    initiatedBy: 'user-003',
    initiatedByName: 'HR Admin',
    initiatedDate: '2024-11-20',
    status: 'pending',
    progress: {
      total: 7,
      completed: 1,
      percentage: 14
    },
    caseCreated: '2024-11-20',
    caseUpdated: '2024-11-20',
    hasOverdueItems: false,
    daysUntilLastDay: 20,
  },
  {
    id: 'off-004',
    employeeId: 'emp-004',
    employeeName: 'Robert Wilson',
    employeeEmail: 'robert.wilson@optimum.com',
    branchId: 'branch-4',
    branchName: 'East Region',
    department: 'Finance',
    position: 'Accountant',
    exitType: 'retirement',
    reason: 'Retirement age',
    lastWorkingDay: '2024-12-01',
    noticePeriodStatus: 'full',
    initiatedBy: 'user-004',
    initiatedByName: 'Finance Manager',
    initiatedDate: '2024-10-01',
    status: 'overdue',
    progress: {
      total: 7,
      completed: 3,
      percentage: 43
    },
    caseCreated: '2024-10-01',
    caseUpdated: '2024-12-01',
    hasOverdueItems: true,
    daysUntilLastDay: -8,
  },
];

export const offboardingService = {
  async getCases(filters: OffboardingFilter = {}): Promise<OffboardingCase[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockCases];
    
    if (filters.branchId && filters.branchId !== 'all') {
      filtered = filtered.filter(c => c.branchId === filters.branchId);
    }
    if (filters.status && filters.status !== 'all') {
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
    if (filters.exitType) {
      filtered = filtered.filter(c => c.exitType === filters.exitType);
    }
    if (filters.department) {
      filtered = filtered.filter(c => c.department === filters.department);
    }
    
    return filtered;
  },

  async getStats(filters: OffboardingFilter = {}): Promise<OffboardingStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cases = await this.getCases(filters);
    
    const byBranch = cases.reduce((acc, c) => {
      const existing = acc.find(b => b.branchId === c.branchId);
      if (existing) {
        existing.total++;
        if (c.status === 'pending') existing.pending++;
        if (c.status === 'completed') existing.completed++;
      } else {
        acc.push({
          branchId: c.branchId,
          branchName: c.branchName,
          total: 1,
          pending: c.status === 'pending' ? 1 : 0,
          completed: c.status === 'completed' ? 1 : 0,
        });
      }
      return acc;
    }, [] as { branchId: string; branchName: string; total: number; pending: number; completed: number; }[]);

    const byExitType = cases.reduce((acc, c) => {
      const existing = acc.find(e => e.exitType === c.exitType);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ exitType: c.exitType, count: 1 });
      }
      return acc;
    }, [] as { exitType: ExitType; count: number; }[]);

    const byDepartment = cases.reduce((acc, c) => {
      const existing = acc.find(d => d.department === c.department);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ department: c.department, count: 1 });
      }
      return acc;
    }, [] as { department: string; count: number; }[]);

    return {
      totalCases: cases.length,
      pending: cases.filter(c => c.status === 'pending').length,
      inProgress: cases.filter(c => c.status === 'in-progress').length,
      completed: cases.filter(c => c.status === 'completed').length,
      overdue: cases.filter(c => c.status === 'overdue').length,
      byBranch,
      byExitType,
      byDepartment,
      avgTimeToComplete: 14,
      monthlyTrend: [],
    };
  },

  async getCaseDetails(caseId: string): Promise<OffboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const caseItem = mockCases.find(c => c.id === caseId);
    if (!caseItem) {
      throw new Error('Case not found');
    }
    return caseItem;
  },

  async updateCase(caseId: string, updates: Partial<OffboardingCase>): Promise<OffboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const caseIndex = mockCases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) {
      throw new Error('Case not found');
    }
    mockCases[caseIndex] = { ...mockCases[caseIndex], ...updates };
    return mockCases[caseIndex];
  },

  async initiateOffboarding(data: Partial<OffboardingCase>): Promise<OffboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCase: OffboardingCase = {
      id: `off-${Date.now()}`,
      employeeId: data.employeeId || 'emp-new',
      employeeName: data.employeeName || 'New Employee',
      employeeEmail: data.employeeEmail || 'new@optimum.com',
      branchId: data.branchId || 'branch-1',
      branchName: data.branchName || 'Headquarters',
      department: data.department || 'Unknown',
      position: data.position || 'Unknown',
      exitType: data.exitType || 'resignation',
      reason: data.reason || '',
      lastWorkingDay: data.lastWorkingDay || new Date().toISOString().split('T')[0],
      noticePeriodStatus: data.noticePeriodStatus || 'full',
      initiatedBy: data.initiatedBy || 'user-system',
      initiatedByName: data.initiatedByName || 'System',
      initiatedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      progress: {
        total: 7,
        completed: 0,
        percentage: 0
      },
      caseCreated: new Date().toISOString().split('T')[0],
      caseUpdated: new Date().toISOString().split('T')[0],
      hasOverdueItems: false,
      daysUntilLastDay: 30,
      ...data,
    };
    mockCases.push(newCase);
    return newCase;
  }
};