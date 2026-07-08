export interface BudgetVarianceRow {
  category: string;
  allocated: number;
  actualSpend: number;
  variance: number;
  status: 'under' | 'over' | 'balanced';
}

export interface ProviderInvoiceRow {
  id: string;
  provider: string;
  benefitCovered: string;
  amountDue: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  reconciliationMismatch: boolean;
  enrollmentDiffText?: string;
}

export interface BenefitsCostData {
  budgets: BudgetVarianceRow[];
  invoices: ProviderInvoiceRow[];
  projectedGrowth: number;
  projectedCostIncrease: number;
}
