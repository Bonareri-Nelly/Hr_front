// src/features/employees/offboarding/services/offboarding.service.ts
// Complete updated file with all fixes

import type { OffboardingCase, OffboardingStats, OffboardingFilter, UploadedFile, ExitType } from '../types';

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
    attachments: [
      {
        id: 'file-001',
        name: 'resignation_letter.pdf',
        size: 245000,
        type: 'application/pdf',
        url: '/uploads/resignation_letter.pdf',
        uploadDate: '2024-11-15'
      }
    ]
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
    attachments: [
      {
        id: 'file-002',
        name: 'termination_letter.pdf',
        size: 180000,
        type: 'application/pdf',
        url: '/uploads/termination_letter.pdf',
        uploadDate: '2024-11-10'
      },
      {
        id: 'file-003',
        name: 'exit_interview.csv',
        size: 12000,
        type: 'text/csv',
        url: '/uploads/exit_interview.csv',
        uploadDate: '2024-11-25'
      }
    ]
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
    attachments: []
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
    attachments: [
      {
        id: 'file-004',
        name: 'retirement_notice.pdf',
        size: 95000,
        type: 'application/pdf',
        url: '/uploads/retirement_notice.pdf',
        uploadDate: '2024-10-01'
      }
    ]
  },
];

// Mock employees data for search
const mockEmployees = [
  { id: 'emp-001', name: 'Jane Doe', email: 'jane.doe@optimum.com', department: 'Engineering', position: 'Senior Software Engineer', branchId: 'branch-1', branchName: 'Headquarters' },
  { id: 'emp-002', name: 'John Smith', email: 'john.smith@optimum.com', department: 'Sales', position: 'Sales Manager', branchId: 'branch-2', branchName: 'North Region' },
  { id: 'emp-003', name: 'Mary Johnson', email: 'mary.johnson@optimum.com', department: 'Marketing', position: 'Marketing Specialist', branchId: 'branch-3', branchName: 'South Region' },
  { id: 'emp-004', name: 'Robert Wilson', email: 'robert.wilson@optimum.com', department: 'Finance', position: 'Accountant', branchId: 'branch-4', branchName: 'East Region' },
  { id: 'emp-005', name: 'Sarah Brown', email: 'sarah.brown@optimum.com', department: 'Human Resources', position: 'HR Manager', branchId: 'branch-1', branchName: 'Headquarters' },
  { id: 'emp-006', name: 'Michael Davis', email: 'michael.davis@optimum.com', department: 'IT', position: 'IT Support Specialist', branchId: 'branch-5', branchName: 'West Region' },
  { id: 'emp-007', name: 'Emily Wilson', email: 'emily.wilson@optimum.com', department: 'Operations', position: 'Operations Manager', branchId: 'branch-2', branchName: 'North Region' },
];

export const offboardingService = {
  async getCases(filters: OffboardingFilter = {}): Promise<OffboardingCase[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockCases];
    
    // Branch filter
    if (filters.branchId && filters.branchId !== 'all') {
      filtered = filtered.filter(c => c.branchId === filters.branchId);
    }
    
    // Status filter - FIXED: remove the !== 'all' check since status is an enum
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    // Department filter
    if (filters.department) {
      filtered = filtered.filter(c => c.department === filters.department);
    }
    
    // Exit type filter
    if (filters.exitType) {
      filtered = filtered.filter(c => c.exitType === filters.exitType);
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.employeeName.toLowerCase().includes(term) ||
        c.department.toLowerCase().includes(term) ||
        c.position.toLowerCase().includes(term) ||
        c.employeeEmail.toLowerCase().includes(term)
      );
    }
    
    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(c => c.caseCreated >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => c.caseCreated <= filters.dateTo!);
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

    // FIXED: Cast exitType to the correct type
    const byExitType = cases.reduce((acc, c) => {
      const existing = acc.find(e => e.exitType === c.exitType);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ exitType: c.exitType as ExitType, count: 1 });
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

    // Calculate monthly trend
    const monthlyTrend = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7);
      const monthCases = cases.filter(c => c.caseCreated.startsWith(monthStr));
      monthlyTrend.push({
        month: monthStr,
        resignations: monthCases.filter(c => c.exitType === 'resignation').length,
        terminations: monthCases.filter(c => c.exitType === 'termination').length,
        others: monthCases.filter(c => c.exitType !== 'resignation' && c.exitType !== 'termination').length,
      });
    }

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
      monthlyTrend,
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
    mockCases[caseIndex] = { 
      ...mockCases[caseIndex], 
      ...updates,
      caseUpdated: new Date().toISOString().split('T')[0]
    };
    return mockCases[caseIndex];
  },

  // FIXED: Updated to match the expected parameter type
  async initiateOffboarding(data: {
    employee: {
      id: string;
      name: string;
      email: string;
      department: string;
      position: string;
      branchId: string;
      branchName: string;
    };
    exitType: string;
    reason: string;
    lastWorkingDay: string;
    attachments?: UploadedFile[];
  }): Promise<OffboardingCase> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCase: OffboardingCase = {
      id: `off-${Date.now()}`,
      employeeId: data.employee.id,
      employeeName: data.employee.name,
      employeeEmail: data.employee.email,
      branchId: data.employee.branchId,
      branchName: data.employee.branchName,
      department: data.employee.department,
      position: data.employee.position,
      exitType: data.exitType as ExitType,
      reason: data.reason,
      lastWorkingDay: data.lastWorkingDay,
      noticePeriodStatus: 'full',
      initiatedBy: 'user-system',
      initiatedByName: 'System',
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
      attachments: data.attachments || [],
    };
    
    mockCases.push(newCase);
    return newCase;
  },

  async searchEmployees(query: string): Promise<typeof mockEmployees> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return mockEmployees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.id.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm)
    );
  },

  async getEmployees(): Promise<typeof mockEmployees> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEmployees;
  },

  async uploadFile(caseId: string, file: File): Promise<UploadedFile> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const uploadedFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    
    const caseIndex = mockCases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
      if (!mockCases[caseIndex].attachments) {
        mockCases[caseIndex].attachments = [];
      }
      mockCases[caseIndex].attachments!.push(uploadedFile);
      mockCases[caseIndex].caseUpdated = new Date().toISOString().split('T')[0];
    }
    
    return uploadedFile;
  },

  async deleteFile(caseId: string, fileId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const caseIndex = mockCases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1 && mockCases[caseIndex].attachments) {
      mockCases[caseIndex].attachments = mockCases[caseIndex].attachments!.filter(
        f => f.id !== fileId
      );
      mockCases[caseIndex].caseUpdated = new Date().toISOString().split('T')[0];
    }
  },

  async downloadFile(fileId: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const content = 'This is a mock file content for demonstration purposes.';
    const blob = new Blob([content], { type: 'text/plain' });
    return blob;
  },

  async generateReport(caseId: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const caseItem = await this.getCaseDetails(caseId);
    const reportContent = `
OFFBOARDING REPORT
==================
Case ID: ${caseItem.id}
Employee: ${caseItem.employeeName}
Department: ${caseItem.department}
Position: ${caseItem.position}
Exit Type: ${caseItem.exitType}
Reason: ${caseItem.reason}
Last Working Day: ${caseItem.lastWorkingDay}
Status: ${caseItem.status}
Initiated By: ${caseItem.initiatedByName}
Initiated Date: ${caseItem.initiatedDate}
Progress: ${caseItem.progress.completed}/${caseItem.progress.total} (${caseItem.progress.percentage}%)

Attachments:
${caseItem.attachments?.map(a => `- ${a.name} (${(a.size / 1024).toFixed(1)} KB)`).join('\n') || 'None'}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    return blob;
  },

  async getChecklist(caseId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checklist = [
      { id: 'check-1', item: 'Knowledge Transfer & Handover', status: 'in-progress', owner: 'John Manager', dueDate: '2024-12-10' },
      { id: 'check-2', item: 'Company Laptop Return', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-14' },
      { id: 'check-3', item: 'System Access Revocation', status: 'completed', owner: 'System Admin', dueDate: '2024-12-15' },
      { id: 'check-4', item: 'Final Settlement Calculation', status: 'pending', owner: 'Finance', dueDate: '2024-12-12' },
      { id: 'check-5', item: 'Exit Interview Completion', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-13' },
    ];
    
    return checklist;
  },

  async updateChecklistItem(caseId: string, itemId: string, status: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updated checklist item ${itemId} to ${status} for case ${caseId}`);
  }
};

export default offboardingService;