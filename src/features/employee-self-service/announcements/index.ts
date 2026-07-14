// src/features/training/announcements/types/index.ts

// Announcement Types
export { default } from './pages/MyAnnouncementsPage';
export { default as MyAnnouncements } from './pages/MyAnnouncementsPage';
export { default as MyAnnouncementsPage } from './pages/MyAnnouncementsPage';
export * from './types';
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AnnouncementStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type AnnouncementCategory = 'company' | 'hr' | 'it' | 'finance' | 'operations' | 'training' | 'general';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  authorId: string;
  authorName: string;
  branchId?: string; // null means all branches
  branchName?: string;
  department?: string; // specific department or null for all
  publishDate?: string;
  expiryDate?: string;
  scheduledDate?: string;
  viewCount: number;
  isPinned: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
  }[];
  targetAudience: {
    roles?: string[];
    departments?: string[];
    branches?: string[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedBy?: string;
  publishedAt?: string;
  comments?: AnnouncementComment[];
}

export interface AnnouncementComment {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Training Types
export type TrainingStatus = 'draft' | 'published' | 'in-progress' | 'completed' | 'cancelled';
export type TrainingType = 'online' | 'in-person' | 'hybrid' | 'self-paced';
export type TrainingCategory = 'technical' | 'soft-skills' | 'leadership' | 'compliance' | 'safety' | 'product' | 'onboarding';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'completed' | 'dropped';

export interface Training {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  category: TrainingCategory;
  status: TrainingStatus;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in hours
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants: number;
  waitlistCount: number;
  location?: string; // for in-person or hybrid
  onlineLink?: string; // for online or hybrid
  instructor: string;
  instructorEmail: string;
  department?: string; // specific department or null for all
  branchId?: string; // specific branch or null for all
  prerequisites?: string[];
  objectives: string[];
  syllabus?: {
    week: number;
    topic: string;
    description: string;
    duration: number;
  }[];
  materials: {
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'video' | 'slide' | 'document' | 'link';
    size?: number;
  }[];
  tags: string[];
  rating: number;
  reviews: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
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
  department: string;
  branchId: string;
  status: EnrollmentStatus;
  enrollmentDate: string;
  completionDate?: string;
  progress?: number; // percentage
  certificateUrl?: string;
  feedback?: {
    rating: number;
    comment: string;
    date: string;
  };
  notes?: string;
}

export interface TrainingStats {
  totalTrainings: number;
  published: number;
  inProgress: number;
  completed: number;
  totalEnrollments: number;
  averageRating: number;
  byCategory: {
    category: TrainingCategory;
    count: number;
  }[];
  byDepartment: {
    department: string;
    count: number;
  }[];
  enrollmentTrend: {
    month: string;
    enrollments: number;
  }[];
}

// Announcement Stats
export interface AnnouncementStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  byCategory: {
    category: AnnouncementCategory;
    count: number;
  }[];
  byPriority: {
    priority: AnnouncementPriority;
    count: number;
  }[];
  totalViews: number;
  averageViews: number;
}

export interface AnnouncementFilter {
  category?: AnnouncementCategory;
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  branchId?: string;
  department?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TrainingFilter {
  category?: TrainingCategory;
  type?: TrainingType;
  status?: TrainingStatus;
  branchId?: string;
  department?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}