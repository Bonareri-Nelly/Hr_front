import { Calendar, ChevronRight } from 'lucide-react';

interface Milestone {
  id: string;
  type: 'hire' | 'probation' | 'promotion' | 'transfer' | 'performance' | 'benefits' | 'salary' | 'leave' | 'offboarding';
  date: string;
  title: string;
  description: string;
  moduleLink: string;
  details?: any;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onClick: () => void;
  color: string;
  icon: React.ElementType;
}

const milestoneTypeLabels = {
  hire: 'Hire',
  probation: 'Probation',
  promotion: 'Promotion',
  transfer: 'Transfer',
  performance: 'Performance Review',
  benefits: 'Benefits Enrollment',
  salary: 'Salary Increment',
  leave: 'Leave of Absence',
  offboarding: 'Offboarding',
};

export const MilestoneCard = ({ milestone, onClick, color, icon: Icon }: MilestoneCardProps) => {
  return (
    <div
      className={`border rounded-xl p-4 hover:shadow-md transition cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/50">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
            <p className="text-sm text-gray-600">{milestone.description}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(milestone.date).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500">
                {milestoneTypeLabels[milestone.type]}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};