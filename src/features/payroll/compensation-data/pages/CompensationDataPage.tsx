import { useState } from "react";
import {
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Download,
  Printer,
  Calendar,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  User,
  Building2,
  Briefcase,
  CreditCard,
  Award,
  Star,
  Zap,
  Shield,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
  Mail,
  Send,
  Settings,
  HelpCircle,
  BookOpen,
  Info,
  AlertTriangle,
  Check,
  X,
  Percent,
  CalendarDays,
  Clock as ClockIcon,
  FileSpreadsheet,
  FolderOpen,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  Crown,
  Target,
  Flame,
  Gift,
  Heart,
} from "lucide-react";

interface EmployeeCompensation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  joinDate: string;
  baseSalary: number;
  hourlyRate?: number;
  currency: string;
  compensation: {
    base: number;
    allowances: {
      housing: number;
      transport: number;
      medical: number;
      education: number;
      communication: number;
      others: number;
    };
    bonuses: {
      performance: number;
      attendance: number;
      project: number;
      holiday: number;
      annual: number;
      other: number;
    };
    benefits: {
      healthInsurance: number;
      lifeInsurance: number;
      pension: number;
      educationAllowance: number;
      wellness: number;
      other: number;
    };
    commissions?: {
      rate: number;
      target: number;
      achieved: number;
      amount: number;
    };
    stockOptions?: {
      granted: number;
      vested: number;
      exercisePrice: number;
      currentPrice: number;
    };
  };
  totalCompensation: number;
  totalCashCompensation: number;
  totalBenefits: number;
  payFrequency: "Monthly" | "Bi-weekly" | "Weekly" | "Semi-monthly";
  lastReviewDate?: string;
  nextReviewDate?: string;
  performanceRating?: number;
  status: "Active" | "Pending Review" | "On Hold" | "Inactive";
  history: {
    date: string;
    action: string;
    amount: number;
    reason: string;
    approvedBy: string;
  }[];
  notes?: string;
}

interface CompensationSummary {
  totalEmployees: number;
  totalCompensation: number;
  averageSalary: number;
  medianSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  totalAllowances: number;
  totalBonuses: number;
  totalBenefits: number;
  byDepartment: {
    name: string;
    count: number;
    total: number;
    average: number;
  }[];
  byType: {
    type: string;
    count: number;
    total: number;
  }[];
  compensationRatio: number;
  salaryDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export default function CompensationDataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [activeTab, setActiveTab] = useState<"overview" | "employees" | "analytics" | "reports">("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Sample compensation data
  const compensationData: EmployeeCompensation[] = [
    {
      id: "c1",
      employeeId: "emp1",
      employeeName: "Sarah Johnson",
      employeeEmail: "sarah.j@company.com",
      department: "Engineering",
      position: "Senior Developer",
      employmentType: "Full-time",
      joinDate: "2020-03-15",
      baseSalary: 7500,
      currency: "USD",
      compensation: {
        base: 7500,
        allowances: {
          housing: 1500,
          transport: 600,
          medical: 375,
          education: 225,
          communication: 150,
          others: 150,
        },
        bonuses: {
          performance: 750,
          attendance: 200,
          project: 300,
          holiday: 200,
          annual: 1500,
          other: 0,
        },
        benefits: {
          healthInsurance: 450,
          lifeInsurance: 75,
          pension: 525,
          educationAllowance: 200,
          wellness: 100,
          other: 0,
        },
        stockOptions: {
          granted: 5000,
          vested: 2000,
          exercisePrice: 50,
          currentPrice: 75,
        },
      },
      totalCompensation: 8500,
      totalCashCompensation: 7650,
      totalBenefits: 1350,
      payFrequency: "Monthly",
      lastReviewDate: "2025-12-01",
      nextReviewDate: "2026-06-01",
      performanceRating: 4.5,
      status: "Active",
      history: [
        {
          date: "2025-12-01",
          action: "Annual Review",
          amount: 7500,
          reason: "Performance-based increase",
          approvedBy: "HR Manager",
        },
        {
          date: "2025-06-01",
          action: "Promotion",
          amount: 6800,
          reason: "Promotion to Senior Developer",
          approvedBy: "HR Manager",
        },
      ],
    },
    {
      id: "c2",
      employeeId: "emp2",
      employeeName: "Michael Chen",
      employeeEmail: "michael.c@company.com",
      department: "Engineering",
      position: "Team Lead",
      employmentType: "Full-time",
      joinDate: "2019-06-20",
      baseSalary: 8500,
      currency: "USD",
      compensation: {
        base: 8500,
        allowances: {
          housing: 1700,
          transport: 680,
          medical: 425,
          education: 255,
          communication: 170,
          others: 170,
        },
        bonuses: {
          performance: 850,
          attendance: 250,
          project: 400,
          holiday: 250,
          annual: 1700,
          other: 0,
        },
        benefits: {
          healthInsurance: 500,
          lifeInsurance: 85,
          pension: 595,
          educationAllowance: 250,
          wellness: 120,
          other: 0,
        },
        stockOptions: {
          granted: 7500,
          vested: 3000,
          exercisePrice: 45,
          currentPrice: 75,
        },
      },
      totalCompensation: 9600,
      totalCashCompensation: 8700,
      totalBenefits: 1550,
      payFrequency: "Monthly",
      lastReviewDate: "2025-11-15",
      nextReviewDate: "2026-05-15",
      performanceRating: 4.8,
      status: "Active",
      history: [
        {
          date: "2025-11-15",
          action: "Annual Review",
          amount: 8500,
          reason: "Exceeds expectations",
          approvedBy: "HR Manager",
        },
      ],
    },
    {
      id: "c3",
      employeeId: "emp3",
      employeeName: "Emily Rodriguez",
      employeeEmail: "emily.r@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      employmentType: "Full-time",
      joinDate: "2021-01-10",
      baseSalary: 6200,
      currency: "USD",
      compensation: {
        base: 6200,
        allowances: {
          housing: 1240,
          transport: 496,
          medical: 310,
          education: 186,
          communication: 124,
          others: 124,
        },
        bonuses: {
          performance: 620,
          attendance: 200,
          project: 250,
          holiday: 150,
          annual: 1240,
          other: 0,
        },
        benefits: {
          healthInsurance: 380,
          lifeInsurance: 62,
          pension: 434,
          educationAllowance: 180,
          wellness: 80,
          other: 0,
        },
      },
      totalCompensation: 7000,
      totalCashCompensation: 6300,
      totalBenefits: 1136,
      payFrequency: "Monthly",
      lastReviewDate: "2025-10-20",
      nextReviewDate: "2026-04-20",
      performanceRating: 4.2,
      status: "Active",
      history: [
        {
          date: "2025-10-20",
          action: "Performance Review",
          amount: 6200,
          reason: "Meets expectations",
          approvedBy: "HR Manager",
        },
      ],
    },
    {
      id: "c4",
      employeeId: "emp4",
      employeeName: "David Kim",
      employeeEmail: "david.k@company.com",
      department: "Sales",
      position: "Sales Executive",
      employmentType: "Full-time",
      joinDate: "2022-07-05",
      baseSalary: 5500,
      currency: "USD",
      compensation: {
        base: 5500,
        allowances: {
          housing: 1100,
          transport: 440,
          medical: 275,
          education: 165,
          communication: 110,
          others: 110,
        },
        bonuses: {
          performance: 550,
          attendance: 250,
          project: 0,
          holiday: 150,
          annual: 1100,
          other: 0,
        },
        benefits: {
          healthInsurance: 340,
          lifeInsurance: 55,
          pension: 385,
          educationAllowance: 150,
          wellness: 70,
          other: 0,
        },
        commissions: {
          rate: 0.05,
          target: 100000,
          achieved: 120000,
          amount: 6000,
        },
      },
      totalCompensation: 7000,
      totalCashCompensation: 6600,
      totalBenefits: 1000,
      payFrequency: "Monthly",
      lastReviewDate: "2025-09-15",
      nextReviewDate: "2026-03-15",
      performanceRating: 4.6,
      status: "Active",
      history: [
        {
          date: "2025-09-15",
          action: "Commission Review",
          amount: 5500,
          reason: "Exceeded sales targets",
          approvedBy: "Sales Director",
        },
      ],
    },
    {
      id: "c5",
      employeeId: "emp5",
      employeeName: "Lisa Thompson",
      employeeEmail: "lisa.t@company.com",
      department: "HR",
      position: "HR Coordinator",
      employmentType: "Full-time",
      joinDate: "2021-09-12",
      baseSalary: 4800,
      currency: "USD",
      compensation: {
        base: 4800,
        allowances: {
          housing: 960,
          transport: 384,
          medical: 240,
          education: 144,
          communication: 96,
          others: 96,
        },
        bonuses: {
          performance: 480,
          attendance: 200,
          project: 200,
          holiday: 100,
          annual: 960,
          other: 0,
        },
        benefits: {
          healthInsurance: 300,
          lifeInsurance: 48,
          pension: 336,
          educationAllowance: 120,
          wellness: 60,
          other: 0,
        },
      },
      totalCompensation: 5400,
      totalCashCompensation: 4880,
      totalBenefits: 864,
      payFrequency: "Monthly",
      lastReviewDate: "2025-08-10",
      nextReviewDate: "2026-02-10",
      performanceRating: 3.8,
      status: "Pending Review",
      history: [
        {
          date: "2025-08-10",
          action: "Annual Review",
          amount: 4800,
          reason: "Needs improvement",
          approvedBy: "HR Manager",
        },
      ],
    },
    {
      id: "c6",
      employeeId: "emp6",
      employeeName: "James Wilson",
      employeeEmail: "james.w@company.com",
      department: "Finance",
      position: "Accountant",
      employmentType: "Full-time",
      joinDate: "2020-11-03",
      baseSalary: 6000,
      currency: "USD",
      compensation: {
        base: 6000,
        allowances: {
          housing: 1200,
          transport: 480,
          medical: 300,
          education: 180,
          communication: 120,
          others: 120,
        },
        bonuses: {
          performance: 600,
          attendance: 200,
          project: 300,
          holiday: 150,
          annual: 1200,
          other: 0,
        },
        benefits: {
          healthInsurance: 370,
          lifeInsurance: 60,
          pension: 420,
          educationAllowance: 160,
          wellness: 80,
          other: 0,
        },
      },
      totalCompensation: 6800,
      totalCashCompensation: 6120,
      totalBenefits: 1090,
      payFrequency: "Monthly",
      lastReviewDate: "2025-12-05",
      nextReviewDate: "2026-06-05",
      performanceRating: 4.3,
      status: "Active",
      history: [
        {
          date: "2025-12-05",
          action: "Performance Review",
          amount: 6000,
          reason: "Exceeds expectations",
          approvedBy: "Finance Director",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "On Hold":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending Review":
        return <Clock className="w-4 h-4" />;
      case "On Hold":
        return <AlertCircle className="w-4 h-4" />;
      case "Inactive":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-purple-100 text-purple-800";
      case "Contract":
        return "bg-orange-100 text-orange-800";
      case "Intern":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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

  const formatDateWithTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
    }).format(value / 100);
  };

  // Calculate summary statistics
  const summary: CompensationSummary = {
    totalEmployees: compensationData.length,
    totalCompensation: compensationData.reduce((sum, emp) => sum + emp.totalCompensation, 0),
    averageSalary: compensationData.reduce((sum, emp) => sum + emp.baseSalary, 0) / compensationData.length,
    medianSalary: compensationData.map(emp => emp.baseSalary).sort((a, b) => a - b)[Math.floor(compensationData.length / 2)],
    salaryRange: {
      min: Math.min(...compensationData.map(emp => emp.baseSalary)),
      max: Math.max(...compensationData.map(emp => emp.baseSalary)),
    },
    totalAllowances: compensationData.reduce((sum, emp) => 
      sum + Object.values(emp.compensation.allowances).reduce((a, b) => a + b, 0), 0),
    totalBonuses: compensationData.reduce((sum, emp) => 
      sum + Object.values(emp.compensation.bonuses).reduce((a, b) => a + b, 0), 0),
    totalBenefits: compensationData.reduce((sum, emp) => 
      sum + Object.values(emp.compensation.benefits).reduce((a, b) => a + b, 0), 0),
    byDepartment: compensationData.reduce((acc, emp) => {
      const dept = acc.find(d => d.name === emp.department);
      if (dept) {
        dept.count++;
        dept.total += emp.baseSalary;
        dept.average = dept.total / dept.count;
      } else {
        acc.push({
          name: emp.department,
          count: 1,
          total: emp.baseSalary,
          average: emp.baseSalary,
        });
      }
      return acc;
    }, [] as { name: string; count: number; total: number; average: number; }[]),
    byType: compensationData.reduce((acc, emp) => {
      const type = acc.find(t => t.type === emp.employmentType);
      if (type) {
        type.count++;
        type.total += emp.baseSalary;
      } else {
        acc.push({
          type: emp.employmentType,
          count: 1,
          total: emp.baseSalary,
        });
      }
      return acc;
    }, [] as { type: string; count: number; total: number; }[]),
    compensationRatio: compensationData.reduce((sum, emp) => 
      sum + (emp.totalCompensation / emp.baseSalary), 0) / compensationData.length,
    salaryDistribution: [
      { range: "0-3,000", count: compensationData.filter(e => e.baseSalary < 3000).length, percentage: 0 },
      { range: "3,001-5,000", count: compensationData.filter(e => e.baseSalary >= 3000 && e.baseSalary < 5000).length, percentage: 0 },
      { range: "5,001-7,000", count: compensationData.filter(e => e.baseSalary >= 5000 && e.baseSalary < 7000).length, percentage: 0 },
      { range: "7,001-9,000", count: compensationData.filter(e => e.baseSalary >= 7000 && e.baseSalary < 9000).length, percentage: 0 },
      { range: "9,000+", count: compensationData.filter(e => e.baseSalary >= 9000).length, percentage: 0 },
    ].map(dist => ({
      ...dist,
      percentage: (dist.count / compensationData.length) * 100,
    })),
  };

  const departments = ["All", ...new Set(compensationData.map(e => e.department))];
  const employmentTypes = ["All", ...new Set(compensationData.map(e => e.employmentType))];
  const statuses = ["All", "Active", "Pending Review", "On Hold", "Inactive"];

  const filteredData = compensationData.filter(emp => {
    const matchesSearch = emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "All" || emp.department === filterDepartment;
    const matchesType = filterType === "All" || emp.employmentType === filterType;
    const matchesStatus = filterStatus === "All" || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const selectedEmployeeData = compensationData.find(e => e.id === selectedEmployee);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Compensation Data</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {compensationData.length} Employees
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage and analyze employee compensation, benefits, and total rewards
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsLoading(true)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
              >
                <Plus className="w-4 h-4" />
                Add Compensation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{summary.totalEmployees}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {summary.byDepartment.length} departments
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Compensation</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.totalCompensation)}
                </p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">↑ 8.5%</span> from previous period
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average Salary</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.averageSalary)}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Range: {formatCurrency(summary.salaryRange.min)} - {formatCurrency(summary.salaryRange.max)}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Compensation Ratio</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {summary.compensationRatio.toFixed(2)}x
                </p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Total compensation vs base salary
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
                  ? "bg-green-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PieChart className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "employees"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" />
              Employees
              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs">
                {compensationData.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "reports"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Department Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Compensation by Department
              </h3>
              <div className="space-y-3">
                {summary.byDepartment.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{dept.name}</span>
                      <span className="text-slate-600">
                        {dept.count} employees • {formatCurrency(dept.average)} avg
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${(dept.total / summary.totalCompensation) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Bonuses</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(summary.totalBonuses)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Allowances</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(summary.totalAllowances)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Benefits</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(summary.totalBenefits)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Type Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-600" />
                Employment Type Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summary.byType.map((type) => (
                  <div key={type.type} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(type.type)}`}>
                        {type.type}
                      </span>
                      <span className="text-sm text-slate-500">{type.count} employees</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 mt-2">{formatCurrency(type.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, position, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {employmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        viewMode === "table"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        viewMode === "cards"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Cards
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Base Salary
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Total Comp
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No employees found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                  {emp.employeeName.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{emp.employeeName}</p>
                                  <p className="text-sm text-slate-500">{emp.employeeEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                {emp.department}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {emp.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                              {formatCurrency(emp.baseSalary)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">
                              {formatCurrency(emp.totalCompensation)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                                {getStatusIcon(emp.status)}
                                {emp.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(emp.id);
                                    setViewMode("detail");
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-14 h-14 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No employees found</p>
                    </div>
                  </div>
                ) : (
                  filteredData.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                            {emp.employeeName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{emp.employeeName}</h3>
                            <p className="text-sm text-slate-500">{emp.position}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                          {getStatusIcon(emp.status)}
                          {emp.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Department</p>
                          <p className="font-medium text-slate-900">{emp.department}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Type</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(emp.employmentType)}`}>
                            {emp.employmentType}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Base Salary</p>
                          <p className="font-semibold text-slate-900">{formatCurrency(emp.baseSalary)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Total Comp</p>
                          <p className="font-bold text-green-600">{formatCurrency(emp.totalCompensation)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>Joined: {formatDate(emp.joinDate)}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp.id);
                              setViewMode("detail");
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Detail View */}
        {viewMode === "detail" && selectedEmployeeData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("table")}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 text-slate-600 rotate-45" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                    {selectedEmployeeData.employeeName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedEmployeeData.employeeName}</h2>
                    <p className="text-sm text-slate-500">{selectedEmployeeData.position} • {selectedEmployeeData.department}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEmployeeData.status)}`}>
                  {getStatusIcon(selectedEmployeeData.status)}
                  {selectedEmployeeData.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  <Award className="w-4 h-4" />
                  Review
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Compensation Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Base Salary</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedEmployeeData.baseSalary)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Compensation</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedEmployeeData.totalCompensation)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Benefits</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedEmployeeData.totalBenefits)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Performance Rating</p>
                  <p className="text-xl font-bold text-yellow-600">{selectedEmployeeData.performanceRating || "N/A"}</p>
                </div>
              </div>

              {/* Compensation Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Allowances</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedEmployeeData.compensation.allowances).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-600 capitalize">{key}</span>
                        <span className="font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Bonuses</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedEmployeeData.compensation.bonuses).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-600 capitalize">{key}</span>
                        <span className="font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Benefits</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedEmployeeData.compensation.benefits).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-600 capitalize">{key}</span>
                        <span className="font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Employment Type</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(selectedEmployeeData.employmentType)}`}>
                        {selectedEmployeeData.employmentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pay Frequency</span>
                      <span className="font-medium">{selectedEmployeeData.payFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Join Date</span>
                      <span className="font-medium">{formatDate(selectedEmployeeData.joinDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Review</span>
                      <span className="font-medium">{selectedEmployeeData.lastReviewDate ? formatDate(selectedEmployeeData.lastReviewDate) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Review</span>
                      <span className="font-medium">{selectedEmployeeData.nextReviewDate ? formatDate(selectedEmployeeData.nextReviewDate) : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              {selectedEmployeeData.history.length > 0 && (
                <div className="mt-6 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-slate-600" />
                    Compensation History
                  </h4>
                  <div className="space-y-3">
                    {selectedEmployeeData.history.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5"></div>
                          {index < selectedEmployeeData.history.length - 1 && (
                            <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{item.action}</p>
                            <span className="text-sm text-slate-500">{formatDateWithTime(item.date)}</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Amount: {formatCurrency(item.amount)} • {item.reason}
                          </p>
                          <p className="text-sm text-slate-500">Approved by: {item.approvedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Salary Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Salary Distribution
              </h3>
              <div className="space-y-3">
                {summary.salaryDistribution.map((dist) => (
                  <div key={dist.range}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{dist.range}</span>
                      <span className="text-slate-600">{dist.count} employees ({dist.percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${dist.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Compensation Ratio</h4>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{summary.compensationRatio.toFixed(2)}x</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Total comp vs base salary</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Salary Range</h4>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(summary.salaryRange.min)} - {formatCurrency(summary.salaryRange.max)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Min to max salary</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Median Salary</h4>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">{formatCurrency(summary.medianSalary)}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Middle of salary range</p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">New</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Compensation Report</h3>
              <p className="text-sm text-slate-500 mb-4">Detailed compensation breakdown by employee</p>
              <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Salary Analysis</h3>
              <p className="text-sm text-slate-500 mb-4">Salary distribution and benchmarking</p>
              <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Benefits Summary</h3>
              <p className="text-sm text-slate-500 mb-4">Total benefits and perks analysis</p>
              <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Compensation Trends</h3>
              <p className="text-sm text-slate-500 mb-4">Historical compensation changes</p>
              <button className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Market Benchmarking</h3>
              <p className="text-sm text-slate-500 mb-4">Compare against market rates</p>
              <button className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Headcount Analysis</h3>
              <p className="text-sm text-slate-500 mb-4">Headcount by department and cost</p>
              <button className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Edit Compensation Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Compensation</h3>
                  <p className="text-sm text-slate-500">Enter compensation details for a new employee</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="employee@company.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                      <option>Engineering</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>HR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Job title"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Base Salary</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Intern</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Additional compensation notes..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none h-20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Compensation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedEmployeeData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Review Compensation</h3>
              <p className="text-sm text-slate-500 mb-4">
                Review {selectedEmployeeData.employeeName}'s compensation
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employee</span>
                    <span className="font-medium">{selectedEmployeeData.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Position</span>
                    <span className="font-medium">{selectedEmployeeData.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Current Salary</span>
                    <span className="font-medium">{formatCurrency(selectedEmployeeData.baseSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Performance Rating</span>
                    <span className="font-medium">{selectedEmployeeData.performanceRating || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Review Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                    <option>Annual Review</option>
                    <option>Performance Review</option>
                    <option>Promotion</option>
                    <option>Salary Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Salary</label>
                  <input
                    type="number"
                    placeholder="Enter new salary"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
                  <textarea
                    placeholder="Review comments..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none h-20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Guidelines</p>
              <p className="text-xs text-slate-500">Compensation policies</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Market Analysis</p>
              <p className="text-xs text-slate-500">View benchmark data</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Configure</p>
              <p className="text-xs text-slate-500">Compensation settings</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">View guides</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}