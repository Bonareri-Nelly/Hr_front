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
  Edit,
  Trash2,
  Plus,
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
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Globe,
  Link,
  User,
  Phone,
  MapPin,
  Send,
  Save,
  Upload,
} from "lucide-react";

interface TaxEntity {
  id: string;
  name: string;
  type: "Federal" | "State" | "Local" | "International";
  taxType: string;
  taxId: string;
  filingFrequency: "Monthly" | "Quarterly" | "Annually" | "Semi-annually";
  dueDate: string;
  status: "Active" | "Pending" | "Expired" | "Under Review";
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

interface ComplianceRequirement {
  id: string;
  name: string;
  type: "Regulatory" | "Internal" | "Audit" | "Statutory";
  description: string;
  frequency: "Monthly" | "Quarterly" | "Annually" | "As Needed";
  dueDate: string;
  status: "Compliant" | "Non-Compliant" | "In Progress" | "Overdue" | "Not Started";
  assignedTo: string;
  department: string;
  priority: "High" | "Medium" | "Low";
  lastAuditDate?: string;
  nextAuditDate: string;
  findings?: string[];
  documents: {
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }[];
  notes?: string;
}

interface TaxFiling {
  id: string;
  entityId: string;
  period: {
    start: string;
    end: string;
  };
  filingDate: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  penalty: number;
  interest: number;
  status: "Filed" | "Pending" | "Overdue" | "Partially Paid" | "Paid";
  returnType: string;
  formNumber: string;
  filingMethod: "Electronic" | "Paper" | "Third Party";
  filedBy: string;
  approvedBy?: string;
  notes?: string;
  attachments: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  auditRisk: "Low" | "Medium" | "High";
}

export default function TaxComplianceAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState<"taxes" | "compliance" | "filings" | "reports">("taxes");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample tax entities
  const [taxEntities, setTaxEntities] = useState<TaxEntity[]>([
    {
      id: "t1",
      name: "Federal Income Tax",
      type: "Federal",
      taxType: "Income Tax",
      taxId: "FEIN-123456789",
      filingFrequency: "Quarterly",
      dueDate: "2026-04-15",
      status: "Active",
      amount: 125000,
      paidAmount: 93000,
      balance: 32000,
      filingStatus: "Pending",
      lastFiledDate: "2026-01-15",
      nextDueDate: "2026-04-15",
      jurisdiction: "United States - Federal",
      contactPerson: "John Smith",
      contactEmail: "john.smith@company.com",
      contactPhone: "+1 (555) 123-4567",
      registrationDate: "2020-01-01",
      expirationDate: "2030-12-31",
      isAutoCalculated: true,
      taxRate: 0.21,
      taxableBasis: "Net Income",
      history: [
        {
          date: "2026-01-15",
          action: "Filed",
          amount: 42000,
          status: "Filed",
        },
        {
          date: "2026-01-10",
          action: "Payment",
          amount: 42000,
          status: "Paid",
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
      status: "Active",
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
      taxRate: 0.0825,
      taxableBasis: "Gross Sales",
      penalty: 500,
      interest: 120,
      history: [
        {
          date: "2026-02-20",
          action: "Filed",
          amount: 33000,
          status: "Filed",
        },
        {
          date: "2026-02-18",
          action: "Payment",
          amount: 33000,
          status: "Paid",
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
      status: "Active",
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
      taxRate: 0.2,
      taxableBasis: "Value Added",
      history: [
        {
          date: "2026-01-31",
          action: "Filed",
          amount: 28000,
          status: "Filed",
        },
        {
          date: "2026-01-28",
          action: "Payment",
          amount: 28000,
          status: "Paid",
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
      taxRate: 0.0765,
      taxableBasis: "Employee Wages",
      notes: "Under audit review",
      history: [
        {
          date: "2026-02-15",
          action: "Filed",
          amount: 68000,
          status: "Filed",
        },
        {
          date: "2026-02-12",
          action: "Payment",
          amount: 68000,
          status: "Paid",
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
          status: "Filed",
        },
        {
          date: "2025-03-28",
          action: "Payment",
          amount: 15000,
          status: "Paid",
        },
      ],
    },
  ]);

  // Sample compliance requirements
  const complianceRequirements: ComplianceRequirement[] = [
    {
      id: "c1",
      name: "SOX Compliance Audit",
      type: "Regulatory",
      description: "Sarbanes-Oxley Act compliance audit for financial reporting",
      frequency: "Annually",
      dueDate: "2026-06-30",
      status: "In Progress",
      assignedTo: "Sarah Johnson",
      department: "Finance",
      priority: "High",
      lastAuditDate: "2025-06-30",
      nextAuditDate: "2026-06-30",
      documents: [
        {
          name: "SOX_2025_Report.pdf",
          type: "PDF",
          uploadDate: "2025-07-15",
          size: "2.5 MB",
        },
      ],
      notes: "Engaging external auditors for this year",
    },
    {
      id: "c2",
      name: "GDPR Data Protection",
      type: "Regulatory",
      description: "GDPR compliance for data handling and privacy",
      frequency: "Quarterly",
      dueDate: "2026-03-31",
      status: "Compliant",
      assignedTo: "Maria Garcia",
      department: "Legal",
      priority: "High",
      lastAuditDate: "2025-12-31",
      nextAuditDate: "2026-03-31",
      documents: [
        {
          name: "GDPR_Assessment_Q4_2025.pdf",
          type: "PDF",
          uploadDate: "2025-12-20",
          size: "3.1 MB",
        },
      ],
    },
    {
      id: "c3",
      name: "Internal Financial Controls",
      type: "Internal",
      description: "Review of internal financial controls and processes",
      frequency: "Monthly",
      dueDate: "2026-04-15",
      status: "Non-Compliant",
      assignedTo: "James Wilson",
      department: "Finance",
      priority: "High",
      lastAuditDate: "2026-03-15",
      nextAuditDate: "2026-04-15",
      findings: [
        "Missing documentation for Q1 expenditures",
        "Inadequate separation of duties in payment processing",
      ],
      documents: [
        {
          name: "Controls_Review_March_2026.xlsx",
          type: "Excel",
          uploadDate: "2026-03-10",
          size: "1.2 MB",
        },
      ],
      notes: "Needs immediate remediation",
    },
    {
      id: "c4",
      name: "Tax Compliance Review",
      type: "Audit",
      description: "External audit of tax compliance and filings",
      frequency: "Annually",
      dueDate: "2026-08-31",
      status: "Not Started",
      assignedTo: "Robert Taylor",
      department: "Tax",
      priority: "Medium",
      nextAuditDate: "2026-08-31",
      documents: [],
      notes: "Scheduled for Q3 2026",
    },
    {
      id: "c5",
      name: "Employment Law Compliance",
      type: "Statutory",
      description: "Compliance with employment laws and regulations",
      frequency: "Annually",
      dueDate: "2026-05-30",
      status: "Overdue",
      assignedTo: "Lisa Thompson",
      department: "HR",
      priority: "High",
      lastAuditDate: "2025-05-30",
      nextAuditDate: "2026-05-30",
      documents: [
        {
          name: "Employment_Laws_2025.pdf",
          type: "PDF",
          uploadDate: "2025-06-01",
          size: "4.2 MB",
        },
      ],
      notes: "OVERDUE - Action required immediately",
    },
  ];

  // Sample tax filings
  const taxFilings: TaxFiling[] = [
    {
      id: "f1",
      entityId: "t1",
      period: {
        start: "2026-01-01",
        end: "2026-03-31",
      },
      filingDate: "2026-04-15",
      dueDate: "2026-04-15",
      amountDue: 42000,
      amountPaid: 42000,
      penalty: 0,
      interest: 0,
      status: "Filed",
      returnType: "Form 1120",
      formNumber: "1120",
      filingMethod: "Electronic",
      filedBy: "Tax Department",
      notes: "Q1 2026 filing",
      attachments: [
        {
          name: "Form_1120_Q1_2026.pdf",
          type: "PDF",
          size: "3.4 MB",
          url: "#",
        },
      ],
      auditRisk: "Low",
    },
    {
      id: "f2",
      entityId: "t2",
      period: {
        start: "2026-02-01",
        end: "2026-02-28",
      },
      filingDate: "2026-03-20",
      dueDate: "2026-03-20",
      amountDue: 33000,
      amountPaid: 33000,
      penalty: 0,
      interest: 0,
      status: "Paid",
      returnType: "Sales Tax Return",
      formNumber: "BOE-401",
      filingMethod: "Electronic",
      filedBy: "Tax Department",
      approvedBy: "John Smith",
      attachments: [],
      auditRisk: "Medium",
    },
    {
      id: "f3",
      entityId: "t2",
      period: {
        start: "2026-03-01",
        end: "2026-03-31",
      },
      filingDate: "2026-04-20",
      dueDate: "2026-04-20",
      amountDue: 36000,
      amountPaid: 0,
      penalty: 500,
      interest: 120,
      status: "Pending",
      returnType: "Sales Tax Return",
      formNumber: "BOE-401",
      filingMethod: "Electronic",
      filedBy: "Tax Department",
      notes: "Pending approval",
      attachments: [],
      auditRisk: "Medium",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Compliant":
      case "Filed":
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Expired":
      case "Non-Compliant":
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
      case "Compliant":
      case "Filed":
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Expired":
      case "Non-Compliant":
      case "Overdue":
        return <AlertCircle className="w-4 h-4" />;
      case "Under Review":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  const getComplianceTypeColor = (type: string) => {
    switch (type) {
      case "Regulatory":
        return "bg-red-100 text-red-800";
      case "Internal":
        return "bg-blue-100 text-blue-800";
      case "Audit":
        return "bg-purple-100 text-purple-800";
      case "Statutory":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEntities = taxEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || entity.type === filterType;
    const matchesStatus = filterStatus === "All" || entity.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredCompliance = complianceRequirements.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || req.type === filterType;
    const matchesStatus = filterStatus === "All" || req.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTaxLiability = taxEntities.reduce((sum, entity) => sum + entity.amount, 0);
  const totalTaxPaid = taxEntities.reduce((sum, entity) => sum + entity.paidAmount, 0);
  const totalTaxBalance = taxEntities.reduce((sum, entity) => sum + entity.balance, 0);
  const overdueCount = taxEntities.filter(e => e.filingStatus === "Overdue").length;
  const complianceIssues = complianceRequirements.filter(c => c.status === "Non-Compliant" || c.status === "Overdue").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Tax & Compliance</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  Accounts
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage tax filings, compliance requirements, and regulatory reporting
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
                Export Reports
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Bell className="w-4 h-4" />
                Alerts
                {overdueCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {overdueCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                Add Tax Entity
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Tax Liability</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(totalTaxLiability)}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>Paid: {formatCurrency(totalTaxPaid)}</span>
              <span className="text-slate-300 mx-1">|</span>
              <span className="text-red-600">Balance: {formatCurrency(totalTaxBalance)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Tax Entities</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {taxEntities.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span className="text-red-600">{overdueCount} overdue</span>
              <span className="text-slate-300 mx-1">•</span>
              <span>{taxEntities.filter(e => e.status === "Active").length} active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Compliance Status</p>
                <p className="text-2xl font-bold mt-1">
                  {complianceIssues > 0 ? (
                    <span className="text-red-600">{complianceIssues} Issues</span>
                  ) : (
                    <span className="text-green-600">All Compliant</span>
                  )}
                </p>
              </div>
              <div className={complianceIssues > 0 ? "bg-red-100 p-3 rounded-xl" : "bg-green-100 p-3 rounded-xl"}>
                {complianceIssues > 0 ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>{complianceRequirements.filter(c => c.status === "Compliant").length} compliant</span>
              <span className="text-slate-300 mx-1">•</span>
              <span>{complianceRequirements.filter(c => c.status === "In Progress").length} in progress</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Upcoming Filings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {taxEntities.filter(e => e.filingStatus === "Pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>Next due: {taxEntities.length > 0 ? formatDate(taxEntities[0].nextDueDate) : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("taxes")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "taxes"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Tax Entities
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "compliance"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Shield className="w-4 h-4" />
              Compliance
              {complianceIssues > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {complianceIssues}
                </span>
              )}
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
              Tax Filings
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "reports"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  activeTab === "taxes"
                    ? "Search by name, tax ID, or jurisdiction..."
                    : activeTab === "compliance"
                    ? "Search by name, description, or assignee..."
                    : "Search by form number or return type..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {activeTab !== "reports" && (
                <>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      <option value="All">
                        {activeTab === "taxes" ? "All Types" : "All Categories"}
                      </option>
                      {activeTab === "taxes" && (
                        <>
                          <option value="Federal">Federal</option>
                          <option value="State">State</option>
                          <option value="Local">Local</option>
                          <option value="International">International</option>
                        </>
                      )}
                      {activeTab === "compliance" && (
                        <>
                          <option value="Regulatory">Regulatory</option>
                          <option value="Internal">Internal</option>
                          <option value="Audit">Audit</option>
                          <option value="Statutory">Statutory</option>
                        </>
                      )}
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
                      {activeTab === "taxes" && (
                        <>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                          <option value="Under Review">Under Review</option>
                        </>
                      )}
                      {activeTab === "compliance" && (
                        <>
                          <option value="Compliant">Compliant</option>
                          <option value="Non-Compliant">Non-Compliant</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Not Started">Not Started</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                </>
              )}
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

        {/* Main Content - Tax Entities */}
        {activeTab === "taxes" && viewMode === "table" && (
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
                      Paid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Filing Status
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
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600">
                          {formatCurrency(entity.paidAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">
                          {formatCurrency(entity.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(entity.filingStatus)}`}>
                            {getStatusIcon(entity.filingStatus)}
                            {entity.filingStatus}
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

        {/* Tax Entities - Card View */}
        {activeTab === "taxes" && viewMode === "cards" && (
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
                      <p className="text-xs text-slate-500">Filing Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(entity.filingStatus)}`}>
                        {getStatusIcon(entity.filingStatus)}
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
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="grid grid-cols-1 gap-4">
            {filteredCompliance.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                <div className="flex flex-col items-center gap-3">
                  <Shield className="w-14 h-14 text-slate-300" />
                  <p className="text-lg font-medium text-slate-600">No compliance requirements found</p>
                </div>
              </div>
            ) : (
              filteredCompliance.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{req.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getComplianceTypeColor(req.type)}`}>
                            {req.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                            {req.priority} Priority
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{req.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {req.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {req.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {formatDate(req.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {req.frequency}
                          </span>
                        </div>
                        {req.findings && req.findings.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs font-medium text-red-700">Findings:</p>
                            <ul className="list-disc list-inside text-xs text-red-600">
                              {req.findings.map((finding, idx) => (
                                <li key={idx}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all">
                        View Details
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

        {/* Tax Filings Tab */}
        {activeTab === "filings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Tax Filings</h3>
              <button
                onClick={() => setShowFilingModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                New Filing
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Return Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Audit Risk
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {taxFilings.map((filing) => {
                    const entity = taxEntities.find(e => e.id === filing.entityId);
                    return (
                      <tr key={filing.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-slate-900">{filing.returnType}</p>
                            <p className="text-sm text-slate-500">Form {filing.formNumber}</p>
                            {entity && (
                              <p className="text-xs text-slate-400">{entity.name}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(filing.period.start)} - {formatDate(filing.period.end)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {formatCurrency(filing.amountDue)}
                          {filing.amountPaid > 0 && (
                            <p className="text-xs text-green-600">Paid: {formatCurrency(filing.amountPaid)}</p>
                          )}
                          {(filing.penalty > 0 || filing.interest > 0) && (
                            <p className="text-xs text-red-600">
                              {filing.penalty > 0 && `Penalty: ${formatCurrency(filing.penalty)} `}
                              {filing.interest > 0 && `Interest: ${formatCurrency(filing.interest)}`}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(filing.status)}`}>
                            {getStatusIcon(filing.status)}
                            {filing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            filing.auditRisk === "Low" ? "bg-green-100 text-green-800" :
                            filing.auditRisk === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {filing.auditRisk}
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
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <PieChart className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">New</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Tax Liability Summary</h3>
              <p className="text-sm text-slate-500 mb-4">Overview of total tax liabilities by type and jurisdiction</p>
              <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Compliance Status Report</h3>
              <p className="text-sm text-slate-500 mb-4">Track compliance status across all requirements</p>
              <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Filing History Report</h3>
              <p className="text-sm text-slate-500 mb-4">Detailed filing history with payment tracking</p>
              <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Compliance Risk Assessment</h3>
              <p className="text-sm text-slate-500 mb-4">Identify high-risk compliance areas</p>
              <button className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Penalty & Interest Report</h3>
              <p className="text-sm text-slate-500 mb-4">Track penalties and interest charges</p>
              <button className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Filing Calendar</h3>
              <p className="text-sm text-slate-500 mb-4">Upcoming filing deadlines and reminders</p>
              <button className="w-full px-4 py-2 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-all text-sm font-medium">
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Generate Tax Forms</p>
              <p className="text-xs text-slate-500">Create tax forms for filing</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Submit Electronic Filing</p>
              <p className="text-xs text-slate-500">File taxes electronically</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Configure Settings</p>
              <p className="text-xs text-slate-500">Update tax and compliance settings</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">View guides and resources</p>
            </div>
          </button>
        </div>

        {/* Add Tax Entity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Tax Entity</h3>
                  <p className="text-sm text-slate-500">Register a new tax entity for compliance</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="e.g., Federal Income Tax"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      <option>Federal</option>
                      <option>State</option>
                      <option>Local</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tax ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="e.g., FEIN-123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Filing Frequency <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Semi-annually</option>
                      <option>Annually</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Jurisdiction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="e.g., United States - Federal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="e.g., 21"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Name of contact person"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-20"
                    placeholder="Additional notes or comments..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Entity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}