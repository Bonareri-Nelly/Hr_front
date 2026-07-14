export * from './announcements';

export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type TrainingCategory = 'Technical' | 'Compliance' | 'Leadership' | 'Safety' | 'Soft Skills';
export type TrainingType = 'mandatory' | 'optional';

export interface Training {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  type: TrainingType;
  delivery: 'In-Person' | 'Virtual' | 'Hybrid' | 'Self-Paced';
  dateTime: string | null;
  location: string | null;
  capacity: number | null;
  enrolled: number;
  status: TrainingStatus;
  progress: number;
  deadline: string | null;
  audience: {
    type: 'company' | 'branch' | 'department' | 'individual';
    targets: string[];
  };
}

export interface TrainingStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
}

export interface TrainingFilter {
  status?: TrainingStatus;
  category?: TrainingCategory;
  type?: TrainingType;
  search?: string;
}

export interface TrainingEnrollment {
  id: string;
  trainingId: string;
  employeeId: string;
  enrolledAt: string;
  status: TrainingStatus;
  completedAt?: string;
}