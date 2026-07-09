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
} from "lucide-react";
import { Link } from "react-router-dom";
import BranchScopeSelector from "../../executive/components/BranchScopeSelector";
import { ALL_BRANCHES_VALUE } from "../../executive/constants/executiveDashboard.constants";
import { useExecutiveDashboard } from "../../executive/hooks/useExecutiveDashboard";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

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
}

interface LeaveRequest {
  id: string;
  employee: string;
  type: "Annual" | "Sick" | "Personal" | "Maternity" | "Other";
  startDate: string;
  endDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  submitted: string;
}

interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
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
}

interface BranchAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "Info" | "Warning" | "Success" | "Urgent";
  author: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  trend: "up" | "down" | "stable";
  unit: string;
}

export default function BranchDashboardPage() {
  const { branches, data, selectedBranchId, setSelectedBranch } = useExecutiveDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "attendance" | "tasks" | "announcements">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const activeBranchId = selectedBranchId === ALL_BRANCHES_VALUE ? branches[0]?.id : selectedBranchId;
  const activeBranch = branches.find((branch) => branch.id === activeBranchId);
  const activeBranchName = activeBranch?.name ?? data.scope.label;

  // Mock team members data
  const teamMembers: TeamMember[] = [
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
    },
  ];

  // Mock leave requests
  const leaveRequests: LeaveRequest[] = [
    {
      id: "l1",
      employee: "Peter Mwangi",
      type: "Annual",
      startDate: "2026-03-28",
      endDate: "2026-04-01",
      days: 5,
      status: "Pending",
      reason: "Family vacation",
      submitted: "2026-03-20",
    },
    {
      id: "l2",
      employee: "Mary Wanjiru",
      type: "Sick",
      startDate: "2026-03-30",
      endDate: "2026-03-30",
      days: 1,
      status: "Pending",
      reason: "Doctor's appointment",
      submitted: "2026-03-29",
    },
    {
      id: "l3",
      employee: "David Kariuki",
      type: "Personal",
      startDate: "2026-04-05",
      endDate: "2026-04-06",
      days: 2,
      status: "Approved",
      reason: "Personal errands",
      submitted: "2026-03-25",
    },
  ];

  // Mock attendance records
  const attendanceRecords: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 2, i + 1);
    const absent = i % 6 === 0 ? 2 : i % 4 === 0 ? 1 : 0;
    const late = i % 5 === 0 ? 1 : 0;
    const onLeave = i % 7 === 0 ? 1 : 0;

    return {
      date: date.toISOString().split("T")[0],
      present: 25 - absent - late - onLeave,
      absent,
      late,
      onLeave,
      total: 25,
    };
  });

  // Mock tasks
  const branchTasks: BranchTask[] = [
    {
      id: "t1",
      title: "Approve leave cover plans",
      description: "Review and approve leave cover plans for Operations team",
      priority: "High",
      status: "Todo",
      dueDate: "2026-03-30",
      assignedTo: "David Kariuki",
      department: "Operations",
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
    },
  ];

  // Mock announcements
  const announcements: BranchAnnouncement[] = [
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
  ];

  // Performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    { label: "Attendance Rate", value: 94, target: 95, trend: "up", unit: "%" },
    { label: "Customer Satisfaction", value: 4.2, target: 4.5, trend: "stable", unit: "/5" },
    { label: "Sales Target", value: 87, target: 100, trend: "up", unit: "%" },
    { label: "Staff Retention", value: 92, target: 90, trend: "up", unit: "%" },
  ];
  const teamRows: [string, string, number, string, string, Tone][] = Array.from(
    new Set(teamMembers.map((member) => member.department)),
  ).map((department) => {
    const members = teamMembers.filter((member) => member.department === department);
    const presentCount = members.filter((member) => member.status === "Present" || member.status === "Remote").length;
    const attendance = `${presentCount}/${members.length}`;
    const lead = members.find((member) => member.position.toLowerCase().includes("lead")) ?? members[0];
    const hasAbsent = members.some((member) => member.status === "Absent");
    const hasLate = members.some((member) => member.status === "Late");

    return [
      department,
      lead?.name ?? "Unassigned",
      members.length,
      attendance,
      hasAbsent ? "Attention" : hasLate ? "Review" : "Covered",
      hasAbsent ? "danger" : hasLate ? "warning" : "success",
    ];
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "On Leave":
        return "bg-blue-100 text-blue-800";
      case "Remote":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Absent":
        return <XCircle className="w-4 h-4" />;
      case "Late":
        return <Clock className="w-4 h-4" />;
      case "On Leave":
        return <CalendarClock className="w-4 h-4" />;
      case "Remote":
        return <Users className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-green-100 text-green-800";
      case "Blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case "Info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Success":
        return "bg-green-100 text-green-800 border-green-200";
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate attendance summary
  const todayAttendance = attendanceRecords[attendanceRecords.length - 1];
  const attendanceRate = todayAttendance ? (todayAttendance.present / todayAttendance.total) * 100 : 0;

  // Filter tasks by status
  const pendingTasks = branchTasks.filter(t => t.status !== "Done");

  // Filter leave requests by status
  const pendingLeaves = leaveRequests.filter(l => l.status === "Pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
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
                Manage branch operations, team performance, and daily activities
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <BranchScopeSelector
                branches={branches}
                selectedBranchId={activeBranchId ?? selectedBranchId}
                onBranchChange={setSelectedBranch}
              />
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <Link
                to="/dashboard/executive"
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Executive View
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Team Size</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{teamMembers.length}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">+2</span> this month
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Attendance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{attendanceRate.toFixed(0)}%</p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CalendarCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {todayAttendance?.present} present today
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending Leaves</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingLeaves.length}</p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <CalendarClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              Requires your approval
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Tasks</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks.length}</p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <ClipboardCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600">
              {branchTasks.filter(t => t.status === "In Progress").length} in progress
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Announcements</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{announcements.length}</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-600">
              {announcements.filter(a => a.type === "Urgent").length} urgent
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
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.label} className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all">
                  <p className="text-sm text-slate-600 font-medium">{metric.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-2xl font-bold text-slate-900">
                      {metric.value}{metric.unit}
                    </p>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-green-600" :
                      metric.trend === "down" ? "text-red-600" :
                      "text-slate-600"
                    }`}>
                      {metric.trend === "up" && <ArrowUpRight className="w-4 h-4" />}
                      {metric.trend === "down" && <ArrowDownRight className="w-4 h-4" />}
                      <span>{metric.value / metric.target * 100}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          metric.value / metric.target > 0.9 ? "bg-green-500" :
                          metric.value / metric.target > 0.7 ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${(metric.value / metric.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Target: {metric.target}{metric.unit}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Team Coverage & Actions */}
              <div className="lg:col-span-2 space-y-6">
                <section className="panel bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-600" />
                      Team Coverage
                    </h3>
                    <Link to="/attendance" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Team</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Lead</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Staff</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Attendance</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {teamRows.map(([team, lead, staff, attendance, status, tone]) => (
                          <tr key={team} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900">{team}</td>
                            <td className="px-4 py-3 text-slate-600">{lead}</td>
                            <td className="px-4 py-3 text-center font-medium">{staff}</td>
                            <td className="px-4 py-3 text-center">{attendance}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                tone === "success" ? "bg-green-100 text-green-800 border-green-200" :
                                tone === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                tone === "danger" ? "bg-red-100 text-red-800 border-red-200" :
                                "bg-blue-100 text-blue-800 border-blue-200"
                              }`}>
                                {status === "Covered" && <CheckCircle2 className="w-3 h-3" />}
                                {status === "Review" && <Clock className="w-3 h-3" />}
                                {status === "Attention" && <AlertTriangle className="w-3 h-3" />}
                                {status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-slate-600" />
                      Pending Tasks
                    </h3>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Task
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {branchTasks.filter(t => t.status !== "Done").slice(0, 4).map((task) => (
                      <div key={task.id} className="px-6 py-4 hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-900">{task.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">{task.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {task.assignedTo}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingTasks.length === 0 && (
                      <div className="px-6 py-8 text-center text-slate-500">
                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm">No pending tasks</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column - Quick Actions & Announcements */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <section className="panel bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all text-left">
                      <UserPlus className="w-5 h-5 text-indigo-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">New Employee</p>
                    </button>
                    <button className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left">
                      <CalendarCheck className="w-5 h-5 text-green-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Approve Leave</p>
                    </button>
                    <button className="p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all text-left">
                      <DollarSign className="w-5 h-5 text-yellow-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Payroll Review</p>
                    </button>
                    <button className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left">
                      <FileText className="w-5 h-5 text-purple-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Generate Report</p>
                    </button>
                    <button className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-left">
                      <Bell className="w-5 h-5 text-red-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Send Alert</p>
                    </button>
                    <button className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left">
                      <Settings className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-sm font-medium text-slate-700">Settings</p>
                    </button>
                  </div>
                </section>

                {/* Recent Announcements */}
                <section className="panel bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-slate-600" />
                      Announcements
                    </h3>
                    <button
                      onClick={() => setShowAnnouncementModal(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      New
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className="px-5 py-4 hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-lg ${getAnnouncementTypeColor(announcement.type)}`}>
                            {announcement.type === "Info" && <Info className="w-3 h-3" />}
                            {announcement.type === "Warning" && <AlertTriangle className="w-3 h-3" />}
                            {announcement.type === "Success" && <CheckCircle2 className="w-3 h-3" />}
                            {announcement.type === "Urgent" && <AlertCircle className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 text-sm">{announcement.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2">{announcement.content}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatDate(announcement.date)} • {announcement.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  Team Members
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({teamMembers.length} members)
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
                  {teamMembers.map((member) => (
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
                        <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-all">
                          View Profile
                        </button>
                        <button className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm hover:bg-slate-100 transition-all">
                          <MessageSquare className="w-4 h-4" />
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
                      {teamMembers.map((member) => (
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
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
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

        {/* Attendance Tab */}
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
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all">
                  Export Report
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Attendance Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
              </div>

              {/* Attendance Chart - Simplified */}
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

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-slate-600" />
                Task Management
              </h3>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600">Todo</p>
                  <p className="text-2xl font-bold text-slate-900">{branchTasks.filter(t => t.status === "Todo").length}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{branchTasks.filter(t => t.status === "In Progress").length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600">Done</p>
                  <p className="text-2xl font-bold text-green-900">{branchTasks.filter(t => t.status === "Done").length}</p>
                </div>
              </div>

              <div className="space-y-3">
                {branchTasks.map((task) => (
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
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                Announcements
              </h3>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
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
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Task</h3>
              <p className="text-sm text-slate-500 mb-4">Add a new task for the branch team</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Task title..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    placeholder="Task description..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    {teamMembers.map(member => (
                      <option key={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">New Announcement</h3>
              <p className="text-sm text-slate-500 mb-4">Create a new branch announcement</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Announcement title..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <textarea
                    placeholder="Announcement content..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    <option>Info</option>
                    <option>Warning</option>
                    <option>Success</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                  Post Announcement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



