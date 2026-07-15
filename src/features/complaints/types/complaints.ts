export interface ComplaintTicket {
  id: string;
  subject: string;
  date: string;
  status: 'resolved' | 'under review';
  updateType: 'Resolution' | 'Status update';
  updateText: string;
}

export interface ComplaintFormData {
  category: string;
  subject: string;
  details: string;
  preferredResolution: string;
  confidentiality: string;
}
