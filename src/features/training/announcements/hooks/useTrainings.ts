// ==========================================
// HOOK: useTrainings
// ==========================================

import { useState, useCallback, useEffect } from 'react';
import { CURRENT_USER } from '../constants';
import { Training, TrainingFormData, TrainingStatus } from '../types';
import { apiClient } from '@/services/api/client';

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Array<{ id: string; name: string; branch: string; department: string }>>([]);

  const mapTraining = (item: any): Training => ({ id: String(item.id), title: item.title, description: item.description || '', category: 'general', delivery: item.location ? 'in_person' : 'online', dateTime: item.start_date || null, location: item.location || null, capacity: null, mandatory: Boolean(item.is_mandatory), audience: { type: 'company', targets: [] }, deadline: item.end_date || null, status: Object.fromEntries((item.enrollments || []).map((enrollment: any) => [String(enrollment.employee), enrollment.status === 'ATTENDED' ? 'completed' : 'not_started'])) });

  useEffect(() => {
    apiClient.get('/hr-operations/trainings/').then((response) => {
      const items = Array.isArray(response.data) ? response.data : response.data?.results ?? [];
      setTrainings(items.map(mapTraining)); setError(null);
    }).catch(() => setError('Failed to load trainings')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    apiClient.get('/employees/').then((response) => {
      const records = Array.isArray(response.data) ? response.data : response.data?.results ?? [];
      setEmployees(records.map((employee: any) => ({ id: String(employee.id), name: employee.full_name || `${employee.first_name || ''} ${employee.last_name || ''}`.trim(), branch: employee.branch_name || '', department: employee.department_name || '' })));
    }).catch(() => setEmployees([]));
  }, []);

  // Get trainings visible to current user
  const getVisibleTrainings = useCallback(() => {
    return trainings.filter(t => {
      const type = t.audience.type;
      if (type === 'company') return true;
      if (type === 'branch') return t.audience.targets.includes(CURRENT_USER.branch);
      if (type === 'department') return t.audience.targets.some(d => d === CURRENT_USER.department);
      if (type === 'individual') return t.audience.targets.includes(CURRENT_USER.id);
      return false;
    });
  }, [trainings]);

  // Get user's status for a training
  const getUserTrainingStatus = useCallback((training: Training): TrainingStatus => {
    const status = training.status[CURRENT_USER.id] || 'not_started';
    if (status === 'completed') return 'completed';
    // Cast comparison to any to avoid narrow union type issues in TS where
    // status may be inferred without 'completed' in some contexts.
    if (training.deadline && new Date(training.deadline) < new Date() && status !== ('completed' as any)) {
      return 'overdue';
    }
    return status as TrainingStatus;
  }, []);

  // Update training status
  const updateTrainingStatus = useCallback((trainingId: string, status: TrainingStatus) => {
    setTrainings(prev =>
      prev.map(t => {
        if (t.id === trainingId) {
          return {
            ...t,
            status: {
              ...t.status,
              [CURRENT_USER.id]: status
            }
          };
        }
        return t;
      })
    );
  }, []);

  // Create new training
  const createTraining = useCallback(async (data: TrainingFormData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/hr-operations/trainings/', { title: data.title, description: data.description, trainer_name: '', start_date: data.dateTime || new Date().toISOString().slice(0, 10), end_date: data.deadline || data.dateTime || new Date().toISOString().slice(0, 10), location: data.location || '', is_mandatory: data.mandatory, status: 'SCHEDULED' });
      const newTraining = mapTraining(response.data);
      setTrainings(prev => [newTraining, ...prev]);
      setError(null);
      return newTraining;
    } catch (err) {
      setError('Failed to create training');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get compliance data
  const getComplianceData = useCallback(() => {
    return employees.map(emp => {
      const assignedTrainings = trainings.filter(t => {
        const type = t.audience.type;
        if (type === 'company') return true;
        if (type === 'branch') return t.audience.targets.includes(emp.branch);
        if (type === 'department') return t.audience.targets.includes(emp.department);
        if (type === 'individual') return t.audience.targets.includes(emp.id);
        return false;
      });

      const mandatoryTrainings = assignedTrainings.filter(t => t.mandatory);
      const completed = mandatoryTrainings.filter(t => {
        const status = t.status[emp.id] || 'not_started';
        return status === 'completed';
      }).length;

      const total = mandatoryTrainings.length;
      const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        branch: emp.branch,
        department: emp.department,
        completed,
        totalRequired: total,
        percentage
      };
    });
  }, [employees, trainings]);

  return {
    trainings,
    visibleTrainings: getVisibleTrainings(),
    loading,
    error,
    getUserTrainingStatus,
    updateTrainingStatus,
    createTraining,
    getComplianceData
  };
};
