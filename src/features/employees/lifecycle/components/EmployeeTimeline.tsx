
import { useState } from 'react';
import { 
  Calendar,
  UserPlus,
  Briefcase,
  TrendingUp,
  Gift,
  DollarSign,
  CalendarDays,
  UserX,
  Clock,
  ChevronRight,
  Eye,
  Building2
} from 'lucide-react';
import { MilestoneCard } from './MilestoneCard';
import { MilestoneModal } from './MilestoneModal';
import { LifecycleStageBadge } from './LifecycleStageBadge';
import { TenureBadge } from './TenureBadge';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  role: string;
  stage: 'onboarding' | 'active' | 'notice_period' | 'offboarded';
  startDate: string;
  tenure: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  type: 'hire' | 'probation' | 'promotion' | 'transfer' | 'performance' | 'benefits' | 'salary' | 'leave' | 'offboarding';
  date: string;
  title: string;
  description: string;
  moduleLink: string;
  details?: any;
}

interface EmployeeTimelineProps {
  employee: Employee;
}

const milestoneColors = {
  hire: 'bg-blue-50 border-blue-200 text-blue-700',
  probation: 'bg-amber-50 border-amber-200 text-amber-700',
  promotion: 'bg-green-50 border-green-200 text-green-700',
  transfer: 'bg-purple-50 border-purple-200 text-purple-700',
  performance: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  benefits: 'bg-teal-50 border-teal-200 text-teal-700',
  salary: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  leave: 'bg-orange-50 border-orange-200 text-orange-700',
  offboarding: 'bg-red-50 border-red-200 text-red-700',
};

const milestoneIcons = {
  hire: UserPlus,
  probation: Clock,
  promotion: TrendingUp,
  transfer: Briefcase,
  performance: TrendingUp,
  benefits: Gift,
  salary: DollarSign,
  leave: CalendarDays,
  offboarding: UserX,
};

export const EmployeeTimeline = ({ employee }: EmployeeTimelineProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!employee) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Employee not found</p>
      </div>
    );
  }

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const sortedMilestones = [...employee.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      {/* Employee Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            {employee.name}
            <LifecycleStageBadge stage={employee.stage} />
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {employee.role}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {employee.department} · {employee.branch}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Started: {new Date(employee.startDate).toLocaleDateString()}
            </span>
            <TenureBadge startDate={employee.startDate} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition">
            View Full Profile
          </button>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const Icon = milestoneIcons[milestone.type];
            const colors = milestoneColors[milestone.type];

            return (
              <div key={milestone.id} className="relative pl-14">
                {/* Timeline Node */}
                <div className={`absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${colors}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Milestone Card */}
                <div
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors}`}>
                          {milestone.type}
                        </span>
                      </div>
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

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestone={selectedMilestone}
      />
    </div>
  );
};

