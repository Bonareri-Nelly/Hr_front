import React, { useState } from 'react';
import { 
  UserRound, 
  User, 
  Building2, 
  Calendar, 
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  UserX,
  Search,
  TrendingUp,
  CalendarDays,
  Gift,
  DollarSign,
  Briefcase,
  Eye,
  X,
  ExternalLink,
  BarChart3,
  Users,
  UserPlus,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Bell,
  Plus,
  Filter,
  Activity,
  Mail,
  Phone,
  Wallet
} from 'lucide-react';

type LifecycleStage = 'onboarding' | 'active' | 'notice_period' | 'offboarded';
type MilestoneType = 
  | 'hire' 
  | 'probation' 
  | 'promotion' 
  | 'transfer' 
  | 'performance' 
  | 'benefits' 
  | 'salary' 
  | 'leave' 
  | 'offboarding'
  | 'payroll';

interface Milestone {
  id: string;
  type: MilestoneType;
  date: string;
  title: string;
  description: string;
  moduleLink: string;
  details?: Record<string, any>;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  branch: string;
  role: string;
  stage: LifecycleStage;
  startDate: string;
  employmentType: string;
  milestones: Milestone[];
  upcomingMilestones: { id: string; type: MilestoneType; date: string; title: string }[];
  activity: { date: string; text: string; icon: React.ElementType }[];
}

const stageConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  onboarding: {
    label: 'Onboarding',
    icon: Clock,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  active: {
    label: 'Active',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  notice_period: {
    label: 'Notice Period',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  offboarded: {
    label: 'Offboarding Complete',
    icon: UserX,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

const milestoneIcons: Record<string, React.ElementType> = {
  hire: UserPlus,
  probation: Clock,
  promotion: TrendingUp,
  transfer: Briefcase,
  performance: TrendingUp,
  benefits: Gift,
  salary: DollarSign,
  leave: CalendarDays,
  offboarding: UserX,
  payroll: Wallet,
};

const milestoneColors: Record<string, string> = {
  hire: 'bg-blue-50 border-blue-200 text-blue-700',
  probation: 'bg-amber-50 border-amber-200 text-amber-700',
  promotion: 'bg-green-50 border-green-200 text-green-700',
  transfer: 'bg-purple-50 border-purple-200 text-purple-700',
  performance: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  benefits: 'bg-teal-50 border-teal-200 text-teal-700',
  salary: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  leave: 'bg-orange-50 border-orange-200 text-orange-700',
  offboarding: 'bg-red-50 border-red-200 text-red-700',
  payroll: 'bg-cyan-50 border-cyan-200 text-cyan-700',
};

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Kimani',
    email: 'sarah.kimani@optimum.com',
    phone: '+254 712 345 678',
    department: 'Engineering',
    branch: 'Nairobi HQ',
    role: 'Senior Software Engineer',
    stage: 'active',
    startDate: '2024-01-15',
    employmentType: 'Permanent',
    milestones: [
      {
        id: 'm1',
        type: 'hire',
        date: '2024-01-15',
        title: 'Hired as Software Engineer',
        description: 'Onboarding completed successfully',
        moduleLink: '/employees/onboarding/1',
        details: { department: 'Engineering', manager: 'John Doe' },
      },
      {
        id: 'm2',
        type: 'probation',
        date: '2024-04-15',
        title: 'Probation Completed',
        description: 'Successfully completed 3-month probation',
        moduleLink: '/employees/performance/1',
        details: { rating: 'Exceeds Expectations' },
      },
      {
        id: 'm3',
        type: 'promotion',
        date: '2025-01-15',
        title: 'Promoted to Senior Software Engineer',
        description: 'Promotion after 1 year of service',
        moduleLink: '/employees/promotions/1',
        details: { new_role: 'Senior Software Engineer', increment: '15%' },
      },
      {
        id: 'm4',
        type: 'performance',
        date: '2025-06-01',
        title: 'Performance Review - Q2 2025',
        description: 'Annual performance review completed',
        moduleLink: '/performance/reviews/1',
        details: { rating: '4.5', cycle: 'Q2 2025' },
      },
      {
        id: 'm5',
        type: 'benefits',
        date: '2025-07-01',
        title: 'Enrolled in Medical Insurance',
        description: 'Company medical insurance enrollment',
        moduleLink: '/benefits/1',
        details: { plan: 'Family Plan', provider: 'Jubilee Insurance' },
      },
      {
        id: 'm6',
        type: 'payroll',
        date: '2025-05-25',
        title: 'Payroll Processed - May 2025',
        description: 'Monthly salary of KES 850,000 processed successfully',
        moduleLink: '/payroll/history/1',
        details: { amount: 'KES 850,000', period: 'May 2025', status: 'Success' },
      },
      {
        id: 'm7',
        type: 'payroll',
        date: '2025-04-25',
        title: 'Payroll Failed - April 2025',
        description: 'Salary processing failed due to bank integration error. Retried and resolved.',
        moduleLink: '/payroll/history/1',
        details: { amount: 'KES 850,000', period: 'April 2025', status: 'Failed - Retried' },
      },
      {
        id: 'm8',
        type: 'salary',
        date: '2025-06-01',
        title: 'Salary Adjustment',
        description: 'Annual increment of 5% applied',
        moduleLink: '/payroll/history/1',
        details: { previous: 'KES 810,000', new: 'KES 850,000', reason: 'Annual review' },
      },
    ],
    upcomingMilestones: [
      { id: 'u1', type: 'performance', date: '2025-09-01', title: 'Performance Review - Q3 2025' },
      { id: 'u2', type: 'benefits', date: '2025-10-01', title: 'Benefits Renewal' },
      { id: 'u3', type: 'payroll', date: '2025-06-25', title: 'Payroll Processing - June 2025' },
    ],
    activity: [
      { date: '2025-06-15', text: 'Profile updated', icon: User },
      { date: '2025-06-10', text: 'Leave request submitted', icon: Calendar },
      { date: '2025-06-05', text: 'Performance review completed', icon: TrendingUp },
    ],
  },
  {
    id: '2',
    name: 'James Ochieng',
    email: 'james.ochieng@optimum.com',
    phone: '+254 723 456 789',
    department: 'Finance',
    branch: 'Nairobi HQ',
    role: 'Finance Manager',
    stage: 'notice_period',
    startDate: '2020-03-01',
    employmentType: 'Permanent',
    milestones: [
      {
        id: 'm9',
        type: 'hire',
        date: '2020-03-01',
        title: 'Hired as Finance Analyst',
        description: 'Onboarding completed',
        moduleLink: '/employees/onboarding/2',
        details: { department: 'Finance', manager: 'CEO' },
      },
      {
        id: 'm10',
        type: 'promotion',
        date: '2022-03-01',
        title: 'Promoted to Finance Manager',
        description: 'Promotion after 2 years',
        moduleLink: '/employees/promotions/2',
        details: { new_role: 'Finance Manager', increment: '20%' },
      },
      {
        id: 'm11',
        type: 'offboarding',
        date: '2024-07-15',
        title: 'Offboarding Initiated',
        description: 'Notice period started. Last day: 2024-08-15',
        moduleLink: '/employees/offboarding/2',
        details: { reason: 'Resignation', last_day: '2024-08-15' },
      },
      {
        id: 'm12',
        type: 'payroll',
        date: '2024-07-25',
        title: 'Final Payroll Processed',
        description: 'Final settlement and last salary processed',
        moduleLink: '/payroll/history/2',
        details: { amount: 'KES 950,000', period: 'July 2024', status: 'Final Settlement' },
      },
    ],
    upcomingMilestones: [
      { id: 'u4', type: 'offboarding', date: '2024-08-15', title: 'Last Working Day' },
    ],
    activity: [
      { date: '2024-07-15', text: 'Offboarding initiated', icon: UserX },
      { date: '2024-07-10', text: 'Resignation submitted', icon: AlertCircle },
    ],
  },
  {
    id: '3',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@optimum.com',
    phone: '+254 734 567 890',
    department: 'HR',
    branch: 'Nairobi HQ',
    role: 'HR Business Partner',
    stage: 'active',
    startDate: '2021-06-01',
    employmentType: 'Permanent',
    milestones: [
      {
        id: 'm13',
        type: 'hire',
        date: '2021-06-01',
        title: 'Hired as HR Coordinator',
        description: 'Onboarding completed',
        moduleLink: '/employees/onboarding/3',
        details: { department: 'HR', manager: 'HR Director' },
      },
      {
        id: 'm14',
        type: 'promotion',
        date: '2023-06-01',
        title: 'Promoted to HR Business Partner',
        description: 'Promotion after 2 years',
        moduleLink: '/employees/promotions/3',
        details: { new_role: 'HR Business Partner', increment: '12%' },
      },
      {
        id: 'm15',
        type: 'performance',
        date: '2025-03-01',
        title: 'Performance Review - Q1 2025',
        description: 'Quarterly performance review',
        moduleLink: '/performance/reviews/3',
        details: { rating: '4.8', cycle: 'Q1 2025' },
      },
    ],
    upcomingMilestones: [
      { id: 'u5', type: 'promotion', date: '2025-12-01', title: 'Potential promotion review' },
    ],
    activity: [
      { date: '2025-05-20', text: 'Department head meeting attended', icon: Users },
      { date: '2025-05-15', text: 'Training session completed', icon: Calendar },
    ],
  },
];

const mockAnalytics = {
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
  stageDistribution: [
    { stage: 'Onboarding', count: 8 },
    { stage: 'Active', count: 42 },
    { stage: 'Notice Period', count: 3 },
    { stage: 'Offboarding Complete', count: 5 },
  ],
};

function Toast({ message, type, onClose }: any) {
  const colors = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type] || colors.info}`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
    </div>
  );
}

function EmployeeList({ employees, onSelect }: any) {
  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Employee</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Department</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Branch</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Role</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Stage</th>
              <th className="text-right text-xs text-gray-500 py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp: Employee) => {
              const config = stageConfig[emp.stage];
              const Icon = config?.icon || Clock;
              return (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => onSelect(emp.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{emp.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{emp.branch}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{emp.role}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config?.color || ''}`}>
                      <Icon className="w-3 h-3" />
                      {config?.label || emp.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MilestoneModal({ isOpen, onClose, milestone, onViewFullRecord }: any) {
  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(milestone.date).toLocaleDateString()}</span>
        </div>
        {milestone.details && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4 space-y-2">
            {Object.entries(milestone.details).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                <span className="text-gray-700 font-medium">{value as string}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewFullRecord(milestone)}
            className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeTimeline({ employee, onBack, onViewFullRecord }: any) {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!employee) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Employee not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
        >
          ← Back to List
        </button>
      </div>
    );
  }

  const milestones = employee.milestones || [];
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleMilestoneClick = (milestone: any) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const config = stageConfig[employee.stage];
  const StageIcon = config?.icon || Clock;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            {employee.name}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config?.color || ''}`}>
              <StageIcon className="w-3 h-3" />
              {config?.label || employee.stage}
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{employee.role}</span>
            <span>·</span>
            <span>{employee.department}</span>
            <span>·</span>
            <span>{employee.branch}</span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
        >
          ← Back to List
        </button>
      </div>

      {sortedMilestones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No milestones recorded yet</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {sortedMilestones.map((milestone: any) => {
              const Icon = milestoneIcons[milestone.type] || Clock;
              const colors = milestoneColors[milestone.type] || 'bg-gray-50 border-gray-200 text-gray-700';
              return (
                <div key={milestone.id} className="relative pl-14">
                  <div className={`absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleMilestoneClick(milestone)}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(milestone.date).toLocaleDateString()}
                          </span>
                          <button
                            className="text-xs text-blue-700 hover:underline flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMilestoneClick(milestone);
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestone={selectedMilestone}
        onViewFullRecord={onViewFullRecord}
      />
    </div>
  );
}

function LifecycleAnalytics({ data }: any) {
  const metrics = [
    { label: 'Avg Time to Promotion', value: data?.avgTimeToPromotion || 'N/A', icon: TrendingUp },
    { label: 'Avg Tenure', value: data?.avgTenure || 'N/A', icon: Clock },
    { label: 'Onboarding Completion', value: data?.onboardingCompletionRate ? `${data.onboardingCompletionRate}%` : 'N/A', icon: Users },
    { label: 'Time to Productivity', value: data?.timeToProductivity || 'N/A', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <metric.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-700" />
          Attrition by Stage
        </h3>
        <div className="space-y-3">
          {data?.attritionByStage?.map((item: any) => (
            <div key={item.stage}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.stage}</span>
                <span className="text-gray-500">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeeProfileCard({ employee, onAddNote, onRemind }: any) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isRemindModalOpen, setIsRemindModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [reminderText, setReminderText] = useState('');

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    onAddNote(noteText);
    setNoteText('');
    setIsNoteModalOpen(false);
  };

  const handleRemind = () => {
    if (!reminderText.trim()) return;
    onRemind(reminderText);
    setReminderText('');
    setIsRemindModalOpen(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-blue-700" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${stageConfig[employee.stage]?.color || ''}`}>
                {React.createElement(stageConfig[employee.stage]?.icon || Clock, { className: "w-3 h-3" })}
                {stageConfig[employee.stage]?.label || employee.stage}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {employee.role}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                {employee.department} · {employee.branch}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                Started: {new Date(employee.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {employee.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                {employee.employmentType}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="px-3 py-1.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
            <button
              onClick={() => setIsRemindModalOpen(true)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Remind
            </button>
          </div>
        </div>
      </div>

      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsNoteModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Note for {employee.name}</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Enter note here..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddNote}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
              >
                Save Note
              </button>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isRemindModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsRemindModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Send Reminder to {employee.name}</h3>
              <button onClick={() => setIsRemindModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <textarea
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              rows={3}
              placeholder="Reminder message..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRemind}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition"
              >
                Send Reminder
              </button>
              <button
                onClick={() => setIsRemindModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UpcomingMilestones({ milestones }: { milestones: any[] }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
        No upcoming milestones
      </div>
    );
  }

  const sorted = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-700" />
        Upcoming Milestones
      </h4>
      <div className="space-y-2">
        {sorted.slice(0, 3).map((milestone) => {
          const daysUntil = Math.ceil((new Date(milestone.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const Icon = milestoneIcons[milestone.type] || Clock;
          return (
            <div key={milestone.id} className="flex items-center justify-between text-sm bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded">
                  <Icon className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{milestone.title}</p>
                  <p className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                daysUntil <= 7 ? 'bg-red-100 text-red-700' :
                daysUntil <= 30 ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {daysUntil <= 0 ? 'Today' : `${daysUntil} days`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-700" />
        Recent Activity
      </h4>
      <div className="space-y-2">
        {activities.slice(0, 4).map((activity, idx) => {
          const Icon = activity.icon || Clock;
          return (
            <div key={idx} className="flex items-center gap-3 text-sm bg-white rounded-lg p-2 border border-gray-100">
              <div className="p-1.5 bg-gray-100 rounded">
                <Icon className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="text-gray-700">{activity.text}</span>
              <span className="text-xs text-gray-400 ml-auto">{new Date(activity.date).toLocaleDateString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageDistribution({ data }: { data: any[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const colors: Record<string, string> = {
    'Onboarding': 'bg-amber-500',
    'Active': 'bg-green-500',
    'Notice Period': 'bg-orange-500',
    'Offboarding Complete': 'bg-gray-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-700" />
        Employee Stage Distribution
      </h4>
      <div className="space-y-2">
        {data.map((item) => {
          const percentage = Math.round((item.count / total) * 100);
          const color = colors[item.stage] || 'bg-blue-500';
          return (
            <div key={item.stage}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{item.stage}</span>
                <span className="text-gray-500">{item.count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExportDropdown({ onExport }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3 h-3" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
            <button
              onClick={() => { setIsOpen(false); onExport('pdf'); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              Export as PDF
            </button>
            <button
              onClick={() => { setIsOpen(false); onExport('excel'); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-500" />
              Export as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AdvancedFilters({
  searchTerm,
  setSearchTerm,
  selectedStage,
  setSelectedStage,
  selectedDepartment,
  setSelectedDepartment,
  selectedBranch,
  setSelectedBranch,
  selectedEmploymentType,
  setSelectedEmploymentType,
}: any) {
  const stages = ['all', 'onboarding', 'active', 'notice_period', 'offboarded'];
  const departments = ['all', 'Engineering', 'Finance', 'HR', 'Sales', 'Operations'];
  const branches = ['all', 'Nairobi HQ', 'Mombasa', 'Kisumu'];
  const employmentTypes = ['all', 'Permanent', 'Contract', 'Intern'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
          />
        </div>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {stages.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Stages' : s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
          ))}
        </select>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {branches.map((b) => (
            <option key={b} value={b}>{b === 'all' ? 'All Branches' : b}</option>
          ))}
        </select>
        <select
          value={selectedEmploymentType}
          onChange={(e) => setSelectedEmploymentType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {employmentTypes.map((e) => (
            <option key={e} value={e}>{e === 'all' ? 'All Types' : e}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function EmployeeLifecyclePage() {
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'analytics'>('list');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [employees, setEmployees] = useState(mockEmployees);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || emp.stage === selectedStage;
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesBranch = selectedBranch === 'all' || emp.branch === selectedBranch;
    const matchesEmployment = selectedEmploymentType === 'all' || emp.employmentType === selectedEmploymentType;
    return matchesSearch && matchesStage && matchesDepartment && matchesBranch && matchesEmployment;
  });

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setViewMode('timeline');
  };

  const handleBackToList = () => {
    setSelectedEmployeeId(null);
    setViewMode('list');
  };

  const handleToggleAnalytics = () => {
    setViewMode(viewMode === 'analytics' ? 'list' : 'analytics');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddNote = (employeeId: string, noteText: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            activity: [
              { date: new Date().toISOString().slice(0, 10), text: noteText, icon: User },
              ...emp.activity
            ]
          };
        }
        return emp;
      })
    );
    showToast('Note added successfully!', 'success');
  };

  const handleRemind = (employeeId: string, reminderText: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;
    const newMilestone = {
      id: `u${Date.now()}`,
      type: 'performance' as MilestoneType,
      date: new Date().toISOString().slice(0, 10),
      title: reminderText.slice(0, 40) + (reminderText.length > 40 ? '...' : ''),
    };
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            upcomingMilestones: [...emp.upcomingMilestones, newMilestone]
          };
        }
        return emp;
      })
    );
    showToast('Reminder sent!', 'success');
  };

  const handleViewFullRecord = (milestone: any) => {
    window.open(milestone.moduleLink, '_blank');
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    showToast(`Exporting ${format.toUpperCase()}...`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UserRound className="w-7 h-7 text-blue-700" />
            Employee Lifecycle
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Unified view of employee journeys from onboarding to offboarding
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            List
          </button>
          <button
            onClick={handleToggleAnalytics}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              viewMode === 'analytics'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Analytics
          </button>
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {viewMode === 'list' && (
        <AdvancedFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedEmploymentType={selectedEmploymentType}
          setSelectedEmploymentType={setSelectedEmploymentType}
        />
      )}

      <div className="mt-6">
        {viewMode === 'list' && (
          <EmployeeList
            employees={filteredEmployees}
            onSelect={handleSelectEmployee}
          />
        )}

        {viewMode === 'timeline' && selectedEmployee && (
          <div className="space-y-6">
            <EmployeeProfileCard
              employee={selectedEmployee}
              onAddNote={(text: string) => handleAddNote(selectedEmployee.id, text)}
              onRemind={(text: string) => handleRemind(selectedEmployee.id, text)}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <EmployeeTimeline
                    employee={selectedEmployee}
                    onBack={handleBackToList}
                    onViewFullRecord={handleViewFullRecord}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <UpcomingMilestones milestones={selectedEmployee.upcomingMilestones} />
                <ActivityFeed activities={selectedEmployee.activity} />
                <StageDistribution data={mockAnalytics.stageDistribution} />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LifecycleAnalytics data={mockAnalytics} />
              </div>
              <div>
                <StageDistribution data={mockAnalytics.stageDistribution} />
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}