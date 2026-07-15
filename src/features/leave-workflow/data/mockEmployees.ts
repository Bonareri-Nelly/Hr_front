import type { Employee } from "../types/leaveWorkflowTypes";

export const mockEmployees: Employee[] = [
  { id: "e-1001", name: "Aisha Khan", department: "Engineering", gender: "Female" },
  { id: "e-1002", name: "Noah Chen", department: "Engineering", gender: "Male" },
  { id: "e-1003", name: "Sophia Patel", department: "Engineering", gender: "Female" },

  { id: "e-2001", name: "Maya Rodriguez", department: "Human Resources", gender: "Female" },
  { id: "e-2002", name: "Ethan Brown", department: "Human Resources", gender: "Male" },

  { id: "e-3001", name: "Chloe Martin", department: "Sales", gender: "Female" },
  { id: "e-3002", name: "Liam Wilson", department: "Sales", gender: "Male" },
];
