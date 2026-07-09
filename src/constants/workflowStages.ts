export const WORKFLOW_STAGES = {
  PENDING_DEPARTMENT_HEAD_APPROVAL: "Pending Department Head Approval",
  PENDING_BRANCH_MANAGER_APPROVAL: "Pending Branch Manager Approval",
  PENDING_EXECUTIVE_APPROVAL: "Pending Executive Approval",
  PENDING_HR_APPROVAL: "Pending HR Approval",
  PENDING_HR_AUDIT: "Pending HR Audit",

  APPROVED: "Approved",
  REJECTED: "Rejected",
  AUDITED: "Audit",
} as const;

export type WorkflowStage =
  typeof WORKFLOW_STAGES[keyof typeof WORKFLOW_STAGES];