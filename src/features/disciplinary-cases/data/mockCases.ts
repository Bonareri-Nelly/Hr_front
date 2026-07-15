import type { DisciplinaryCase, DisciplinaryIncident } from "../types";

export const mockIncidents: DisciplinaryIncident[] = [
  { id: "INC-2026-001", employee: "John Smith", department: "ICT", source: "Employee Complaint", summary: "Workplace harassment concern", reportedOn: "2026-07-02", supervisor: "Mary Wanjiku", outcome: "Escalated to HR", escalatedCaseId: "DC-2026-001" },
  { id: "INC-2026-002", employee: "Jane Wambui", department: "Finance", source: "Attendance Threshold", summary: "Repeated unapproved absences", reportedOn: "2026-07-04", supervisor: "James Otieno", outcome: "Escalated to HR", escalatedCaseId: "DC-2026-002" },
  { id: "INC-2026-003", employee: "Grace Achieng", department: "Operations", source: "Supervisor Report", summary: "Late reporting addressed through coaching", reportedOn: "2026-07-05", supervisor: "Peter Mwangi", outcome: "Resolved Locally", resolutionNote: "Coaching plan agreed and attendance improved." },
  { id: "INC-2026-004", employee: "Alice Njeri", department: "Procurement", source: "Audit Finding", summary: "Potential procurement control breach", reportedOn: "2026-07-07", supervisor: "Grace Kim", outcome: "Escalated to HR", escalatedCaseId: "DC-2026-004" },
  { id: "INC-2026-005", employee: "David Kiptoo", department: "Logistics", source: "Security Report", summary: "Unauthorized access investigation", reportedOn: "2026-07-09", supervisor: "Mary Wanjiku", outcome: "Resolved Locally", resolutionNote: "Access procedure re-issued and matter closed locally." },
];

export const mockCases: DisciplinaryCase[] = [
  {
    id: "DC-2026-001",
    complaintId: "CMP-2026-001",
    incidentId: "INC-2026-001",
    employee: "John Smith",
    department: "ICT",
    complaint: "Workplace Harassment",
    priority: "Major",
    status: "Pending Review",
    nextAction: "Schedule Hearing",
    assignedTo: "HR",
  },

  {
    id: "DC-2026-002",
    complaintId: "CMP-2026-002",
    incidentId: "INC-2026-002",
    employee: "Jane Wambui",
    department: "Finance",
    complaint: "Absenteeism",
    priority: "Minor",
    status: "Hearing Scheduled",
    nextAction: "Conduct Hearing",
    assignedTo: "Department Head",
  },

  {
    id: "DC-2026-003",
    complaintId: "CMP-2026-003",
    incidentId: "INC-2026-003",
    employee: "Peter Mwangi",
    department: "Operations",
    complaint: "Insubordination",
    priority: "Major",
    status: "Hearing In Progress",
    nextAction: "Record Decision",
    assignedTo: "HR",
  },

  {
    id: "DC-2026-004",
    complaintId: "CMP-2026-004",
    incidentId: "INC-2026-004",
    employee: "Alice Njeri",
    department: "Procurement",
    complaint: "Fraud Allegation",
    priority: "Major",
    status: "Appealed",
    nextAction: "Review Appeal",
    assignedTo: "Branch Manager",
  },

  {
    id: "DC-2026-005",
    complaintId: "CMP-2026-005",
    incidentId: "INC-2026-005",
    employee: "David Kiptoo",
    department: "Logistics",
    complaint: "Repeated Misconduct",
    priority: "Minor",
    status: "Closed",
    nextAction: "Case Closed",
    assignedTo: "Department Head",
  },
];
