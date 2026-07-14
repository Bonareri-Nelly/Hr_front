// ==========================================
// HOOK: useTrainings
// ==========================================

import { useState, useCallback } from 'react';
import { MOCK_TRAININGS, CURRENT_USER, MOCK_EMPLOYEES } from '../constants';
import { Training, TrainingFormData, TrainingStatus } from '../types';

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>(MOCK_TRAININGS as Training[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const createTraining = useCallback((data: TrainingFormData) => {
    setLoading(true);
    try {
      // Assign status to all employees in audience
      const statusObj: Record<string, TrainingStatus> = {};
      const targetEmployees = MOCK_EMPLOYEES.filter(emp => {
        if (data.audience === 'company') return true;
        if (data.audience === 'branch') return data.targets.includes(emp.branch);
        if (data.audience === 'department') return data.targets.includes(emp.department);
        if (data.audience === 'individual') return data.targets.includes(emp.id);
        return false;
      });
      targetEmployees.forEach(emp => { statusObj[emp.id] = 'not_started'; });

      const newTraining: Training = {
        id: `train-${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        delivery: data.delivery,
        dateTime: data.dateTime || null,
        location: data.location || null,
        capacity: data.capacity || null,
        mandatory: data.mandatory,
        audience: {
          type: data.audience,
          targets: data.targets
        },
        deadline: data.deadline || null,
        status: statusObj
      };
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
    return MOCK_EMPLOYEES.map(emp => {
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
  }, [trainings]);

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