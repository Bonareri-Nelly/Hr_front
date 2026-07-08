export const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  AUDITED: "Audited",
} as const;

export type LeaveStatus =
  typeof LEAVE_STATUS[keyof typeof LEAVE_STATUS];