import { X, Calendar, Building2, User, Link2, ExternalLink } from 'lucide-react';

interface Milestone {
  id: string;
  type: 'hire' | 'probation' | 'promotion' | 'transfer' | 'performance' | 'benefits' | 'salary' | 'leave' | 'offboarding';
  date: string;
  title: string;
  description: string;
  moduleLink: string;
  details?: any;
}

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
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

export const MilestoneModal = ({ isOpen, onClose, milestone }: MilestoneModalProps) => {
  if (!isOpen || !milestone) return null;

  const typeLabel = milestoneTypeLabels[milestone.type] || milestone.type;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {typeLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(milestone.date).toLocaleDateString()}</span>
          </div>

          {milestone.details && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {Object.entries(milestone.details).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-gray-700 font-medium">{value as string}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2">
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
    </div>
  );
};