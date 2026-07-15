import { ROLES, type UserRole } from "../../../constants/roles";
import {
  WORKFLOW_STAGES,
  type WorkflowStage,
} from "../../../constants/workflowStages";
import {
  LEAVE_STATUS,
  type LeaveStatus,
} from "../../../constants/leaveStatus";



export type WorkflowAction = "Approve" | "Reject";

export interface ApprovalHistory {
  role: UserRole;
  approver: string;
  action: WorkflowAction;
  comment: string;
  date: string;
}

export interface CurrentApprover {
  role: UserRole;
  department?: string;
}




export interface LeaveRequest {
  id: number;
  employee: string;
  department: string;
  employeeRole: UserRole;
  submittedByRole: UserRole;

  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;

  workflowStage: WorkflowStage;

  currentApprover: CurrentApprover;

  approvalHistory: ApprovalHistory[];
}

export function getInitialWorkflow(
  submittedByRole: UserRole,
  department: string
): {
  stage: WorkflowStage;
  approver: CurrentApprover;
} {
  switch (submittedByRole) {
    case ROLES.EMPLOYEE:
      return {
        stage: WORKFLOW_STAGES.PENDING_DEPARTMENT_HEAD_APPROVAL,
        approver: {
          role: ROLES.DEPARTMENT_HEAD,
          department,
        },
      };

    case ROLES.DEPARTMENT_HEAD:
      return {
        stage: WORKFLOW_STAGES.PENDING_BRANCH_MANAGER_APPROVAL,
        approver: {
          role: ROLES.BRANCH_MANAGER,
        },
      };

    case ROLES.HR_OFFICER:
    case ROLES.FINANCE_OFFICER:
      return {
        stage: WORKFLOW_STAGES.PENDING_EXECUTIVE_APPROVAL,
        approver: {
          role: ROLES.EXECUTIVE,
        },
      };

    case ROLES.EXECUTIVE:
      return {
        stage: WORKFLOW_STAGES.PENDING_HR_AUDIT,
        approver: {
          role: ROLES.HR_OFFICER,
        },
      };

    default:
      return {
        stage: WORKFLOW_STAGES.PENDING_DEPARTMENT_HEAD_APPROVAL,
        approver: {
          role: ROLES.DEPARTMENT_HEAD,
          department,
        },
      };
  }
}

export function advanceWorkflow(
  request: LeaveRequest,
  approverName: string,
  comment: string
): LeaveRequest {
  const updatedHistory: ApprovalHistory[] = [
    ...request.approvalHistory,
    {
      role: request.currentApprover.role,
      approver: approverName,
      action: "Approve",
      comment,
      date: new Date().toISOString(),
    },
  ];

  switch (request.workflowStage) {
    // Employee -> Department Head -> HR
    case WORKFLOW_STAGES.PENDING_DEPARTMENT_HEAD_APPROVAL:
      return {
        ...request,
        status: LEAVE_STATUS.PENDING,
        workflowStage: WORKFLOW_STAGES.PENDING_HR_APPROVAL,
        currentApprover: {
          role: ROLES.HR_OFFICER,
        },
        approvalHistory: updatedHistory,
      };

    // HR gives final approval
    case WORKFLOW_STAGES.PENDING_HR_APPROVAL:
      return {
        ...request,
        status: LEAVE_STATUS.APPROVED,
        workflowStage: WORKFLOW_STAGES.APPROVED,
        approvalHistory: updatedHistory,
      };

    // Department Head -> Branch Manager -> HR
    case WORKFLOW_STAGES.PENDING_BRANCH_MANAGER_APPROVAL:
      return {
        ...request,
        status: LEAVE_STATUS.PENDING,
        workflowStage: WORKFLOW_STAGES.PENDING_HR_APPROVAL,
        currentApprover: {
          role: ROLES.HR_OFFICER,
        },
        approvalHistory: updatedHistory,
      };

    // HR / Finance -> Executive
    case WORKFLOW_STAGES.PENDING_EXECUTIVE_APPROVAL:
      return {
        ...request,
        status: LEAVE_STATUS.APPROVED,
        workflowStage: WORKFLOW_STAGES.APPROVED,
        approvalHistory: updatedHistory,
      };

    // Executive -> HR Audit
    case WORKFLOW_STAGES.PENDING_HR_AUDIT:
      return {
        ...request,
        status: LEAVE_STATUS.AUDITED,
        workflowStage: WORKFLOW_STAGES.AUDITED,
        approvalHistory: updatedHistory,
      };

    default:
      return request;
  }
}
export function rejectWorkflow(
  request: LeaveRequest,
  approverName: string,
  comment: string
): LeaveRequest {
  const updatedHistory: ApprovalHistory[] = [
    ...request.approvalHistory,
    {
      role: request.currentApprover.role,
      approver: approverName,
      action: "Reject",
      comment,
      date: new Date().toISOString(),
    },
  ];

  return {
    ...request,
    status: LEAVE_STATUS.REJECTED,
    workflowStage: WORKFLOW_STAGES.REJECTED,

    // Nobody owns the request anymore
    currentApprover: {
      role: request.currentApprover.role,
    },

    approvalHistory: updatedHistory,
  };
}