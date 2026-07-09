import { useState } from "react";
import {
  Shield,
  FileText,
  DollarSign,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Printer,
  Mail,
  Bell,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  ExternalLink,
  HelpCircle,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Globe,
  User,
  Phone,
  MapPin,
  Info,
  CalendarDays,
  Clock as ClockIcon,
  Percent,
  Award,
  Zap,
  ShieldCheck,
  FileCheck2,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TaxEntity {
  id: string;
  name: string;
  type: "Federal" | "State" | "Local" | "International";
  taxType: string;
  taxId: string;
  filingFrequency: "Monthly" | "Quarterly" | "Annually" | "Semi-annually";
  dueDate: string;
  status: "Compliant" | "Pending" | "Expired" | "Under Review" | "Overdue";
  amount: number;
  paidAmount: number;
  balance: number;
  filingStatus: "Filed" | "Pending" | "Overdue" | "Not Filed";
  lastFiledDate?: string;
  nextDueDate: string;
  jurisdiction: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  registrationDate: string;
  expirationDate?: string;
  notes?: string;
  isAutoCalculated: boolean;
  taxRate?: number;
  taxableBasis?: string;
  penalty?: number;
  interest?: number;
  history: {
    date: string;
    action: string;
    amount: number;
    status: string;
    note?: string;
  }[];
}

interface TaxSummary {
  totalLiability: number;
  totalPaid: number;
  totalBalance: number;
  totalPenalties: number;
  totalInterest: number;
  complianceRate: number;
  overdueCount: number;
  pendingCount: number;
  byType: {
    type: string;
    count: number;
    amount: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  byJurisdiction: {
    name: string;
    count: number;
    amount: number;
  }[];
  upcomingDeadlines: {
    entity: string;
    date: string;
    amount: number;
  }[];
  recentFilings: {
    entity: string;
    date: string;
    amount: number;
    status: string;
  }[];
}

export default function TaxCompliancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "entities" | "filings" | "history">("overview");

  // Sample tax entities - read-only data
  const taxEntities: TaxEntity[] = [
    {
      id: "t1",
      name: "Federal Income Tax",
      type: "Federal",
      taxType: "Income Tax",
      taxId: "FEIN-123456789",
      filingFrequency: "Quarterly",
      dueDate: "2026-04-15",
      status: "Compliant",
      amount: 125000,
      paidAmount: 125000,
      balance: 0,
      filingStatus: "Filed",
      lastFiledDate: "2026-01-15",
      nextDueDate: "2026-04-15",
      jurisdiction: "United States - Federal",
      contactPerson: "John Smith",
      contactEmail: "john.smith@company.com",
      contactPhone: "+1 (555) 123-4567",
      registrationDate: "2020-01-01",
      expirationDate: "2030-12-31",
      isAutoCalculated: true,
      taxRate: 21,
      taxableBasis: "Net Income",
      history: [
        {
          date: "2026-01-15",
          action: "Filed",
          amount: 42000,
          status: "Completed",
        },
        {
          date: "2026-01-10",
          action: "Payment",
          amount: 42000,
          status: "Completed",
        },
      ],
    },
    {
      id: "t2",
      name: "State Sales Tax",
      type: "State",
      taxType: "Sales Tax",
      taxId: "ST-987654321",
      filingFrequency: "Monthly",
      dueDate: "2026-03-20",
      status: "Overdue",
      amount: 45000,
      paidAmount: 33000,
      balance: 12000,
      filingStatus: "Overdue",
      lastFiledDate: "2026-02-20",
      nextDueDate: "2026-03-20",
      jurisdiction: "California",
      contactPerson: "Maria Garcia",
      contactEmail: "maria.g@company.com",
      contactPhone: "+1 (555) 234-5678",
      registrationDate: "2019-06-15",
      isAutoCalculated: false,
      taxRate: 8.25,
      taxableBasis: "Gross Sales",
      penalty: 500,
      interest: 120,
      history: [
        {
          date: "2026-02-20",
          action: "Filed",
          amount: 33000,
          status: "Completed",
        },
        {
          date: "2026-02-18",
          action: "Payment",
          amount: 33000,
          status: "Completed",
        },
      ],
    },
    {
      id: "t3",
      name: "Local Business Tax",
      type: "Local",
      taxType: "Business License",
      taxId: "LBT-555555555",
      filingFrequency: "Annually",
      dueDate: "2026-06-30",
      status: "Pending",
      amount: 8000,
      paidAmount: 0,
      balance: 8000,
      filingStatus: "Not Filed",
      nextDueDate: "2026-06-30",
      jurisdiction: "San Francisco, CA",
      contactPerson: "Robert Taylor",
      contactEmail: "robert.t@company.com",
      contactPhone: "+1 (555) 345-6789",
      registrationDate: "2018-03-01",
      expirationDate: "2026-12-31",
      isAutoCalculated: false,
      notes: "Annual renewal required",
      history: [],
    },
    {
      id: "t4",
      name: "VAT/GST",
      type: "International",
      taxType: "Value Added Tax",
      taxId: "VAT-UK-1234567",
      filingFrequency: "Quarterly",
      dueDate: "2026-04-30",
      status: "Compliant",
      amount: 28000,
      paidAmount: 28000,
      balance: 0,
      filingStatus: "Filed",
      lastFiledDate: "2026-01-31",
      nextDueDate: "2026-04-30",
      jurisdiction: "United Kingdom",
      contactPerson: "Sarah Johnson",
      contactEmail: "sarah.j@company.com",
      contactPhone: "+44 20 1234 5678",
      registrationDate: "2020-09-15",
      isAutoCalculated: true,
      taxRate: 20,
      taxableBasis: "Value Added",
      history: [
        {
          date: "2026-01-31",
          action: "Filed",
          amount: 28000,
          status: "Completed",
        },
        {
          date: "2026-01-28",
          action: "Payment",
          amount: 28000,
          status: "Completed",
        },
      ],
    },
    {
      id: "t5",
      name: "Payroll Taxes",
      type: "Federal",
      taxType: "Payroll Tax",
      taxId: "PT-987654321",
      filingFrequency: "Monthly",
      dueDate: "2026-03-15",
      status: "Under Review",
      amount: 76000,
      paidAmount: 68000,
      balance: 8000,
      filingStatus: "Pending",
      lastFiledDate: "2026-02-15",
      nextDueDate: "2026-03-15",
      jurisdiction: "United States - Federal",
      contactPerson: "James Wilson",
      contactEmail: "james.w@company.com",
      contactPhone: "+1 (555) 456-7890",
      registrationDate: "2019-01-01",
      isAutoCalculated: true,
      taxRate: 7.65,
      taxableBasis: "Employee Wages",
      notes: "Under audit review",
      history: [
        {
          date: "2026-02-15",
          action: "Filed",
          amount: 68000,
          status: "Completed",
        },
        {
          date: "2026-02-12",
          action: "Payment",
          amount: 68000,
          status: "Completed",
        },
      ],
    },
    {
      id: "t6",
      name: "Property Tax",
      type: "Local",
      taxType: "Property Tax",
      taxId: "PTX-111222333",
      filingFrequency: "Annually",
      dueDate: "2026-04-01",
      status: "Expired",
      amount: 15000,
      paidAmount: 15000,
      balance: 0,
      filingStatus: "Filed",
      lastFiledDate: "2025-04-01",
      nextDueDate: "2026-04-01",
      jurisdiction: "Santa Clara County, CA",
      contactPerson: "Lisa Thompson",
      contactEmail: "lisa.t@company.com",
      contactPhone: "+1 (555) 567-8901",
      registrationDate: "2017-01-01",
      expirationDate: "2026-01-01",
      isAutoCalculated: false,
      history: [
        {
          date: "2025-04-01",
          action: "Filed",
          amount: 15000,
          status: "Completed",
        },
        {
          date: "2025-03-28",
          action: "Payment",
          amount: 15000,
          status: "Completed",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
      case "Filed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Expired":
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
      case "Filed":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Expired":
      case "Overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTaxTypeColor = (type: string) => {
    switch (type) {
      case "Federal":
        return "bg-blue-100 text-blue-800";
      case "State":
        return "bg-purple-100 text-purple-800";
      case "Local":
        return "bg-green-100 text-green-800";
      case "International":
        return "bg-indigo-100 text-indigo-800";
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

  // Calculate summary statistics
  const summary: TaxSummary = {
    totalLiability: taxEntities.reduce((sum, e) => sum + e.amount, 0),
    totalPaid: taxEntities.reduce((sum, e) => sum + e.paidAmount, 0),
    totalBalance: taxEntities.reduce((sum, e) => sum + e.balance, 0),
    totalPenalties: taxEntities.reduce((sum, e) => sum + (e.penalty || 0), 0),
    totalInterest: taxEntities.reduce((sum, e) => sum + (e.interest || 0), 0),
    complianceRate: (taxEntities.filter(e => e.status === "Compliant").length / taxEntities.length) * 100,
    overdueCount: taxEntities.filter(e => e.status === "Overdue").length,
    pendingCount: taxEntities.filter(e => e.status === "Pending" || e.status === "Under Review").length,
    byType: [
      {
        type: "Federal",
        count: taxEntities.filter(e => e.type === "Federal").length,
        amount: taxEntities.filter(e => e.type === "Federal").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        type: "State",
        count: taxEntities.filter(e => e.type === "State").length,
        amount: taxEntities.filter(e => e.type === "State").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        type: "Local",
        count: taxEntities.filter(e => e.type === "Local").length,
        amount: taxEntities.filter(e => e.type === "Local").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        type: "International",
        count: taxEntities.filter(e => e.type === "International").length,
        amount: taxEntities.filter(e => e.type === "International").reduce((sum, e) => sum + e.amount, 0),
      },
    ],
    byStatus: [
      {
        status: "Compliant",
        count: taxEntities.filter(e => e.status === "Compliant").length,
        amount: taxEntities.filter(e => e.status === "Compliant").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        status: "Pending",
        count: taxEntities.filter(e => e.status === "Pending").length,
        amount: taxEntities.filter(e => e.status === "Pending").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        status: "Overdue",
        count: taxEntities.filter(e => e.status === "Overdue").length,
        amount: taxEntities.filter(e => e.status === "Overdue").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        status: "Under Review",
        count: taxEntities.filter(e => e.status === "Under Review").length,
        amount: taxEntities.filter(e => e.status === "Under Review").reduce((sum, e) => sum + e.amount, 0),
      },
      {
        status: "Expired",
        count: taxEntities.filter(e => e.status === "Expired").length,
        amount: taxEntities.filter(e => e.status === "Expired").reduce((sum, e) => sum + e.amount, 0),
      },
    ],
    byJurisdiction: [
      {
        name: "Federal",
        count: taxEntities.filter(e => e.jurisdiction.includes("Federal")).length,
        amount: taxEntities.filter(e => e.jurisdiction.includes("Federal")).reduce((sum, e) => sum + e.amount, 0),
      },
      {
        name: "California",
        count: taxEntities.filter(e => e.jurisdiction.includes("California")).length,
        amount: taxEntities.filter(e => e.jurisdiction.includes("California")).reduce((sum, e) => sum + e.amount, 0),
      },
      {
        name: "San Francisco",
        count: taxEntities.filter(e => e.jurisdiction.includes("San Francisco")).length,
        amount: taxEntities.filter(e => e.jurisdiction.includes("San Francisco")).reduce((sum, e) => sum + e.amount, 0),
      },
      {
        name: "United Kingdom",
        count: taxEntities.filter(e => e.jurisdiction.includes("United Kingdom")).length,
        amount: taxEntities.filter(e => e.jurisdiction.includes("United Kingdom")).reduce((sum, e) => sum + e.amount, 0),
      },
      {
        name: "Santa Clara County",
        count: taxEntities.filter(e => e.jurisdiction.includes("Santa Clara County")).length,
        amount: taxEntities.filter(e => e.jurisdiction.includes("Santa Clara County")).reduce((sum, e) => sum + e.amount, 0),
      },
    ],
    upcomingDeadlines: taxEntities
      .filter(e => e.status !== "Compliant")
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
      .slice(0, 5)
      .map(e => ({
        entity: e.name,
        date: e.nextDueDate,
        amount: e.balance,
      })),
    recentFilings: taxEntities
      .filter(e => e.lastFiledDate)
      .sort((a, b) => new Date(b.lastFiledDate!).getTime() - new Date(a.lastFiledDate!).getTime())
      .slice(0, 5)
      .map(e => ({
        entity: e.name,
        date: e.lastFiledDate!,
        amount: e.amount,
        status: e.filingStatus,
      })),
  };

  const filteredEntities = taxEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || entity.type === filterType;
    const matchesStatus = filterStatus === "All" || entity.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedEntityData = taxEntities.find(e => e.id === selectedEntity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Read-Only Indicator */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Tax & Compliance</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  View Only
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Read-Only
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                View tax compliance status, filings, and historical records
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
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Liability</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.totalLiability)}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>Paid: {formatCurrency(summary.totalPaid)}</span>
              <span className="text-slate-300 mx-1">|</span>
              <span className="text-red-600">Balance: {formatCurrency(summary.totalBalance)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {summary.complianceRate.toFixed(0)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>{taxEntities.filter(e => e.status === "Compliant").length} of {taxEntities.length} compliant</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending Actions</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {summary.pendingCount + summary.overdueCount}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span className="text-red-600">{summary.overdueCount} overdue</span>
              <span className="text-slate-300 mx-1">•</span>
              <span className="text-yellow-600">{summary.pendingCount} pending</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Penalties & Interest</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(summary.totalPenalties + summary.totalInterest)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>Penalties: {formatCurrency(summary.totalPenalties)}</span>
              <span className="text-slate-300 mx-1">•</span>
              <span>Interest: {formatCurrency(summary.totalInterest)}</span>
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
              <PieChart className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("entities")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "entities"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Tax Entities
              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs">
                {taxEntities.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("filings")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "filings"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              Filings
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              History
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 lg:col-span-2">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  Tax Distribution
                </h3>
                <div className="space-y-3">
                  {summary.byType.map((item) => (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{item.type}</span>
                        <span className="text-slate-600">
                          {item.count} entities • {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                          style={{
                            width: `${(item.amount / summary.totalLiability) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  Compliance Status
                </h3>
                <div className="space-y-3">
                  {summary.byStatus
                    .filter(item => item.count > 0)
                    .map((item) => (
                      <div key={item.status} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            item.status === "Compliant" ? "bg-green-500" :
                            item.status === "Pending" ? "bg-yellow-500" :
                            item.status === "Overdue" ? "bg-red-500" :
                            item.status === "Under Review" ? "bg-blue-500" :
                            "bg-gray-500"
                          }`} />
                          {item.status}
                        </span>
                        <span className="text-slate-600">
                          {item.count} ({formatCurrency(item.amount)})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines & Recent Filings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  Upcoming Deadlines
                </h3>
                {summary.upcomingDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {summary.upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-slate-900">{deadline.entity}</p>
                          <p className="text-sm text-slate-500">Due: {formatDate(deadline.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{formatCurrency(deadline.amount)}</p>
                          <p className="text-xs text-slate-500">Balance due</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No upcoming deadlines</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-green-600" />
                  Recent Filings
                </h3>
                {summary.recentFilings.length > 0 ? (
                  <div className="space-y-3">
                    {summary.recentFilings.map((filing, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-slate-900">{filing.entity}</p>
                          <p className="text-sm text-slate-500">Filed: {formatDate(filing.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(filing.amount)}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(filing.status)}`}>
                            {filing.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No recent filings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Entities Tab */}
        {activeTab === "entities" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, tax ID, or jurisdiction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      <option value="All">All Types</option>
                      <option value="Federal">Federal</option>
                      <option value="State">State</option>
                      <option value="Local">Local</option>
                      <option value="International">International</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      <option value="All">All Status</option>
                      <option value="Compliant">Compliant</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Expired">Expired</option>
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

            {/* Entities - Table View */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Tax Entity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Tax ID
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Next Due
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEntities.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No tax entities found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEntities.map((entity) => (
                          <tr key={entity.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-slate-900">{entity.name}</p>
                                <p className="text-sm text-slate-500">{entity.jurisdiction}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaxTypeColor(entity.type)}`}>
                                {entity.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                              {entity.taxId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                              {formatCurrency(entity.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">
                              {formatCurrency(entity.balance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(entity.status)}`}>
                                {getStatusIcon(entity.status)}
                                {entity.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                              {formatDate(entity.nextDueDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedEntity(entity.id);
                                    setViewMode("detail");
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
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

            {/* Entities - Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntities.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-14 h-14 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No tax entities found</p>
                    </div>
                  </div>
                ) : (
                  filteredEntities.map((entity) => (
                    <div key={entity.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{entity.name}</h3>
                            <p className="text-sm text-slate-500">{entity.jurisdiction}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(entity.status)}`}>
                          {entity.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Total Amount</p>
                          <p className="font-semibold text-slate-900">{formatCurrency(entity.amount)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Balance</p>
                          <p className="font-semibold text-red-600">{formatCurrency(entity.balance)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Status</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(entity.filingStatus)}`}>
                            {entity.filingStatus}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Next Due</p>
                          <p className="font-medium text-sm">{formatDate(entity.nextDueDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{entity.filingFrequency}</span>
                          <span>•</span>
                          <span>{entity.taxType}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedEntity(entity.id);
                              setViewMode("detail");
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
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
        {activeTab === "entities" && viewMode === "detail" && selectedEntityData && (
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
                  {selectedEntityData.name}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEntityData.status)}`}>
                  {selectedEntityData.status}
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
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Tax Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax Type</span>
                      <span className="font-medium">{selectedEntityData.taxType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax ID</span>
                      <span className="font-medium font-mono">{selectedEntityData.taxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Jurisdiction</span>
                      <span className="font-medium">{selectedEntityData.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Filing Frequency</span>
                      <span className="font-medium">{selectedEntityData.filingFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax Rate</span>
                      <span className="font-medium">{selectedEntityData.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Taxable Basis</span>
                      <span className="font-medium">{selectedEntityData.taxableBasis || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Financial Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Amount</span>
                      <span className="font-medium">{formatCurrency(selectedEntityData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Paid Amount</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedEntityData.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Balance</span>
                      <span className="font-bold text-red-600">{formatCurrency(selectedEntityData.balance)}</span>
                    </div>
                    {selectedEntityData.penalty && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Penalty</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedEntityData.penalty)}</span>
                      </div>
                    )}
                    {selectedEntityData.interest && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Interest</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedEntityData.interest)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Contact Person</span>
                      <span className="font-medium">{selectedEntityData.contactPerson || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email</span>
                      <span className="font-medium">{selectedEntityData.contactEmail || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone</span>
                      <span className="font-medium">{selectedEntityData.contactPhone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Registration Date</span>
                      <span className="font-medium">{formatDate(selectedEntityData.registrationDate)}</span>
                    </div>
                    {selectedEntityData.expirationDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Expiration Date</span>
                        <span className="font-medium">{formatDate(selectedEntityData.expirationDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              {selectedEntityData.history.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-slate-600" />
                    History
                  </h4>
                  <div className="space-y-3">
                    {selectedEntityData.history.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                          {index < selectedEntityData.history.length - 1 && (
                            <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{item.action}</p>
                            <span className="text-sm text-slate-500">{formatDateWithTime(item.date)}</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Amount: {formatCurrency(item.amount)} • Status: {item.status}
                          </p>
                          {item.note && (
                            <p className="text-sm text-slate-500 mt-1">{item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filings Tab */}
        {activeTab === "filings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Filing History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Filing Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Period</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {taxEntities
                    .filter(e => e.lastFiledDate)
                    .sort((a, b) => new Date(b.lastFiledDate!).getTime() - new Date(a.lastFiledDate!).getTime())
                    .map((entity) => (
                      <tr key={entity.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-slate-900">{entity.name}</p>
                            <p className="text-sm text-slate-500">{entity.taxType}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entity.lastFiledDate ? formatDate(entity.lastFiledDate) : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {entity.filingFrequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {formatCurrency(entity.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(entity.filingStatus)}`}>
                            {getStatusIcon(entity.filingStatus)}
                            {entity.filingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-slate-600" />
                Complete History
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {taxEntities.map((entity) => (
                  entity.history.length > 0 && (
                    <div key={entity.id} className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-3">{entity.name}</h4>
                      <div className="space-y-2">
                        {entity.history.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{item.action}</p>
                              <p className="text-slate-500">{formatDateWithTime(item.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(item.amount)}</p>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Read Only */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Tax Forms</p>
              <p className="text-xs text-slate-500">Access filed tax documents</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Calendar</p>
              <p className="text-xs text-slate-500">Upcoming deadlines</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Reports</p>
              <p className="text-xs text-slate-500">Historical tax reports</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">Tax compliance guides</p>
            </div>
          </div>
        </div>

        {/* Read-Only Notice */}
        <div className="mt-6 bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="font-medium text-indigo-900">View-Only Mode</p>
              <p className="text-sm text-indigo-700">
                This is a read-only view of tax compliance data. For any updates or corrections,
                please contact your tax administrator or submit a request through the appropriate channel.
              </p>
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Generate Report</h3>
              <p className="text-sm text-slate-500 mb-4">Select the type of report you want to generate</p>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">Tax Liability Summary</p>
                    <p className="text-xs text-slate-500">Overview of all tax liabilities</p>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">Compliance Status Report</p>
                    <p className="text-xs text-slate-500">Detailed compliance status</p>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">Upcoming Deadlines</p>
                    <p className="text-xs text-slate-500">Pending filing deadlines</p>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">History Report</p>
                    <p className="text-xs text-slate-500">Complete filing history</p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

