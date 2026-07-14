// src/features/employees/onboarding/types/index.ts
export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'on-hold';
export type OnboardingStepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';
export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';
export type EquipmentStatus = 'pending' | 'assigned' | 'received' | 'returned';

export interface OnboardingEmployee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  branchId: string;
  branchName: string;
  startDate: string;
  managerId: string;
  managerName: string;
  status: OnboardingStatus;
}

export interface OnboardingStep {
  id: string;
  onboardingId: string;
  name: string;
  description?: string;
  category: 'documentation' | 'equipment' | 'training' | 'hr' | 'it' | 'facilities' | 'finance';
  status: OnboardingStepStatus;
  order: number;
  assignedTo: string;
  assignedToName: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
  required: boolean;
}

export interface OnboardingDocument {
  id: string;
  onboardingId: string;
  employeeId: string;
  documentType: 'id' | 'passport' | 'visa' | 'bank-details' | 'tax-id' | 'degree' | 'certificate' | 'contract' | 'other';
  documentName: string;
  fileName?: string;
  fileUrl?: string;
  status: DocumentStatus;
  uploadDate?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  expiryDate?: string;
  notes?: string;
}

export interface OnboardingEquipment {
  id: string;
  onboardingId: string;
  employeeId: string;
  equipmentType: 'laptop' | 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'phone' | 'access-card' | 'id-badge' | 'other';
  itemName: string;
  serialNumber?: string;
  status: EquipmentStatus;
  assignedDate?: string;
  receivedDate?: string;
  condition?: string;
  notes?: string;
}

export interface OnboardingTask {
  id: string;
  onboardingId: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: 'hr' | 'it' | 'finance' | 'facilities' | 'training' | 'buddy';
  completedDate?: string;
  notes?: string;
}

export interface OnboardingCase {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  branchId: string;
  branchName: string;
  department: string;
  position: string;
  startDate: string;
  managerId: string;
  managerName: string;
  status: OnboardingStatus;
  progress: {
    totalSteps: number;
    completedSteps: number;
    percentage: number;
  };
  caseCreated: string;
  caseUpdated: string;
  dateCompleted?: string;
  hasOverdueTasks: boolean;
  daysUntilStart: number;
  notes?: string;
  tasks?: OnboardingTask[];
  steps?: OnboardingStep[];
  documents?: OnboardingDocument[];
  equipment?: OnboardingEquipment[];
}

export interface OnboardingStats {
  totalCases: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  overdue: number;
  onHold: number;
  byBranch: {
    branchId: string;
    branchName: string;
    total: number;
    inProgress: number;
    completed: number;
  }[];
  byDepartment: {
    department: string;
    count: number;
  }[];
  byStatus: {
    status: OnboardingStatus;
    count: number;
  }[];
  avgTimeToComplete: number;
  monthlyTrend: {
    month: string;
    newHires: number;
    completed: number;
  }[];
}

export interface OnboardingFilter {
  branchId?: string;
  department?: string;
  status?: OnboardingStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

// Helper type for form data
export interface OnboardingFormData {
  employeeId: string;
  startDate: string;
  managerId: string;
  department: string;
  position: string;
  branchId: string;
  notes?: string;
}