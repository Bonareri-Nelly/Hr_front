import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Edit,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  Home,
  Laptop,
  Mail,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Route,
  Search,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
  X,
  Award,
  Gift,
  DollarSign,
  Flag,
  Layers,
  List,
  MapPin,
  Mic,
  Phone,
  Printer,
  Star,
  Target,
  Truck,
  User,
  Video,
  Volume2,
  Wifi,
  Zap,
  ChevronDown,
  ChevronRight,
  Check,
  File,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Coffee,
  Pause,
  Play,
  StopCircle,
  Timer,
  Bot,
  Send,
  Sparkles,
  Loader2,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon2,
  FileText as FileTextIcon,
  Briefcase as BriefcaseIcon,
  Award as AwardIcon,
  Gift as GiftIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  ScatterChart,
  Activity as ActivityIcon,
  Clock as ClockIcon2,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  CreditCard,
  Shield,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  Users2,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  UserCheck as UserCheckIcon,
  CalendarDays,
  Timer as TimerIcon,
  Hourglass,
  History,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  AlertCircle,
  AlertOctagon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  LifeBuoy,
  Shield as ShieldIcon,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Code,
  Database,
  Server,
  Cloud,
  HardDrive,
  Monitor,
  Tablet,
  Smartphone,
  Watch,
  Headphones,
  Speaker,
  Mic as MicIcon,
  Video as VideoIcon,
  Camera,
  Image,
  Film,
  Music,
  Radio,
  Tv,
  Printer as PrinterIcon,
  Phone as PhoneIcon2,
  Mail as MailIcon2,
  MessageCircle,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
  Paperclip,
  Link,
  Share,
  Bookmark,
  Flag as FlagIcon,
  Star as StarIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Zap as ZapIcon,
  CloudRain,
  Snowflake,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Umbrella,
  Thermometer,
  Droplet,
  Wind as WindIcon,
  Compass,
  Navigation,
  Map,
  Globe,
  Earth,
  Satellite,
  Rocket,
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  Ship,
  Anchor,
  Truck as TruckIcon,
  Package,
  Box,
  Archive,
  Trash2,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  File as FileIcon,
  FilePlus as FilePlusIcon,
  FileMinus as FileMinusIcon,
  FileCheck as FileCheckIcon,
  FileX as FileXIcon,
  FileText as FileTextIcon2,
  FileImage,
  FileAudio,
  FileVideo,
  FileCode,
  FileJson,
  Files,
  FileSpreadsheet,
  FileClock,
  FileSearch,
  FileLock,
  FileLock2,
  FileKey,
  FileBadge,
  FileCheck2 as FileCheckIcon2,
  FileX2,
  FilePlus2,
  FileMinus2,
  FileHeart,
  FileWarning,
  FileQuestion
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  supervisor: string;
  skills: string[];
  certifications: string[];
  assets: string[];
  emergencyContact: string;
  hourlyRate: number;
  gender?: string;
  birthDate?: string;
  nationality?: string;
  maritalStatus?: string;
  dependants?: number;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  overtime: number;
  biometricVerified?: boolean;
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewer: string;
  period: string;
  rating: number | null;
  status: string;
  comments: string;
}

interface TrainingProgram {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  attendees: number;
  duration: string;
  cost?: number;
  certification?: string;
  expiryDate?: string;
}

interface Budget {
  category: string;
  allocated: number;
  used: number;
  remaining: number;
  year: string;
}

interface Approval {
  id: number;
  type: string;
  requester: string;
  requestDate: string;
  status: string;
  priority: string;
  details: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
  status: string;
  expiryDate?: string;
  employeeId?: number;
}

interface Asset {
  id: number;
  name: string;
  assignedTo: string;
  serial: string;
  status: string;
  date: string;
  value?: number;
  condition?: string;
}

interface TimerState {
  startTime: Date;
  elapsed: number;
  isRunning: boolean;
  breakStart?: Date;
  breaks: Array<{ start: Date; end: Date; duration: number }>;
  totalBreakTime: number;
  overtime: number;
}

interface SelfCheckIn {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  checkIn: string;
  checkOut: string | null;
  status: "Clocked In" | "On Break" | "Completed";
  startTime: Date;
  elapsed: number;
  isRunning: boolean;
  breakStart?: Date;
  totalBreakTime: number;
  overtime: number;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  meta?: string;
  tone?: Tone;
  icon?: React.ComponentType<{ size?: number }>;
  trend?: number;
}

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "default" | "small";
  disabled?: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  quickActions?: string[];
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  onBreak: number;
  remote: number;
  fieldDuty: number;
  earlyDeparture: number;
  attendanceRate: string;
  totalHours: string;
  totalOvertime: string;
  totalBreakTime: string;
  avgHoursPerEmployee: string;
}

// ============================================================
// DATA LAYER
// ============================================================

const DATA = {
  dashboardSummary: {
    totalEmployees: 214,
    activeEmployees: 198,
    newEmployees: 8,
    onLeave: 12,
    presentToday: 186,
    absentToday: 7,
    lateToday: 5,
    upcomingBirthdays: 4,
    upcomingAnniversaries: 6,
    openPositions: 18,
    departmentBudget: 42000000,
    payrollStatus: "Processing",
    performanceScore: 4.2,
    satisfactionScore: 78,
    monthlyTurnover: 4.2,
    newEmployeesThisMonth: 8,
    probation: 14,
    contract: 38,
    permanent: 156,
    pendingLeave: 18,
    pendingOvertime: 7,
    pendingAttendanceCorrections: 4,
    pendingPerformanceReviews: 9,
    pendingRecruitment: 6,
    pendingApprovals: 23,
    turnoverRate: 4.2
  },

  employees: [
    { id: 1, name: "Grace Wanjiru", position: "Head of People Operations", department: "People Operations", email: "grace.w@company.com", phone: "+254 712 345 678", joinDate: "2020-03-15", status: "Active", supervisor: "James Mwangi", skills: ["HR Strategy", "Talent Management", "Employee Relations"], certifications: ["SHRM-SCP", "CIPD"], assets: ["Laptop", "Phone"], emergencyContact: "John Wanjiru - +254 723 456 789", hourlyRate: 2500, gender: "Female", birthDate: "1985-06-15", nationality: "Kenyan", maritalStatus: "Married" },
    { id: 2, name: "Brian Otieno", position: "Talent Acquisition Manager", department: "Talent Acquisition", email: "brian.o@company.com", phone: "+254 723 456 789", joinDate: "2021-06-01", status: "Active", supervisor: "Grace Wanjiru", skills: ["Recruitment", "Sourcing", "Interviewing"], certifications: ["PHR", "AIRS"], assets: ["Laptop"], emergencyContact: "Mary Otieno - +254 734 567 890", hourlyRate: 2200, gender: "Male", birthDate: "1988-03-10", nationality: "Kenyan", maritalStatus: "Single" },
    { id: 3, name: "Mercy Achieng", position: "Payroll Manager", department: "Payroll Services", email: "mercy.a@company.com", phone: "+254 734 567 890", joinDate: "2019-08-20", status: "Active", supervisor: "Grace Wanjiru", skills: ["Payroll", "Accounting", "Tax Compliance"], certifications: ["CPA", "IPM-K"], assets: ["Laptop", "Monitor"], emergencyContact: "Peter Achieng - +254 745 678 901", hourlyRate: 2300, gender: "Female", birthDate: "1987-11-20", nationality: "Kenyan", maritalStatus: "Married" },
    { id: 4, name: "Sam Mwangi", position: "Employee Relations Manager", department: "Employee Relations", email: "sam.m@company.com", phone: "+254 745 678 901", joinDate: "2020-11-01", status: "Active", supervisor: "Grace Wanjiru", skills: ["Conflict Resolution", "Labor Law", "Investigations"], certifications: ["CIPD", "Certified Mediator"], assets: ["Laptop", "Phone"], emergencyContact: "Jane Mwangi - +254 756 789 012", hourlyRate: 2100, gender: "Male", birthDate: "1986-09-05", nationality: "Kenyan", maritalStatus: "Married" },
    { id: 5, name: "Amina Hassan", position: "Learning & Development Manager", department: "Learning & Development", email: "amina.h@company.com", phone: "+254 756 789 012", joinDate: "2021-02-15", status: "Active", supervisor: "Grace Wanjiru", skills: ["Training Design", "Coaching", "Curriculum Development"], certifications: ["ATD", "ICF"], assets: ["Laptop", "Projector"], emergencyContact: "Hassan Ali - +254 767 890 123", hourlyRate: 2150, gender: "Female", birthDate: "1989-12-01", nationality: "Kenyan", maritalStatus: "Single" },
    { id: 6, name: "Peter Kimani", position: "Senior HR Specialist", department: "People Operations", email: "peter.k@company.com", phone: "+254 767 890 123", joinDate: "2020-09-10", status: "Active", supervisor: "Grace Wanjiru", skills: ["HR Operations", "Compliance", "Data Analysis"], certifications: ["SHRM-CP"], assets: ["Laptop", "Phone"], emergencyContact: "Sarah Kimani - +254 778 901 234", hourlyRate: 1800, gender: "Male", birthDate: "1990-02-20", nationality: "Kenyan", maritalStatus: "Married" },
    { id: 7, name: "Jane Muthoni", position: "Recruitment Specialist", department: "Talent Acquisition", email: "jane.m@company.com", phone: "+254 778 901 234", joinDate: "2022-01-10", status: "Active", supervisor: "Brian Otieno", skills: ["Sourcing", "Employer Branding", "ATS"], certifications: ["CIR"], assets: ["Laptop"], emergencyContact: "David Muthoni - +254 789 012 345", hourlyRate: 1700, gender: "Female", birthDate: "1992-05-15", nationality: "Kenyan", maritalStatus: "Single" },
    { id: 8, name: "James Ochieng", position: "Payroll Administrator", department: "Payroll Services", email: "james.o@company.com", phone: "+254 789 012 345", joinDate: "2021-10-05", status: "Active", supervisor: "Mercy Achieng", skills: ["Payroll Processing", "Excel", "QuickBooks"], certifications: ["Payroll Professional"], assets: ["Laptop", "Calculator"], emergencyContact: "Mary Ochieng - +254 790 123 456", hourlyRate: 1600, gender: "Male", birthDate: "1991-08-25", nationality: "Kenyan", maritalStatus: "Married" },
    { id: 9, name: "Faith Akinyi", position: "Employee Relations Officer", department: "Employee Relations", email: "faith.a@company.com", phone: "+254 790 123 456", joinDate: "2022-05-20", status: "Active", supervisor: "Sam Mwangi", skills: ["Case Management", "Policy", "Employee Engagement"], certifications: ["Employee Relations Specialist"], assets: ["Laptop"], emergencyContact: "Peter Akinyi - +254 791 234 567", hourlyRate: 1550, gender: "Female", birthDate: "1993-11-10", nationality: "Kenyan", maritalStatus: "Single" },
    { id: 10, name: "Michael Okoth", position: "Training Coordinator", department: "Learning & Development", email: "michael.o@company.com", phone: "+254 791 234 567", joinDate: "2021-12-01", status: "Active", supervisor: "Amina Hassan", skills: ["Event Planning", "Training Logistics", "Content Creation"], certifications: ["CTP"], assets: ["Laptop", "Tablet"], emergencyContact: "Susan Okoth - +254 792 345 678", hourlyRate: 1500, gender: "Male", birthDate: "1994-03-30", nationality: "Kenyan", maritalStatus: "Single" }
  ],

  attendanceRecords: [
    { id: 1, employeeId: 1, date: "2026-07-14", checkIn: "08:15", checkOut: "17:30", status: "Present", overtime: 0, biometricVerified: true },
    { id: 2, employeeId: 2, date: "2026-07-14", checkIn: "09:45", checkOut: "18:15", status: "Late", overtime: 0.5, biometricVerified: true },
    { id: 3, employeeId: 3, date: "2026-07-14", checkIn: "08:00", checkOut: "17:00", status: "Present", overtime: 0, biometricVerified: true },
    { id: 4, employeeId: 4, date: "2026-07-14", checkIn: null, checkOut: null, status: "Absent", overtime: 0, biometricVerified: false },
    { id: 5, employeeId: 5, date: "2026-07-14", checkIn: "08:30", checkOut: "17:30", status: "Remote", overtime: 0, biometricVerified: false },
    { id: 6, employeeId: 6, date: "2026-07-14", checkIn: "08:00", checkOut: "17:00", status: "Present", overtime: 0, biometricVerified: true },
    { id: 7, employeeId: 7, date: "2026-07-14", checkIn: "08:20", checkOut: "17:45", status: "Present", overtime: 0, biometricVerified: true },
    { id: 8, employeeId: 8, date: "2026-07-14", checkIn: "09:00", checkOut: "18:00", status: "Present", overtime: 0, biometricVerified: true },
    { id: 9, employeeId: 9, date: "2026-07-14", checkIn: "08:00", checkOut: "17:00", status: "Field Duty", overtime: 0, biometricVerified: false },
    { id: 10, employeeId: 10, date: "2026-07-14", checkIn: "08:45", checkOut: "17:30", status: "Late", overtime: 0, biometricVerified: true }
  ],

  leaveRequests: [
    { id: 1, employeeId: 1, type: "Annual Leave", startDate: "2026-07-20", endDate: "2026-07-24", days: 5, status: "Pending", reason: "Family vacation" },
    { id: 2, employeeId: 3, type: "Sick Leave", startDate: "2026-07-15", endDate: "2026-07-15", days: 1, status: "Approved", reason: "Medical appointment", approvedBy: "Grace Wanjiru", approvedDate: "2026-07-14" },
    { id: 3, employeeId: 5, type: "Maternity Leave", startDate: "2026-08-01", endDate: "2026-11-30", days: 90, status: "Pending", reason: "Maternity" },
    { id: 4, employeeId: 2, type: "Annual Leave", startDate: "2026-07-25", endDate: "2026-08-01", days: 7, status: "Rejected", reason: "Business critical period" },
    { id: 5, employeeId: 4, type: "Compassionate Leave", startDate: "2026-07-16", endDate: "2026-07-17", days: 2, status: "Approved", reason: "Family bereavement", approvedBy: "Grace Wanjiru", approvedDate: "2026-07-14" }
  ],

  payrollSummary: {
    totalCost: 28500000,
    baseSalary: 22000000,
    overtime: 1200000,
    bonuses: 1800000,
    allowances: 2400000,
    deductions: 1100000,
    netPay: 27400000
  },

  performanceReviews: [
    { id: 1, employeeId: 1, reviewer: "James Mwangi", period: "Q2 2026", rating: 4.8, status: "Completed", comments: "Excellent performance, exceeding all KPIs" },
    { id: 2, employeeId: 2, reviewer: "Grace Wanjiru", period: "Q2 2026", rating: 4.2, status: "Completed", comments: "Strong performance, needs improvement in sourcing strategy" },
    { id: 3, employeeId: 3, reviewer: "Grace Wanjiru", period: "Q2 2026", rating: 3.8, status: "In Progress", comments: "" },
    { id: 4, employeeId: 4, reviewer: "Grace Wanjiru", period: "Q2 2026", rating: null, status: "Pending", comments: "" },
    { id: 5, employeeId: 5, reviewer: "Grace Wanjiru", period: "Q2 2026", rating: 4.5, status: "Completed", comments: "Excellent training programs delivered" }
  ],

  trainingPrograms: [
    { id: 1, title: "Leadership Development Program", type: "Management", date: "2026-07-20", status: "Upcoming", attendees: 15, duration: "2 days", cost: 50000, certification: "Certified Leader", expiryDate: "2028-07-20" },
    { id: 2, title: "Excel Advanced Analytics", type: "Technical", date: "2026-07-10", status: "Completed", attendees: 20, duration: "1 day", cost: 20000, certification: "Excel Expert", expiryDate: "2028-07-10" },
    { id: 3, title: "Conflict Resolution Workshop", type: "Soft Skills", date: "2026-07-25", status: "Upcoming", attendees: 12, duration: "2 days", cost: 30000, certification: "Mediator", expiryDate: "2028-07-25" },
    { id: 4, title: "HR Compliance Certification", type: "Certification", date: "2026-08-05", status: "Pending", attendees: 8, duration: "5 days", cost: 100000, certification: "HR Compliance Professional", expiryDate: "2028-08-05" }
  ],

  recruitment: [
    { id: 1, position: "Senior Developer", department: "IT", status: "Open", applicants: 45, interviews: 8, offers: 2, hired: 0, postedDate: "2026-06-01", closingDate: "2026-07-31", budget: 200000 },
    { id: 2, position: "HR Business Partner", department: "HR", status: "Interviewing", applicants: 32, interviews: 6, offers: 1, hired: 1, postedDate: "2026-06-15", closingDate: "2026-07-30", budget: 180000 },
    { id: 3, position: "Financial Analyst", department: "Finance", status: "Open", applicants: 28, interviews: 4, offers: 0, hired: 0, postedDate: "2026-07-01", closingDate: "2026-08-15", budget: 150000 }
  ],

  budget: [
    { category: "Payroll", allocated: 25000000, used: 22000000, remaining: 3000000, year: "2026" },
    { category: "Training", allocated: 2000000, used: 1200000, remaining: 800000, year: "2026" },
    { category: "Recruitment", allocated: 3000000, used: 1800000, remaining: 1200000, year: "2026" },
    { category: "Welfare", allocated: 1000000, used: 600000, remaining: 400000, year: "2026" }
  ],

  approvals: [
    { id: 1, type: "Leave", requester: "Jane Muthoni", requestDate: "2026-07-14", status: "Pending", priority: "High", details: "Annual Leave - 5 days" },
    { id: 2, type: "Overtime", requester: "Peter Kimani", requestDate: "2026-07-14", status: "Pending", priority: "Medium", details: "3 hours overtime" },
    { id: 3, type: "Attendance Correction", requester: "Faith Akinyi", requestDate: "2026-07-13", status: "Pending", priority: "High", details: "Late clock-in correction" },
    { id: 4, type: "Training", requester: "Michael Okoth", requestDate: "2026-07-12", status: "Approved", priority: "Low", details: "Excel Advanced Training" }
  ],

  documents: [
    { id: 1, name: "Employment Contract - Grace Wanjiru.pdf", type: "Contract", date: "2020-03-15", size: "245 KB", status: "Active", expiryDate: "2025-03-14", employeeId: 1 },
    { id: 2, name: "Employment Contract - Brian Otieno.pdf", type: "Contract", date: "2021-06-01", size: "230 KB", status: "Active", expiryDate: "2026-05-31", employeeId: 2 },
    { id: 3, name: "Warning Letter - James Ochieng.pdf", type: "Warning Letter", date: "2026-06-10", size: "128 KB", status: "Active", employeeId: 8 },
    { id: 4, name: "Promotion Letter - Brian Otieno.pdf", type: "Promotion Letter", date: "2026-05-01", size: "186 KB", status: "Active", employeeId: 2 }
  ],

  assets: [
    { id: 1, name: "Laptop Dell XPS 15", assignedTo: "Grace Wanjiru", serial: "XPSC-2026-001", status: "Assigned", date: "2026-01-10", value: 150000, condition: "Good" },
    { id: 2, name: "iPhone 14 Pro", assignedTo: "Brian Otieno", serial: "IPH-2026-002", status: "Assigned", date: "2026-02-15", value: 120000, condition: "Good" },
    { id: 3, name: "HP Monitor 27\"", assignedTo: "Mercy Achieng", serial: "HPM-2026-003", status: "Assigned", date: "2026-03-01", value: 45000, condition: "Excellent" },
    { id: 4, name: "Lenovo ThinkPad", assignedTo: "Sam Mwangi", serial: "LTP-2026-004", status: "Assigned", date: "2026-01-20", value: 130000, condition: "Good" },
    { id: 5, name: "MacBook Pro 16\"", assignedTo: "Amina Hassan", serial: "MBP-2026-005", status: "Assigned", date: "2026-02-01", value: 180000, condition: "Excellent" }
  ],

  notifications: [
    { id: 1, type: "leave", message: "New leave request from Jane Muthoni", time: "2h ago", read: false, priority: "High" },
    { id: 2, type: "attendance", message: "Attendance correction request from Peter Kimani", time: "3h ago", read: false, priority: "Medium" },
    { id: 3, type: "birthday", message: "Today is Grace Wanjiru's birthday!", time: "5h ago", read: false, priority: "High" },
    { id: 4, type: "payroll", message: "July payroll has been published", time: "1d ago", read: true, priority: "Medium" },
    { id: 5, type: "performance", message: "Performance review due for 3 employees", time: "1d ago", read: true, priority: "High" }
  ],

  activityLog: [
    { id: 1, action: "Leave Approved", user: "Grace Wanjiru", target: "Jane Muthoni", time: "2h ago", icon: "check", details: "Annual leave approved" },
    { id: 2, action: "Employee Added", user: "Brian Otieno", target: "Michael Okoth", time: "3h ago", icon: "plus", details: "New employee added to system" },
    { id: 3, action: "Attendance Updated", user: "Mercy Achieng", target: "Peter Kimani", time: "4h ago", icon: "edit", details: "Attendance correction applied" },
    { id: 4, action: "Performance Review Submitted", user: "Sam Mwangi", target: "Faith Akinyi", time: "5h ago", icon: "file", details: "Q2 performance review completed" },
    { id: 5, action: "Training Assigned", user: "Amina Hassan", target: "5 employees", time: "1d ago", icon: "book", details: "Leadership training assigned" }
  ],

  meetings: [
    { id: 1, title: "Department Strategy Meeting", date: "2026-07-16", time: "10:00", attendees: 12, type: "Department", location: "Conference Room A" },
    { id: 2, title: "Employee Performance Review", date: "2026-07-17", time: "14:00", attendees: 3, type: "One-on-One", location: "Meeting Room 2" },
    { id: 3, title: "Budget Planning Session", date: "2026-07-20", time: "09:30", attendees: 8, type: "Department", location: "Board Room" }
  ],

  kpis: [
    { label: "Attendance Rate", value: "96%", color: "text-green-600", trend: 2.5 },
    { label: "Leave Utilization", value: "78%", color: "text-blue-600", trend: -1.2 },
    { label: "Training Completion", value: "92%", color: "text-yellow-600", trend: 5.8 },
    { label: "Turnover Rate", value: "4.2%", color: "text-red-600", trend: -0.3 },
    { label: "Avg Performance Score", value: "4.3", color: "text-purple-600", trend: 0.5 },
    { label: "Time to Approve Leave", value: "2.3h", color: "text-teal-600", trend: -0.5 },
    { label: "Overtime Hours", value: "14", color: "text-orange-600", trend: 2.1 },
    { label: "Open Vacancies", value: "18", color: "text-pink-600", trend: 3.0 }
  ],

  chartData: {
    attendanceTrend: [
      { month: "Jan", present: 180, absent: 12, late: 6 },
      { month: "Feb", present: 185, absent: 10, late: 4 },
      { month: "Mar", present: 190, absent: 8, late: 5 },
      { month: "Apr", present: 195, absent: 7, late: 3 },
      { month: "May", present: 188, absent: 9, late: 7 },
      { month: "Jun", present: 192, absent: 6, late: 4 },
      { month: "Jul", present: 186, absent: 7, late: 5 }
    ],
    leaveTrend: [
      { month: "Jan", approved: 15, pending: 5, rejected: 2 },
      { month: "Feb", approved: 18, pending: 3, rejected: 1 },
      { month: "Mar", approved: 12, pending: 8, rejected: 3 },
      { month: "Apr", approved: 20, pending: 4, rejected: 1 },
      { month: "May", approved: 16, pending: 6, rejected: 2 },
      { month: "Jun", approved: 22, pending: 3, rejected: 0 },
      { month: "Jul", approved: 14, pending: 4, rejected: 1 }
    ],
    genderDistribution: [
      { name: "Male", value: 120 },
      { name: "Female", value: 94 }
    ],
    employmentType: [
      { name: "Permanent", value: 156 },
      { name: "Contract", value: 38 },
      { name: "Probation", value: 14 },
      { name: "Intern", value: 6 }
    ],
    leaveTypes: [
      { name: "Annual", value: 45 },
      { name: "Sick", value: 28 },
      { name: "Maternity", value: 8 },
      { name: "Compassionate", value: 5 },
      { name: "Study", value: 3 },
      { name: "Other", value: 11 }
    ]
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const getStatusColor = (status: string): Tone => {
  const map: Record<string, Tone> = {
    'Active': 'success',
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
    'Completed': 'success',
    'In Progress': 'info',
    'Processing': 'warning',
    'Absent': 'danger',
    'Present': 'success',
    'Late': 'warning',
    'Remote': 'info',
    'Field Duty': 'info',
    'Early Departure': 'warning',
    'High': 'danger',
    'Medium': 'warning',
    'Low': 'info',
    'Upcoming': 'info',
    'Archived': 'neutral',
    'Assigned': 'success',
    'Training': 'info',
    'Department': 'info',
    'One-on-One': 'info',
    'On Break': 'info',
    'Clocked In': 'success',
    'Open': 'success',
    'Closed': 'neutral',
    'Interviewing': 'info',
    'Offered': 'warning',
    'Hired': 'success'
  };
  return map[status] || 'neutral';
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const MetricCard: React.FC<MetricCardProps> = ({ label, value, meta, tone = "neutral", icon: Icon, trend }) => (
  <div className="metric-cell">
    <div className="metric-top-row">
      <div className="metric-label">{label}</div>
      {Icon && (
        <span className={`icon-chip icon-chip-${tone}`}>
          <Icon size={16} />
        </span>
      )}
    </div>
    <div className="metric-value">
      {value}
      {trend !== undefined && (
        <span className={`trend-tag ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-flat'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : null}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    {meta && <div className="metric-meta"><span className={`pill pill-${tone}`}>{meta}</span></div>}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`pill pill-${getStatusColor(status)}`}>{status}</span>
);

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, variant = "secondary", size = "default", disabled = false }) => (
  <button className={`button button-${variant} ${size === "small" ? "button-small" : ""}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

// ============================================================
// CHART COMPONENTS
// ============================================================

const COLORS = ['#d4a843', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];

const ChartCard: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode; icon?: React.ComponentType<{ size?: number }> }> = ({ title, children, action, icon: Icon }) => (
  <div className="panel">
    <div className="panel-header">
      <h3 className="panel-title">
        {Icon && (
          <span className="icon-chip icon-chip-gold panel-title-icon">
            <Icon size={15} />
          </span>
        )}
        {title}
      </h3>
      {action && <div className="panel-action">{action}</div>}
    </div>
    <div className="panel-body" style={{ height: 300 }}>
      {children}
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const DepartmentDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("employee");
  const [feedback, setFeedback] = useState<string>("");
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(DATA.attendanceRecords);
  const [timers, setTimers] = useState<Record<number, TimerState>>({});
  const [intervalIds, setIntervalIds] = useState<Record<number, ReturnType<typeof setInterval>>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "warning" | "error">("success");

  // ---- Employee Self Check-In/Check-Out ----
  const [selfCheckins, setSelfCheckins] = useState<SelfCheckIn[]>([]);
  const [selfIntervalIds, setSelfIntervalIds] = useState<Record<number, ReturnType<typeof setInterval>>>({});
  const [selfCheckinIdCounter, setSelfCheckinIdCounter] = useState<number>(1);
  const [selfForm, setSelfForm] = useState<{ name: string; employeeId: string; department: string; position: string }>({
    name: "",
    employeeId: "",
    department: "People Operations",
    position: ""
  });
  const [selfFormError, setSelfFormError] = useState<string>("");

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateOvertime = (elapsedSeconds: number): number => {
    const standardSeconds = 8 * 3600;
    return Math.max(0, elapsedSeconds - standardSeconds);
  };

  const showFeedback = (message: string, type: "success" | "warning" | "error" = "success"): void => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const startTimer = (recordId: number): void => {
    if (timers[recordId]?.isRunning) return;

    const startTime = new Date();
    setTimers(prev => ({
      ...prev,
      [recordId]: { 
        startTime, 
        elapsed: 0, 
        isRunning: true,
        breaks: [],
        totalBreakTime: 0,
        overtime: 0
      }
    }));

    const intervalId = setInterval(() => {
      setTimers(prev => {
        const timer = prev[recordId];
        if (!timer || !timer.isRunning) return prev;
        
        const now = new Date();
        const totalElapsed = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000) - timer.totalBreakTime;
        const overtime = calculateOvertime(totalElapsed);
        
        return {
          ...prev,
          [recordId]: { 
            ...timer, 
            elapsed: totalElapsed,
            overtime
          }
        };
      });
    }, 1000);

    setIntervalIds(prev => ({ ...prev, [recordId]: intervalId }));
    
    setAttendanceData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "Clocked In", checkIn: new Date().toLocaleTimeString() }
        : record
    ));

    showFeedback(`Clocked in successfully!`, "success");
  };

  const stopTimer = (recordId: number): void => {
    if (intervalIds[recordId]) {
      clearInterval(intervalIds[recordId]);
      setIntervalIds(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[recordId];
        return newIntervals;
      });
    }

    const timer = timers[recordId];
    if (timer) {
      const totalTime = timer.elapsed;
      const overtime = timer.overtime;
      const totalBreakTime = timer.totalBreakTime;
      
      setTimers(prev => ({
        ...prev,
        [recordId]: { ...timer, isRunning: false }
      }));

      setAttendanceData(prev => prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              status: "Completed", 
              checkOut: new Date().toLocaleTimeString(),
              overtime: overtime / 3600
            }
          : record
      ));

      showFeedback(
        `Clocked out! Time worked: ${formatTime(totalTime)} | Overtime: ${formatTime(overtime)} | Breaks: ${formatTime(totalBreakTime)}`,
        "success"
      );
    }
  };

  const startBreak = (recordId: number): void => {
    const timer = timers[recordId];
    if (!timer || !timer.isRunning || timer.breakStart) return;

    setTimers(prev => ({
      ...prev,
      [recordId]: { 
        ...timer, 
        breakStart: new Date()
      }
    }));

    setAttendanceData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "On Break" }
        : record
    ));

    showFeedback("Break started", "success");
  };

  const endBreak = (recordId: number): void => {
    const timer = timers[recordId];
    if (!timer || !timer.breakStart) return;

    const breakEnd = new Date();
    const breakDuration = Math.floor((breakEnd.getTime() - timer.breakStart.getTime()) / 1000);
    const totalBreakTime = timer.totalBreakTime + breakDuration;

    const newBreak = { start: timer.breakStart, end: breakEnd, duration: breakDuration };

    setTimers(prev => ({
      ...prev,
      [recordId]: { 
        ...timer, 
        breakStart: undefined,
        totalBreakTime,
        breaks: [...timer.breaks, newBreak]
      }
    }));

    setAttendanceData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "Clocked In" }
        : record
    ));

    showFeedback(`Break ended - Duration: ${formatTime(breakDuration)}`, "success");
  };

  const handleSelfFormChange = (field: keyof typeof selfForm, value: string): void => {
    setSelfForm(prev => ({ ...prev, [field]: value }));
    if (selfFormError) setSelfFormError("");
  };

  const handleSelfClockIn = (): void => {
    if (!selfForm.name.trim()) {
      setSelfFormError("Please enter your full name to clock in.");
      return;
    }

    const newId = selfCheckinIdCounter;
    setSelfCheckinIdCounter(prev => prev + 1);

    const startTime = new Date();
    const newEntry: SelfCheckIn = {
      id: newId,
      name: selfForm.name.trim(),
      employeeId: selfForm.employeeId.trim() || `EMP-${1000 + newId}`,
      department: selfForm.department,
      position: selfForm.position.trim() || "—",
      checkIn: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      status: "Clocked In",
      startTime,
      elapsed: 0,
      isRunning: true,
      totalBreakTime: 0,
      overtime: 0
    };

    setSelfCheckins(prev => [newEntry, ...prev]);

    const intervalId = setInterval(() => {
      setSelfCheckins(prev => prev.map(entry => {
        if (entry.id !== newId || !entry.isRunning) return entry;
        const now = new Date();
        const totalElapsed = Math.floor((now.getTime() - entry.startTime.getTime()) / 1000) - entry.totalBreakTime;
        return { ...entry, elapsed: totalElapsed, overtime: calculateOvertime(totalElapsed) };
      }));
    }, 1000);

    setSelfIntervalIds(prev => ({ ...prev, [newId]: intervalId }));
    showFeedback(`Welcome ${newEntry.name}! You're clocked in at ${newEntry.checkIn}.`, "success");
    setSelfForm({ name: "", employeeId: "", department: selfForm.department, position: "" });
  };

  const handleSelfClockOut = (id: number): void => {
    if (selfIntervalIds[id]) {
      clearInterval(selfIntervalIds[id]);
      setSelfIntervalIds(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }

    const entry = selfCheckins.find(e => e.id === id);
    if (!entry) return;

    setSelfCheckins(prev => prev.map(e =>
      e.id === id
        ? { ...e, isRunning: false, status: "Completed", checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        : e
    ));

    showFeedback(
      `${entry.name} clocked out. Time worked: ${formatTime(entry.elapsed)}${entry.overtime > 0 ? ` (incl. ${formatTime(entry.overtime)} overtime)` : ""}.`,
      "success"
    );
  };

  const handleSelfBreakToggle = (id: number): void => {
    const entry = selfCheckins.find(e => e.id === id);
    if (!entry || !entry.isRunning) return;

    if (entry.breakStart) {
      const breakEnd = new Date();
      const breakDuration = Math.floor((breakEnd.getTime() - entry.breakStart.getTime()) / 1000);
      setSelfCheckins(prev => prev.map(e =>
        e.id === id
          ? { ...e, breakStart: undefined, totalBreakTime: e.totalBreakTime + breakDuration, status: "Clocked In" }
          : e
      ));
      showFeedback(`${entry.name} resumed work.`, "success");
    } else {
      setSelfCheckins(prev => prev.map(e =>
        e.id === id ? { ...e, breakStart: new Date(), status: "On Break" } : e
      ));
      showFeedback(`${entry.name} started a break.`, "success");
    }
  };

  useEffect(() => {
    return () => {
      Object.values(selfIntervalIds).forEach(clearInterval);
    };
  }, [selfIntervalIds]);

  const handleAction = (action: string, recordId: number): void => {
    switch(action) {
      case 'clock-in':
        startTimer(recordId);
        break;
      case 'clock-out':
        stopTimer(recordId);
        break;
      case 'start-break':
        startBreak(recordId);
        break;
      case 'end-break':
        endBreak(recordId);
        break;
      default:
        showFeedback(`Action: ${action} executed`, "success");
    }
  };

  const getAttendanceSummary = (): AttendanceSummary => {
    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.status === "Present" || a.status === "Clocked In" || a.status === "Completed").length;
    const absent = attendanceData.filter(a => a.status === "Absent").length;
    const late = attendanceData.filter(a => a.status === "Late").length;
    const onBreak = attendanceData.filter(a => a.status === "On Break").length;
    const remote = attendanceData.filter(a => a.status === "Remote").length;
    const fieldDuty = attendanceData.filter(a => a.status === "Field Duty").length;
    const earlyDeparture = attendanceData.filter(a => a.status === "Early Departure").length;

    let totalHours = 0;
    let totalOvertime = 0;
    let totalBreakTime = 0;

    Object.values(timers).forEach(timer => {
      totalHours += timer.elapsed || 0;
      totalOvertime += timer.overtime || 0;
      totalBreakTime += timer.totalBreakTime || 0;
    });

    attendanceData.forEach(record => {
      if (record.status === "Completed" && record.checkIn && record.checkOut) {
        const hours = record.overtime || 0;
        totalHours += hours * 3600;
        totalOvertime += hours * 3600;
      }
    });

    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : "0";

    return {
      total,
      present,
      absent,
      late,
      onBreak,
      remote,
      fieldDuty,
      earlyDeparture,
      attendanceRate,
      totalHours: formatTime(totalHours),
      totalOvertime: formatTime(totalOvertime),
      totalBreakTime: formatTime(totalBreakTime),
      avgHoursPerEmployee: total > 0 ? formatTime(totalHours / total) : "0:00:00"
    };
  };

  const handleExport = (format: string): void => {
    setFeedback(`Report export (${format.toUpperCase()}) has been queued.`);
    setTimeout(() => setFeedback(""), 5000);
  };

  const handleQuickAction = (action: string): void => {
    setFeedback(`${action} has been initiated.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleModalSubmit = (data: Record<string, unknown>): void => {
    setFeedback(`${modalType} action completed successfully!`);
    setShowModal(false);
    setTimeout(() => setFeedback(""), 3000);
  };

  // ============================================================
  // RENDER DASHBOARD
  // ============================================================

  const renderDashboard = () => {
    const summary = DATA.dashboardSummary;

    return (
      <>
        <div className="metrics grid-cols-6">
          <MetricCard label="Total Employees" value={summary.totalEmployees} meta={`${summary.activeEmployees} active`} icon={Users} />
          <MetricCard label="Present Today" value={summary.presentToday} meta={`${summary.absentToday} absent`} tone="success" icon={UserCheck} />
          <MetricCard label="On Leave" value={summary.onLeave} meta={`${summary.pendingLeave} pending`} tone="warning" icon={CalendarClock} />
          <MetricCard label="New Employees" value={summary.newEmployees} meta="This month" tone="success" icon={UserPlus} />
          <MetricCard label="Open Positions" value={summary.openPositions} meta="To fill" tone="info" icon={Briefcase} />
          <MetricCard label="Turnover" value={`${summary.turnoverRate}%`} meta="Monthly" tone="danger" icon={TrendingDown} />
        </div>

        <div className="metrics grid-cols-4">
          <MetricCard label="Performance Score" value={summary.performanceScore} meta="Rating" tone="success" icon={Star} />
          <MetricCard label="Satisfaction" value={`${summary.satisfactionScore}%`} meta="Score" tone="success" icon={Smile} />
          <MetricCard label="Department Budget" value={`KES ${(summary.departmentBudget / 1000000).toFixed(1)}M`} meta="Annual" icon={Wallet} />
          <MetricCard label="Payroll Status" value={summary.payrollStatus} meta="Processing" tone="warning" icon={DollarSign} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="Attendance Trend" icon={Activity}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA.chartData.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5a" />
                <XAxis dataKey="month" stroke="#8899b8" fontSize={12} />
                <YAxis stroke="#8899b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="present" stackId="1" stroke="#d4a843" fill="#d4a843" fillOpacity={0.28} />
                <Area type="monotone" dataKey="absent" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.28} />
                <Area type="monotone" dataKey="late" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.28} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Leave Trend" icon={CalendarClock}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA.chartData.leaveTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5a" />
                <XAxis dataKey="month" stroke="#8899b8" fontSize={12} />
                <YAxis stroke="#8899b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#d4a843" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <ChartCard title="Gender Distribution" icon={Users}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA.chartData.genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {DATA.chartData.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Employment Type" icon={Briefcase}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA.chartData.employmentType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {DATA.chartData.employmentType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Leave Types" icon={FileText}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA.chartData.leaveTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {DATA.chartData.leaveTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><Building2 size={15} /></span>
              Department Health
            </h3>
            <button className="panel-action" onClick={() => setActiveTab("employees")}>View All <ArrowUpRight size={14} /></button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Department</th><th>Manager</th><th>Headcount</th><th>Attendance</th><th>Payroll Status</th><th>ER Cases</th></tr></thead>
              <tbody>
                {[...new Set(DATA.employees.map(e => e.department))].map((dept: string) => {
                  const deptEmployees = DATA.employees.filter(e => e.department === dept);
                  const manager = deptEmployees.find(e => e.position.includes("Head") || e.position.includes("Manager"));
                  const attendance = DATA.attendanceRecords.filter(a => deptEmployees.some(e => e.id === a.employeeId));
                  const present = attendance.filter(a => a.status === "Present").length;
                  const cases = deptEmployees.filter(e => e.position.includes("Relations")).length;
                  return (
                    <tr key={dept}>
                      <td className="font-medium">{dept}</td>
                      <td>{manager?.name || "—"}</td>
                      <td>{deptEmployees.length}</td>
                      <td>{attendance.length > 0 ? `${Math.round((present / attendance.length) * 100)}%` : "—"}</td>
                      <td><StatusBadge status={cases > 1 ? "Review" : "Ready"} /></td>
                      <td><StatusBadge status={cases > 0 ? `${cases} cases` : "Clear"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // RENDER EMPLOYEES
  // ============================================================

  const renderEmployees = () => {
    const filtered = DATA.employees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><Users size={15} /></span>
              Employee Directory
            </h3>
            <span className="panel-subtitle">{filtered.length} employees found</span>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton onClick={() => { setModalType("employee"); setShowModal(true); }}><UserPlus size={15} /> Add Employee</ActionButton>
            <ActionButton onClick={() => handleExport("excel")}><Download size={15} /> Export</ActionButton>
          </div>
        </div>
        <div className="panel-body p-0">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Name</th><th>Position</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div className="row-identity">
                        <span className="avatar-chip">{emp.name.split(" ").map(n => n[0]).join("")}</span>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-xs text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td><StatusBadge status={emp.status} /></td>
                    <td>
                      <button className="panel-action" onClick={() => setSelectedEmployee(emp)}>View Profile <ArrowUpRight size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER ATTENDANCE
  // ============================================================

  const renderAttendance = () => {
    const summary = getAttendanceSummary();

    return (
      <div className="space-y-4">
        {feedbackMessage && (
          <div className={`note action-feedback ${feedbackType === 'error' ? 'note-error' : feedbackType === 'warning' ? 'note-warning' : ''}`}>
            <CheckCircle2 size={16} /> {feedbackMessage}
            <button onClick={() => setFeedbackMessage("")}>×</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-tile stat-tile-info">
            <span className="icon-chip icon-chip-info"><BarChart3 size={16} /></span>
            <div className="stat-tile-label">Attendance Rate</div>
            <div className="stat-tile-value">{summary.attendanceRate}%</div>
            <div className="stat-tile-meta">{summary.present} / {summary.total} employees</div>
          </div>
          <div className="stat-tile stat-tile-success">
            <span className="icon-chip icon-chip-success"><Clock size={16} /></span>
            <div className="stat-tile-label">Total Hours Worked</div>
            <div className="stat-tile-value">{summary.totalHours}</div>
            <div className="stat-tile-meta">Avg: {summary.avgHoursPerEmployee}/employee</div>
          </div>
          <div className="stat-tile stat-tile-warning">
            <span className="icon-chip icon-chip-warning"><TimerIcon size={16} /></span>
            <div className="stat-tile-label">Overtime</div>
            <div className="stat-tile-value">{summary.totalOvertime}</div>
            <div className="stat-tile-meta">Total overtime hours</div>
          </div>
          <div className="stat-tile stat-tile-purple">
            <span className="icon-chip icon-chip-purple"><Coffee size={16} /></span>
            <div className="stat-tile-label">Break Time</div>
            <div className="stat-tile-value">{summary.totalBreakTime}</div>
            <div className="stat-tile-meta">Total break duration</div>
          </div>
        </div>

        <div className="metrics grid-cols-5">
          <MetricCard label="Present" value={summary.present} meta={`${((summary.present / summary.total) * 100).toFixed(1)}%`} tone="success" icon={UserCheck} />
          <MetricCard label="Absent" value={summary.absent} meta={`${((summary.absent / summary.total) * 100).toFixed(1)}%`} tone="danger" icon={UserMinus} />
          <MetricCard label="Late" value={summary.late} meta={`${((summary.late / summary.total) * 100).toFixed(1)}%`} tone="warning" icon={AlertTriangle} />
          <MetricCard label="On Break" value={summary.onBreak} meta={`${summary.onBreak > 0 ? 'Active' : 'None'}`} tone="info" icon={Coffee} />
          <MetricCard label="Remote/Field" value={summary.remote + summary.fieldDuty} meta={`${summary.remote} remote, ${summary.fieldDuty} field`} tone="neutral" icon={Laptop} />
        </div>

        <div className="panel self-checkin-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><UserCheck size={15} /></span>
              Employee Self Check-In
            </h3>
            <span className="panel-subtitle">Enter your details to clock in — no login required</span>
          </div>
          <div className="panel-body">
            <div className="self-checkin-form">
              <label className="field-control">
                <span className="eyebrow">Full Name</span>
                <input
                  type="text"
                  placeholder="e.g. Grace Wanjiru"
                  value={selfForm.name}
                  onChange={(e) => handleSelfFormChange("name", e.target.value)}
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Employee ID (optional)</span>
                <input
                  type="text"
                  placeholder="e.g. EMP-1042"
                  value={selfForm.employeeId}
                  onChange={(e) => handleSelfFormChange("employeeId", e.target.value)}
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Department</span>
                <select
                  value={selfForm.department}
                  onChange={(e) => handleSelfFormChange("department", e.target.value)}
                >
                  {[...new Set(DATA.employees.map(e => e.department))].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="field-control">
                <span className="eyebrow">Position (optional)</span>
                <input
                  type="text"
                  placeholder="e.g. HR Specialist"
                  value={selfForm.position}
                  onChange={(e) => handleSelfFormChange("position", e.target.value)}
                />
              </label>
              <button className="button button-primary self-checkin-submit" onClick={handleSelfClockIn}>
                <Clock size={15} /> Clock In
              </button>
            </div>
            {selfFormError && (
              <div className="self-checkin-error"><AlertTriangle size={13} /> {selfFormError}</div>
            )}

            {selfCheckins.length > 0 && (
              <div className="self-checkin-list">
                {selfCheckins.map(entry => (
                  <div key={entry.id} className={`self-checkin-card ${entry.status === "Completed" ? "is-done" : ""}`}>
                    <div className="self-checkin-card-top">
                      <span className="avatar-chip">{entry.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</span>
                      <div className="self-checkin-card-info">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-xs text-gray-500">{entry.employeeId} · {entry.department}</div>
                      </div>
                      <StatusBadge status={entry.status} />
                    </div>
                    <div className="self-checkin-card-times">
                      <div><span className="text-xs text-gray-500">Check In</span><div className="font-medium">{entry.checkIn}</div></div>
                      <div><span className="text-xs text-gray-500">Check Out</span><div className="font-medium">{entry.checkOut || "—"}</div></div>
                      <div>
                        <span className="text-xs text-gray-500">Time Worked</span>
                        <div className="font-medium font-mono">
                          {entry.isRunning && (
                            <span className="flex items-center gap-1 text-success">
                              <span className="live-dot"></span>{formatTime(entry.elapsed)}
                            </span>
                          )}
                          {!entry.isRunning && formatTime(entry.elapsed)}
                        </div>
                      </div>
                      {entry.overtime > 0 && (
                        <div><span className="text-xs text-gray-500">Overtime</span><div className="font-medium text-orange-600">+{formatTime(entry.overtime)}</div></div>
                      )}
                    </div>
                    {entry.status !== "Completed" && (
                      <div className="self-checkin-card-actions">
                        <ActionButton
                          variant="secondary"
                          size="small"
                          onClick={() => handleSelfBreakToggle(entry.id)}
                        >
                          <Coffee size={12} /> {entry.breakStart ? "Resume" : "Break"}
                        </ActionButton>
                        <ActionButton
                          variant="danger"
                          size="small"
                          onClick={() => handleSelfClockOut(entry.id)}
                        >
                          <StopCircle size={12} /> Clock Out
                        </ActionButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="button button-primary" onClick={() => {
            attendanceData.forEach(record => {
              if (record.status === "Absent") startTimer(record.id);
            });
            showFeedback("Bulk clock-in initiated for all absent employees", "success");
          }}>
            <Clock size={14} /> Bulk Clock In
          </button>
          <button className="button button-secondary" onClick={() => handleAction('refresh', 0)}>
            <RefreshCw size={14} /> Refresh Status
          </button>
          <button className="button button-secondary" onClick={() => handleExport("attendance")}>
            <Download size={14} /> Export Report
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><Clock size={15} /></span>
              Today's Attendance
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {attendanceData.filter(a => a.status === "Clocked In" || a.status === "Present" || a.status === "Completed").length} active
              </span>
              <button className="panel-action" onClick={() => handleAction('refresh-attendance', 0)}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Time Worked</th>
                  <th>Break Time</th>
                  <th>Overtime</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map(rec => {
                  const emp = DATA.employees.find(e => e.id === rec.employeeId);
                  const timer = timers[rec.id];
                  const isRunning = timer?.isRunning || false;
                  const elapsedTime = timer?.elapsed || 0;
                  const breakTime = timer?.totalBreakTime || 0;
                  const overtime = timer?.overtime || 0;
                  const isOnBreak = timer?.breakStart !== undefined;
                  
                  return (
                    <tr key={rec.id}>
                      <td className="font-medium">{emp?.name || "Unknown"}</td>
                      <td>{rec.checkIn || "—"}</td>
                      <td>{rec.checkOut || "—"}</td>
                      <td>
                        {isRunning ? (
                          <span className="flex items-center gap-1 text-success font-mono">
                            <span className="live-dot"></span>
                            {formatTime(elapsedTime)}
                          </span>
                        ) : elapsedTime > 0 ? (
                          <span className="font-mono">{formatTime(elapsedTime)}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {breakTime > 0 ? formatTime(breakTime) : (isOnBreak ? <span className="text-warning">In progress</span> : "—")}
                      </td>
                      <td>
                        {overtime > 0 ? (
                          <span className="text-orange-600 font-mono font-medium">+{formatTime(overtime)}</span>
                        ) : "—"}
                      </td>
                      <td><StatusBadge status={rec.status} /></td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          {rec.status === "Absent" && (
                            <>
                              <ActionButton 
                                variant="success" 
                                size="small" 
                                onClick={() => handleAction('clock-in', rec.id)}
                              >
                                <Clock size={12} /> Clock In
                              </ActionButton>
                              <ActionButton 
                                variant="warning" 
                                size="small" 
                                onClick={() => handleAction('mark-late', rec.id)}
                              >
                                <ClockIcon size={12} /> Late
                              </ActionButton>
                            </>
                          )}
                          {rec.status === "Clocked In" && (
                            <>
                              <ActionButton 
                                variant="secondary" 
                                size="small" 
                                onClick={() => handleAction('start-break', rec.id)}
                                disabled={isOnBreak}
                              >
                                <Coffee size={12} /> Break
                              </ActionButton>
                              {isOnBreak && (
                                <ActionButton 
                                  variant="success" 
                                  size="small" 
                                  onClick={() => handleAction('end-break', rec.id)}
                                >
                                  <Play size={12} /> Resume
                                </ActionButton>
                              )}
                              <ActionButton 
                                variant="danger" 
                                size="small" 
                                onClick={() => handleAction('clock-out', rec.id)}
                              >
                                <StopCircle size={12} /> Clock Out
                              </ActionButton>
                            </>
                          )}
                          {rec.status === "Late" && (
                            <>
                              <ActionButton 
                                variant="success" 
                                size="small" 
                                onClick={() => handleAction('clock-in', rec.id)}
                              >
                                <Clock size={12} /> Clock In
                              </ActionButton>
                              <ActionButton 
                                variant="danger" 
                                size="small" 
                                onClick={() => handleAction('mark-absent', rec.id)}
                              >
                                <X size={12} /> Absent
                              </ActionButton>
                            </>
                          )}
                          {rec.status === "On Break" && (
                            <ActionButton 
                              variant="success" 
                              size="small" 
                              onClick={() => handleAction('end-break', rec.id)}
                            >
                              <Play size={12} /> Resume
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER LEAVE MANAGEMENT
  // ============================================================

  const renderLeave = () => {
    const pending = DATA.leaveRequests.filter(l => l.status === "Pending");
    const approved = DATA.leaveRequests.filter(l => l.status === "Approved");
    const rejected = DATA.leaveRequests.filter(l => l.status === "Rejected");

    return (
      <div className="space-y-4">
        <div className="metrics grid-cols-4">
          <MetricCard label="Pending" value={pending.length} tone="warning" icon={Clock} />
          <MetricCard label="Approved" value={approved.length} tone="success" icon={CheckCircle2} />
          <MetricCard label="Rejected" value={rejected.length} tone="danger" icon={X} />
          <MetricCard label="Total Requests" value={DATA.leaveRequests.length} icon={FileText} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><CalendarClock size={15} /></span>
              Leave Requests
            </h3>
            <button className="panel-action" onClick={() => handleQuickAction("New leave request")}>
              <Plus size={14} /> Request Leave
            </button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Employee</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {DATA.leaveRequests.map(req => {
                  const emp = DATA.employees.find(e => e.id === req.employeeId);
                  return (
                    <tr key={req.id}>
                      <td className="font-medium">{emp?.name || "Unknown"}</td>
                      <td>{req.type}</td>
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>{req.days}</td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>
                        {req.status === "Pending" && (
                          <div className="flex gap-1">
                            <ActionButton variant="success" size="small" onClick={() => handleQuickAction(`Approved ${req.type}`)}>Approve</ActionButton>
                            <ActionButton variant="danger" size="small" onClick={() => handleQuickAction(`Rejected ${req.type}`)}>Reject</ActionButton>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER PAYROLL
  // ============================================================

  const renderPayroll = () => (
    <div className="space-y-4">
      <div className="metrics grid-cols-4">
        <MetricCard label="Total Payroll" value={`KES ${DATA.payrollSummary.totalCost.toLocaleString()}`} icon={Wallet} />
        <MetricCard label="Base Salary" value={`KES ${DATA.payrollSummary.baseSalary.toLocaleString()}`} icon={DollarSign} />
        <MetricCard label="Overtime" value={`KES ${DATA.payrollSummary.overtime.toLocaleString()}`} icon={Clock} />
        <MetricCard label="Net Pay" value={`KES ${DATA.payrollSummary.netPay.toLocaleString()}`} icon={CheckCircle2} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <span className="icon-chip icon-chip-gold panel-title-icon"><Wallet size={15} /></span>
            Payroll Breakdown
          </h3>
          <button className="panel-action" onClick={() => handleExport("pdf")}><Download size={14} /> Export Report</button>
        </div>
        <div className="panel-body">
          <div className="space-y-2">
            {Object.entries(DATA.payrollSummary).map(([key, value]) => {
              if (typeof value === 'number' && key !== 'totalCost' && key !== 'netPay') {
                return (
                  <div key={key} className="breakdown-row">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">KES {value.toLocaleString()}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER RECRUITMENT
  // ============================================================

  const renderRecruitment = () => (
    <div className="space-y-4">
      <div className="metrics grid-cols-4">
        <MetricCard label="Open Vacancies" value={DATA.dashboardSummary.openPositions} icon={Briefcase} tone="info" />
        <MetricCard label="Total Candidates" value="124" icon={Users} tone="success" />
        <MetricCard label="Interviews" value="48" icon={Calendar} tone="warning" />
        <MetricCard label="Offers Pending" value="6" icon={Mail} tone="success" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <span className="icon-chip icon-chip-gold panel-title-icon"><Briefcase size={15} /></span>
            Open Positions
          </h3>
          <button className="panel-action" onClick={() => handleQuickAction("New position")}><Plus size={14} /> Create Position</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Position</th><th>Department</th><th>Status</th><th>Applicants</th><th>Interviews</th><th>Actions</th></tr></thead>
            <tbody>
              {DATA.recruitment.map(pos => (
                <tr key={pos.id}>
                  <td className="font-medium">{pos.position}</td>
                  <td>{pos.department}</td>
                  <td><StatusBadge status={pos.status} /></td>
                  <td>{pos.applicants}</td>
                  <td>{pos.interviews}</td>
                  <td><button className="panel-action" onClick={() => handleQuickAction(`View ${pos.position}`)}>View <ArrowUpRight size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER PERFORMANCE
  // ============================================================

  const renderPerformance = () => {
    const completed = DATA.performanceReviews.filter(r => r.status === "Completed");
    const pending = DATA.performanceReviews.filter(r => r.status === "Pending");
    const avgRating = completed.reduce((sum, r) => sum + (r.rating || 0), 0) / (completed.length || 1);

    return (
      <div className="space-y-4">
        <div className="metrics grid-cols-4">
          <MetricCard label="Completed" value={completed.length} tone="success" icon={CheckCircle2} />
          <MetricCard label="Pending" value={pending.length} tone="warning" icon={Clock} />
          <MetricCard label="In Progress" value={DATA.performanceReviews.filter(r => r.status === "In Progress").length} tone="info" icon={Activity} />
          <MetricCard label="Avg Rating" value={avgRating.toFixed(1)} icon={Star} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><Star size={15} /></span>
              Performance Reviews
            </h3>
            <button className="panel-action" onClick={() => handleQuickAction("Start new review")}><Plus size={14} /> New Review</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Employee</th><th>Reviewer</th><th>Period</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {DATA.performanceReviews.map(review => {
                  const emp = DATA.employees.find(e => e.id === review.employeeId);
                  return (
                    <tr key={review.id}>
                      <td className="font-medium">{emp?.name || "Unknown"}</td>
                      <td>{review.reviewer}</td>
                      <td>{review.period}</td>
                      <td>{review.rating ? `${review.rating}/5` : "—"}</td>
                      <td><StatusBadge status={review.status} /></td>
                      <td><button className="panel-action" onClick={() => handleQuickAction("Review employee")}>{review.status === "Pending" ? "Start Review" : "View Details"}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER TRAINING
  // ============================================================

  const renderTraining = () => {
    const upcoming = DATA.trainingPrograms.filter(t => t.status === "Upcoming");
    const completed = DATA.trainingPrograms.filter(t => t.status === "Completed");

    return (
      <div className="space-y-4">
        <div className="metrics grid-cols-3">
          <MetricCard label="Upcoming" value={upcoming.length} tone="info" icon={Calendar} />
          <MetricCard label="Completed" value={completed.length} tone="success" icon={CheckCircle2} />
          <MetricCard label="Total Programs" value={DATA.trainingPrograms.length} icon={BookOpen} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="icon-chip icon-chip-gold panel-title-icon"><GraduationCap size={15} /></span>
              Training Programs
            </h3>
            <button className="panel-action" onClick={() => { setModalType("training"); setShowModal(true); }}><Plus size={14} /> Create Training</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Attendees</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {DATA.trainingPrograms.map(t => (
                  <tr key={t.id}>
                    <td className="font-medium">{t.title}</td>
                    <td>{t.type}</td>
                    <td>{t.date}</td>
                    <td>{t.attendees}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td><button className="panel-action" onClick={() => handleQuickAction("View training")}><Eye size={12} /> View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER APPROVALS
  // ============================================================

  const renderApprovals = () => (
    <div className="space-y-4">
      <div className="metrics grid-cols-4">
        <MetricCard label="Pending Approvals" value={DATA.dashboardSummary.pendingApprovals} tone="warning" icon={Clock} />
        <MetricCard label="Leave Approvals" value="4" tone="info" icon={CalendarClock} />
        <MetricCard label="Attendance Corrections" value="3" tone="warning" icon={Edit} />
        <MetricCard label="Training Requests" value="2" tone="success" icon={GraduationCap} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <span className="icon-chip icon-chip-gold panel-title-icon"><ClipboardCheck size={15} /></span>
            Approval Center
          </h3>
          <button className="panel-action" onClick={() => handleQuickAction("View all")}>View All</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Type</th><th>Requester</th><th>Date</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {DATA.approvals.map(approval => (
                <tr key={approval.id}>
                  <td className="font-medium">{approval.type}</td>
                  <td>{approval.requester}</td>
                  <td>{approval.requestDate}</td>
                  <td><StatusBadge status={approval.priority} /></td>
                  <td><StatusBadge status={approval.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <ActionButton variant="success" size="small" onClick={() => handleQuickAction(`Approve ${approval.type}`)}>Approve</ActionButton>
                      <ActionButton variant="danger" size="small" onClick={() => handleQuickAction(`Reject ${approval.type}`)}>Reject</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER BUDGET
  // ============================================================

  const renderBudget = () => (
    <div className="space-y-4">
      <div className="metrics grid-cols-4">
        <MetricCard label="Total Budget" value={`KES ${(DATA.dashboardSummary.departmentBudget / 1000000).toFixed(1)}M`} icon={Wallet} />
        <MetricCard label="Used" value={`KES ${(DATA.dashboardSummary.departmentBudget * 0.65 / 1000000).toFixed(1)}M`} meta="65%" tone="warning" icon={TrendingUp} />
        <MetricCard label="Remaining" value={`KES ${(DATA.dashboardSummary.departmentBudget * 0.35 / 1000000).toFixed(1)}M`} meta="35%" tone="success" icon={TrendingDown} />
        <MetricCard label="Payroll Cost" value={`KES ${(DATA.payrollSummary.totalCost / 1000000).toFixed(1)}M`} meta="Monthly" icon={Users} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <span className="icon-chip icon-chip-gold panel-title-icon"><DollarSign size={15} /></span>
            Budget Breakdown
          </h3>
        </div>
        <div className="panel-body">
          <div className="space-y-4">
            {DATA.budget.map(item => (
              <div key={item.category} className="budget-row">
                <div className="flex justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span>KES {(item.used / 1000000).toFixed(1)}M / KES {(item.allocated / 1000000).toFixed(1)}M</span>
                </div>
                <div className="budget-track">
                  <div 
                    className="budget-fill" 
                    style={{ width: `${(item.used / item.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER CALENDAR
  // ============================================================

  const renderCalendar = () => (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="icon-chip icon-chip-gold panel-title-icon"><Calendar size={15} /></span>
          Calendar
        </h3>
        <div className="flex gap-2 items-center">
          <button className="panel-action" onClick={() => handleQuickAction("Previous")}><ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} /></button>
          <span className="text-sm font-medium">July 2026</span>
          <button className="panel-action" onClick={() => handleQuickAction("Next")}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="panel-body">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-dow">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2;
            if (day < 1 || day > 31) return <div key={i} className="calendar-cell calendar-cell-muted">{day}</div>;
            const events = [];
            if (day === 15) events.push({ type: 'birthday', name: 'Grace Wanjiru' });
            if (day === 20) events.push({ type: 'leave', name: 'Team Meeting' });
            if (day === 25) events.push({ type: 'training', name: 'Leadership Program' });
            return (
              <div key={i} className="calendar-cell">
                <div className="calendar-cell-day">{day}</div>
                {events.map((event, idx) => (
                  <div key={idx} className={`calendar-event calendar-event-${event.type}`}>
                    {event.type === 'birthday' && <Gift size={10} />}
                    {event.type === 'leave' && <CalendarClock size={10} />}
                    {event.type === 'training' && <GraduationCap size={10} />}
                    {event.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER REPORTS
  // ============================================================

  const renderReports = () => (
    <div className="space-y-4">
      <div className="metrics grid-cols-4">
        <MetricCard label="Attendance Report" value="Generate" icon={FileText} tone="info" />
        <MetricCard label="Leave Report" value="Generate" icon={Calendar} tone="info" />
        <MetricCard label="Payroll Report" value="Generate" icon={DollarSign} tone="info" />
        <MetricCard label="Performance Report" value="Generate" icon={Star} tone="info" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <span className="icon-chip icon-chip-gold panel-title-icon"><FileText size={15} /></span>
            Reports Center
          </h3>
          <button className="panel-action" onClick={() => handleQuickAction("Generate all")}>Generate All</button>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Attendance', 'Leave', 'Payroll', 'Employee', 'Performance', 'Recruitment', 'Budget', 'Training'].map(report => (
              <div key={report} className="report-card" onClick={() => handleExport(report.toLowerCase())}>
                <span className="icon-chip icon-chip-gold report-card-icon"><FileText size={22} /></span>
                <div className="font-medium mt-2">{report} Report</div>
                <div className="text-xs text-gray-500">Export as PDF/Excel</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER QUICK ACTIONS
  // ============================================================

  const renderQuickActions = () => (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
      <button className="quick-action-tile quick-action-info" onClick={() => handleQuickAction("Add Employee")}>
        <span className="icon-chip icon-chip-gold quick-action-icon"><UserPlus size={22} /></span>
        <div className="quick-action-label">Add Employee</div>
      </button>
      <button className="quick-action-tile quick-action-success" onClick={() => handleQuickAction("Approve Leave")}>
        <span className="icon-chip icon-chip-success quick-action-icon"><CheckCircle2 size={22} /></span>
        <div className="quick-action-label">Approve Leave</div>
      </button>
      <button className="quick-action-tile quick-action-warning" onClick={() => handleQuickAction("Record Attendance")}>
        <span className="icon-chip icon-chip-warning quick-action-icon"><Clock size={22} /></span>
        <div className="quick-action-label">Record Attendance</div>
      </button>
      <button className="quick-action-tile quick-action-purple" onClick={() => handleQuickAction("Generate Payroll")}>
        <span className="icon-chip icon-chip-purple quick-action-icon"><DollarSign size={22} /></span>
        <div className="quick-action-label">Generate Payroll</div>
      </button>
      <button className="quick-action-tile quick-action-pink" onClick={() => handleQuickAction("Assign Training")}>
        <span className="icon-chip icon-chip-pink quick-action-icon"><GraduationCap size={22} /></span>
        <div className="quick-action-label">Assign Training</div>
      </button>
      <button className="quick-action-tile quick-action-indigo" onClick={() => handleQuickAction("Create Announcement")}>
        <span className="icon-chip icon-chip-indigo quick-action-icon"><Megaphone size={22} /></span>
        <div className="quick-action-label">Announce</div>
      </button>
    </div>
  );

  // ============================================================
  // AI ASSISTANT LOGIC
  // ============================================================

  const AIAssistantLogic = {
    getResponse: (userMessage: string, context: any): { text: string; quickActions?: string[] } => {
      const lowerMsg = userMessage.toLowerCase();
      
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey')) {
        return {
          text: "👋 Hello! I'm your Department Assistant. I can help with:\n• Employee information\n• Attendance tracking\n• Leave management\n• Payroll queries\n• Performance reviews\n• Training programs\n• Department analytics\n\nWhat would you like to know?",
          quickActions: ['Show attendance summary', 'Pending leave requests', 'Department health']
        };
      }

      if (lowerMsg.includes('attendance') || lowerMsg.includes('present') || lowerMsg.includes('absent')) {
        const summary = context.getAttendanceSummary();
        return {
          text: `📊 **Attendance Summary**\n\n• Attendance Rate: ${summary.attendanceRate}%\n• Present: ${summary.present} employees\n• Absent: ${summary.absent} employees\n• Late: ${summary.late} employees\n• On Break: ${summary.onBreak} employees\n• Remote: ${summary.remote} employees\n• Total Hours Worked: ${summary.totalHours}\n• Overtime: ${summary.totalOvertime}`,
          quickActions: ['Who is absent today?', 'Mark attendance', 'View attendance table']
        };
      }

      if (lowerMsg.includes('who is absent') || lowerMsg.includes('absent today')) {
        const absentEmployees = context.attendanceData
          .filter((a: AttendanceRecord) => a.status === 'Absent')
          .map((a: AttendanceRecord) => {
            const emp = context.employees.find((e: Employee) => e.id === a.employeeId);
            return emp?.name || 'Unknown';
          })
          .filter(Boolean);
        
        if (absentEmployees.length === 0) {
          return {
            text: "✅ Great news! No employees are absent today.",
            quickActions: ['Show attendance summary', 'Mark someone late']
          };
        }
        
        return {
          text: `📋 **Employees Absent Today**\n\n${absentEmployees.map((name: string) => `• ${name}`).join('\n')}\n\nTotal: ${absentEmployees.length} employees`,
          quickActions: ['Mark attendance', 'Contact absent employees']
        };
      }

      if (lowerMsg.includes('leave') || lowerMsg.includes('vacation') || lowerMsg.includes('holiday')) {
        const pending = context.leaveRequests.filter((l: LeaveRequest) => l.status === 'Pending');
        const approved = context.leaveRequests.filter((l: LeaveRequest) => l.status === 'Approved');
        
        if (lowerMsg.includes('pending')) {
          if (pending.length === 0) {
            return {
              text: "✅ No pending leave requests at the moment.",
              quickActions: ['View all leaves', 'Request leave']
            };
          }
          return {
            text: `⏳ **Pending Leave Requests** (${pending.length})\n\n${pending.map((l: LeaveRequest) => {
              const emp = context.employees.find((e: Employee) => e.id === l.employeeId);
              return `• ${emp?.name || 'Unknown'}: ${l.type} (${l.days} days)`;
            }).join('\n')}`,
            quickActions: ['Approve all leaves', 'View all leave requests']
          };
        }
        
        return {
          text: `📅 **Leave Summary**\n\n• Total Requests: ${context.leaveRequests.length}\n• Pending: ${pending.length}\n• Approved: ${approved.length}\n• Rejected: ${context.leaveRequests.filter((l: LeaveRequest) => l.status === 'Rejected').length}`,
          quickActions: ['Show pending leaves', 'Request leave', 'View leave calendar']
        };
      }

      if (lowerMsg.includes('payroll') || lowerMsg.includes('salary') || lowerMsg.includes('budget')) {
        const summary = context.payrollSummary;
        return {
          text: `💰 **Payroll Summary**\n\n• Total Cost: KES ${summary.totalCost.toLocaleString()}\n• Base Salary: KES ${summary.baseSalary.toLocaleString()}\n• Overtime: KES ${summary.overtime.toLocaleString()}\n• Bonuses: KES ${summary.bonuses.toLocaleString()}\n• Net Pay: KES ${summary.netPay.toLocaleString()}`,
          quickActions: ['View payroll breakdown', 'Export payroll report', 'Department budget']
        };
      }

      if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
        return {
          text: `🤖 **I can help you with:**\n\n📊 **Dashboard Analytics**\n• Department health\n• Key metrics and KPIs\n\n👥 **Employee Management**\n• Find employee information\n• View team structure\n\n⏰ **Attendance**\n• Track attendance\n• Clock in/out\n• Break management\n\n📋 **Leave Management**\n• View pending requests\n• Leave balances\n\n💰 **Payroll**\n• Payroll summary\n• Salary breakdown\n\n⭐ **Performance**\n• Review status\n• Performance ratings\n\n🎓 **Training**\n• Upcoming programs\n• Training completion\n\nJust type what you need!`,
          quickActions: ['Show attendance summary', 'View pending leaves', 'Department health']
        };
      }

      return {
        text: "I'm not sure I understand. I can help with attendance, leave, payroll, performance, training, and employee information. Try asking something like:\n\n• 'Show attendance summary'\n• 'Who is absent today?'\n• 'Pending leave requests'\n• 'Payroll summary'\n• 'Performance reviews'\n• 'Department health'\n\nHow can I assist you today?",
        quickActions: ['Show attendance summary', 'Help', 'Department health']
      };
    }
  };

  // ============================================================
  // AI ASSISTANT COMPONENT
  // ============================================================

  const AIAssistantComponent: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    context: any;
  }> = ({ isOpen, onClose, context }) => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        text: "👋 Hello! I'm your Department Assistant. I can help you with attendance, leave, payroll, performance, training, and more. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
        quickActions: ['Show attendance summary', 'Pending leave requests', 'Department health']
      }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [messageIdCounter, setMessageIdCounter] = useState(2);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }, [isOpen]);

    const handleSend = (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: messageIdCounter,
        text: text.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessageIdCounter(prev => prev + 1);
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const response = AIAssistantLogic.getResponse(text.trim(), context);
        const aiMessage: Message = {
          id: messageIdCounter + 1,
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
          quickActions: response.quickActions
        };
        setMessageIdCounter(prev => prev + 2);
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 500 + Math.floor(Math.random() * 500));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(input);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="ai-assistant-container">
        <div className="ai-assistant-header">
          <div className="ai-assistant-header-left">
            <div className="ai-avatar">
              <Bot size={20} />
            </div>
            <div>
              <h3>Department Assistant</h3>
              <span className="ai-status">● Online</span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="ai-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
              {msg.sender === 'ai' && (
                <div className="ai-message-avatar">
                  <Bot size={16} />
                </div>
              )}
              <div className="ai-message-content">
                <div className="ai-message-text">{msg.text}</div>
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="ai-quick-actions">
                    {msg.quickActions.map((action, idx) => (
                      <button 
                        key={idx} 
                        className="ai-quick-action-btn"
                        onClick={() => handleSend(action)}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
                <div className="ai-message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message ai">
              <div className="ai-message-avatar">
                <Bot size={16} />
              </div>
              <div className="ai-message-content">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-area">
          <div className="ai-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="ai-input"
            />
            <button 
              className="ai-send-btn" 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
            </button>
          </div>
          <div className="ai-suggestions">
            <button className="ai-suggestion-chip" onClick={() => handleSend('Show attendance summary')}>
              <Calendar size={12} /> Attendance
            </button>
            <button className="ai-suggestion-chip" onClick={() => handleSend('Pending leave requests')}>
              <ClockIcon size={12} /> Leaves
            </button>
            <button className="ai-suggestion-chip" onClick={() => handleSend('Payroll summary')}>
              <Wallet size={12} /> Payroll
            </button>
            <button className="ai-suggestion-chip" onClick={() => handleSend('Department health')}>
              <Building2 size={12} /> Departments
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // TABS
  // ============================================================

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "employees", label: "Employees", icon: Users },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave Management", icon: CalendarClock },
    { id: "payroll", label: "Payroll", icon: Wallet },
    { id: "recruitment", label: "Recruitment", icon: Briefcase },
    { id: "performance", label: "Performance", icon: Star },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "approvals", label: "Approvals", icon: ClipboardCheck },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "quickactions", label: "Quick Actions", icon: Zap }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "dashboard": return renderDashboard();
      case "employees": return renderEmployees();
      case "attendance": return renderAttendance();
      case "leave": return renderLeave();
      case "payroll": return renderPayroll();
      case "recruitment": return renderRecruitment();
      case "performance": return renderPerformance();
      case "training": return renderTraining();
      case "budget": return renderBudget();
      case "approvals": return renderApprovals();
      case "calendar": return renderCalendar();
      case "reports": return renderReports();
      case "quickactions": return renderQuickActions();
      default: return null;
    }
  };

  const getAIContext = () => ({
    employees: DATA.employees,
    attendanceData: attendanceData,
    leaveRequests: DATA.leaveRequests,
    payrollSummary: DATA.payrollSummary,
    performanceReviews: DATA.performanceReviews,
    trainingPrograms: DATA.trainingPrograms,
    getAttendanceSummary: getAttendanceSummary
  });

  // ============================================================
  // MAIN RETURN
  // ============================================================

  return (
    <div className="department-dashboard executive-consistent-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .department-dashboard {
          --font-display: var(--font-serif);
          --font-body: var(--font-sans);

          /* Executive Dashboard light visual system */
          --bg: oklch(97.5% 0.004 250);
          --bg-soft: oklch(97.5% 0.004 250);
          --bg-surface: oklch(99% 0.002 255);
          --bg-hover: oklch(93% 0.003 255);
          --border: oklch(89.5% 0.005 255);
          --border-light: oklch(93% 0.003 255);

          --gold: oklch(69% 0.1 78);
          --gold-soft: oklch(69% 0.1 78);
          --gold-light: oklch(87% 0.035 78);
          --gold-dark: oklch(57% 0.08 64);
          --gold-bg: oklch(87% 0.035 78);
          --gold-border: oklch(89.5% 0.005 255);

          --text-primary: oklch(20% 0.018 255);
          --text-secondary: oklch(44% 0.012 255);
          --text-muted: oklch(60% 0.008 255);
          --text-faint: oklch(60% 0.008 255);

          --success: oklch(57% 0.11 155);
          --success-soft: oklch(92% 0.025 155);
          --warning: oklch(66% 0.11 85);
          --warning-soft: oklch(93% 0.028 85);
          --danger: oklch(56% 0.13 28);
          --danger-soft: oklch(92% 0.025 28);
          --info: oklch(55% 0.09 240);
          --info-soft: oklch(92% 0.02 240);
          --neutral: #94a3b8;
          --neutral-soft: rgba(148, 163, 184, 0.15);
          --purple: #a78bfa;
          --purple-soft: rgba(167, 139, 250, 0.15);
          --pink: #f472b6;
          --pink-soft: rgba(244, 114, 182, 0.15);
          --indigo: #818cf8;
          --indigo-soft: rgba(129, 140, 248, 0.15);

          /* Keep accent colors but make them gold/bronze */
          --primary: var(--gold);
          --primary-soft: var(--gold-bg);
          --primary-dark: var(--gold-dark);
          --accent: var(--gold);

          font-family: var(--font-body);
          color: var(--text-primary);
          background: var(--bg);
          padding: 24px 28px 56px;
          min-height: 100vh;
          box-sizing: border-box;
          position: relative;
        }

        .department-dashboard *,
        .department-dashboard *::before,
        .department-dashboard *::after {
          box-sizing: border-box;
        }

        .department-dashboard h1,
        .department-dashboard h2,
        .department-dashboard h3 {
          font-family: var(--font-display);
          margin: 0;
          color: var(--text-primary);
        }

        /* ---------- NAV ---------- */
        .department-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 6px;
          margin-bottom: 20px;
          position: sticky;
          top: 8px;
          z-index: 20;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .department-nav button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 13px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          white-space: nowrap;
        }
        .department-nav button:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .department-nav button.active {
          background: var(--gold);
          color: var(--bg);
          box-shadow: 0 4px 16px rgba(212, 168, 67, 0.3);
        }

        /* ---------- HEADING ---------- */
        .dashboard-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .page-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }
        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .page-subtitle {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin: 6px 0 0;
          max-width: 520px;
        }
        .action-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ---------- BUTTONS (Gold/Bronze themed) ---------- */
        .button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .button:active {
          transform: translateY(1px);
        }
        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .button-primary {
          background: var(--gold);
          color: var(--bg);
          box-shadow: 0 4px 16px rgba(212, 168, 67, 0.3);
        }
        .button-primary:hover {
          background: var(--gold-dark);
          box-shadow: 0 4px 20px rgba(212, 168, 67, 0.4);
        }
        .button-secondary {
          background: var(--bg-surface);
          color: var(--text-primary);
          border-color: var(--border);
        }
        .button-secondary:hover {
          background: var(--bg-hover);
          border-color: var(--gold);
        }
        .button-success {
          background: var(--success);
          color: var(--bg);
        }
        .button-success:hover {
          filter: brightness(0.9);
        }
        .button-danger {
          background: var(--danger);
          color: var(--bg);
        }
        .button-danger:hover {
          filter: brightness(0.9);
        }
        .button-warning {
          background: var(--warning);
          color: var(--bg);
        }
        .button-warning:hover {
          filter: brightness(0.9);
        }
        .button-small {
          padding: 5px 9px;
          font-size: 11.5px;
          border-radius: 7px;
        }

        /* ---------- ICON CHIPS ---------- */
        .icon-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .icon-chip-success {
          background: var(--success-soft);
          color: var(--success);
        }
        .icon-chip-warning {
          background: var(--warning-soft);
          color: var(--warning);
        }
        .icon-chip-danger {
          background: var(--danger-soft);
          color: var(--danger);
        }
        .icon-chip-info {
          background: var(--info-soft);
          color: var(--info);
        }
        .icon-chip-neutral {
          background: var(--neutral-soft);
          color: var(--neutral);
        }
        .icon-chip-gold {
          background: var(--gold-bg);
          color: var(--gold);
          border: 1px solid var(--gold-border);
        }
        .icon-chip-purple {
          background: var(--purple-soft);
          color: var(--purple);
        }
        .icon-chip-pink {
          background: var(--pink-soft);
          color: var(--pink);
        }
        .icon-chip-indigo {
          background: var(--indigo-soft);
          color: var(--indigo);
        }

        .panel-title-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          margin-right: 8px;
        }

        /* ---------- METRICS GRID ---------- */
        .metrics {
          display: grid;
          gap: 14px;
          margin-bottom: 18px;
        }
        .grid-cols-6 {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
        .grid-cols-5 {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 1100px) {
          .grid-cols-6,
          .grid-cols-5,
          .grid-cols-4 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .grid-cols-6,
          .grid-cols-5,
          .grid-cols-4,
          .grid-cols-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .metric-cell {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
        }
        .metric-cell:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
          border-color: var(--gold-border);
        }
        .metric-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .metric-value {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .trend-tag {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          font-weight: 700;
          font-family: var(--font-body);
        }
        .trend-up {
          color: var(--success);
        }
        .trend-down {
          color: var(--danger);
        }
        .trend-flat {
          color: var(--text-faint);
        }
        .metric-meta {
          margin-top: 8px;
        }

        /* ---------- PILLS / BADGES ---------- */
        .pill {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          text-transform: capitalize;
        }
        .pill-success {
          background: var(--success-soft);
          color: var(--success);
        }
        .pill-warning {
          background: var(--warning-soft);
          color: var(--warning);
        }
        .pill-danger {
          background: var(--danger-soft);
          color: var(--danger);
        }
        .pill-info {
          background: var(--info-soft);
          color: var(--info);
        }
        .pill-neutral {
          background: var(--neutral-soft);
          color: var(--neutral);
        }

        /* ---------- PANELS ---------- */
        .panel {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-bottom: 18px;
          overflow: hidden;
        }
        .panel:hover {
          border-color: var(--border-light);
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          background: var(--bg-soft);
        }
        .panel-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
        }
        .panel-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .panel-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--gold);
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .panel-action:hover {
          color: var(--gold-light);
          text-decoration: underline;
        }
        .panel-body {
          padding: 18px;
        }
        .panel-body.p-0 {
          padding: 0;
        }

        /* ---------- TABLE ---------- */
        .table-wrap {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .table thead th {
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          padding: 10px 18px;
          background: var(--bg-soft);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .table tbody td {
          padding: 12px 18px;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          vertical-align: middle;
        }
        .table tbody tr:last-child td {
          border-bottom: none;
        }
        .table tbody tr:hover {
          background: var(--bg-hover);
        }
        .table .font-medium {
          font-weight: 600;
          color: var(--text-primary);
        }

        .row-identity {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar-chip {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--gold-bg);
          color: var(--gold);
          font-size: 11px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--gold-border);
        }

        /* ---------- NOTES / FEEDBACK ---------- */
        .note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--success-soft);
          color: var(--success);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .note button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          font-size: 16px;
          cursor: pointer;
          line-height: 1;
        }
        .note-warning {
          background: var(--warning-soft);
          color: var(--warning);
          border-color: rgba(251, 191, 36, 0.2);
        }
        .note-error {
          background: var(--danger-soft);
          color: var(--danger);
          border-color: rgba(248, 113, 113, 0.2);
        }

        /* ---------- STAT TILES ---------- */
        .stat-tile {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          text-align: center;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .stat-tile:hover {
          border-color: var(--gold-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .stat-tile .icon-chip {
          margin: 0 auto 8px;
        }
        .stat-tile-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-tile-value {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          margin-top: 2px;
        }
        .stat-tile-meta {
          font-size: 11px;
          color: var(--text-faint);
          margin-top: 2px;
        }
        .stat-tile-info .stat-tile-value {
          color: var(--info);
        }
        .stat-tile-success .stat-tile-value {
          color: var(--success);
        }
        .stat-tile-warning .stat-tile-value {
          color: var(--warning);
        }
        .stat-tile-purple .stat-tile-value {
          color: var(--purple);
        }

        .live-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--success);
          animation: pulse-dot 1.4s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }

        /* ---------- SELF SERVICE CLOCK IN/OUT ---------- */
        .self-checkin-panel {
          border-color: var(--gold-border);
        }
        .self-checkin-panel .panel-header {
          background: var(--gold-bg);
          border-bottom-color: var(--gold-border);
        }
        .self-checkin-form {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr auto;
          gap: 12px;
          align-items: end;
        }
        .self-checkin-form .field-control {
          padding: 0;
        }
        .self-checkin-submit {
          height: 38px;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .self-checkin-form {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .self-checkin-form {
            grid-template-columns: 1fr;
          }
        }
        .self-checkin-error {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--danger);
        }
        .self-checkin-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
        .self-checkin-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          background: var(--bg-soft);
        }
        .self-checkin-card.is-done {
          opacity: 0.7;
        }
        .self-checkin-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .self-checkin-card-info {
          flex: 1;
          min-width: 0;
        }
        .self-checkin-card-info .font-medium {
          color: var(--text-primary);
        }
        .self-checkin-card-info .text-xs {
          color: var(--text-muted);
        }
        .self-checkin-card-times {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 10px;
        }
        .self-checkin-card-times .text-xs {
          color: var(--text-muted);
        }
        .self-checkin-card-actions {
          display: flex;
          gap: 6px;
        }

        /* ---------- BREAKDOWN / BUDGET ---------- */
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13.5px;
          color: var(--text-secondary);
        }
        .breakdown-row:last-child {
          border-bottom: none;
        }

        .budget-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .budget-row .font-medium {
          color: var(--text-primary);
        }
        .budget-track {
          width: 100%;
          background: var(--bg-soft);
          border-radius: 999px;
          height: 8px;
          overflow: hidden;
        }
        .budget-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--gold-dark), var(--gold));
        }

        /* ---------- CALENDAR ---------- */
        .calendar-dow {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          padding: 8px 0;
          text-transform: uppercase;
        }
        .calendar-cell {
          border: 1px solid var(--border);
          border-radius: 10px;
          min-height: 84px;
          padding: 8px;
          background: var(--bg-surface);
        }
        .calendar-cell:hover {
          background: var(--bg-hover);
          border-color: var(--gold-border);
        }
        .calendar-cell-muted {
          color: var(--text-faint);
          opacity: 0.4;
          border: none;
          text-align: center;
          padding-top: 12px;
        }
        .calendar-cell-day {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .calendar-event {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 6px;
          border-radius: 6px;
          margin-top: 4px;
        }
        .calendar-event-birthday {
          background: var(--pink-soft);
          color: var(--pink);
        }
        .calendar-event-leave {
          background: var(--info-soft);
          color: var(--info);
        }
        .calendar-event-training {
          background: var(--success-soft);
          color: var(--success);
        }

        /* ---------- REPORTS ---------- */
        .report-card {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          text-align: center;
          cursor: pointer;
          transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
          background: var(--bg-surface);
        }
        .report-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
          border-color: var(--gold);
        }
        .report-card-icon {
          margin: 0 auto;
        }
        .report-card .font-medium {
          color: var(--text-primary);
        }
        .report-card .text-xs {
          color: var(--text-muted);
        }

        /* ---------- QUICK ACTIONS ---------- */
        .quick-action-tile {
          border: 1px solid var(--border);
          background: var(--bg-surface);
          border-radius: 14px;
          padding: 18px 12px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
          text-align: center;
        }
        .quick-action-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          border-color: var(--gold);
        }
        .quick-action-icon {
          margin: 0 auto 8px;
          width: 44px;
          height: 44px;
          border-radius: 12px;
        }
        .quick-action-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* ---------- SIDEBAR ---------- */
        .profile-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 360px;
          max-width: 92vw;
          background: var(--bg-surface);
          border-left: 1px solid var(--border);
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.6);
          z-index: 60;
          overflow-y: auto;
          animation: slide-in 0.2s ease;
        }
        @keyframes slide-in {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .profile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .profile-sidebar-body {
          padding: 20px;
          color: var(--text-secondary);
        }
        .profile-avatar {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--gold-bg);
          color: var(--gold);
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          border: 2px solid var(--gold-border);
        }
        .profile-section {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .profile-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .profile-section .text-gray-600 {
          color: var(--text-secondary) !important;
        }
        .profile-section .text-gray-500 {
          color: var(--text-muted) !important;
        }

        /* ---------- MODAL ---------- */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 70;
          padding: 20px;
        }
        .modal {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          width: 560px;
          max-width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 22px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .modal-header h2 {
          font-size: 18px;
          font-weight: 800;
          margin-top: 2px;
          color: var(--text-primary);
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 20px 22px 0;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 18px 22px 22px;
        }
        .field-control {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          padding: 0 22px;
        }
        .modal-grid .field-control {
          padding: 0;
        }
        .field-control .eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }
        .field-control input,
        .field-control select,
        .field-control textarea {
          font-family: var(--font-body);
          font-size: 13.5px;
          padding: 9px 11px;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: var(--bg-soft);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.15s ease;
        }
        .field-control input:focus,
        .field-control select:focus,
        .field-control textarea:focus {
          border-color: var(--gold);
          background: var(--bg-surface);
        }
        .field-control input::placeholder {
          color: var(--text-faint);
        }
        .field-control textarea {
          margin: 14px 22px 0;
          width: calc(100% - 44px);
          resize: vertical;
        }

        /* ---------- AI ASSISTANT ---------- */
        .ai-fab {
          position: fixed;
          bottom: 26px;
          right: 26px;
          width: 58px;
          height: 58px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          border: none;
          color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(212, 168, 67, 0.4);
          z-index: 80;
          transition: transform 0.15s ease;
        }
        .ai-fab:hover {
          transform: scale(1.06);
          box-shadow: 0 8px 32px rgba(212, 168, 67, 0.5);
        }
        .ai-fab .sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--bg);
          border-radius: 999px;
          padding: 3px;
          display: flex;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .ai-assistant-container {
          position: fixed;
          bottom: 96px;
          right: 26px;
          width: 380px;
          max-width: 92vw;
          height: 560px;
          max-height: 78vh;
          background: var(--bg-surface);
          border-radius: 18px;
          border: 1px solid var(--border);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 80;
          animation: slide-in 0.2s ease;
        }
        .ai-assistant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--bg);
        }
        .ai-assistant-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ai-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-assistant-header h3 {
          font-size: 14px;
          font-weight: 700;
        }
        .ai-status {
          font-size: 11px;
          opacity: 0.85;
        }
        .ai-close-btn {
          background: none;
          border: none;
          color: var(--bg);
          cursor: pointer;
          display: flex;
          opacity: 0.85;
        }
        .ai-close-btn:hover {
          opacity: 1;
        }

        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: var(--bg-soft);
        }
        .ai-message {
          display: flex;
          gap: 8px;
          max-width: 90%;
        }
        .ai-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .ai-message-avatar {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: var(--gold-bg);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-message-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ai-message-text {
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-line;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 12px;
          color: var(--text-secondary);
        }
        .ai-message.user .ai-message-text {
          background: var(--gold);
          color: var(--bg);
          border-color: var(--gold);
        }
        .ai-message-time {
          font-size: 10px;
          color: var(--text-faint);
        }
        .ai-message.user .ai-message-time {
          text-align: right;
        }

        .ai-quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ai-quick-action-btn {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--gold);
          background: var(--gold-bg);
          color: var(--gold);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ai-quick-action-btn:hover {
          background: var(--gold);
          color: var(--bg);
        }

        .ai-typing {
          display: flex;
          gap: 4px;
          padding: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .ai-typing span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--text-faint);
          animation: typing-bounce 1.2s infinite ease-in-out;
        }
        .ai-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .ai-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes typing-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .ai-input-area {
          border-top: 1px solid var(--border);
          padding: 12px;
          background: var(--bg-surface);
        }
        .ai-input-wrapper {
          display: flex;
          gap: 8px;
        }
        .ai-input {
          flex: 1;
          font-family: var(--font-body);
          font-size: 13px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-soft);
          color: var(--text-primary);
          outline: none;
        }
        .ai-input:focus {
          border-color: var(--gold);
          background: var(--bg-surface);
        }
        .ai-input::placeholder {
          color: var(--text-faint);
        }
        .ai-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background: var(--gold);
          color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .ai-send-btn:hover {
          background: var(--gold-dark);
        }
        .ai-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .spinning {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .ai-suggestions {
          display: flex;
          gap: 6px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .ai-suggestion-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 9px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-soft);
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .ai-suggestion-chip:hover {
          border-color: var(--gold);
          color: var(--gold);
        }

        /* ---------- MISC UTILITY ---------- */
        .text-success {
          color: var(--success);
        }
        .text-warning {
          color: var(--warning);
        }
        .text-danger {
          color: var(--danger);
        }
        .text-orange-600 {
          color: #fb923c;
        }
        .text-gray-500 {
          color: var(--text-muted) !important;
        }
        .text-gray-600 {
          color: var(--text-secondary) !important;
        }
        .font-mono {
          font-family: 'SFMono-Regular', Consolas, monospace;
        }
        .text-xs {
          font-size: 11px;
        }
        .text-sm {
          font-size: 13px;
        }
        .font-medium {
          font-weight: 600;
        }
        .space-y-4 > * + * {
          margin-top: 16px;
        }
        .flex {
          display: flex;
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .gap-1 {
          gap: 4px;
        }
        .gap-2 {
          gap: 8px;
        }
        .gap-4 {
          gap: 16px;
        }
        .items-center {
          align-items: center;
        }
        .flex-1 {
          flex: 1;
        }
        .min-w-200 {
          min-width: 200px;
        }
        .mb-4 {
          margin-bottom: 16px;
        }
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        .mt-2 {
          margin-top: 8px;
        }
        .text-center {
          text-align: center;
        }
        .capitalize {
          text-transform: capitalize;
        }
        .bg-white {
          background: var(--bg-surface);
        }
        .border {
          border: 1px solid var(--border);
        }
        .border-gray-200 {
          border-color: var(--border);
        }
        .rounded-lg {
          border-radius: 10px;
        }
        .px-3 {
          padding-left: 12px;
          padding-right: 12px;
        }
        .py-2 {
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .w-full {
          width: 100%;
        }
        .outline-none {
          outline: none;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        .grid-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        .grid-cols-7 {
          grid-template-columns: repeat(7, 1fr);
        }
        .gap-1 {
          gap: 4px;
        }
        .gap-4 {
          gap: 16px;
        }
        .bg-gray-200 {
          background: var(--bg-soft);
        }
        .h-2.5 {
          height: 10px;
        }
        .rounded-full {
          border-radius: 999px;
        }
        .bg-blue-600 {
          background: var(--gold);
        }
        .hover\\:bg-gray-50:hover {
          background: var(--bg-hover);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .min-h-80 {
          min-height: 80px;
        }
        .p-1 {
          padding: 4px;
        }
        .p-2 {
          padding: 8px;
        }
        .p-4 {
          padding: 16px;
        }
        .mt-1 {
          margin-top: 4px;
        }
        .border-b {
          border-bottom: 1px solid var(--border);
        }
        .last\\:border-0:last-child {
          border-bottom: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .department-dashboard {
            padding: 16px;
          }
          .page-title {
            font-size: 22px;
          }
          .grid-cols-2,
          .grid-cols-3,
          .grid-cols-4,
          .grid-cols-5,
          .grid-cols-6 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .grid-cols-2,
          .grid-cols-3,
          .grid-cols-4,
          .grid-cols-5,
          .grid-cols-6 {
            grid-template-columns: 1fr;
          }
          .dashboard-heading {
            flex-direction: column;
          }
          .action-row {
            width: 100%;
          }
          .action-row .button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <nav className="department-nav">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Department Operations Workspace</div>
          <h1 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <p className="page-subtitle">
            {activeTab === "dashboard" && "Complete department overview with key metrics, trends, and analytics."}
            {activeTab === "employees" && "Manage employee profiles, skills, certifications, and documents."}
            {activeTab === "attendance" && "Track daily attendance with real-time timers and overtime."}
            {activeTab === "leave" && "Manage leave requests, balances, and team availability."}
            {activeTab === "payroll" && "View payroll summary, breakdowns, and history."}
            {activeTab === "recruitment" && "Track open positions, candidates, and hiring pipeline."}
            {activeTab === "performance" && "Manage reviews, goals, KPIs, and performance metrics."}
            {activeTab === "training" && "Track training programs, certifications, and learning progress."}
            {activeTab === "budget" && "Monitor department budget allocation and utilization."}
            {activeTab === "approvals" && "Review and manage all pending approvals."}
            {activeTab === "calendar" && "View department events, meetings, and important dates."}
            {activeTab === "reports" && "Generate and export department reports."}
            {activeTab === "quickactions" && "Quick access to common department actions."}
          </p>
        </div>
        <div className="action-row">
          <button className="button button-secondary" onClick={() => handleExport("pdf")}><Download size={15} /> Export</button>
          <button className="button button-secondary" onClick={() => handleExport("excel")}><Download size={15} /> Excel</button>
          <button className="button button-primary" onClick={() => handleQuickAction("Refresh data")}><RefreshCw size={15} /> Refresh</button>
        </div>
      </div>

      {feedback && (
        <div className="note action-feedback">
          <CheckCircle2 size={16} /> {feedback}
          <button onClick={() => setFeedback("")}>×</button>
        </div>
      )}

      {activeTab !== "dashboard" && activeTab !== "calendar" && activeTab !== "reports" && activeTab !== "quickactions" && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-200 bg-surface border border-border rounded-lg px-3 py-2 flex items-center gap-2">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full outline-none text-sm bg-transparent text-primary" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="px-3 py-2 border border-border rounded-lg bg-surface text-sm text-primary" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {renderContent()}

      {selectedEmployee && (
        <div className={`profile-sidebar ${selectedEmployee ? "open" : ""}`}>
          <div className="profile-sidebar-header">
            <h3 className="font-bold text-lg">Employee Profile</h3>
            <button className="panel-action" onClick={() => setSelectedEmployee(null)}><X size={20} /></button>
          </div>
          <div className="profile-sidebar-body">
            <div className="text-center">
              <div className="profile-avatar mx-auto">{selectedEmployee.name.split(" ").map(n => n[0]).join("")}</div>
              <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
              <p className="text-gray-600">{selectedEmployee.position}</p>
              <p className="text-gray-500 text-sm">{selectedEmployee.department}</p>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Contact</div>
              <div className="space-y-1 text-sm"><div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" />{selectedEmployee.email}</div><div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" />{selectedEmployee.phone}</div></div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Employment</div>
              <div className="space-y-1 text-sm"><div>Joined: {selectedEmployee.joinDate}</div><div>Status: <StatusBadge status={selectedEmployee.status} /></div><div>Supervisor: {selectedEmployee.supervisor}</div></div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Skills</div>
              <div className="flex flex-wrap gap-1">{selectedEmployee.skills.map(s => <span key={s} className="pill pill-info">{s}</span>)}</div>
              <div className="mt-2 flex flex-wrap gap-1">{selectedEmployee.certifications.map(c => <span key={c} className="pill pill-success">{c}</span>)}</div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Assets</div>
              <div className="flex flex-wrap gap-1">{selectedEmployee.assets.map(a => <span key={a} className="pill pill-neutral">{a}</span>)}</div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Emergency Contact</div>
              <div className="text-sm">{selectedEmployee.emergencyContact}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="button button-primary flex-1" onClick={() => handleQuickAction(`View ${selectedEmployee.name}'s full profile`)}>Full Profile</button>
              <button className="button button-secondary" onClick={() => handleQuickAction(`Contact ${selectedEmployee.name}`)}><MessageSquare size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="page-kicker">{modalType} Action</div><h2>{modalType === "employee" ? "Add New Employee" : modalType === "leave" ? "New Leave Request" : modalType === "training" ? "Create Training Program" : modalType === "announcement" ? "Create Announcement" : modalType === "document" ? "Upload Document" : "Assign Asset"}</h2></div>
              <button className="panel-action" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.target as HTMLFormElement)); handleModalSubmit(data); }}>
              <div className="modal-grid">
                {(modalType === "employee" || modalType === "announcement") && (
                  <>
                    <label className="field-control"><span className="eyebrow">Name / Title</span><input name="title" placeholder={modalType === "employee" ? "Full Name" : "Announcement Title"} required /></label>
                    <label className="field-control"><span className="eyebrow">Department</span><select name="department" defaultValue="People Operations">{[...new Set(DATA.employees.map(e => e.department))].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
                    <label className="field-control"><span className="eyebrow">Email / Type</span><input name="type" placeholder={modalType === "employee" ? "Email Address" : "Announcement Type"} /></label>
                    <label className="field-control"><span className="eyebrow">Priority</span><select name="priority" defaultValue="Medium"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></label>
                  </>
                )}
                {modalType === "document" && (
                  <>
                    <label className="field-control"><span className="eyebrow">Document Name</span><input name="name" placeholder="Enter document name" required /></label>
                    <label className="field-control"><span className="eyebrow">Document Type</span><select name="type" defaultValue="Contract"><option value="Contract">Contract</option><option value="Policy">Policy</option><option value="Report">Report</option><option value="Other">Other</option></select></label>
                  </>
                )}
                {modalType === "asset" && (
                  <>
                    <label className="field-control"><span className="eyebrow">Asset Name</span><input name="name" placeholder="Enter asset name" required /></label>
                    <label className="field-control"><span className="eyebrow">Assign To</span><select name="assignedTo" defaultValue={DATA.employees[0].name}>{DATA.employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}</select></label>
                  </>
                )}
                {(modalType === "leave" || modalType === "training") && (
                  <>
                    <label className="field-control"><span className="eyebrow">Title / Type</span><input name="title" placeholder={modalType === "leave" ? "Leave Type" : "Training Title"} required /></label>
                    <label className="field-control"><span className="eyebrow">Date</span><input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} /></label>
                  </>
                )}
              </div>
              <label className="field-control"><span className="eyebrow">Description / Notes</span><textarea name="description" rows={3} placeholder="Enter additional details..." className="w-full" /></label>
              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary"><Plus size={15} /> Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button className="ai-fab" onClick={() => setIsAIOpen(!isAIOpen)}>
        <Bot size={28} />
        <span className="sparkle">
          <Sparkles size={14} className="text-yellow-400" />
        </span>
      </button>

      <AIAssistantComponent 
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        context={getAIContext()}
      />
    </div>
  );
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

const PinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 17v5"/><path d="M5 17h14"/><path d="M6 6a6 6 0 0 1 12 0v6c0 2-1.5 6-6 6s-6-4-6-6V6z"/>
  </svg>
);

const UploadIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export default DepartmentDashboardPage;
