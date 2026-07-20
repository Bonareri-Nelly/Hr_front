import { Calendar, Clock, User } from 'lucide-react';

interface UpcomingEventsProps {
  events?: {
    title: string;
    date: string;
    type: string;
    icon: React.ElementType;
  }[];
}

export const UpcomingEvents = ({ events = [] }: UpcomingEventsProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Upcoming Events</h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          No upcoming events
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Upcoming Events</h3>
      <div className="space-y-2">
        {events.slice(0, 3).map((event, idx) => (
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