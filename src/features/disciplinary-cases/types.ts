export interface DisciplinaryCase {
  id: string;
  complaintId: string;
  incidentId: string;

  employee: string;
  department: string;

  complaint: string;

  priority: "Major" | "Minor";

  status:
    | "Pending Review"
    | "Hearing Scheduled"
    | "Hearing In Progress"
    | "Decision Issued"
    | "Appealed"
    | "Appeal Decided"
    | "Closed";

  nextAction:
    | "Schedule Hearing"
    | "Conduct Hearing"
    | "Record Decision"
    | "Review Appeal"
    | "Case Closed";

  assignedTo:
    | "Department Head"
    | "HR"
    | "Branch Manager";

    hearing?: Hearing;
}

export interface Hearing {
  date: string;

  time: string;

  venue: string;

  platform: "Physical" | "Microsoft Teams" | "Google Meet" | "Zoom";

  status:
    | "Scheduled"
    | "Rescheduled"
    | "In Progress"
    | "Completed";

  notes: string;

  rescheduleHistory: HearingReschedule[];
}

export interface HearingReschedule {
  previousDate: string;

  previousTime: string;

  newDate: string;

  newTime: string;

  reason: string;

  changedBy: string;

  changedOn: string;
}

export type IncidentSource = "Attendance Threshold" | "Employee Complaint" | "Supervisor Report" | "Management Report" | "Security Report" | "Audit Finding";
export type IncidentOutcome = "Under Supervisor Review" | "Resolved Locally" | "Escalated to HR";
export interface DisciplinaryIncident { id: string; employee: string; department: string; source: IncidentSource; summary: string; reportedOn: string; supervisor: string; outcome: IncidentOutcome; resolutionNote?: string; escalatedCaseId?: string; }
