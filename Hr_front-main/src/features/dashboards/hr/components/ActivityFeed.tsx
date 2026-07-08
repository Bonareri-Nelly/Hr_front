const activities = [
  { time: '10:30 AM', text: 'Payroll for Nairobi HQ approved by Finance' },
  { time: '09:15 AM', text: 'John Doe submitted timesheet adjustments' },
  { time: 'Yesterday', text: 'New employee onboarding completed (5 staff)' },
];

export const ActivityFeed = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((act, idx) => (
          <div key={idx} className="flex gap-3 text-xs border-b last:border-0 pb-2 last:pb-0">  {/* was text-sm */}
            <span className="text-gray-400 font-mono whitespace-nowrap">{act.time}</span>
            <span className="text-gray-700">{act.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};