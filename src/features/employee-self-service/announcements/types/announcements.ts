export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderRole: 'HR Operations' | 'Branch Manager' | 'Department Head';
  senderName: string;
  dateSent: string;
  deadline?: string;
  isRead: boolean;
}

export interface AnnouncementsDashboardData {
  items: Announcement[];
}
