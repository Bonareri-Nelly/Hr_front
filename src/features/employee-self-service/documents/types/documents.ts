export interface DocumentItem {
  id: string; // Added to uniquely identify records for late sending
  title: string;
  status: 'signed' | 'acknowledged' | 'pending signature' | 'filed' | 'uploaded';
  category: string;
  routedTo?: string; 
  isDraft: boolean; // Tracks if the file is stored locally or already sent
}

export interface DocumentsDashboardData {
  library: DocumentItem[];
}
