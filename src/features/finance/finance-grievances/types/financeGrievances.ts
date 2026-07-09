export interface HrEscalatedComplaint {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  escalatedDate: string;
  hrMessage: string;
  status: 'pending' | 'in progress' | 'completed';
}

export interface GrievanceDashboardData {
  tickets: HrEscalatedComplaint[];
}
