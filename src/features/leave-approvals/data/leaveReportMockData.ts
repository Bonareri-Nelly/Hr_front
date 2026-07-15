export type LeaveReportRecord = {
  id: number; employee: string; department: string; branch: string; position: string; employmentType: string;
  leaveType: string; status: "Pending" | "Approved" | "Rejected" | "Cancelled"; approvalStage: string;
  startDate: string; endDate: string; days: number; gender: "Male" | "Female"; manager: string;
  dateApplied: string; dateApproved: string | null; approver: string;
};

export const leaveReportRecords: LeaveReportRecord[] = [
  { id: 1, employee: "Jane Smith", department: "ICT", branch: "Nairobi", position: "Developer", employmentType: "Permanent", leaveType: "Annual Leave", status: "Approved", approvalStage: "Completed", startDate: "2026-07-10", endDate: "2026-07-14", days: 5, gender: "Female", manager: "Mary Wanjiku", dateApplied: "2026-06-20", dateApproved: "2026-06-23", approver: "Mary Wanjiku" },
  { id: 2, employee: "Peter Mwangi", department: "ICT", branch: "Nairobi", position: "Support Analyst", employmentType: "Permanent", leaveType: "Sick Leave", status: "Pending", approvalStage: "Department Head", startDate: "2026-07-20", endDate: "2026-07-22", days: 3, gender: "Male", manager: "Mary Wanjiku", dateApplied: "2026-07-12", dateApproved: null, approver: "Mary Wanjiku" },
  { id: 3, employee: "Aisha Khan", department: "Finance", branch: "Mombasa", position: "Accountant", employmentType: "Contract", leaveType: "Maternity Leave", status: "Approved", approvalStage: "Completed", startDate: "2026-07-01", endDate: "2026-09-28", days: 90, gender: "Female", manager: "James Otieno", dateApplied: "2026-05-18", dateApproved: "2026-05-25", approver: "HR Officer" },
  { id: 4, employee: "Noah Chen", department: "Operations", branch: "Nairobi", position: "Coordinator", employmentType: "Permanent", leaveType: "Compassionate Leave", status: "Rejected", approvalStage: "Completed", startDate: "2026-07-18", endDate: "2026-07-20", days: 3, gender: "Male", manager: "Grace Kim", dateApplied: "2026-07-10", dateApproved: "2026-07-11", approver: "Grace Kim" },
];
