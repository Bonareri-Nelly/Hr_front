import { Calendar, Clock, User } from 'lucide-react';

interface UpcomingEventsProps {
  branch: string;
}

export const UpcomingEvents = ({ branch }: UpcomingEventsProps) => {
  const events = {
    'Nairobi HQ': [
      { title: 'Leave Request - John Doe', date: 'Tomorrow', type: 'Pending Approval', icon: Clock },
      { title: 'Contract Renewal - Jane Smith', date: 'July 10', type: 'Upcoming', icon: Calendar },
      { title: 'Onboarding - 5 New Employees', date: 'July 15', type: 'Scheduled', icon: User },
      { title: 'Performance Reviews', date: 'July 20', type: 'Coming Up', icon: Calendar },
    ],
    'Mombasa': [
      { title: 'Team Meeting - Sales', date: 'Tomorrow', type: 'Scheduled', icon: Calendar },
      { title: 'Performance Reviews - Q2', date: 'July 12', type: 'Pending', icon: User },
    ],
  };

  const branchEvents = events[branch] || events['Nairobi HQ'];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Upcoming Events</h3>
      <div className="space-y-2">
        {branchEvents.map((event, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs border-b last:border-0 pb-2 last:pb-0">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <event.icon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-xs">{event.title}</p>
              <p className="text-[10px] text-gray-500">{event.date} · {event.type}</p>
            </div>
            <button className="text-[10px] text-blue-600 hover:underline">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};