// src/features/training/announcements/services/training.service.ts
import type {
  Training,
  TrainingStats,
  TrainingFilter,
  TrainingEnrollment,
  TrainingStatus,
  TrainingCategory,
  TrainingType
} from '../types/announcements';

// Mock data
const mockTrainings: Training[] = [
  {
    id: 'tr-001',
    title: 'Advanced React Development',
    description: 'Deep dive into React hooks, state management, and performance optimization.',
    type: 'online',
    category: 'technical',
    status: 'published',
    level: 'advanced',
    duration: 20,
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    registrationDeadline: '2025-01-10',
    maxParticipants: 30,
    currentParticipants: 24,
    waitlistCount: 5,
    onlineLink: 'https://zoom.us/meeting/123',
    instructor: 'John Doe',
    instructorEmail: 'john.doe@optimum.com',
    objectives: [
      'Understand advanced React patterns',
      'Implement performance optimizations',
      'Build complex state management solutions'
    ],
    tags: ['react', 'frontend', 'advanced'],
    rating: 4.8,
    reviews: [],
    createdBy: 'user-001',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-10',
    publishedBy: 'user-001',
    publishedAt: '2024-12-10',
  },
  {
    id: 'tr-002',
    title: 'Leadership Essentials',
    description: 'Essential leadership skills for new and aspiring managers.',
    type: 'in-person',
    category: 'leadership',
    status: 'published',
    level: 'intermediate',
    duration: 16,
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    registrationDeadline: '2025-01-25',
    maxParticipants: 20,
    currentParticipants: 12,
    waitlistCount: 2,
    location: 'HQ Training Room B',
    instructor: 'Sarah Johnson',
    instructorEmail: 'sarah.johnson@optimum.com',
    objectives: [
      'Develop leadership mindset',
      'Build effective teams',
      'Communicate with impact'
    ],
    tags: ['leadership', 'management', 'soft-skills'],
    rating: 4.5,
    reviews: [],
    createdBy: 'user-002',
    createdAt: '2024-11-15',
    updatedAt: '2024-12-05',
    publishedBy: 'user-002',
    publishedAt: '2024-12-05',
  },
];

export const trainingService = {
  async getTrainings(filters: TrainingFilter = {}): Promise<Training[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...mockTrainings];
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.level) {
      filtered = filtered.filter(t => t.level === filters.level);
    }
    if (filters.branchId && filters.branchId !== 'all') {
      filtered = filtered.filter(t => t.branchId === filters.branchId || t.branchId === null);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  },

  async getStats(filters: TrainingFilter = {}): Promise<TrainingStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const trainings = await this.getTrainings(filters);
    
    return {
      totalTrainings: trainings.length,
      published: trainings.filter(t => t.status === 'published').length,
      inProgress: trainings.filter(t => t.status === 'in-progress').length,
      completed: trainings.filter(t => t.status === 'completed').length,
      totalEnrollments: trainings.reduce((sum, t) => sum + t.currentParticipants, 0),
      averageRating: trainings.length > 0 ? 
        trainings.reduce((sum, t) => sum + t.rating, 0) / trainings.length : 0,
      byCategory: trainings.reduce(
        (acc: { category: TrainingCategory; count: number }[], t) => {
          const existing = acc.find((c) => c.category === t.category);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ category: t.category, count: 1 });
          }
          return acc;
        },
        [] as { category: TrainingCategory; count: number }[]
      ),
      byDepartment: trainings.reduce((acc: { department: string; count: number }[], t) => {
        const dept = t.department || 'All';
        const existing = acc.find((d) => d.department === dept);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ department: dept, count: 1 });
        }
        return acc;
      }, [] as { department: string; count: number; }[]),
      enrollmentTrend: [],
    };
  },

  async getTraining(id: string): Promise<Training> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const training = mockTrainings.find(t => t.id === id);
    if (!training) {
      throw new Error('Training not found');
    }
    return training;
  },

  async createTraining(data: Partial<Training>): Promise<Training> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTraining: Training = {
      id: `tr-${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      type: data.type || 'online',
      category: data.category || 'technical',
      status: data.status || 'draft',
      level: data.level || 'beginner',
      duration: data.duration || 0,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      registrationDeadline: data.registrationDeadline || new Date().toISOString().split('T')[0],
      currentParticipants: 0,
      waitlistCount: 0,
      instructor: data.instructor || '',
      instructorEmail: data.instructorEmail || '',
      objectives: data.objectives || [],
      tags: data.tags || [],
      rating: 0,
      reviews: [],
      createdBy: data.createdBy || 'user-system',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    };
    mockTrainings.unshift(newTraining);
    return newTraining;
  },

  async updateTraining(id: string, data: Partial<Training>): Promise<Training> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    mockTrainings[index] = {
      ...mockTrainings[index],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return mockTrainings[index];
  },

  async deleteTraining(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    mockTrainings.splice(index, 1);
  },

  async enrollInTraining(trainingId: string, userId: string): Promise<TrainingEnrollment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const training = await this.getTraining(trainingId);
    
    if (training.currentParticipants >= (training.maxParticipants || Infinity)) {
      training.waitlistCount += 1;
      return {
        id: `enr-${Date.now()}`,
        trainingId,
        trainingTitle: training.title,
        userId,
        userName: 'John Employee',
        userEmail: 'john@optimum.com',
        department: 'Engineering',
        branchId: 'branch-1',
        status: 'waitlisted',
        enrollmentDate: new Date().toISOString().split('T')[0],
      };
    }
    
    training.currentParticipants += 1;
    return {
      id: `enr-${Date.now()}`,
      trainingId,
      trainingTitle: training.title,
      userId,
      userName: 'John Employee',
      userEmail: 'john@optimum.com',
      department: 'Engineering',
      branchId: 'branch-1',
      status: 'approved',
      enrollmentDate: new Date().toISOString().split('T')[0],
      progress: 0,
    };
  }
};

export default trainingService;