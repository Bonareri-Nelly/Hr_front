// src/features/benefits/management/hooks/UseBenefitsData.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface UseBenefitsDataProps {
  role: string;
  branchId?: string;
  selectedBranch?: string;
  dateRange?: 'month' | 'quarter' | 'year';
}

interface BenefitsData {
  totalEligible: number;
  totalEnrolled: number;
  enrollmentRate: number;
  enrollmentTrend: {
    totalEmployees: number;
    enrolled: number;
  };
  costTrend: {
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
  byCategory: Array<{
    category: string;
    eligible: number;
    enrolled: number;
    rate: number;
    cost: number;
    costPerEmployee: number;
    trend: number;
  }>;
  byBranch: Array<{
    branchId: string;
    branchName: string;
    eligible: number;
    enrolled: number;
    rate: number;
    cost: number;
    costPerEmployee: number;
  }>;
  costSummary: {
    total: number;
    employerCovered: number;
    employeeCovered: number;
    costPerEmployee: number;
    budget: number;
    actual: number;
    variance: number;
  };
  trends: Array<{
    date: string;
    enrolled: number;
    eligible: number;
    cost: number;
    costPerEmployee: number;
    newEnrollments: number;
    cancellations: number;
    budget: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
    branchName?: string;
  }>;
  categories: string[];
  branches: Array<{
    id: string;
    name: string;
    code: string;
    location: string;
    managerId: string;
  }>;
}

export const useBenefitsData = ({ 
  role, 
  branchId, 
  selectedBranch, 
  dateRange 
}: UseBenefitsDataProps) => {
  const [data, setData] = useState<BenefitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const unwrap = (payload: any) => Array.isArray(payload) ? payload : payload?.results || [];
        const [employeesResponse, plansResponse, enrollmentsResponse] = await Promise.all([
          apiClient.get('/employees/'),
          apiClient.get('/benefits/plans/'),
          apiClient.get('/benefits/enrollments/'),
        ]);
        const allEmployees = unwrap(employeesResponse.data);
        const plans = unwrap(plansResponse.data);
        const allEnrollments = unwrap(enrollmentsResponse.data);
        const selectedScope = selectedBranch && selectedBranch !== 'all' ? selectedBranch : branchId;
        const employees = selectedScope
          ? allEmployees.filter((employee: any) => String(employee.branch) === String(selectedScope) || employee.branch_name === selectedScope)
          : allEmployees;
        const employeeIds = new Set(employees.map((employee: any) => employee.id));
        const enrollments = allEnrollments.filter((enrollment: any) =>
          employeeIds.has(enrollment.employee) && ['ACTIVE', 'PENDING', 'SUSPENDED'].includes(enrollment.status),
        );
        const enrolledEmployeeIds = new Set(enrollments.map((enrollment: any) => enrollment.employee));
        const totalEligible = employees.length;
        const totalEnrolled = enrolledEmployeeIds.size;
        const contribution = (plan: any) => Number(plan.employee_contribution || 0) + Number(plan.employer_contribution || 0);
        const byCategory = plans.filter((plan: any) => plan.is_active).map((plan: any) => {
          const planEnrollments = enrollments.filter((enrollment: any) => enrollment.benefit_plan === plan.id);
          const enrolled = new Set(planEnrollments.map((enrollment: any) => enrollment.employee)).size;
          return {
            category: String(plan.benefit_type || 'Other').replace(/_/g, ' '),
            eligible: totalEligible,
            enrolled,
            rate: totalEligible ? Number((enrolled / totalEligible * 100).toFixed(1)) : 0,
            cost: contribution(plan) * enrolled,
            costPerEmployee: contribution(plan),
            trend: 0,
          };
        });
        const branchMap = new Map<string, { id: string; name: string }>();
        employees.forEach((employee: any) => branchMap.set(String(employee.branch ?? 'unassigned'), {
          id: String(employee.branch ?? 'unassigned'), name: employee.branch_name || 'Unassigned',
        }));
        const byBranch = Array.from(branchMap.values()).map((branch) => {
          const branchEmployees = employees.filter((employee: any) => String(employee.branch ?? 'unassigned') === branch.id);
          const branchIds = new Set(branchEmployees.map((employee: any) => employee.id));
          const branchEnrollments = enrollments.filter((enrollment: any) => branchIds.has(enrollment.employee));
          const enrolled = new Set(branchEnrollments.map((enrollment: any) => enrollment.employee)).size;
          const cost = branchEnrollments.reduce((sum: number, enrollment: any) => {
            const plan = plans.find((item: any) => item.id === enrollment.benefit_plan);
            return sum + (plan ? contribution(plan) : Number(enrollment.employee_amount || 0) + Number(enrollment.employer_amount || 0));
          }, 0);
          return { branchId: branch.id, branchName: branch.name, eligible: branchEmployees.length, enrolled,
            rate: branchEmployees.length ? Number((enrolled / branchEmployees.length * 100).toFixed(1)) : 0,
            cost, costPerEmployee: enrolled ? cost / enrolled : 0 };
        });
        const employeeCovered = enrollments.reduce((sum: number, item: any) => sum + Number(item.employee_amount || 0), 0);
        const employerCovered = enrollments.reduce((sum: number, item: any) => sum + Number(item.employer_amount || 0), 0);
        const total = employeeCovered + employerCovered;
        setData({ totalEligible, totalEnrolled, enrollmentRate: totalEligible ? Number((totalEnrolled / totalEligible * 100).toFixed(1)) : 0,
          enrollmentTrend: { totalEmployees: totalEligible, enrolled: totalEnrolled }, costTrend: { percentage: 0, direction: 'stable' },
          byCategory, byBranch, costSummary: { total, employerCovered, employeeCovered, costPerEmployee: totalEnrolled ? total / totalEnrolled : 0, budget: total, actual: total, variance: 0 },
          trends: [], alerts: [], categories: byCategory.map((item: { category: string }) => item.category), branches: byBranch.map((branch) => ({ id: branch.branchId, name: branch.branchName, code: '', location: '', managerId: '' })) });
        setError(null);
        return;

        // Mock data
        const mockData: BenefitsData = {
          totalEligible: 425,
          totalEnrolled: 356,
          enrollmentRate: 83.8,
          enrollmentTrend: {
            totalEmployees: 425,
            enrolled: 356
          },
          costTrend: {
            percentage: 2.5,
            direction: 'up'
          },
          byCategory: [
            {
              category: 'Health',
              eligible: 425,
              enrolled: 380,
              rate: 89.4,
              cost: 42500,
              costPerEmployee: 100,
              trend: 3.2
            },
            {
              category: 'Retirement',
              eligible: 425,
              enrolled: 340,
              rate: 80.0,
              cost: 51000,
              costPerEmployee: 120,
              trend: 1.8
            },
            {
              category: 'Wellness',
              eligible: 380,
              enrolled: 280,
              rate: 73.7,
              cost: 16800,
              costPerEmployee: 60,
              trend: 5.1
            },
            {
              category: 'Compensation',
              eligible: 250,
              enrolled: 200,
              rate: 80.0,
              cost: 40000,
              costPerEmployee: 160,
              trend: -0.5
            },
            {
              category: 'Leave',
              eligible: 425,
              enrolled: 390,
              rate: 91.8,
              cost: 19500,
              costPerEmployee: 50,
              trend: 2.1
            }
          ],
          byBranch: [
            {
              branchId: 'branch-1',
              branchName: 'Headquarters',
              eligible: 150,
              enrolled: 135,
              rate: 90.0,
              cost: 42000,
              costPerEmployee: 280
            },
            {
              branchId: 'branch-2',
              branchName: 'North Region',
              eligible: 100,
              enrolled: 82,
              rate: 82.0,
              cost: 28000,
              costPerEmployee: 280
            },
            {
              branchId: 'branch-3',
              branchName: 'South Region',
              eligible: 75,
              enrolled: 58,
              rate: 77.3,
              cost: 21000,
              costPerEmployee: 280
            },
            {
              branchId: 'branch-4',
              branchName: 'East Region',
              eligible: 55,
              enrolled: 48,
              rate: 87.3,
              cost: 15000,
              costPerEmployee: 273
            },
            {
              branchId: 'branch-5',
              branchName: 'West Region',
              eligible: 45,
              enrolled: 33,
              rate: 73.3,
              cost: 12000,
              costPerEmployee: 267
            }
          ],
          costSummary: {
            total: 169800,
            employerCovered: 118860,
            employeeCovered: 50940,
            costPerEmployee: 400,
            budget: 180000,
            actual: 169800,
            variance: 10200
          },
          trends: [
            { date: '2024-01', enrolled: 320, eligible: 400, cost: 160000, costPerEmployee: 400, newEnrollments: 15, cancellations: 5, budget: 170000 },
            { date: '2024-02', enrolled: 330, eligible: 410, cost: 162000, costPerEmployee: 395, newEnrollments: 12, cancellations: 2, budget: 172000 },
            { date: '2024-03', enrolled: 340, eligible: 415, cost: 165000, costPerEmployee: 397, newEnrollments: 18, cancellations: 8, budget: 175000 },
            { date: '2024-04', enrolled: 345, eligible: 420, cost: 167000, costPerEmployee: 398, newEnrollments: 10, cancellations: 5, budget: 176000 },
            { date: '2024-05', enrolled: 350, eligible: 420, cost: 168000, costPerEmployee: 400, newEnrollments: 8, cancellations: 3, budget: 178000 },
            { date: '2024-06', enrolled: 356, eligible: 425, cost: 169800, costPerEmployee: 400, newEnrollments: 6, cancellations: 0, budget: 180000 }
          ],
          alerts: [
            {
              type: 'warning',
              message: 'Enrollment rate below 80% in West Region',
              branchName: 'West Region'
            },
            {
              type: 'info',
              message: 'Open enrollment period starts in 30 days'
            },
            {
              type: 'success',
              message: 'Headquarters exceeded 90% enrollment target'
            }
          ],
          categories: ['Health', 'Retirement', 'Wellness', 'Compensation', 'Leave'],
          branches: [
            { id: 'branch-1', name: 'Headquarters', code: 'HQ', location: 'New York', managerId: 'user-1' },
            { id: 'branch-2', name: 'North Region', code: 'NR', location: 'Boston', managerId: 'user-2' },
            { id: 'branch-3', name: 'South Region', code: 'SR', location: 'Atlanta', managerId: 'user-3' },
            { id: 'branch-4', name: 'East Region', code: 'ER', location: 'Philadelphia', managerId: 'user-4' },
            { id: 'branch-5', name: 'West Region', code: 'WR', location: 'Chicago', managerId: 'user-5' }
          ]
        };

        // Filter data based on role and branch
        const filteredData = { ...mockData };
        
        if (role === 'Branch Manager' && branchId) {
          const branch = mockData.byBranch.find(b => b.branchId === branchId);
          if (branch) {
            filteredData.byBranch = [branch!];
            filteredData.totalEligible = branch!.eligible;
            filteredData.totalEnrolled = branch!.enrolled;
            filteredData.enrollmentRate = branch!.rate;
          }
        }

        if (selectedBranch && selectedBranch !== 'all') {
          const branch = mockData.byBranch.find(b => b.branchId === selectedBranch);
          if (branch) {
            filteredData.byBranch = [branch!];
          }
        }

        setData(filteredData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, branchId, selectedBranch, dateRange, refreshVersion]);

  const refetch = () => {
    setRefreshVersion((version) => version + 1);
  };

  return { data, loading, error, refetch };
};

