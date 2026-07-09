export interface CompLineItem {
  label: string;
  value: number;
}

export interface SalaryChangeLog {
  date: string;
  previous: number;
  updated: number;
  approvedBy: string;
}

export interface BankDisbursementRecord {
  period: string;
  runRef: string;
  status: 'confirmed' | 'failed' | 'processing';
  amount: number;
  reason?: string;
}

export interface InternalFinanceNote {
  timestamp: string;
  author: string;
  text: string;
}

export interface FullFinancialProfile {
  summary: {
    name: string;
    id: string;
    branch: string;
    department: string;
    grade: string;
    status: string;
    grossSalary: number;
  };
  breakdown: {
    basic: number;
    allowances: CompLineItem[];
    deductions: CompLineItem[];
  };
  identifiers: {
    taxPin: string;
    nssf: string;
    shif: string;
    isComplete: boolean;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
  };
  history: SalaryChangeLog[];
  disbursements: BankDisbursementRecord[];
  notes: InternalFinanceNote[];
}
