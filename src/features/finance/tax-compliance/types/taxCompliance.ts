export interface DeductionConfigRow {
  name: string;
  method: string;
  employerContribution: string;
  frequency: string;
  deadlineRule: string;
}

export interface ComplianceFilingObligation {
  id: string;
  deductionType: string;
  period: string;
  daysRemaining: number;
  status: 'Not Started' | 'In Progress' | 'Filed' | 'Overdue';
  proofFile?: string;
}

export interface MissingIdentifierError {
  employeeId: string;
  name: string;
  missingField: string;
}

export interface TaxComplianceDashboardData {
  config: DeductionConfigRow[];
  obligations: ComplianceFilingObligation[];
  errors: MissingIdentifierError[];
}
