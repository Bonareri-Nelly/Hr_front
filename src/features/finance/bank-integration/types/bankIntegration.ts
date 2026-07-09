export interface VerificationError {
  employeeId: string;
  name: string;
  issue: 'missing account' | 'missing bank' | 'invalid length';
}

export interface BankFileHistoryItem {
  id: string;
  batchRef: string;
  dateGenerated: string;
  generatedBy: string;
  totalAmount: number;
  status: 'pending' | 'sent' | 'confirmed' | 'failed';
  discrepancy: boolean;
}

export interface BankPaymentPreview {
  employeeName: string;
  maskedAccount: string;
  bankName: string;
  amount: number;
  reference: string;
}
