export interface CalendarDayLog {
  dayNumber: number;
  status: 'attended' | 'missed' | 'pending' | 'empty';
}

export interface EmployeeDashboardData {
  user: {
    name: string;
    location: string;
    department: string;
  };
  stats: { label: string; value: string | number }[];
  actions: { title: string; description: string }[];
  timeline: { date: string; title: string; description: string }[];
  calendarDays: CalendarDayLog[];
}
