export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderRole: string;
  senderName: string;
  dateSent: string;
  deadline?: string;
  isRead: boolean;
}

// ==========================
// Training-related types
// ==========================

export type TrainingType = 'online' | 'in-person';

export type TrainingCategory =
  | 'technical'
  | 'leadership'
  | 'compliance'
  | 'hr'
  | 'sales'
  | 'security'
  | string;

export type TrainingStatus = 'draft' | 'published' | 'in-progress' | 'completed';

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Training {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  category: TrainingCategory;
  status: TrainingStatus;
  level: TrainingLevel;
  duration: number;

  startDate: string;
  endDate: string;
  registrationDeadline: string;

  maxParticipants?: number;
  currentParticipants: number;
  waitlistCount: number;

  // Optional fields used by the training page UI
  branchId?: string | null;
  department?: string | null;
  location?: string;
  onlineLink?: string;

  instructor: string;
  instructorEmail: string;
  objectives: string[];
  tags: string[];
  rating: number;
  reviews: { id: string; userId: string; userName: string; rating: number; comment: string }[];

  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedBy?: string;
  publishedAt?: string;
}

export interface TrainingEnrollment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  department?: string;
  branchId?: string;
  status: 'approved' | 'waitlisted' | 'rejected';
  enrollmentDate: string;
  progress?: number;
}

export interface TrainingFilter {
  category?: TrainingCategory | 'all';
  type?: TrainingType | 'all';
  status?: TrainingStatus | 'all';
  level?: TrainingLevel | 'all';
  branchId?: string;
  searchTerm?: string;
}

export interface TrainingStats {
  totalTrainings: number;
  published: number;
  inProgress: number;
  completed: number;
  totalEnrollments: number;
  averageRating: number;
  byCategory: { category: TrainingCategory; count: number }[];
  byDepartment: { department: string; count: number }[];
  enrollmentTrend: { month: string; enrollments: number }[];
}

