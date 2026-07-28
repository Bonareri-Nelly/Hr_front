import type { User } from '../types';

// Until authentication context is injected into this feature, these values only
// provide UI scope defaults; training and announcement records come from the API.
export const CURRENT_USER: User = { id: '', name: '', role: 'employee', branch: '', department: '', email: '' };

export const AUDIENCE_OPTIONS = [
  { value: 'company', label: 'Company-wide' }, { value: 'branch', label: 'Branch' },
  { value: 'department', label: 'Department' }, { value: 'individual', label: 'Specific Employees' },
];
export const PRIORITY_OPTIONS = [{ value: 'normal', label: 'Normal' }, { value: 'urgent', label: 'Urgent' }];
export const CATEGORY_OPTIONS = ['General', 'Policy Update', 'Holiday', 'Event', 'Compliance', 'Technical', 'Leadership', 'Safety', 'Soft Skills'];
export const DELIVERY_OPTIONS = ['In-Person', 'Virtual', 'Hybrid', 'Self-Paced'];
