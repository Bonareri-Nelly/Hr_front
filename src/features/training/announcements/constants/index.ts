import type { User, Employee } from '../types';

export const CURRENT_USER: User = {
  id: 'user-001',
  name: 'John Kamau',
  role: 'branch_manager',
  branch: 'Nairobi',
  department: 'Engineering',
  email: 'john.kamau@optimum.com'
};

// No mock data; features should query backend or show empty states
export const MOCK_EMPLOYEES: Employee[] = [];

export const MOCK_ANNOUNCEMENTS: any[] = [];

// Fix the status types to use proper TrainingStatus
export const MOCK_TRAININGS: any[] = [];

export const AUDIENCE_OPTIONS = [
  { value: 'company', label: 'Company-wide' },
  { value: 'branch', label: 'Branch' },
  { value: 'department', label: 'Department' },
  { value: 'individual', label: 'Specific Employees' }
];

export const PRIORITY_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' }
];

export const CATEGORY_OPTIONS = [
  'General',
  'Policy Update',
  'Holiday',
  'Event',
  'Compliance',
  'Technical',
  'Leadership',
  'Safety',
  'Soft Skills'
];

export const DELIVERY_OPTIONS = [
  'In-Person',
  'Virtual',
  'Hybrid',
  'Self-Paced'
];