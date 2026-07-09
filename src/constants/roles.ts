export const ROLES = {
  EMPLOYEE: "Employee",
  DEPARTMENT_HEAD: "Department Head",
  BRANCH_MANAGER: "Branch Manager",
  HR_OFFICER: "HR Officer",
  FINANCE_OFFICER: "Finance Officer",
  EXECUTIVE: "Executive",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];