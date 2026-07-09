// src/features/employees/offboarding/services/offboarding.service.ts
import type { OffboardingCase, OffboardingStats, OffboardingFilter } from '../types';

// Mock data for development
const mockCases: OffboardingCase[] = [
  {
    id: 'off-001',
    employeeId: 'emp-001',
    employeeName: 'Nelly Ntabo',
    employeeEmail: 'nelly.doe@optimum.com',
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
];

export const offboardingService = {
  async getCases(filters: OffboardingFilter): Promise<OffboardingCase[]> {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockCases];
    
    if (filters.branchId) {
      filtered = filtered.filter(c => c.branchId === filters.branchId);
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

  async getStats(filters: OffboardingFilter): Promise<OffboardingStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cases = await this.getCases(filters);
    
    return {
      totalCases: cases.length,
      pending: cases.filter(c => c.status === 'pending').length,
      inProgress: cases.filter(c => c.status === 'in-progress').length,
      completed: cases.filter(c => c.status === 'completed').length,
      overdue: cases.filter(c => c.status === 'overdue').length,
      byBranch: [],
      byExitType: [],
      byDepartment: [],
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
};