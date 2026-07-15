export type Employee = {
  id: string;
  name: string;
  department: string;
  gender: "Male" | "Female";
};

export type LeaveTypeKey =
  | "annual"
  | "sick"
  | "maternity"
  | "paternity"
  | "compassionate"
  | "study"
  | "unpaid";

export type LeavePolicySnapshot = {
  requiresSubstitute: boolean;
};

export type ReplacementDecision = "accepted" | "rejected";

export type ReplacementAttempt = {
  attemptNumber: number;
  employeeId: string;
  decision: ReplacementDecision;
  decisionAt: number; // epoch ms
};

export type ReplacementWorkflowState = {
  status:
    | "idle"
    | "replacement_needed"
    | "awaiting_decision"
    | "accepted"
    | "rejected_loop";

  applierDepartment: string;
  attempts: ReplacementAttempt[];
  currentEmployeeId: string | null;
  currentAttemptNumber: number;
};

export type LeaveEntitlements = {
  annual: number;
  sick: number;
  maternity: number | "Eligible";
  paternity: number | "Eligible";
  compassionate: number;
  study: number;
  unpaid: number | "As Required";
};
