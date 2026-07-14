import type { User, Employee } from '../types';

export const CURRENT_USER: User = {
  id: 'user-001',
  name: 'John Kamau',
  role: 'branch_manager',
  branch: 'Nairobi',
  department: 'Engineering',
  email: 'john.kamau@optimum.com'
};

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-001', name: 'Grace Mwangi', branch: 'Nairobi', department: 'Engineering' },
  { id: 'emp-002', name: 'James Ochieng', branch: 'Nairobi', department: 'Finance' },
  { id: 'emp-003', name: 'Sarah Kiprop', branch: 'Mombasa', department: 'Sales' },
  { id: 'emp-004', name: 'David Odhiambo', branch: 'Kisumu', department: 'HR' },
  { id: 'emp-005', name: 'Alice Wanjiru', branch: 'Nairobi', department: 'Engineering' }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-001',
    title: 'Q3 Performance Reviews',
    body: 'All employees must complete their self-assessment by July 31st.',
    category: 'Compliance',
    audience: { type: 'company' as const, targets: [] },
    priority: 'urgent' as const,
    requiresAck: true,
    postedBy: 'HR Admin',
    postedAt: '2026-07-14T09:00:00',
    expiresAt: '2026-07-31T23:59:59',
    acknowledgedBy: []
  },
  {
    id: 'ann-002',
    title: 'Nairobi Office Relocation',
    body: 'The Nairobi branch will be moving to new premises.',
    category: 'General',
    audience: { type: 'branch' as const, targets: ['Nairobi'] },
    priority: 'normal' as const,
    requiresAck: false,
    postedBy: 'Branch Manager',
    postedAt: '2026-07-13T14:30:00',
    expiresAt: '2026-08-01T17:00:00',
    acknowledgedBy: []
  },
  {
    id: 'ann-003',
    title: 'New Time Tracking System',
    body: 'Starting August 1st, we will use the new time tracking system.',
    category: 'Policy Update',
    audience: { type: 'department' as const, targets: ['Engineering'] },
    priority: 'urgent' as const,
    requiresAck: true,
    postedBy: 'HR Admin',
    postedAt: '2026-07-12T10:00:00',
    expiresAt: '2026-08-15T23:59:59',
    acknowledgedBy: []
  }
];

// Fix the status types to use proper TrainingStatus
export const MOCK_TRAININGS = [
  {
    id: 'train-001',
    title: 'Cybersecurity Awareness',
    description: 'Mandatory training on cybersecurity best practices.',
    category: 'Compliance',
    delivery: 'Self-Paced',
    dateTime: '2026-07-20T10:00:00',
    location: 'Online',
    capacity: 50,
    mandatory: true,
    audience: { type: 'company' as const, targets: [] },
    deadline: '2026-08-15T23:59:59',
    status: {
      'emp-001': 'in_progress' as const,
      'emp-002': 'not_started' as const,
      'emp-003': 'not_started' as const,
      'emp-004': 'completed' as const,
      'emp-005': 'in_progress' as const
    }
  },
  {
    id: 'train-002',
    title: 'Leadership Workshop',
    description: 'One-day workshop on effective leadership.',
    category: 'Leadership',
    delivery: 'In-Person',
    dateTime: '2026-08-05T09:00:00',
    location: 'Conference Room A',
    capacity: 20,
    mandatory: false,
    audience: { type: 'department' as const, targets: ['HR', 'Sales'] },
    deadline: '2026-08-10T17:00:00',
    status: {
      'emp-003': 'not_started' as const,
      'emp-004': 'in_progress' as const
    }
  },
  {
    id: 'train-003',
    title: 'New Hire Onboarding',
    description: 'Welcome! This training covers company culture.',
    category: 'Technical',
    delivery: 'Virtual',
    dateTime: '2026-07-25T14:00:00',
    location: 'Zoom link',
    capacity: 30,
    mandatory: true,
    audience: { type: 'individual' as const, targets: ['emp-005'] },
    deadline: '2026-07-30T23:59:59',
    status: {
      'emp-005': 'not_started' as const
    }
  }
];

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