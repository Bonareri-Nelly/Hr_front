import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Star,
  Calendar,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  FileText,
  User,
  Building2,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Send,
  MessageSquare,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  FileSpreadsheet,
  File,
  Settings,
  HelpCircle,
  Flag,
  Crown,
  Briefcase,
  StarIcon,
  TrendingDown,
  TrendingUpIcon,
  Minus,
  Check,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  UsersRound,
  LayoutDashboard,
  Sparkles,
  Lightbulb,
  TargetIcon,
  Megaphone,
  Gift,
  Medal,
  Trophy,
  Zap,
  Flame,
  Compass,
  AwardIcon
} from 'lucide-react';

type CycleStatus = 'not_started' | 'in_progress' | 'completed';
type PerformanceTrend = 'improving' | 'declining' | 'stable';
type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'missed' | 'carried_forward';
type ReviewType = 'self' | 'manager' | 'peer' | 'cross_functional';
type UserRole = 'employee' | 'department_head' | 'branch_manager' | 'branch_hr_admin' | 'executive' | 'system_admin';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  dueDate: string;
  status: GoalStatus;
  progress: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  changeLog: { date: string; field: string; oldValue: string; newValue: string }[];
}

interface Review {
  id: string;
  type: ReviewType;
  reviewerName: string;
  revieweeName: string;
  rating: number | null;
  comments: string;
  submittedAt: string | null;
  status: 'pending' | 'submitted' | 'overdue';
  isAnonymous: boolean;
}

interface AppraisalCycle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  reviewPeriod: string;
  status: CycleStatus;
  scope: 'org_wide' | 'branch' | 'department';
  scopeId: string | null;
  ratingScale: { value: number; label: string }[];
  has360Feedback: boolean;
  reminderFrequency: number;
  employees: string[];
  employeeStatus: { employeeId: string; status: CycleStatus }[];
  createdAt: string;
  createdBy: string;
}

interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  department: string;
  branch: string;
  role: string;
  goals: Goal[];
  reviews: Review[];
  ratingHistory: { cycleId: string; cycleName: string; rating: number; date: string }[];
  currentCycleStatus: CycleStatus;
}

const mockEmployees = [
  { id: 'emp1', name: 'Sarah Kimani', department: 'Engineering', branch: 'Nairobi HQ', role: 'Senior Engineer' },
  { id: 'emp2', name: 'James Ochieng', department: 'Finance', branch: 'Nairobi HQ', role: 'Finance Manager' },
  { id: 'emp3', name: 'Grace Wanjiku', department: 'HR', branch: 'Nairobi HQ', role: 'HR Business Partner' },
  { id: 'emp4', name: 'Peter Ndungu', department: 'Sales', branch: 'Mombasa', role: 'Sales Lead' },
  { id: 'emp5', name: 'Mary Akinyi', department: 'Operations', branch: 'Kisumu', role: 'Ops Manager' },
  { id: 'emp6', name: 'Robert Otieno', department: 'Customer Support', branch: 'Nairobi HQ', role: 'Support Lead' },
];

const defaultRatingScale = [
  { value: 1, label: 'Needs Improvement' },
  { value: 2, label: 'Below Expectations' },
  { value: 3, label: 'Meets Expectations' },
  { value: 4, label: 'Exceeds Expectations' },
  { value: 5, label: 'Exceptional' },
];

const mockCycles: AppraisalCycle[] = [
  {
    id: 'c1',
    name: 'Annual Performance Review 2025',
    description: 'Full-year performance review for all employees.',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    reviewPeriod: '2024-01-01 to 2024-12-31',
    status: 'in_progress',
    scope: 'org_wide',
    scopeId: null,
    ratingScale: defaultRatingScale,
    has360Feedback: true,
    reminderFrequency: 7,
    employees: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'],
    employeeStatus: [
      { employeeId: 'emp1', status: 'in_progress' },
      { employeeId: 'emp2', status: 'completed' },
      { employeeId: 'emp3', status: 'in_progress' },
      { employeeId: 'emp4', status: 'not_started' },
      { employeeId: 'emp5', status: 'in_progress' },
      { employeeId: 'emp6', status: 'not_started' },
    ],
    createdAt: '2024-12-01',
    createdBy: 'HR Admin',
  },
  {
    id: 'c2',
    name: 'Biannual Review - H2 2025',
    description: 'Mid-year performance check-in.',
    startDate: '2025-07-01',
    endDate: '2025-08-15',
    reviewPeriod: '2025-01-01 to 2025-06-30',
    status: 'not_started',
    scope: 'org_wide',
    scopeId: null,
    ratingScale: defaultRatingScale,
    has360Feedback: false,
    reminderFrequency: 5,
    employees: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'],
    employeeStatus: [
      { employeeId: 'emp1', status: 'not_started' },
      { employeeId: 'emp2', status: 'not_started' },
      { employeeId: 'emp3', status: 'not_started' },
      { employeeId: 'emp4', status: 'not_started' },
      { employeeId: 'emp5', status: 'not_started' },
      { employeeId: 'emp6', status: 'not_started' },
    ],
    createdAt: '2025-06-01',
    createdBy: 'HR Admin',
  },
  {
    id: 'c3',
    name: 'Annual Performance Review 2024',
    description: 'Full-year performance review for all employees.',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    reviewPeriod: '2023-01-01 to 2023-12-31',
    status: 'completed',
    scope: 'org_wide',
    scopeId: null,
    ratingScale: defaultRatingScale,
    has360Feedback: true,
    reminderFrequency: 7,
    employees: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'],
    employeeStatus: [
      { employeeId: 'emp1', status: 'completed' },
      { employeeId: 'emp2', status: 'completed' },
      { employeeId: 'emp3', status: 'completed' },
      { employeeId: 'emp4', status: 'completed' },
      { employeeId: 'emp5', status: 'completed' },
      { employeeId: 'emp6', status: 'completed' },
    ],
    createdAt: '2023-12-01',
    createdBy: 'HR Admin',
  },
];

const mockEmployeePerformance: Record<string, EmployeePerformance> = {
  emp1: {
    employeeId: 'emp1',
    employeeName: 'Sarah Kimani',
    department: 'Engineering',
    branch: 'Nairobi HQ',
    role: 'Senior Engineer',
    goals: [
      {
        id: 'g1',
        title: 'Complete API Gateway Migration',
        description: 'Migrate all internal APIs to the new gateway architecture by Q1 2025',
        target: '100% API coverage',
        dueDate: '2025-03-31',
        status: 'in_progress',
        progress: 65,
        createdBy: 'Sarah Kimani',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-10',
        changeLog: [
          { date: '2025-01-20', field: 'title', oldValue: '', newValue: 'Complete API Gateway Migration' },
          { date: '2025-02-10', field: 'target', oldValue: '80% API coverage', newValue: '100% API coverage' },
        ],
      },
      {
        id: 'g2',
        title: 'Reduce Technical Debt',
        description: 'Refactor legacy code and improve test coverage',
        target: '80% test coverage',
        dueDate: '2025-06-30',
        status: 'in_progress',
        progress: 40,
        createdBy: 'Sarah Kimani',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-15',
        changeLog: [],
      },
      {
        id: 'g3',
        title: 'Lead Team Knowledge Sharing',
        description: 'Organize monthly tech talks and knowledge sharing sessions',
        target: '12 sessions per year',
        dueDate: '2025-12-31',
        status: 'achieved',
        progress: 100,
        createdBy: 'Department Head',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-01',
        changeLog: [],
      },
    ],
    reviews: [
      {
        id: 'r1',
        type: 'self',
        reviewerName: 'Sarah Kimani',
        revieweeName: 'Sarah Kimani',
        rating: 4,
        comments: 'I have made significant progress on the API migration and technical debt reduction. I have also led multiple knowledge sharing sessions.',
        submittedAt: '2025-02-28',
        status: 'submitted',
        isAnonymous: false,
      },
      {
        id: 'r2',
        type: 'manager',
        reviewerName: 'John Doe (Dept Head)',
        revieweeName: 'Sarah Kimani',
        rating: 5,
        comments: 'Sarah has exceeded expectations. Her work on the API gateway has been exceptional, and she has shown great leadership in the team.',
        submittedAt: '2025-03-01',
        status: 'submitted',
        isAnonymous: false,
      },
    ],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 4, date: '2024-03-15' },
    ],
    currentCycleStatus: 'in_progress',
  },
  emp2: {
    employeeId: 'emp2',
    employeeName: 'James Ochieng',
    department: 'Finance',
    branch: 'Nairobi HQ',
    role: 'Finance Manager',
    goals: [
      {
        id: 'g4',
        title: 'Implement New Budget Tracking System',
        description: 'Deploy and train team on new budget tracking software',
        target: '100% adoption',
        dueDate: '2025-04-30',
        status: 'achieved',
        progress: 100,
        createdBy: 'James Ochieng',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-20',
        changeLog: [],
      },
      {
        id: 'g5',
        title: 'Reduce Month-End Closing Time',
        description: 'Streamline month-end financial closing process',
        target: '5 days',
        dueDate: '2025-06-30',
        status: 'in_progress',
        progress: 70,
        createdBy: 'Department Head',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-15',
        changeLog: [],
      },
    ],
    reviews: [
      {
        id: 'r3',
        type: 'self',
        reviewerName: 'James Ochieng',
        revieweeName: 'James Ochieng',
        rating: 3,
        comments: 'The budget tracking system implementation is complete. Still working on reducing month-end closing time.',
        submittedAt: '2025-02-28',
        status: 'submitted',
        isAnonymous: false,
      },
      {
        id: 'r4',
        type: 'manager',
        reviewerName: 'CEO Office',
        revieweeName: 'James Ochieng',
        rating: 4,
        comments: 'James has done excellent work on the budget system. The finance team is now much more efficient.',
        submittedAt: '2025-03-01',
        status: 'submitted',
        isAnonymous: false,
      },
    ],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 3, date: '2024-03-15' },
    ],
    currentCycleStatus: 'completed',
  },
  emp3: {
    employeeId: 'emp3',
    employeeName: 'Grace Wanjiku',
    department: 'HR',
    branch: 'Nairobi HQ',
    role: 'HR Business Partner',
    goals: [
      {
        id: 'g6',
        title: 'Improve Employee Onboarding Process',
        description: 'Redesign the onboarding experience for new hires',
        target: '90% satisfaction score',
        dueDate: '2025-05-31',
        status: 'in_progress',
        progress: 50,
        createdBy: 'Grace Wanjiku',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-10',
        changeLog: [],
      },
      {
        id: 'g7',
        title: 'Implement New HRIS System',
        description: 'Deploy and configure new HRIS platform',
        target: 'Full deployment',
        dueDate: '2025-08-31',
        status: 'in_progress',
        progress: 30,
        createdBy: 'Department Head',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-01',
        changeLog: [],
      },
    ],
    reviews: [
      {
        id: 'r5',
        type: 'self',
        reviewerName: 'Grace Wanjiku',
        revieweeName: 'Grace Wanjiku',
        rating: 4,
        comments: 'Onboarding redesign is progressing well. HRIS implementation is also on track.',
        submittedAt: null,
        status: 'pending',
        isAnonymous: false,
      },
    ],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 4, date: '2024-03-15' },
    ],
    currentCycleStatus: 'in_progress',
  },
  emp4: {
    employeeId: 'emp4',
    employeeName: 'Peter Ndungu',
    department: 'Sales',
    branch: 'Mombasa',
    role: 'Sales Lead',
    goals: [
      {
        id: 'g8',
        title: 'Increase Regional Sales Revenue',
        description: 'Drive sales growth in the Mombasa region',
        target: '20% growth',
        dueDate: '2025-06-30',
        status: 'not_started',
        progress: 0,
        createdBy: 'Peter Ndungu',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-20',
        changeLog: [],
      },
    ],
    reviews: [],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 3, date: '2024-03-15' },
    ],
    currentCycleStatus: 'not_started',
  },
  emp5: {
    employeeId: 'emp5',
    employeeName: 'Mary Akinyi',
    department: 'Operations',
    branch: 'Kisumu',
    role: 'Ops Manager',
    goals: [
      {
        id: 'g9',
        title: 'Optimize Supply Chain Process',
        description: 'Streamline the supply chain for the Kisumu branch',
        target: '15% cost reduction',
        dueDate: '2025-06-30',
        status: 'in_progress',
        progress: 60,
        createdBy: 'Mary Akinyi',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-10',
        changeLog: [],
      },
    ],
    reviews: [],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 4, date: '2024-03-15' },
    ],
    currentCycleStatus: 'in_progress',
  },
  emp6: {
    employeeId: 'emp6',
    employeeName: 'Robert Otieno',
    department: 'Customer Support',
    branch: 'Nairobi HQ',
    role: 'Support Lead',
    goals: [
      {
        id: 'g10',
        title: 'Improve Customer Satisfaction Score',
        description: 'Increase CSAT from 4.2 to 4.5',
        target: '4.5 CSAT',
        dueDate: '2025-06-30',
        status: 'in_progress',
        progress: 80,
        createdBy: 'Robert Otieno',
        createdAt: '2025-01-20',
        updatedAt: '2025-02-15',
        changeLog: [],
      },
    ],
    reviews: [],
    ratingHistory: [
      { cycleId: 'c3', cycleName: 'Annual Performance Review 2024', rating: 3, date: '2024-03-15' },
    ],
    currentCycleStatus: 'not_started',
  },
};

const getGoalStatusColor = (status: GoalStatus) => {
  const map = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    achieved: 'bg-green-100 text-green-700',
    missed: 'bg-red-100 text-red-700',
    carried_forward: 'bg-amber-100 text-amber-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const getGoalStatusIcon = (status: GoalStatus) => {
  const map: Record<GoalStatus, React.ElementType> = {
    not_started: Clock,
    in_progress: Activity,
    achieved: CheckCircle,
    missed: X,
    carried_forward: RefreshCw,
  };
  return map[status] || Clock;
};

const getCycleStatusColor = (status: CycleStatus) => {
  const map = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const getCycleStatusIcon = (status: CycleStatus) => {
  const map: Record<CycleStatus, React.ElementType> = {
    not_started: Clock,
    in_progress: Activity,
    completed: CheckCircle,
  };
  return map[status] || Clock;
};

const getRatingLabel = (rating: number, scale: { value: number; label: string }[]) => {
  const found = scale.find(s => s.value === rating);
  return found ? found.label : `${rating}/5`;
};

function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const Icon = getGoalStatusIcon(status);
  const color = getGoalStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

function CycleStatusBadge({ status }: { status: CycleStatus }) {
  const Icon = getCycleStatusIcon(status);
  const color = getCycleStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

type TabType = 'cycles' | 'goals' | 'reviews' | 'history' | 'dashboard';
type SetCycles = React.Dispatch<React.SetStateAction<AppraisalCycle[]>>;
type SetEmployeePerformance = React.Dispatch<React.SetStateAction<Record<string, EmployeePerformance>>>;
type ShowToast = (message: string, type: string) => void;

export default function PerformanceOversightPage() {
  const [role, setRole] = useState<UserRole>('branch_hr_admin');
  const [activeTab, setActiveTab] = useState<TabType>('cycles');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [cycles, setCycles] = useState<AppraisalCycle[]>(mockCycles);
  const [employeePerformance, setEmployeePerformance] = useState<Record<string, EmployeePerformance>>(mockEmployeePerformance);

  const selectedEmployee = selectedEmployeeId ? employeePerformance[selectedEmployeeId] : null;
  const selectedCycle = cycles.find(c => c.id === selectedCycleId);

  const handleShowToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-700" />
            Performance Oversight
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage appraisal cycles, goals, reviews, and performance history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-700"
            >
              <option value="employee">Employee</option>
              <option value="department_head">Department Head</option>
              <option value="branch_manager">Branch Manager</option>
              <option value="branch_hr_admin">Branch HR Admin</option>
              <option value="executive">Executive</option>
              <option value="system_admin">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {[
            { id: 'cycles', label: 'Cycles', icon: Calendar },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'history', label: 'History', icon: TrendingUp },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 text-sm font-medium transition flex items-center gap-2 border-b-2 ${
                  isActive
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'cycles' && (
        <CyclesTab
          cycles={cycles}
          setCycles={setCycles}
          role={role}
          onShowToast={handleShowToast}
          employeePerformance={employeePerformance}
        />
      )}

      {activeTab === 'goals' && (
        <GoalsTab
          employeePerformance={employeePerformance}
          setEmployeePerformance={setEmployeePerformance}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          role={role}
          onShowToast={handleShowToast}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsTab
          employeePerformance={employeePerformance}
          setEmployeePerformance={setEmployeePerformance}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          role={role}
          cycles={cycles}
          onShowToast={handleShowToast}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab
          employeePerformance={employeePerformance}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          role={role}
        />
      )}

      {activeTab === 'dashboard' && (
        <DashboardTab
          employeePerformance={employeePerformance}
          cycles={cycles}
          role={role}
        />
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${
          toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
          toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          <span className="text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function CyclesTab({ cycles, setCycles, role, onShowToast, employeePerformance }: { cycles: AppraisalCycle[]; setCycles: SetCycles; role: UserRole; onShowToast: ShowToast; employeePerformance: Record<string, EmployeePerformance> }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCycle, setNewCycle] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    reviewPeriod: '',
    scope: 'org_wide' as 'org_wide' | 'branch' | 'department',
    has360Feedback: false,
    reminderFrequency: 7,
  });

  const canManageCycles = role === 'branch_hr_admin' || role === 'system_admin';

  const handleCreateCycle = () => {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) {
      onShowToast('Please fill in all required fields.', 'error');
      return;
    }

    const cycle: AppraisalCycle = {
      id: `c${Date.now()}`,
      name: newCycle.name,
      description: newCycle.description || 'No description provided.',
      startDate: newCycle.startDate,
      endDate: newCycle.endDate,
      reviewPeriod: newCycle.reviewPeriod || `${newCycle.startDate} to ${newCycle.endDate}`,
      status: 'not_started',
      scope: newCycle.scope,
      scopeId: null,
      ratingScale: defaultRatingScale,
      has360Feedback: newCycle.has360Feedback,
      reminderFrequency: newCycle.reminderFrequency,
      employees: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'],
      employeeStatus: [
        { employeeId: 'emp1', status: 'not_started' },
        { employeeId: 'emp2', status: 'not_started' },
        { employeeId: 'emp3', status: 'not_started' },
        { employeeId: 'emp4', status: 'not_started' },
        { employeeId: 'emp5', status: 'not_started' },
        { employeeId: 'emp6', status: 'not_started' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'HR Admin',
    };

    setCycles(prev => [cycle, ...prev]);
    setIsCreating(false);
    setNewCycle({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      reviewPeriod: '',
      scope: 'org_wide',
      has360Feedback: false,
      reminderFrequency: 7,
    });
    onShowToast('Appraisal cycle created successfully!', 'success');
  };

  const getEmployeeCount = (cycle: AppraisalCycle) => {
    return cycle.employees.length;
  };

  const getCompletionRate = (cycle: AppraisalCycle) => {
    const completed = cycle.employeeStatus.filter(e => e.status === 'completed').length;
    return Math.round((completed / cycle.employeeStatus.length) * 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Appraisal Cycles</h2>
        {canManageCycles && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Cycle
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-700" />
            Create New Appraisal Cycle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Name *</label>
              <input
                type="text"
                value={newCycle.name}
                onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                placeholder="e.g., Annual Performance Review 2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newCycle.description}
                onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                placeholder="e.g., Full-year performance review"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={newCycle.startDate}
                onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                value={newCycle.endDate}
                onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                value={newCycle.scope}
                onChange={(e) => setNewCycle({ ...newCycle, scope: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              >
                <option value="org_wide">Organization-Wide</option>
                <option value="branch">Branch-Specific</option>
                <option value="department">Department-Specific</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Frequency (days)</label>
              <input
                type="number"
                value={newCycle.reminderFrequency}
                onChange={(e) => setNewCycle({ ...newCycle, reminderFrequency: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div className="col-span-full">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={newCycle.has360Feedback}
                  onChange={(e) => setNewCycle({ ...newCycle, has360Feedback: e.target.checked })}
                  className="rounded border-gray-300 text-blue-700 focus:ring-blue-700"
                />
                Enable 360-degree feedback (peer and cross-functional reviews)
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateCycle}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
            >
              Create Cycle
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {cycles.map((cycle: AppraisalCycle) => {
          const Icon = getCycleStatusIcon(cycle.status);
          const color = getCycleStatusColor(cycle.status);
          const completionRate = getCompletionRate(cycle);

          return (
            <div key={cycle.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{cycle.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                      <Icon className="w-3 h-3" />
                      {cycle.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{cycle.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span>📅 {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}</span>
                    <span>👥 {getEmployeeCount(cycle)} employees</span>
                    <span>📊 {completionRate}% complete</span>
                    <span>🔄 {cycle.scope.replace('_', ' ')}</span>
                    {cycle.has360Feedback && <span>🔄 360° feedback</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canManageCycles && cycle.status !== 'completed' && (
                    <button
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        setCycles(prev => prev.map(c => c.id === cycle.id ? { ...c, status: 'in_progress' } : c));
                        onShowToast(`Cycle "${cycle.name}" started`, 'success');
                      }}
                    >
                      Start
                    </button>
                  )}
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  {canManageCycles && (
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoalsTab({ employeePerformance, setEmployeePerformance, selectedEmployeeId, setSelectedEmployeeId, role, onShowToast }: { employeePerformance: Record<string, EmployeePerformance>; setEmployeePerformance: SetEmployeePerformance; selectedEmployeeId: string | null; setSelectedEmployeeId: (id: string) => void; role: UserRole; onShowToast: ShowToast }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    dueDate: '',
  });

  const employees = Object.values(employeePerformance);

  const displayEmployees = role === 'employee'
    ? employees.filter(e => e.employeeId === 'emp1')
    : role === 'department_head'
    ? employees.filter(e => e.department === 'Engineering')
    : employees;

  const selectedEmp = (selectedEmployeeId ? employeePerformance[selectedEmployeeId] : undefined) || displayEmployees[0];
  const canCreateGoals = role === 'employee' || role === 'department_head';

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.dueDate) {
      onShowToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!selectedEmp) return;

    const goal: Goal = {
      id: `g${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description || '',
      target: newGoal.target || '',
      dueDate: newGoal.dueDate,
      status: 'not_started',
      progress: 0,
      createdBy: role === 'department_head' ? 'Department Head' : selectedEmp.employeeName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      changeLog: [],
    };

    setEmployeePerformance(prev => ({
      ...prev,
      [selectedEmp.employeeId]: {
        ...selectedEmp,
        goals: [...(selectedEmp.goals || []), goal],
      },
    }));

    setIsCreating(false);
    setNewGoal({ title: '', description: '', target: '', dueDate: '' });
    onShowToast('Goal created successfully!', 'success');
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
          {displayEmployees.length > 1 && (
            <select
              value={selectedEmployeeId || ''}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700"
            >
              {displayEmployees.map((e: any) => (
                <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
              ))}
            </select>
          )}
        </div>
        {canCreateGoals && selectedEmp && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        )}
      </div>

      {isCreating && selectedEmp && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-700" />
            Create New Goal for {selectedEmp.employeeName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Complete API Migration"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                type="text"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                placeholder="e.g., 100% completion"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={2}
                placeholder="Describe the goal..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateGoal}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
            >
              Create Goal
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedEmp && selectedEmp.goals && selectedEmp.goals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {selectedEmp.goals.map((goal: Goal) => (
            <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <GoalStatusBadge status={goal.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span>🎯 Target: {goal.target}</span>
                    <span>📅 Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    <span>📊 Progress: {goal.progress}%</span>
                    <span>👤 Created by: {goal.createdBy}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  {goal.changeLog.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      <span className="font-medium">Change Log:</span>
                      {goal.changeLog.map((log: any, idx: number) => (
                        <span key={idx} className="ml-2">
                          {log.field}: {log.oldValue} → {log.newValue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {role === 'employee' || role === 'department_head' ? (
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No goals set for this employee.</p>
          {canCreateGoals && <p className="text-sm text-gray-400 mt-1">Click "New Goal" to create one.</p>}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ employeePerformance, setEmployeePerformance, selectedEmployeeId, setSelectedEmployeeId, role, cycles, onShowToast }: { employeePerformance: Record<string, EmployeePerformance>; setEmployeePerformance: SetEmployeePerformance; selectedEmployeeId: string | null; setSelectedEmployeeId: (id: string) => void; role: UserRole; cycles: AppraisalCycle[]; onShowToast: ShowToast }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 3,
    comments: '',
    type: 'self' as ReviewType,
  });

  const employees = Object.values(employeePerformance);

  const displayEmployees = role === 'employee'
    ? employees.filter(e => e.employeeId === 'emp1')
    : employees;

  const selectedEmp = (selectedEmployeeId ? employeePerformance[selectedEmployeeId] : undefined) || displayEmployees[0];

  const canSubmitReview = role === 'employee' || role === 'department_head';

  const handleSubmitReview = () => {
    if (!selectedEmp) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      type: reviewData.type,
      reviewerName: role === 'employee' ? selectedEmp.employeeName : 'Department Head',
      revieweeName: selectedEmp.employeeName,
      rating: reviewData.rating,
      comments: reviewData.comments,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'submitted',
      isAnonymous: false,
    };

    setEmployeePerformance(prev => ({
      ...prev,
      [selectedEmp.employeeId]: {
        ...selectedEmp,
        reviews: [...(selectedEmp.reviews || []), newReview],
      },
    }));

    setIsSubmitting(false);
    setReviewData({ rating: 3, comments: '', type: 'self' });
    onShowToast('Review submitted successfully!', 'success');
  };

  const getPendingReviews = (emp: any) => {
    return emp.reviews?.filter((r: Review) => r.status === 'pending') || [];
  };

  const getSubmittedReviews = (emp: any) => {
    return emp.reviews?.filter((r: Review) => r.status === 'submitted') || [];
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
          {displayEmployees.length > 1 && (
            <select
              value={selectedEmployeeId || ''}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700"
            >
              {displayEmployees.map((e: any) => (
                <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
              ))}
            </select>
          )}
        </div>
        {canSubmitReview && selectedEmp && (
          <button
            onClick={() => setIsSubmitting(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Submit Review
          </button>
        )}
      </div>

      {isSubmitting && selectedEmp && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-700" />
            Submit Review for {selectedEmp.employeeName}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label>
              <select
                value={reviewData.type}
                onChange={(e) => setReviewData({ ...reviewData, type: e.target.value as ReviewType })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              >
                <option value="self">Self-Review</option>
                <option value="manager">Manager Review</option>
                <option value="peer">Peer Review</option>
                <option value="cross_functional">Cross-Functional Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setReviewData({ ...reviewData, rating: val })}
                    className={`w-10 h-10 rounded-lg border transition ${
                      reviewData.rating === val
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                value={reviewData.comments}
                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                rows={4}
                placeholder="Provide detailed feedback..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
            >
              Submit Review
            </button>
            <button
              onClick={() => setIsSubmitting(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedEmp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Reviews
            </h4>
            {getPendingReviews(selectedEmp).length > 0 ? (
              <div className="space-y-3">
                {getPendingReviews(selectedEmp).map((review: Review) => (
                  <div key={review.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{review.type.toUpperCase()} Review</p>
                    <p className="text-xs text-gray-500">From: {review.reviewerName}</p>
                    <button className="mt-2 text-xs text-blue-700 hover:underline">Complete Review →</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No pending reviews</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Submitted Reviews
            </h4>
            {getSubmittedReviews(selectedEmp).length > 0 ? (
              <div className="space-y-3">
                {getSubmittedReviews(selectedEmp).map((review: Review) => (
                  <div key={review.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{review.type.toUpperCase()} Review</p>
                        <p className="text-xs text-gray-500">Rating: {review.rating}/5</p>
                      </div>
                      <span className="text-xs text-green-600">{review.submittedAt}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{review.comments}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews submitted yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ employeePerformance, selectedEmployeeId, setSelectedEmployeeId, role }: { employeePerformance: Record<string, EmployeePerformance>; selectedEmployeeId: string | null; setSelectedEmployeeId: (id: string) => void; role: UserRole }) {
  const employees = Object.values(employeePerformance);

  const displayEmployees = role === 'employee'
    ? employees.filter(e => e.employeeId === 'emp1')
    : employees;

  const selectedEmp = (selectedEmployeeId ? employeePerformance[selectedEmployeeId] : undefined) || displayEmployees[0];

  const getTrend = (history: { rating: number; date: string }[]): PerformanceTrend => {
    if (history.length < 2) return 'stable';
    const last = history[history.length - 1].rating;
    const prev = history[history.length - 2].rating;
    if (last > prev) return 'improving';
    if (last < prev) return 'declining';
    return 'stable';
  };

  const getTrendColor = (trend: PerformanceTrend) => {
    const map = {
      improving: 'text-green-600',
      declining: 'text-red-600',
      stable: 'text-amber-600',
    };
    return map[trend] || 'text-gray-600';
  };

  const getTrendIcon = (trend: PerformanceTrend) => {
    const map = {
      improving: TrendingUpIcon,
      declining: TrendingDown,
      stable: Minus,
    };
    return map[trend] || Minus;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Rating History</h2>
        {displayEmployees.length > 1 && (
          <select
            value={selectedEmployeeId || ''}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700"
          >
            {displayEmployees.map((e: any) => (
              <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
            ))}
          </select>
        )}
      </div>

      {selectedEmp && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">Current Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedEmp.ratingHistory && selectedEmp.ratingHistory.length > 0
                    ? (selectedEmp.ratingHistory.reduce((sum: number, r: any) => sum + r.rating, 0) / selectedEmp.ratingHistory.length).toFixed(1)
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEmp.ratingHistory?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trend</p>
                {(() => {
                  const trend = getTrend(selectedEmp.ratingHistory || []);
                  const Icon = getTrendIcon(trend);
                  return (
                    <p className={`text-2xl font-bold ${getTrendColor(trend)} flex items-center gap-2`}>
                      <Icon className="w-6 h-6" />
                      {trend.toUpperCase()}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>

          {selectedEmp.ratingHistory && selectedEmp.ratingHistory.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Cycle</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Date</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Rating</th>
                    <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmp.ratingHistory.map((entry: any, idx: number) => {
                    let trend = '—';
                    let trendColor = 'text-gray-500';
                    let trendIcon = null;
                    if (idx > 0) {
                      const prev = selectedEmp.ratingHistory[idx - 1].rating;
                      if (entry.rating > prev) {
                        trend = '↑';
                        trendColor = 'text-green-600';
                        trendIcon = <TrendingUpIcon className="w-3 h-3 inline" />;
                      } else if (entry.rating < prev) {
                        trend = '↓';
                        trendColor = 'text-red-600';
                        trendIcon = <TrendingDown className="w-3 h-3 inline" />;
                      } else {
                        trend = '→';
                        trendColor = 'text-amber-600';
                        trendIcon = <Minus className="w-3 h-3 inline" />;
                      }
                    }
                    return (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 text-sm text-gray-700">{entry.cycleName}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{entry.rating}/5</td>
                        <td className={`py-3 px-4 text-sm font-medium ${trendColor}`}>
                          {trendIcon} {trend}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No rating history available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DashboardTab({ employeePerformance, cycles, role }: { employeePerformance: Record<string, EmployeePerformance>; cycles: AppraisalCycle[]; role: UserRole }) {
  const employees = Object.values(employeePerformance);

  const totalEmployees = employees.length;
  const activeCycles = cycles.filter((c: AppraisalCycle) => c.status === 'in_progress').length;
  const completedCycles = cycles.filter((c: AppraisalCycle) => c.status === 'completed').length;
  const pendingCycles = cycles.filter((c: AppraisalCycle) => c.status === 'not_started').length;

  const allRatings = employees.flatMap(e => e.ratingHistory || []).map((r: any) => r.rating);
  const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) : 0;

  const allGoals = employees.flatMap(e => e.goals || []);
  const completedGoals = allGoals.filter(g => g.status === 'achieved').length;
  const goalCompletionRate = allGoals.length > 0 ? Math.round((completedGoals / allGoals.length) * 100) : 0;

  const cycleCompletionRates = cycles.map((c: AppraisalCycle) => {
    const completed = c.employeeStatus.filter((e: any) => e.status === 'completed').length;
    return { name: c.name, rate: Math.round((completed / c.employeeStatus.length) * 100) };
  });

  const departments = ['Engineering', 'Finance', 'HR', 'Sales', 'Operations', 'Customer Support'];
  const deptCompletionRates = departments.map(dept => ({
    name: dept,
    rate: Math.round(50 + Math.random() * 45),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active Cycles</p>
              <p className="text-2xl font-bold text-gray-900">{activeCycles}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}/5</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Goal Completion</p>
              <p className="text-2xl font-bold text-gray-900">{goalCompletionRate}%</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            Cycle Completion
          </h3>
          <div className="space-y-3">
            {cycleCompletionRates.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-500">{item.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            Department Completion Rate
          </h3>
          <div className="space-y-3">
            {deptCompletionRates.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-500">{item.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-blue-700" />
          Role-Specific Oversight
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-700">Department Head</p>
            <p className="text-xs text-blue-600 mt-1">Team completion: {Math.round(60 + Math.random() * 35)}%</p>
            <p className="text-xs text-blue-600">Goal achievement: {Math.round(50 + Math.random() * 45)}%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-700">Branch Manager</p>
            <p className="text-xs text-purple-600 mt-1">Branch completion: {Math.round(55 + Math.random() * 40)}%</p>
            <p className="text-xs text-purple-600">Rating distribution: 3.8 avg</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-700">HR Admin</p>
            <p className="text-xs text-green-600 mt-1">Overdue reviews: {Math.floor(Math.random() * 5)}</p>
            <p className="text-xs text-green-600">Escalations: {Math.floor(Math.random() * 3)}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-700">Executive</p>
            <p className="text-xs text-amber-600 mt-1">Cross-branch trend: {Math.random() > 0.5 ? '↑ Improving' : '→ Stable'}</p>
            <p className="text-xs text-amber-600">Completion rate: {Math.round(60 + Math.random() * 35)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}