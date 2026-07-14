interface ActivityFeedProps {
  activities: { time: string; text: string }[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((act, idx) => (
          <div key={idx} className="flex gap-3 text-xs border-b last:border-0 pb-2 last:pb-0">
            <span className="text-gray-400 font-mono whitespace-nowrap">{act.time}</span>
            <span className="text-gray-700">{act.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};