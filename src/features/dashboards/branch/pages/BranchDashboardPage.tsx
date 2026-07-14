import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  UserMinus,
  Award,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bell,
  Settings,
  HelpCircle,
  BookOpen,
  Upload,
  FileText,
  Printer,
  Send,
  Save,
  AlertCircle,
  Check,
  X,
  Zap,
  Crown,
  Target,
  Flame,
  Coffee,
  Gift,
  Heart,
  Smile,
  Frown,
  Meh,
  LayoutGrid,
  List,
  Info,
  UserCheck,
  UserX,
  UserCog,
  CalendarDays,
  Clock as ClockIcon,
  Activity,
  Percent,
  Receipt,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

// ==================== INTERFACES ====================
interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  status: "Present" | "Absent" | "Late" | "On Leave" | "Remote";
  checkIn?: string;
  checkOut?: string;
  avatar?: string;
  email: string;
  phone: string;
  joinDate: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary: number;
  attendance: {
    present: number;
    absent: number;
    late: number;
    overtime: number;
    totalDays: number;
  };
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
}

interface LeaveRequest {
  id: string;
  employee: string;
  employeeId: string;
  type: "Annual" | "Sick" | "Personal" | "Maternity" | "Paternity" | "Compassionate" | "Other";
  startDate: string;
  endDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  reason: string;
  submitted: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
  overtime: number;
}

interface BranchTask {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done" | "Blocked";
  dueDate: string;
  assignedTo: string;
  department: string;
  createdBy: string;
  createdAt: string;
}

interface BranchAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "Info" | "Warning" | "Success" | "Urgent";
  author: string;
  expiresAt?: string;
}

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error" | "birthday" | "contract" | "probation" | "payroll";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    link: string;
  };
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: "attendance" | "payroll" | "leave" | "employee" | "task" | "system";
  department?: string;
}

interface PayrollSummary {
  totalPayroll: number;
  processedPayroll: number;
  pendingPayroll: number;
  totalDeductions: number;
  totalBonuses: number;
  totalAllowances: number;
  paye: number;
  nssf: number;
  nhif: number;
  housingLevy: number;
  shif: number;
}

interface DepartmentSummary {
  name: string;
  employees: number;
  head: string;
  attendanceRate: number;
  presentToday: number;
  totalEmployees: number;
}

// ==================== MOCK DATA ====================
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Winnie Adera",
    position: "Front Office Lead",
    department: "Front Office",
    status: "Present",
    checkIn: "08:15",
    checkOut: "17:00",
    email: "winnie.a@branch.com",
    phone: "+254 712 345 678",
    joinDate: "2022-01-15",
    employmentType: "Full-time",
    salary: 85000,
    attendance: { present: 22, absent: 0, late: 1, overtime: 5, totalDays: 22 },
    leaveBalance: { annual: 15, sick: 10, personal: 3 },
  },
  {
    id: "2",
    name: "David Kariuki",
    position: "Operations Manager",
    department: "Operations",
    status: "Late",
    checkIn: "09:30",
    checkOut: "18:00",
    email: "david.k@branch.com",
    phone: "+254 723 456 789",
    joinDate: "2019-06-01",
    employmentType: "Full-time",
    salary: 120000,
    attendance: { present: 18, absent: 1, late: 3, overtime: 8, totalDays: 22 },
    leaveBalance: { annual: 18, sick: 12, personal: 5 },
  },
  {
    id: "3",
    name: "Nadia Osman",
    position: "Customer Service Lead",
    department: "Customer Service",
    status: "Present",
    checkIn: "08:00",
    checkOut: "16:30",
    email: "nadia.o@branch.com",
    phone: "+254 734 567 890",
    joinDate: "2021-03-10",
    employmentType: "Full-time",
    salary: 78000,
    attendance: { present: 21, absent: 0, late: 0, overtime: 4, totalDays: 22 },
    leaveBalance: { annual: 14, sick: 9, personal: 2 },
  },
  {
    id: "4",
    name: "Peter Mwangi",
    position: "Finance Officer",
    department: "Finance",
    status: "On Leave",
    checkIn: "-",
    checkOut: "-",
    email: "peter.m@branch.com",
    phone: "+254 745 678 901",
    joinDate: "2020-08-20",
    employmentType: "Full-time",
    salary: 95000,
    attendance: { present: 19, absent: 1, late: 0, overtime: 6, totalDays: 20 },
    leaveBalance: { annual: 12, sick: 8, personal: 3 },
  },
  {
    id: "5",
    name: "Eunice Njeri",
    position: "Field Sales Lead",
    department: "Field Sales",
    status: "Remote",
    checkIn: "08:00",
    checkOut: "17:00",
    email: "eunice.n@branch.com",
    phone: "+254 756 789 012",
    joinDate: "2021-11-05",
    employmentType: "Full-time",
    salary: 82000,
    attendance: { present: 20, absent: 0, late: 0, overtime: 10, totalDays: 20 },
    leaveBalance: { annual: 13, sick: 7, personal: 2 },
  },
  {
    id: "6",
    name: "James Ochieng",
    position: "IT Support",
    department: "Operations",
    status: "Present",
    checkIn: "08:30",
    checkOut: "17:30",
    email: "james.o@branch.com",
    phone: "+254 767 890 123",
    joinDate: "2022-05-20",
    employmentType: "Contract",
    salary: 65000,
    attendance: { present: 20, absent: 0, late: 2, overtime: 12, totalDays: 22 },
    leaveBalance: { annual: 8, sick: 5, personal: 1 },
  },
  {
    id: "7",
    name: "Mary Wanjiru",
    position: "Receptionist",
    department: "Front Office",
    status: "Absent",
    checkIn: "-",
    checkOut: "-",
    email: "mary.w@branch.com",
    phone: "+254 778 901 234",
    joinDate: "2023-02-01",
    employmentType: "Intern",
    salary: 35000,
    attendance: { present: 15, absent: 3, late: 2, overtime: 0, totalDays: 20 },
    leaveBalance: { annual: 6, sick: 4, personal: 1 },
  },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "l1",
    employee: "Peter Mwangi",
    employeeId: "4",
    type: "Annual",
    startDate: "2026-03-28",
    endDate: "2026-04-01",
    days: 5,
    status: "Pending",
    reason: "Family vacation",
    submitted: "2026-03-20T09:00:00",
  },
  {
    id: "l2",
    employee: "Mary Wanjiru",
    employeeId: "7",
    type: "Sick",
    startDate: "2026-03-30",
    endDate: "2026-03-30",
    days: 1,
    status: "Pending",
    reason: "Doctor's appointment",
    submitted: "2026-03-29T14:30:00",
  },
  {
    id: "l3",
    employee: "David Kariuki",
    employeeId: "2",
    type: "Personal",
    startDate: "2026-04-05",
    endDate: "2026-04-06",
    days: 2,
    status: "Approved",
    reason: "Personal errands",
    submitted: "2026-03-25T11:00:00",
    approvedBy: "HR Manager",
    approvedDate: "2026-03-26T10:00:00",
  },
  {
    id: "l4",
    employee: "Winnie Adera",
    employeeId: "1",
    type: "Annual",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    days: 3,
    status: "Pending",
    reason: "Weekend getaway",
    submitted: "2026-03-30T08:00:00",
  },
];

const mockAttendanceRecords: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, i + 1);
  const absent = i % 6 === 0 ? 2 : i % 4 === 0 ? 1 : 0;
  const late = i % 5 === 0 ? 1 : 0;
  const onLeave = i % 7 === 0 ? 1 : 0;
  const overtime = i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;

  return {
    date: date.toISOString().split("T")[0],
    present: 25 - absent - late - onLeave,
    absent,
    late,
    onLeave,
    total: 25,
    overtime,
  };
});

const mockTasks: BranchTask[] = [
  {
    id: "t1",
    title: "Approve leave cover plans",
    description: "Review and approve leave cover plans for Operations team",
    priority: "High",
    status: "Todo",
    dueDate: "2026-03-30",
    assignedTo: "David Kariuki",
    department: "Operations",
    createdBy: "HR Manager",
    createdAt: "2026-03-25T09:00:00",
  },
  {
    id: "t2",
    title: "Clear payroll bank changes",
    description: "Review and approve bank change requests for payroll",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-03-30",
    assignedTo: "Peter Mwangi",
    department: "Finance",
    createdBy: "Finance Manager",
    createdAt: "2026-03-24T10:00:00",
  },
  {
    id: "t3",
    title: "Submit branch safety checklist",
    description: "Complete monthly safety and compliance checklist",
    priority: "Medium",
    status: "Todo",
    dueDate: "2026-03-31",
    assignedTo: "Winnie Adera",
    department: "Front Office",
    createdBy: "Safety Officer",
    createdAt: "2026-03-26T08:00:00",
  },
  {
    id: "t4",
    title: "Confirm field sales attendance",
    description: "Review and confirm field sales attendance notes",
    priority: "Medium",
    status: "Todo",
    dueDate: "2026-04-01",
    assignedTo: "Eunice Njeri",
    department: "Field Sales",
    createdBy: "Sales Manager",
    createdAt: "2026-03-27T14:00:00",
  },
  {
    id: "t5",
    title: "Update customer service protocols",
    description: "Review and update customer service standard operating procedures",
    priority: "Low",
    status: "Done",
    dueDate: "2026-03-28",
    assignedTo: "Nadia Osman",
    department: "Customer Service",
    createdBy: "Operations Manager",
    createdAt: "2026-03-20T09:00:00",
  },
];

const mockAnnouncements: BranchAnnouncement[] = [
  {
    id: "a1",
    title: "Payroll Deadline Extended",
    content: "The payroll submission deadline has been extended to April 5th. Please ensure all changes are submitted by then.",
    date: "2026-03-29",
    type: "Info",
    author: "HR Department",
  },
  {
    id: "a2",
    title: "Safety Inspection Scheduled",
    content: "Branch safety inspection will take place on April 2nd. Please ensure all safety protocols are followed.",
    date: "2026-03-28",
    type: "Warning",
    author: "Safety Officer",
  },
  {
    id: "a3",
    title: "New Training Program",
    content: "New customer service training program starts April 15th. All CS staff must register by April 5th.",
    date: "2026-03-27",
    type: "Success",
    author: "Training Department",
  },
  {
    id: "a4",
    title: "System Maintenance",
    content: "The HR system will be down for maintenance on April 3rd from 2 AM to 6 AM.",
    date: "2026-03-30",
    type: "Urgent",
    author: "IT Department",
  },
];

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "contract",
    title: "Contract Expiring Soon",
    message: "James Ochieng's contract expires in 30 days. Please review and renew.",
    timestamp: "2026-03-29T08:00:00",
    read: false,
    action: { label: "View Contract", link: "/employees/6" },
  },
  {
    id: "n2",
    type: "birthday",
    title: "🎂 Birthday Today!",
    message: "It's Nadia Osman's birthday today! Don't forget to wish her.",
    timestamp: "2026-03-30T06:00:00",
    read: false,
  },
  {
    id: "n3",
    type: "probation",
    title: "Probation Ending",
    message: "Mary Wanjiru's probation period ends in 2 weeks.",
    timestamp: "2026-03-28T16:00:00",
    read: true,
    action: { label: "Review", link: "/employees/7" },
  },
  {
    id: "n4",
    type: "payroll",
    title: "Payroll Processing Reminder",
    message: "March payroll is due for processing by the end of today.",
    timestamp: "2026-03-30T09:00:00",
    read: false,
    action: { label: "Process Now", link: "/payroll" },
  },
  {
    id: "n5",
    type: "warning",
    title: "Missing Attendance Records",
    message: "3 employees have missing attendance records for yesterday.",
    timestamp: "2026-03-29T10:00:00",
    read: false,
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: "a1",
    user: "Winnie Adera",
    action: "clocked in",
    details: "Clocked in at 8:02 AM",
    timestamp: "2026-03-30T08:02:00",
    type: "attendance",
    department: "Front Office",
  },
  {
    id: "a2",
    user: "Peter Mwangi",
    action: "submitted leave request",
    details: "Submitted annual leave request for 5 days",
    timestamp: "2026-03-29T14:30:00",
    type: "leave",
    department: "Finance",
  },
  {
    id: "a3",
    user: "Mary Wanjiru",
    action: "submitted leave request",
    details: "Submitted sick leave request for 1 day",
    timestamp: "2026-03-29T09:00:00",
    type: "leave",
    department: "Front Office",
  },
  {
    id: "a4",
    user: "HR Admin",
    action: "approved payroll",
    details: "Payroll for February approved and processed",
    timestamp: "2026-03-28T16:30:00",
    type: "payroll",
    department: "HR",
  },
  {
    id: "a5",
    user: "James Ochieng",
    action: "clocked in",
    details: "Clocked in at 8:15 AM (Late)",
    timestamp: "2026-03-28T08:15:00",
    type: "attendance",
    department: "Operations",
  },
  {
    id: "a6",
    user: "System",
    action: "registered",
    details: "New employee Grace Wanjiru registered to Front Office department",
    timestamp: "2026-03-27T10:00:00",
    type: "employee",
    department: "Front Office",
  },
  {
    id: "a7",
    user: "David Kariuki",
    action: "completed task",
    details: "Completed safety checklist for Operations department",
    timestamp: "2026-03-27T15:00:00",
    type: "task",
    department: "Operations",
  },
];

const mockPayrollSummary: PayrollSummary = {
  totalPayroll: 565000,
  processedPayroll: 478000,
  pendingPayroll: 87000,
  totalDeductions: 89500,
  totalBonuses: 25000,
  totalAllowances: 18000,
  paye: 48500,
  nssf: 8200,
  nhif: 9500,
  housingLevy: 5600,
  shif: 3800,
};

const mockDepartmentSummary: DepartmentSummary[] = [
  { name: "Front Office", employees: 2, head: "Winnie Adera", attendanceRate: 95, presentToday: 1, totalEmployees: 2 },
  { name: "Operations", employees: 2, head: "David Kariuki", attendanceRate: 88, presentToday: 1, totalEmployees: 2 },
  { name: "Customer Service", employees: 1, head: "Nadia Osman", attendanceRate: 95, presentToday: 1, totalEmployees: 1 },
  { name: "Finance", employees: 1, head: "Peter Mwangi", attendanceRate: 90, presentToday: 0, totalEmployees: 1 },
  { name: "Field Sales", employees: 1, head: "Eunice Njeri", attendanceRate: 100, presentToday: 1, totalEmployees: 1 },
];

// ==================== MAIN COMPONENT ====================
export default function BranchDashboardPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [tasks, setTasks] = useState<BranchTask[]>(mockTasks);
  const [announcements, setAnnouncements] = useState<BranchAnnouncement[]>(mockAnnouncements);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(mockRecentActivities);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary>(mockPayrollSummary);
  const [departmentSummary, setDepartmentSummary] = useState<DepartmentSummary[]>(mockDepartmentSummary);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "attendance" | "tasks" | "announcements">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [activeBranchName] = useState("Nairobi Branch");

  // Edit state
  const [editingEmployee, setEditingEmployee] = useState<TeamMember | null>(null);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingTask, setEditingTask] = useState<BranchTask | null>(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<BranchAnnouncement | null>(null);
  const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // ==================== CALCULATIONS ====================
  const totalEmployees = teamMembers.length;
  const presentToday = teamMembers.filter(m => m.status === "Present").length;
  const absentToday = teamMembers.filter(m => m.status === "Absent").length;
  const onLeaveToday = teamMembers.filter(m => m.status === "On Leave").length;
  const lateToday = teamMembers.filter(m => m.status === "Late").length;
  const remoteToday = teamMembers.filter(m => m.status === "Remote").length;

  const pendingLeaveRequests = leaveRequests.filter(l => l.status === "Pending").length;
  const approvedLeaveRequests = leaveRequests.filter(l => l.status === "Approved").length;

  const newEmployeesThisMonth = teamMembers.filter(m => {
    const joinDate = new Date(m.joinDate);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  const todayAttendance = attendanceRecords[attendanceRecords.length - 1];
  const attendanceRate = todayAttendance ? (todayAttendance.present / todayAttendance.total) * 100 : 0;

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => t.status !== "Done");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Done");

  const urgentAnnouncements = announcements.filter(a => a.type === "Urgent");

  // ==================== HELPER FUNCTIONS ====================
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Late": return "bg-yellow-100 text-yellow-800";
      case "On Leave": return "bg-blue-100 text-blue-800";
      case "Remote": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present": return <UserCheck className="w-4 h-4" />;
      case "Absent": return <UserX className="w-4 h-4" />;
      case "Late": return <Clock className="w-4 h-4" />;
      case "On Leave": return <CalendarClock className="w-4 h-4" />;
      case "Remote": return <Users className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "Todo": return "bg-gray-100 text-gray-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Done": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case "Info": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Success": return "bg-green-100 text-green-800 border-green-200";
      case "Urgent": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "birthday": return <Gift className="w-5 h-5 text-pink-500" />;
      case "contract": return <FileText className="w-5 h-5 text-orange-500" />;
      case "probation": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "payroll": return <DollarSign className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "attendance": return <Clock className="w-4 h-4 text-blue-500" />;
      case "payroll": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "leave": return <Calendar className="w-4 h-4 text-yellow-500" />;
      case "employee": return <UserPlus className="w-4 h-4 text-purple-500" />;
      case "task": return <ClipboardCheck className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // ==================== HANDLERS ====================
  const handleApproveLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(l =>
      l.id === id ? { ...l, status: "Approved", approvedBy: "Branch Manager", approvedDate: new Date().toISOString() } : l
    ));
    showToast("Leave request approved!", "success");
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(l =>
      l.id === id ? { ...l, status: "Rejected" } : l
    ));
    showToast("Leave request rejected.", "error");
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read", "success");
  };

  const handleProcessPayroll = () => {
    showToast("Processing payroll... This may take a moment.", "info");
    setTimeout(() => {
      setPayrollSummary(prev => ({
        ...prev,
        processedPayroll: prev.totalPayroll,
        pendingPayroll: 0,
      }));
      showToast("Payroll processed successfully!", "success");
    }, 2000);
  };

  const handleAddEmployee = () => {
    showToast("Opening employee registration form...", "info");
    // You can navigate to employee registration page here
    // navigate('/employees/add');
  };

  const handleGenerateReport = (type: string) => {
    showToast(`Generating ${type} report...`, "info");
    setTimeout(() => {
      showToast(`${type} report downloaded successfully!`, "success");
    }, 1500);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: "Done" } : t
    ));
    showToast("Task marked as complete!", "success");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Dashboard refreshed!", "success");
    }, 1000);
  };

  // ==================== EDIT HANDLERS ====================
  const handleEditEmployee = (member: TeamMember) => {
    setEditingEmployee(member);
    setShowEditEmployeeModal(true);
  };

  const handleSaveEmployeeEdit = () => {
    if (editingEmployee) {
      setTeamMembers(prev => prev.map(m =>
        m.id === editingEmployee.id ? editingEmployee : m
      ));
      showToast("Employee updated successfully!", "success");
      setShowEditEmployeeModal(false);
      setEditingEmployee(null);
    }
  };

  const handleEditTask = (task: BranchTask) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };

  const handleSaveTaskEdit = () => {
    if (editingTask) {
      setTasks(prev => prev.map(t =>
        t.id === editingTask.id ? editingTask : t
      ));
      showToast("Task updated successfully!", "success");
      setShowEditTaskModal(false);
      setEditingTask(null);
    }
  };

  const handleEditAnnouncement = (announcement: BranchAnnouncement) => {
    setEditingAnnouncement(announcement);
    setShowEditAnnouncementModal(true);
  };

  const handleSaveAnnouncementEdit = () => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a =>
        a.id === editingAnnouncement.id ? editingAnnouncement : a
      ));
      showToast("Announcement updated successfully!", "success");
      setShowEditAnnouncementModal(false);
      setEditingAnnouncement(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast("Task deleted successfully!", "success");
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast("Announcement deleted successfully!", "success");
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      showToast("Employee removed successfully!", "success");
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newTask: BranchTask = {
      id: `t${tasks.length + 1}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as "High" | "Medium" | "Low",
      status: "Todo",
      dueDate: formData.get('dueDate') as string,
      assignedTo: formData.get('assignedTo') as string,
      department: teamMembers.find(m => m.name === formData.get('assignedTo'))?.department || "General",
      createdBy: "Branch Manager",
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prev => [...prev, newTask]);
    showToast("Task created successfully!", "success");
    setShowTaskModal(false);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newAnnouncement: BranchAnnouncement = {
      id: `a${announcements.length + 1}`,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as "Info" | "Warning" | "Success" | "Urgent",
      date: new Date().toISOString().split('T')[0],
      author: "Branch Manager",
    };
    
    setAnnouncements(prev => [...prev, newAnnouncement]);
    showToast("Announcement posted successfully!", "success");
    setShowAnnouncementModal(false);
  };

  const departments = ["All", ...new Set(teamMembers.map(m => m.department))];
  const filteredTeam = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "All" || m.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            toast.type === "success" ? "bg-green-100 border border-green-200 text-green-800" :
            toast.type === "error" ? "bg-red-100 border border-red-200 text-red-800" :
            "bg-blue-100 border border-blue-200 text-blue-800"
          }`}>
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Branch Dashboard</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {activeBranchName}
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Monitor branch performance, attendance, and payroll in real-time
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                className="relative px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Bell className="w-4 h-4" />
                Notifications
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* ==================== NOTIFICATIONS PANEL ==================== */}
        {showNotificationsPanel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                      {unreadNotifications} unread
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => setShowNotificationsPanel(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`py-4 ${!notification.read ? "bg-blue-50/30 -mx-2 px-2 rounded-lg" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDateTime(notification.timestamp)}</p>
                        {notification.action && (
                          <button 
                            onClick={() => {
                              showToast(`Navigating to ${notification.action?.label}`, "info");
                              setShowNotificationsPanel(false);
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-1"
                          >
                            {notification.action.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowNotificationsPanel(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalEmployees}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              +{newEmployeesThisMonth} new this month
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Present Today</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{presentToday}</p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {Math.round((presentToday / totalEmployees) * 100)}% attendance
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{onLeaveToday}</p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <UserMinus className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {pendingLeaveRequests} pending requests
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Absent Today</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{absentToday}</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {lateToday} late arrivals
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Monthly Payroll</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(payrollSummary.totalPayroll)}</p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {formatCurrency(payrollSummary.processedPayroll)} processed
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Attendance Rate</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{attendanceRate.toFixed(0)}%</p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {attendanceRate >= 90 ? "✅ Good standing" : "⚠️ Needs improvement"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "team"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" />
              Team
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "attendance"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              Attendance
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "tasks"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              Tasks
              {pendingTasks.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {pendingTasks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "announcements"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bell className="w-4 h-4" />
              Announcements
              {urgentAnnouncements.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {urgentAnnouncements.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === "overview" && (
          <>
            {/* Department Summary Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  Department Overview
                </h3>
                <span className="text-sm text-slate-500">{departmentSummary.length} departments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Employees</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department Head</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Present Today</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Attendance Rate</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departmentSummary.map((dept) => (
                      <tr key={dept.name} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{dept.name}</td>
                        <td className="px-4 py-3 text-center">{dept.employees}</td>
                        <td className="px-4 py-3 text-slate-600">{dept.head}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-medium">{dept.presentToday}/{dept.totalEmployees}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  dept.attendanceRate >= 90 ? "bg-green-500" :
                                  dept.attendanceRate >= 70 ? "bg-yellow-500" :
                                  "bg-red-500"
                                }`}
                                style={{ width: `${dept.attendanceRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{dept.attendanceRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            dept.attendanceRate >= 90 ? "bg-green-100 text-green-800" :
                            dept.attendanceRate >= 70 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {dept.attendanceRate >= 90 ? <CheckCircle2 className="w-3 h-3" /> :
                             dept.attendanceRate >= 70 ? <Clock className="w-3 h-3" /> :
                             <AlertTriangle className="w-3 h-3" />}
                            {dept.attendanceRate >= 90 ? "Good" :
                             dept.attendanceRate >= 70 ? "Review" : "Attention"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Recent Activities & Pending Leaves */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-slate-600" />
                      Recent Activities
                    </h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="px-6 py-3 hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-100">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium text-slate-900">{activity.user}</span>
                              <span className="text-slate-600"> {activity.action}</span>
                              {activity.department && (
                                <span className="text-slate-400 text-xs ml-1">
                                  • {activity.department}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{activity.details}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(activity.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Leave Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <CalendarClock className="w-5 h-5 text-slate-600" />
                      Pending Leave Requests
                      {pendingLeaveRequests > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          {pendingLeaveRequests} pending
                        </span>
                      )}
                    </h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {leaveRequests.filter(l => l.status === "Pending").length === 0 ? (
                      <div className="px-6 py-8 text-center text-slate-500">
                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm">No pending leave requests</p>
                      </div>
                    ) : (
                      leaveRequests.filter(l => l.status === "Pending").map((leave) => (
                        <div key={leave.id} className="px-6 py-4 hover:bg-slate-50/70 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-slate-900">{leave.employee}</h4>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {leave.type}
                                </span>
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                  {leave.days} days
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">{leave.reason}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                <span>📅 {formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                                <span>•</span>
                                <span>Submitted: {formatDate(leave.submitted)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleApproveLeave(leave.id)}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(leave.id)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-all flex items-center gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Actions & Notifications */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddEmployee}
                      className="p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all text-left cursor-pointer"
                    >
                      <UserPlus className="w-5 h-5 text-indigo-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Add Employee</p>
                    </button>
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left cursor-pointer"
                    >
                      <CalendarCheck className="w-5 h-5 text-green-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Approve Leave</p>
                    </button>
                    <button
                      onClick={handleProcessPayroll}
                      className="p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all text-left cursor-pointer"
                    >
                      <DollarSign className="w-5 h-5 text-yellow-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Process Payroll</p>
                    </button>
                    <button
                      onClick={() => handleGenerateReport("Attendance")}
                      className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-purple-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">View Attendance</p>
                    </button>
                    <button
                      onClick={() => handleGenerateReport("Monthly")}
                      className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left cursor-pointer"
                    >
                      <Download className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Generate Report</p>
                    </button>
                    <button
                      onClick={() => showToast("Sending alert to all staff...", "info")}
                      className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-left cursor-pointer"
                    >
                      <Bell className="w-5 h-5 text-red-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Send Alert</p>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-slate-600" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                          {unreadNotifications}
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 4).map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-5 py-3 hover:bg-slate-50/70 transition-colors ${!notification.read ? "bg-blue-50/30" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 text-sm">{notification.title}</h4>
                            <p className="text-sm text-slate-500">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(notification.timestamp)}</p>
                            {notification.action && (
                              <button 
                                onClick={() => {
                                  showToast(`Navigating to ${notification.action?.label}`, "info");
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 cursor-pointer"
                              >
                                {notification.action.label} →
                              </button>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== TEAM TAB ==================== */}
        {activeTab === "team" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  Team Members
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({filteredTeam.length} members)
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTeam.map((member) => (
                    <div key={member.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{member.name}</h4>
                            <p className="text-sm text-slate-500">{member.position}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {getStatusIcon(member.status)}
                          {member.status}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">Department</p>
                            <p className="font-medium">{member.department}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Check In</p>
                            <p className="font-medium">{member.checkIn || "-"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-slate-500">Contact</p>
                            <p className="text-sm font-medium text-indigo-600">{member.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => handleEditEmployee(member)}
                          className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(member.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Check In</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Check Out</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTeam.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{member.position}</td>
                          <td className="px-4 py-3 text-slate-600">{member.department}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {getStatusIcon(member.status)}
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{member.checkIn || "-"}</td>
                          <td className="px-4 py-3 text-slate-600">{member.checkOut || "-"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleEditEmployee(member)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                title="Edit Employee"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEmployee(member.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Delete Employee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== ATTENDANCE TAB ==================== */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-slate-600" />
                Attendance Overview
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={() => handleGenerateReport("Attendance")}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Export Report
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Attendance Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Present</p>
                  <p className="text-2xl font-bold text-green-900">{todayAttendance?.present || 0}</p>
                  <p className="text-xs text-green-600">{((todayAttendance?.present || 0) / (todayAttendance?.total || 1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">Absent</p>
                  <p className="text-2xl font-bold text-red-900">{todayAttendance?.absent || 0}</p>
                  <p className="text-xs text-red-600">{((todayAttendance?.absent || 0) / (todayAttendance?.total || 1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-700 font-medium">Late</p>
                  <p className="text-2xl font-bold text-yellow-900">{todayAttendance?.late || 0}</p>
                  <p className="text-xs text-yellow-600">{((todayAttendance?.late || 0) / (todayAttendance?.total || 1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">On Leave</p>
                  <p className="text-2xl font-bold text-blue-900">{todayAttendance?.onLeave || 0}</p>
                  <p className="text-xs text-blue-600">{((todayAttendance?.onLeave || 0) / (todayAttendance?.total || 1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">Overtime</p>
                  <p className="text-2xl font-bold text-purple-900">{todayAttendance?.overtime || 0}</p>
                  <p className="text-xs text-purple-600">hours</p>
                </div>
              </div>

              {/* Attendance Chart */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-medium text-slate-900 mb-4">Daily Attendance Trend</h4>
                <div className="flex items-end gap-1 h-32">
                  {attendanceRecords.slice(-14).map((record, index) => {
                    const height = (record.present / record.total) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[8px] text-slate-500">
                          {new Date(record.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TASKS TAB ==================== */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-slate-600" />
                Task Management
              </h3>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600">Todo</p>
                  <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === "Todo").length}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{tasks.filter(t => t.status === "In Progress").length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Done</p>
                  <p className="text-2xl font-bold text-green-900">{tasks.filter(t => t.status === "Done").length}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm text-red-600">Blocked</p>
                  <p className="text-2xl font-bold text-red-900">{tasks.filter(t => t.status === "Blocked").length}</p>
                </div>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {task.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {task.status !== "Done" && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
                            title="Mark as Complete"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditTask(task)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ANNOUNCEMENTS TAB ==================== */}
        {activeTab === "announcements" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                Announcements
              </h3>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Announcement
              </button>
            </div>

            <div className="p-6 space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`border rounded-xl p-4 ${getAnnouncementTypeColor(announcement.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAnnouncementTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <p className="text-slate-700">{announcement.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {announcement.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(announcement.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                        title="Edit Announcement"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== EDIT EMPLOYEE MODAL ==================== */}
        {showEditEmployeeModal && editingEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-indigo-600" />
                  Edit Employee
                </h3>
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingEmployee.phone}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input
                    type="number"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editingEmployee.status}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={editingEmployee.employmentType}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployeeEdit}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EDIT TASK MODAL ==================== */}
        {showEditTaskModal && editingTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-indigo-600" />
                  Edit Task
                </h3>
                <button
                  onClick={() => setShowEditTaskModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                  <select
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {teamMembers.map(member => (
                      <option key={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTaskEdit}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EDIT ANNOUNCEMENT MODAL ==================== */}
        {showEditAnnouncementModal && editingAnnouncement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-indigo-600" />
                  Edit Announcement
                </h3>
                <button
                  onClick={() => setShowEditAnnouncementModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingAnnouncement.title}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <textarea
                    value={editingAnnouncement.content}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={editingAnnouncement.type}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Info">Info</option>
                    <option value="Warning">Warning</option>
                    <option value="Success">Success</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditAnnouncementModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAnnouncementEdit}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CREATE TASK MODAL ==================== */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Create New Task
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Task title..."
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Task description..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                      <select name="priority" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                        <option value="High">High</option>
                        <option value="Medium" selected>Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                      <input
                        name="dueDate"
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                    <select name="assignedTo" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      {teamMembers.map(member => (
                        <option key={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== CREATE ANNOUNCEMENT MODAL ==================== */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  New Announcement
                </h3>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Announcement title..."
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
                    <textarea
                      name="content"
                      placeholder="Announcement content..."
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select name="type" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      <option value="Info">Info</option>
                      <option value="Warning">Warning</option>
                      <option value="Success">Success</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Post Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== LEAVE APPROVAL MODAL ==================== */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-green-600" />
                  Approve Leave
                </h3>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {leaveRequests.filter(l => l.status === "Pending").length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p>No pending leave requests</p>
                  </div>
                ) : (
                  leaveRequests.filter(l => l.status === "Pending").map((leave) => (
                    <div key={leave.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{leave.employee}</p>
                          <p className="text-sm text-slate-500">{leave.type} • {leave.days} days</p>
                          <p className="text-xs text-slate-400">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</p>
                          <p className="text-xs text-slate-500 mt-1">{leave.reason}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              handleApproveLeave(leave.id);
                              if (leaveRequests.filter(l => l.status === "Pending").length <= 1) {
                                setShowLeaveModal(false);
                              }
                            }}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              handleRejectLeave(leave.id);
                              if (leaveRequests.filter(l => l.status === "Pending").length <= 1) {
                                setShowLeaveModal(false);
                              }
                            }}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-all flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}