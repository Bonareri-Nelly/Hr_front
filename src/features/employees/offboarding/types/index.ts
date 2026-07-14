// src/features/employees/offboarding/types/index.ts
export type ExitType = 'resignation' | 'termination' | 'end-of-contract' | 'retirement';
export type OffboardingStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
export type ChecklistItemStatus = 'pending' | 'in-progress' | 'completed' | 'waived';
export type AssetCondition = 'good' | 'fair' | 'poor' | 'damaged' | 'missing';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  branchId: string;
  branchName: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
}

export interface OffboardingCase {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  branchId: string;
  branchName: string;
  department: string;
  position: string;
  exitType: ExitType;
  reason: string;
  reasonCategory?: string;
  lastWorkingDay: string;
  noticePeriodStatus: 'full' | 'partial' | 'waived' | 'shortfall';
  initiatedBy: string;
  initiatedByName: string;
  initiatedDate: string;
  status: OffboardingStatus;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
  caseCreated: string;
  caseUpdated: string;
  dateCompleted?: string;
  hasOverdueItems: boolean;
  daysUntilLastDay: number;
  notes?: string;
  attachments?: UploadedFile[];
}

export interface ChecklistItem {
  id: string;
  caseId: string;
  category: 'handover' | 'assets' | 'it-access' | 'finance' | 'statutory' | 'exit-interview' | 'documentation';
  item: string;
  description?: string;
  status: ChecklistItemStatus;
  owner: string;
  ownerName: string;
  ownerRole: 'manager' | 'hr-admin' | 'finance' | 'system-admin' | 'employee';
  dueDate?: string;
  completedDate?: string;
  notes?: string;
  required: boolean;
  order: number;
}

export interface FinalSettlement {
  id: string;
  caseId: string;
  employeeId: string;
  proRatedSalary: number;
  leaveEncashment: number;
  pendingReimbursements: number;
  otherEarnings: number;
  totalEarnings: number;
  loanDeductions: number;
  assetNonReturnDeduction: number;
  noticePeriodShortfall: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  finalPAYE: number;
  finalNSSF: number;
  finalNHIF: number;
  finalHousingLevy: number;
  status: 'draft' | 'pending-review' | 'approved' | 'rejected' | 'paid';
  reviewedBy?: string;
  reviewedByName?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExitInterview {
  id: string;
  caseId: string;
  employeeId: string;
  primaryReason: string;
  secondaryReasons?: string[];
  feedback: {
    category: string;
    rating: number;
    comments?: string;
  }[];
  overallRating: number;
  wouldRecommend: 'yes' | 'no' | 'maybe';
  additionalComments?: string;
  suggestionsForImprovement?: string;
  submittedBy: 'employee' | 'hr-admin';
  submittedDate: string;
  isConfidential: boolean;
}

export interface OffboardingStats {
  totalCases: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byBranch: {
    branchId: string;
    branchName: string;
    total: number;
    pending: number;
    completed: number;
  }[];
  byExitType: {
    exitType: ExitType;
    count: number;
  }[];
  byDepartment: {
    department: string;
    count: number;
  }[];
  avgTimeToComplete: number;
  monthlyTrend: {
    month: string;
    resignations: number;
    terminations: number;
    others: number;
  }[];
}

export interface OffboardingFilter {
  branchId?: string;
  department?: string;
  exitType?: ExitType;
  status?: OffboardingStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}