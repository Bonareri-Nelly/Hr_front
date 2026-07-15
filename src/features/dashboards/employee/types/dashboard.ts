export interface StatCardProps {
  label: string;
  value: string | number;
}

export interface QuickActionProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export interface TimelineEventProps {
  date: string;
  title: string;
  description: string;
}

export interface DashboardData {
  user: {
    name: string;
    location: string;
    department: string;
    role: string;
  };
  stats: StatCardProps[];
  actions: QuickActionProps[];
  timeline: TimelineEventProps[];
}

export interface AssignedTask {
  id: string;
  title: string;
  dueDate: string;
  assignedBy: string;
  status: 'pending' | 'in progress' | 'completed';
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
  tasks: AssignedTask[];
}

