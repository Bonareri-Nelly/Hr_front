export type UserRole = 
  | 'employee' 
  | 'department_head' 
  | 'branch_manager' 
  | 'branch_hr_admin' 
  | 'finance' 
  | 'system_admin' 
  | 'executive';

export type AudienceType = 'company' | 'branch' | 'department' | 'individual';
export type Priority = 'normal' | 'urgent';
export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  branch: string;
  department: string;
  email?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  audience: {
    type: AudienceType;
    targets: string[];
  };
  priority: Priority;
  requiresAck: boolean;
  postedBy: string;
  postedAt: string;
  expiresAt: string | null;
  acknowledgedBy: string[];
}

export interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  delivery: string;
  dateTime: string | null;
  location: string | null;
  capacity: number | null;
  mandatory: boolean;
  audience: {
    type: AudienceType;
    targets: string[];
  };
  deadline: string | null;
  status: Record<string, TrainingStatus>;
}

export interface Employee {
  id: string;
  name: string;
  branch: string;
  department: string;
  email?: string;
}

export interface ComplianceData {
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  completed: number;
  totalRequired: number;
  percentage: number;
}

export interface AnnouncementFormData {
  title: string;
  body: string;
  category: string;
  audience: AudienceType;
  targets: string[];
  priority: Priority;
  requiresAck: boolean;
  expiry: string | null;
}

export interface TrainingFormData {
  title: string;
  description: string;
  category: string;
  delivery: string;
  dateTime: string | null;
  location: string | null;
  capacity: number | null;
  mandatory: boolean;
  audience: AudienceType;
  targets: string[];
  deadline: string | null;
}