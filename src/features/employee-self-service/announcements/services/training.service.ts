import { apiClient } from '@/services/api/client';
import type { Training, TrainingStats, TrainingFilter, TrainingEnrollment, TrainingStatus, TrainingCategory } from '../types/announcements';

const list = (data: any) => Array.isArray(data) ? data : data?.results ?? [];
const statusMap: Record<string, TrainingStatus> = { SCHEDULED: 'published', ONGOING: 'in-progress', COMPLETED: 'completed', CANCELLED: 'draft' };
const toTraining = (record: any): Training => ({
  id: String(record.id), title: record.title, description: record.description || '', type: record.location ? 'in-person' : 'online',
  category: 'technical', status: statusMap[record.status] || 'draft', level: 'beginner', duration: Math.max(0, Math.ceil((new Date(record.end_date).getTime() - new Date(record.start_date).getTime()) / 36e5)),
  startDate: record.start_date, endDate: record.end_date, registrationDeadline: record.start_date,
  currentParticipants: record.enrolled_count || 0, waitlistCount: 0, location: record.location || undefined,
  instructor: record.trainer_name || '', instructorEmail: '', objectives: [], tags: [], rating: 0, reviews: [],
  createdBy: String(record.created_by || ''), createdAt: record.created_at || '', updatedAt: record.created_at || '',
});
const toApiStatus = (status?: TrainingStatus) => ({ published: 'SCHEDULED', 'in-progress': 'ONGOING', completed: 'COMPLETED', draft: 'CANCELLED' }[status || 'draft']);

export const trainingService = {
  async getTrainings(filters: TrainingFilter = {}): Promise<Training[]> {
    const { data } = await apiClient.get('/hr-operations/trainings/', { params: filters.status && filters.status !== 'all' ? { status: toApiStatus(filters.status) } : {} });
    return list(data).map(toTraining).filter((training: Training) =>
      (!filters.searchTerm || `${training.title} ${training.description}`.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.category || filters.category === 'all' || training.category === filters.category) &&
      (!filters.type || filters.type === 'all' || training.type === filters.type) &&
      (!filters.level || filters.level === 'all' || training.level === filters.level)
    );
  },
  async getStats(filters: TrainingFilter = {}): Promise<TrainingStats> {
    const trainings = await this.getTrainings(filters);
    return {
      totalTrainings: trainings.length, published: trainings.filter((item) => item.status === 'published').length,
      inProgress: trainings.filter((item) => item.status === 'in-progress').length, completed: trainings.filter((item) => item.status === 'completed').length,
      totalEnrollments: trainings.reduce((total, item) => total + item.currentParticipants, 0), averageRating: 0,
      byCategory: trainings.reduce((groups: { category: TrainingCategory; count: number }[], item) => { const found = groups.find((group) => group.category === item.category); found ? found.count++ : groups.push({ category: item.category, count: 1 }); return groups; }, []),
      byDepartment: [], enrollmentTrend: [],
    };
  },
  async getTraining(id: string): Promise<Training> { return toTraining((await apiClient.get(`/hr-operations/trainings/${id}/`)).data); },
  async createTraining(data: Partial<Training>): Promise<Training> {
    return toTraining((await apiClient.post('/hr-operations/trainings/', { title: data.title || '', description: data.description || '', trainer_name: data.instructor || '', start_date: data.startDate, end_date: data.endDate, location: data.location || '', is_mandatory: false, status: toApiStatus(data.status) })).data);
  },
  async updateTraining(id: string, data: Partial<Training>): Promise<Training> {
    return toTraining((await apiClient.patch(`/hr-operations/trainings/${id}/`, { title: data.title, description: data.description, trainer_name: data.instructor, start_date: data.startDate, end_date: data.endDate, location: data.location, status: data.status ? toApiStatus(data.status) : undefined })).data);
  },
  async deleteTraining(id: string): Promise<void> { await apiClient.delete(`/hr-operations/trainings/${id}/`); },
  async enrollInTraining(trainingId: string, userId: string): Promise<TrainingEnrollment> {
    const { data } = await apiClient.post(`/hr-operations/trainings/${trainingId}/enroll/`, { employee: Number(userId) });
    return { id: String(data.id), trainingId: String(data.training), trainingTitle: '', userId: String(data.employee), userName: data.employee_name || '', userEmail: '', status: data.status === 'ENROLLED' ? 'approved' : 'rejected', enrollmentDate: data.enrolled_at, progress: 0 };
  },
};

export default trainingService;
