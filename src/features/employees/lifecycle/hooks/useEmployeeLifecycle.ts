import { useState, useEffect } from 'react';

interface UseEmployeeLifecycleProps {
  searchTerm: string;
  stage: string;
  department: string;
  dateRange: { start: string; end: string };
}

export const useEmployeeLifecycle = ({
  searchTerm,
  stage,
  department,
  dateRange,
}: UseEmployeeLifecycleProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const mockData = {
          employees: [
            {
              id: '1',
              name: 'Sarah Kimani',
              email: 'sarah.kimani@optimum.com',
              department: 'Engineering',
              branch: 'Nairobi HQ',
              role: 'Senior Software Engineer',
              stage: 'active' as const,
              startDate: '2024-01-15',
              tenure: '1 yr 6 mos',
              milestones: [
                {
                  id: 'm1',
                  type: 'hire' as const,
                  date: '2024-01-15',
                  title: 'Hired as Software Engineer',
                  description: 'Onboarding completed successfully',
                  moduleLink: '/employees/onboarding/1',
                  details: { department: 'Engineering', manager: 'John Doe' },
                },
                {
                  id: 'm2',
                  type: 'probation' as const,
                  date: '2024-04-15',
                  title: 'Probation Completed',
                  description: 'Successfully completed 3-month probation',
                  moduleLink: '/employees/performance/1',
                  details: { rating: 'Exceeds Expectations' },
                },
                {
                  id: 'm3',
                  type: 'promotion' as const,
                  date: '2025-01-15',
                  title: 'Promoted to Senior Software Engineer',
                  description: 'Promotion after 1 year of service',
                  moduleLink: '/employees/promotions/1',
                  details: { new_role: 'Senior Software Engineer', increment: '15%' },
                },
                {
                  id: 'm4',
                  type: 'performance' as const,
                  date: '2025-06-01',
                  title: 'Performance Review - Q2 2025',
                  description: 'Annual performance review completed',
                  moduleLink: '/performance/reviews/1',
                  details: { rating: '4.5', cycle: 'Q2 2025' },
                },
                {
                  id: 'm5',
                  type: 'benefits' as const,
                  date: '2025-07-01',
                  title: 'Enrolled in Medical Insurance',
                  description: 'Company medical insurance enrollment',
                  moduleLink: '/benefits/1',
                  details: { plan: 'Family Plan', provider: 'Jubilee Insurance' },
                },
              ],
            },
            {
              id: '2',
              name: 'James Ochieng',
              email: 'james.ochieng@optimum.com',
              department: 'Finance',
              branch: 'Nairobi HQ',
              role: 'Finance Manager',
              stage: 'notice_period' as const,
              startDate: '2020-03-01',
              tenure: '4 yrs 4 mos',
              milestones: [
                {
                  id: 'm6',
                  type: 'hire' as const,
                  date: '2020-03-01',
                  title: 'Hired as Finance Analyst',
                  description: 'Onboarding completed',
                  moduleLink: '/employees/onboarding/2',
                  details: { department: 'Finance', manager: 'CEO' },
                },
                {
                  id: 'm7',
                  type: 'promotion' as const,
                  date: '2022-03-01',
                  title: 'Promoted to Finance Manager',
                  description: 'Promotion after 2 years',
                  moduleLink: '/employees/promotions/2',
                  details: { new_role: 'Finance Manager', increment: '20%' },
                },
                {
                  id: 'm8',
                  type: 'offboarding' as const,
                  date: '2024-07-15',
                  title: 'Offboarding Initiated',
                  description: 'Notice period started. Last day: 2024-08-15',
                  moduleLink: '/employees/offboarding/2',
                  details: { reason: 'Resignation', last_day: '2024-08-15' },
                },
              ],
            },
          ],
          analytics: {
            avgTimeToPromotion: '1.2 years',
            avgTenure: '3.8 years',
            attritionByStage: [
              { stage: '0-6 months', percentage: 15 },
              { stage: '6-12 months', percentage: 25 },
              { stage: '1-3 years', percentage: 35 },
              { stage: '3+ years', percentage: 25 },
            ],
            onboardingCompletionRate: 92,
            timeToProductivity: '3 months',
          },
        };

        // Apply filters
        let filteredEmployees = mockData.employees;

        if (searchTerm) {
          filteredEmployees = filteredEmployees.filter(
            (e) =>
              e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (stage !== 'all') {
          filteredEmployees = filteredEmployees.filter((e) => e.stage === stage);
        }

        if (department !== 'all') {
          filteredEmployees = filteredEmployees.filter((e) => e.department === department);
        }

        setData({
          ...mockData,
          employees: filteredEmployees,
        });
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, stage, department, dateRange]);

  return { data, loading, error };
};