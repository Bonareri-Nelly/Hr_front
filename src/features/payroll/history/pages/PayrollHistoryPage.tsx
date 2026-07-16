import { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Download,
  Printer,
  Calendar,
  DollarSign,
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
  CalendarDays,
  User,
  Building2,
  Briefcase,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  FolderOpen,
  ExternalLink,
  Settings,
  HelpCircle,
  BookOpen,
  Zap,
  Star,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Info,
  AlertTriangle,
  Check,
  X,
  Mail,
  Send,
  Copy,
  Trash2,
  Edit,
  Plus,
  Minus,
  Percent,
  Award,
  Shield,
  Clock as ClockIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface PayrollHistoryRecord {
  id: string;
  runName: string;
  period: {
    start: string;
    end: string;
  };
  paymentDate: string;
  processedDate: string;
  status: "Completed" | "Processing" | "Failed" | "Partially Paid" | "Cancelled";
  totalEmployees: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalBonuses: number;
  totalTaxes: number;
  totalBenefits: number;
  department: string;
  processedBy: string;
  approvedBy?: string;
  paymentMethod: "Bank Transfer" | "Check" | "Cash" | "Wire Transfer";
  bankReference?: string;
  notes?: string;
  metrics: {
    averageSalary: number;
    highestPay: number;
    lowestPay: number;
    payrollCostRatio: number;
    overtimeTotal: number;
    leaveAdjustments: number;
  };
  breakdown: {
    byDepartment: {
      name: string;
      count: number;
      amount: number;
    }[];
    byEmploymentType: {
      type: string;
      count: number;
      amount: number;
    }[];
  };
  history: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
  employees: {
    id: string;
    name: string;
    position: string;
    department: string;
    grossPay: number;
    netPay: number;
    deductions: number;
    status: "Paid" | "Pending" | "Failed";
  }[];
}

interface PayrollSummary {
  totalRuns: number;
  totalPaid: number;
  totalEmployees: number;
  averageRunAmount: number;
  totalTaxes: number;
  totalDeductions: number;
  totalBonuses: number;
  successRate: number;
  byPeriod: {
    period: string;
    amount: number;
    employees: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  recentActivity: {
    action: string;
    date: string;
    user: string;
    details: string;
  }[];
}

export default function PayrollHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [activeTab, setActiveTab] = useState<"overview" | "runs" | "analytics" | "employees">("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  // Sample payroll history data
  const payrollHistory: PayrollHistoryRecord[] = [
    {
      id: "ph1",
      runName: "March 2026 Payroll",
      period: {
        start: "2026-03-01",
        end: "2026-03-31",
      },
      paymentDate: "2026-04-05",
      processedDate: "2026-04-04",
      status: "Completed",
      totalEmployees: 68,
      totalGross: 543000,
      totalNet: 456000,
      totalDeductions: 87000,
      totalBonuses: 52000,
      totalTaxes: 68000,
      totalBenefits: 19000,
      department: "All Departments",
      processedBy: "HR Admin",
      approvedBy: "Finance Manager",
      paymentMethod: "Bank Transfer",
      bankReference: "BTR-2026-03-001",
      notes: "Regular monthly payroll with Q1 bonuses",
      metrics: {
        averageSalary: 6700,
        highestPay: 12500,
        lowestPay: 3200,
        payrollCostRatio: 0.42,
        overtimeTotal: 8200,
        leaveAdjustments: 3100,
      },
      breakdown: {
        byDepartment: [
          { name: "Engineering", count: 18, amount: 162000 },
          { name: "Sales", count: 12, amount: 89000 },
          { name: "Marketing", count: 10, amount: 72000 },
          { name: "Finance", count: 8, amount: 58000 },
          { name: "HR", count: 6, amount: 42000 },
          { name: "Operations", count: 8, amount: 54000 },
          { name: "Design", count: 6, amount: 39000 },
        ],
        byEmploymentType: [
          { type: "Full-time", count: 52, amount: 380000 },
          { type: "Part-time", count: 8, amount: 42000 },
          { type: "Contract", count: 6, amount: 28000 },
          { type: "Intern", count: 2, amount: 6000 },
        ],
      },
      history: [
        {
          action: "Payroll Run Created",
          date: "2026-04-01T09:00:00",
          user: "HR Admin",
        },
        {
          action: "Employee Data Verified",
          date: "2026-04-02T10:30:00",
          user: "HR Admin",
        },
        {
          action: "Payroll Approved",
          date: "2026-04-03T14:00:00",
          user: "Finance Manager",
          note: "All calculations verified",
        },
        {
          action: "Payment Processed",
          date: "2026-04-04T11:00:00",
          user: "System",
          note: "Bank transfer initiated",
        },
        {
          action: "Payroll Completed",
          date: "2026-04-05T09:00:00",
          user: "System",
          note: "All payments confirmed",
        },
      ],
      employees: [
        {
          id: "emp1",
          name: "Sarah Johnson",
          position: "Senior Developer",
          department: "Engineering",
          grossPay: 7500,
          netPay: 6200,
          deductions: 1300,
          status: "Paid",
        },
        {
          id: "emp2",
          name: "Michael Chen",
          position: "Team Lead",
          department: "Engineering",
          grossPay: 8500,
          netPay: 6900,
          deductions: 1600,
          status: "Paid",
        },
        {
          id: "emp3",
          name: "Emily Rodriguez",
          position: "Marketing Manager",
          department: "Marketing",
          grossPay: 6200,
          netPay: 5100,
          deductions: 1100,
          status: "Paid",
        },
      ],
    },
    {
      id: "ph2",
      runName: "February 2026 Payroll",
      period: {
        start: "2026-02-01",
        end: "2026-02-28",
      },
      paymentDate: "2026-03-05",
      processedDate: "2026-03-04",
      status: "Completed",
      totalEmployees: 65,
      totalGross: 528000,
      totalNet: 443000,
      totalDeductions: 85000,
      totalBonuses: 48000,
      totalTaxes: 66000,
      totalBenefits: 19000,
      department: "All Departments",
      processedBy: "HR Admin",
      approvedBy: "Finance Manager",
      paymentMethod: "Bank Transfer",
      bankReference: "BTR-2026-02-001",
      metrics: {
        averageSalary: 6500,
        highestPay: 12000,
        lowestPay: 3100,
        payrollCostRatio: 0.41,
        overtimeTotal: 7500,
        leaveAdjustments: 2900,
      },
      breakdown: {
        byDepartment: [
          { name: "Engineering", count: 17, amount: 156000 },
          { name: "Sales", count: 12, amount: 86000 },
          { name: "Marketing", count: 10, amount: 69000 },
          { name: "Finance", count: 8, amount: 56000 },
          { name: "HR", count: 6, amount: 40000 },
          { name: "Operations", count: 8, amount: 52000 },
          { name: "Design", count: 4, amount: 24000 },
        ],
        byEmploymentType: [
          { type: "Full-time", count: 50, amount: 370000 },
          { type: "Part-time", count: 8, amount: 40000 },
          { type: "Contract", count: 5, amount: 22000 },
          { type: "Intern", count: 2, amount: 6000 },
        ],
      },
      history: [
        {
          action: "Payroll Run Created",
          date: "2026-03-01T09:00:00",
          user: "HR Admin",
        },
        {
          action: "Payroll Approved",
          date: "2026-03-03T14:00:00",
          user: "Finance Manager",
        },
        {
          action: "Payment Processed",
          date: "2026-03-04T11:00:00",
          user: "System",
        },
        {
          action: "Payroll Completed",
          date: "2026-03-05T09:00:00",
          user: "System",
        },
      ],
      employees: [],
    },
    {
      id: "ph3",
      runName: "January 2026 Payroll",
      period: {
        start: "2026-01-01",
        end: "2026-01-31",
      },
      paymentDate: "2026-02-05",
      processedDate: "2026-02-04",
      status: "Completed",
      totalEmployees: 62,
      totalGross: 510000,
      totalNet: 425000,
      totalDeductions: 85000,
      totalBonuses: 45000,
      totalTaxes: 64000,
      totalBenefits: 21000,
      department: "All Departments",
      processedBy: "HR Admin",
      approvedBy: "Finance Manager",
      paymentMethod: "Bank Transfer",
      bankReference: "BTR-2026-01-001",
      metrics: {
        averageSalary: 6300,
        highestPay: 11800,
        lowestPay: 3000,
        payrollCostRatio: 0.40,
        overtimeTotal: 6800,
        leaveAdjustments: 2700,
      },
      breakdown: {
        byDepartment: [
          { name: "Engineering", count: 16, amount: 148000 },
          { name: "Sales", count: 11, amount: 82000 },
          { name: "Marketing", count: 10, amount: 67000 },
          { name: "Finance", count: 7, amount: 52000 },
          { name: "HR", count: 6, amount: 38000 },
          { name: "Operations", count: 8, amount: 50000 },
          { name: "Design", count: 4, amount: 23000 },
        ],
        byEmploymentType: [
          { type: "Full-time", count: 48, amount: 360000 },
          { type: "Part-time", count: 7, amount: 35000 },
          { type: "Contract", count: 5, amount: 20000 },
          { type: "Intern", count: 2, amount: 6000 },
        ],
      },
      history: [
        {
          action: "Payroll Run Created",
          date: "2026-02-01T09:00:00",
          user: "HR Admin",
        },
        {
          action: "Payroll Approved",
          date: "2026-02-03T14:00:00",
          user: "Finance Manager",
        },
        {
          action: "Payment Processed",
          date: "2026-02-04T11:00:00",
          user: "System",
        },
        {
          action: "Payroll Completed",
          date: "2026-02-05T09:00:00",
          user: "System",
        },
      ],
      employees: [],
    },
    {
      id: "ph4",
      runName: "Q1 Bonus Payroll",
      period: {
        start: "2026-01-01",
        end: "2026-03-31",
      },
      paymentDate: "2026-04-10",
      processedDate: "2026-04-09",
      status: "Processing",
      totalEmployees: 68,
      totalGross: 280000,
      totalNet: 220000,
      totalDeductions: 60000,
      totalBonuses: 250000,
      totalTaxes: 50000,
      totalBenefits: 10000,
      department: "All Departments",
      processedBy: "HR Admin",
      paymentMethod: "Wire Transfer",
      notes: "Quarterly bonus distribution",
      metrics: {
        averageSalary: 4100,
        highestPay: 8500,
        lowestPay: 2000,
        payrollCostRatio: 0.15,
        overtimeTotal: 0,
        leaveAdjustments: 0,
      },
      breakdown: {
        byDepartment: [
          { name: "Engineering", count: 18, amount: 82000 },
          { name: "Sales", count: 12, amount: 58000 },
          { name: "Marketing", count: 10, amount: 42000 },
          { name: "Finance", count: 8, amount: 32000 },
          { name: "HR", count: 6, amount: 24000 },
          { name: "Operations", count: 8, amount: 28000 },
          { name: "Design", count: 6, amount: 14000 },
        ],
        byEmploymentType: [
          { type: "Full-time", count: 52, amount: 200000 },
          { type: "Part-time", count: 8, amount: 12000 },
          { type: "Contract", count: 6, amount: 6000 },
          { type: "Intern", count: 2, amount: 2000 },
        ],
      },
      history: [
        {
          action: "Payroll Run Created",
          date: "2026-04-08T09:00:00",
          user: "HR Admin",
          note: "Special bonus payroll",
        },
        {
          action: "Processing Started",
          date: "2026-04-09T10:00:00",
          user: "System",
        },
      ],
      employees: [],
    },
    {
      id: "ph5",
      runName: "December 2025 Payroll",
      period: {
        start: "2025-12-01",
        end: "2025-12-31",
      },
      paymentDate: "2026-01-05",
      processedDate: "2026-01-04",
      status: "Completed",
      totalEmployees: 60,
      totalGross: 580000,
      totalNet: 480000,
      totalDeductions: 100000,
      totalBonuses: 75000,
      totalTaxes: 72000,
      totalBenefits: 28000,
      department: "All Departments",
      processedBy: "HR Admin",
      approvedBy: "Finance Manager",
      paymentMethod: "Bank Transfer",
      bankReference: "BTR-2025-12-001",
      notes: "Year-end payroll with annual bonuses",
      metrics: {
        averageSalary: 8000,
        highestPay: 15000,
        lowestPay: 3500,
        payrollCostRatio: 0.45,
        overtimeTotal: 9200,
        leaveAdjustments: 3500,
      },
      breakdown: {
        byDepartment: [
          { name: "Engineering", count: 16, amount: 180000 },
          { name: "Sales", count: 10, amount: 95000 },
          { name: "Marketing", count: 9, amount: 75000 },
          { name: "Finance", count: 7, amount: 62000 },
          { name: "HR", count: 6, amount: 45000 },
          { name: "Operations", count: 8, amount: 58000 },
          { name: "Design", count: 4, amount: 25000 },
        ],
        byEmploymentType: [
          { type: "Full-time", count: 46, amount: 420000 },
          { type: "Part-time", count: 7, amount: 38000 },
          { type: "Contract", count: 5, amount: 22000 },
          { type: "Intern", count: 2, amount: 6000 },
        ],
      },
      history: [
        {
          action: "Payroll Run Created",
          date: "2026-01-02T09:00:00",
          user: "HR Admin",
        },
        {
          action: "Payroll Approved",
          date: "2026-01-03T14:00:00",
          user: "Finance Manager",
          note: "Year-end bonuses approved",
        },
        {
          action: "Payment Processed",
          date: "2026-01-04T11:00:00",
          user: "System",
        },
        {
          action: "Payroll Completed",
          date: "2026-01-05T09:00:00",
          user: "System",
        },
      ],
      employees: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "Partially Paid":
        return <AlertCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const formatPeriod = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Calculate summary statistics
  const summary: PayrollSummary = {
    totalRuns: payrollHistory.length,
    totalPaid: payrollHistory.reduce((sum, r) => sum + r.totalNet, 0),
    totalEmployees: payrollHistory.reduce((sum, r) => sum + r.totalEmployees, 0) / payrollHistory.length,
    averageRunAmount: payrollHistory.reduce((sum, r) => sum + r.totalNet, 0) / payrollHistory.length,
    totalTaxes: payrollHistory.reduce((sum, r) => sum + r.totalTaxes, 0),
    totalDeductions: payrollHistory.reduce((sum, r) => sum + r.totalDeductions, 0),
    totalBonuses: payrollHistory.reduce((sum, r) => sum + r.totalBonuses, 0),
    successRate: (payrollHistory.filter(r => r.status === "Completed").length / payrollHistory.length) * 100,
    byPeriod: payrollHistory.map(r => ({
      period: r.runName,
      amount: r.totalNet,
      employees: r.totalEmployees,
    })),
    byStatus: [
      {
        status: "Completed",
        count: payrollHistory.filter(r => r.status === "Completed").length,
        amount: payrollHistory.filter(r => r.status === "Completed").reduce((sum, r) => sum + r.totalNet, 0),
      },
      {
        status: "Processing",
        count: payrollHistory.filter(r => r.status === "Processing").length,
        amount: payrollHistory.filter(r => r.status === "Processing").reduce((sum, r) => sum + r.totalNet, 0),
      },
      {
        status: "Failed",
        count: payrollHistory.filter(r => r.status === "Failed").length,
        amount: payrollHistory.filter(r => r.status === "Failed").reduce((sum, r) => sum + r.totalNet, 0),
      },
    ],
    recentActivity: payrollHistory
      .flatMap(r => r.history.map(h => ({
        action: h.action,
        date: h.date,
        user: h.user,
        details: r.runName,
      })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10),
  };

  const departments = ["All", ...new Set(payrollHistory.map(r => r.department))];
  const statuses = ["All", "Completed", "Processing", "Partially Paid", "Failed", "Cancelled"];

  const filteredRecords = payrollHistory.filter(record => {
    const matchesSearch = record.runName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.processedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bankReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesStatus = filterStatus === "All" || record.status === filterStatus;
    const matchesDepartment = filterDepartment === "All" || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const selectedRecordData = payrollHistory.find(r => r.id === selectedRecord);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payroll History</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {payrollHistory.length} Records
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                View and analyze historical payroll data and trends
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
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                <BarChart3 className="w-4 h-4" />
                Compare Runs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Runs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{summary.totalRuns}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">{summary.successRate.toFixed(0)}%</span> success rate
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.totalPaid)}
                </p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Across {summary.totalRuns} runs
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average Run</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.averageRunAmount)}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">↑ 5.2%</span> from previous period
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Avg Employees</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {summary.totalEmployees.toFixed(0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Per payroll run
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Bonuses</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(summary.totalBonuses)}
                </p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">↑ 12%</span> year over year
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
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PieChart className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("runs")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "runs"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              Payroll Runs
              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs">
                {payrollHistory.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "employees"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" />
              Employee History
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-slate-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {summary.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>
                      {index < summary.recentActivity.length - 1 && (
                        <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <span className="text-sm text-slate-500">{formatDateWithTime(activity.date)}</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        By {activity.user} • {activity.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Taxes</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(summary.totalTaxes)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Deductions</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(summary.totalDeductions)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
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
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Avg Employees</p>
                    <p className="text-lg font-bold text-slate-900">{summary.totalEmployees.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-600" />
                Status Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summary.byStatus.map((item) => (
                  <div key={item.status} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                      <span className="text-sm text-slate-500">{item.count} runs</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 mt-2">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payroll Runs Tab */}
        {activeTab === "runs" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by run name, processor, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
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
                          Run Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Net Pay
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Employees
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No payroll records found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-slate-900">{record.runName}</p>
                                <p className="text-sm text-slate-500">By {record.processedBy}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {formatPeriod(record.period.start, record.period.end)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                              {formatCurrency(record.totalNet)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {record.totalEmployees}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                {getStatusIcon(record.status)}
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                              {formatDate(record.paymentDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedRecord(record.id);
                                    setViewMode("detail");
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                  <Download className="w-4 h-4" />
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
                {filteredRecords.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-14 h-14 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No payroll records found</p>
                    </div>
                  </div>
                ) : (
                  filteredRecords.map((record) => (
                    <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{record.runName}</h3>
                          <p className="text-sm text-slate-500">{formatPeriod(record.period.start, record.period.end)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Net Pay</p>
                          <p className="font-bold text-blue-600">{formatCurrency(record.totalNet)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Employees</p>
                          <p className="font-semibold text-slate-900">{record.totalEmployees}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Bonuses</p>
                          <p className="font-semibold text-green-600">{formatCurrency(record.totalBonuses)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Payment Date</p>
                          <p className="font-medium text-sm">{formatDate(record.paymentDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>{record.processedBy}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedRecord(record.id);
                              setViewMode("detail");
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <Download className="w-4 h-4" />
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
        {viewMode === "detail" && selectedRecordData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("table")}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 text-slate-600 rotate-45" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedRecordData.runName}
                </h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecordData.status)}`}>
                  {getStatusIcon(selectedRecordData.status)}
                  {selectedRecordData.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                  <Copy className="w-4 h-4" />
                  Duplicate Run
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Gross</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedRecordData.totalGross)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Net</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedRecordData.totalNet)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Deductions</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedRecordData.totalDeductions)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Total Bonuses</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedRecordData.totalBonuses)}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Run Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average Salary</span>
                      <span className="font-medium">{formatCurrency(selectedRecordData.metrics.averageSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Highest Pay</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedRecordData.metrics.highestPay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Lowest Pay</span>
                      <span className="font-medium text-red-600">{formatCurrency(selectedRecordData.metrics.lowestPay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payroll Cost Ratio</span>
                      <span className="font-medium">{(selectedRecordData.metrics.payrollCostRatio * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overtime Total</span>
                      <span className="font-medium">{formatCurrency(selectedRecordData.metrics.overtimeTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Leave Adjustments</span>
                      <span className="font-medium">{formatCurrency(selectedRecordData.metrics.leaveAdjustments)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payment Method</span>
                      <span className="font-medium">{selectedRecordData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payment Date</span>
                      <span className="font-medium">{formatDate(selectedRecordData.paymentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Processed Date</span>
                      <span className="font-medium">{formatDate(selectedRecordData.processedDate)}</span>
                    </div>
                    {selectedRecordData.bankReference && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Reference</span>
                        <span className="font-medium font-mono">{selectedRecordData.bankReference}</span>
                      </div>
                    )}
                    {selectedRecordData.approvedBy && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Approved By</span>
                        <span className="font-medium">{selectedRecordData.approvedBy}</span>
                      </div>
                    )}
                    {selectedRecordData.notes && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Notes</span>
                        <span className="font-medium text-sm">{selectedRecordData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Department Breakdown</h4>
                <div className="space-y-2">
                  {selectedRecordData.breakdown.byDepartment.map((dept) => (
                    <div key={dept.name} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium text-slate-700">{dept.name}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${(dept.amount / selectedRecordData.totalNet) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 whitespace-nowrap">
                        {dept.count} employees • {formatCurrency(dept.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-slate-600" />
                  Run History
                </h4>
                <div className="space-y-3">
                  {selectedRecordData.history.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>
                        {index < selectedRecordData.history.length - 1 && (
                          <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{item.action}</p>
                          <span className="text-sm text-slate-500">{formatDateWithTime(item.date)}</span>
                        </div>
                        <p className="text-sm text-slate-600">By {item.user}</p>
                        {item.note && (
                          <p className="text-sm text-slate-500 mt-1">{item.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Trend Chart - Simplified */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                Payroll Trends
              </h3>
              <div className="space-y-4">
                {payrollHistory.map((record) => (
                  <div key={record.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{record.runName}</span>
                      <span className="text-slate-600">{formatCurrency(record.totalNet)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{
                          width: `${(record.totalNet / Math.max(...payrollHistory.map(r => r.totalNet))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Growth</h4>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">+12.5%</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Payroll growth over 6 months</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Efficiency</h4>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">94%</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Payroll accuracy rate</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Cost Per Employee</h4>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(summary.totalPaid / summary.totalRuns / summary.totalEmployees)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Average per run</p>
              </div>
            </div>
          </div>
        )}

        {/* Employee History Tab */}
        {activeTab === "employees" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Employee Payment History
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {payrollHistory
                  .filter(r => r.employees && r.employees.length > 0)
                  .map((record) => (
                    <div key={record.id} className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-3">{record.runName}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Employee</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Position</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Gross</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Net</th>
                              <th className="px-4 py-2 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {record.employees.map((emp) => (
                              <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{emp.position}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{emp.department}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(emp.grossPay)}</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency(emp.netPay)}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    emp.status === "Paid" ? "bg-green-100 text-green-800" :
                                    emp.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {emp.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                                    {emp.status === "Pending" && <Clock className="w-3 h-3" />}
                                    {emp.status === "Failed" && <XCircle className="w-3 h-3" />}
                                    {emp.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Export History</p>
              <p className="text-xs text-slate-500">Download full history</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Analytics Report</p>
              <p className="text-xs text-slate-500">Generate insights</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Configure</p>
              <p className="text-xs text-slate-500">History settings</p>
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

        {/* Compare Runs Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Compare Payroll Runs</h3>
                  <p className="text-sm text-slate-500">Select runs to compare side by side</p>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                {payrollHistory.map((record) => (
                  <div key={record.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                    <input
                      type="checkbox"
                      checked={selectedPeriods.includes(record.id)}
                      onChange={() => {
                        setSelectedPeriods(prev =>
                          prev.includes(record.id)
                            ? prev.filter(id => id !== record.id)
                            : [...prev, record.id]
                        );
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{record.runName}</p>
                      <p className="text-sm text-slate-500">
                        {formatPeriod(record.period.start, record.period.end)} • {formatCurrency(record.totalNet)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={selectedPeriods.length < 2}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    selectedPeriods.length >= 2
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Compare ({selectedPeriods.length} selected)
                </button>
              </div>
              {selectedPeriods.length < 2 && (
                <p className="text-sm text-yellow-600 mt-2">Please select at least 2 runs to compare</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}