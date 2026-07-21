import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

interface UseEmployeeLifecycleProps {
  searchTerm: string;
  stage: string;
  department: string;
  branch: string;
  employmentType: string;
}

export const useEmployeeLifecycle = ({
  searchTerm,
  stage,
  department,
  branch,
  employmentType,
}: UseEmployeeLifecycleProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        if (stage !== 'all') params.stage = stage;
        if (department !== 'all') params.department = department;
        if (branch !== 'all') params.branch = branch;
        if (employmentType !== 'all') params.employment_type = employmentType;

        const response = await apiClient.get('/employees/lifecycle/', { params });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, stage, department, branch, employmentType]);

  return { data, loading, error };
};
