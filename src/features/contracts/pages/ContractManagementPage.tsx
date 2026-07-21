import { useState } from "react";
import { useContracts } from "../../../hooks";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  Upload,
  User,
  X,
  Zap,
  FileSpreadsheet,
  FolderOpen,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  CalendarDays,
  Clock as ClockIcon,
  MoreVertical,
  Copy,
  ExternalLink,
  Shield,
  Lock,
  Unlock,
  Users,
  Building,
  FileCheck,
  FileWarning,
  FileX,
  Timer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  MessageSquare,
  Bell,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Settings as SettingsIcon,
  HelpCircle,
  BookOpen,
  Ban,
  FilePlus
} from "lucide-react";

type ContractStatus = "Active" | "Pending" | "Expired" | "Terminated" | "Draft" | "Under Review";
type ContractType = "Employment" | "Contractor" | "Internship" | "Probation" | "Consultancy";

interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  salary: number;
  currency: string;
  probationPeriod: number;
  noticePeriod: number;
  documents: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    url: string;
  }[];
  signedByEmployee: boolean;
  signedByEmployer: boolean;
  signedDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  notes?: string;
  history: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
}

// ============================================================
// ADD CONTRACT MODAL
// ============================================================

function AddContractModal({ isOpen, onClose, onConfirm }: any) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Employment' as ContractType,
    employeeName: '',
    employeeId: '',
    employeeEmail: '',
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    salary: '',
    currency: 'USD',
    probationPeriod: 0,
    noticePeriod: 30,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.employeeName || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const newContract: Contract = {
      id: `c${Date.now()}`,
      title: formData.title,
      type: formData.type,
      status: 'Draft',
      employeeName: formData.employeeName,
      employeeId: formData.employeeId || 'EMP-001',
      employeeEmail: formData.employeeEmail,
      department: formData.department,
      position: formData.position,
      startDate: formData.startDate,
      endDate: formData.endDate,
      salary: parseFloat(formData.salary) || 0,
      currency: formData.currency,
      probationPeriod: parseInt(formData.probationPeriod as any) || 0,
      noticePeriod: parseInt(formData.noticePeriod as any) || 30,
      documents: [],
      signedByEmployee: false,
      signedByEmployer: false,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes,
      history: [{
        action: 'Created',
        date: new Date().toISOString(),
        user: 'Current User',
        note: 'Contract created'
      }],
    };

    onConfirm(newContract);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-blue-700" />
            New Contract
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              >
                <option value="Employment">Employment</option>
                <option value="Contractor">Contractor</option>
                <option value="Internship">Internship</option>
                <option value="Probation">Probation</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Email</label>
              <input
                type="email"
                name="employeeEmail"
                value={formData.employeeEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="john.doe@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="e.g. Senior Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary ({formData.currency})</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="e.g. 75000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              >
                <option value="USD">USD</option>
                <option value="KES">KES</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Probation (months)</label>
              <input
                type="number"
                name="probationPeriod"
                value={formData.probationPeriod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notice Period (days)</label>
              <input
                type="number"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="Additional details..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Create Contract
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ContractManagementPage() {
  const {
    contracts: apiContracts,
    isLoading,
    error,
    createContract,
    deleteContract,
    renewContract,
    approveContract,
    refreshContracts,
  } = useContracts();

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContractStatus | "All">("All");
  const [filterType, setFilterType] = useState<ContractType | "All">("All");
  const [activeTab, setActiveTab] = useState<"overview" | "contracts" | "templates" | "reports">("overview");
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const contracts = apiContracts as Contract[];

  // Contract Statistics
  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === "Active").length,
    pending: contracts.filter(c => c.status === "Pending").length,
    expired: contracts.filter(c => c.status === "Expired").length,
    expiringSoon: contracts.filter(c => {
      if (!c.endDate) return false;
      const endDate = new Date(c.endDate);
      const today = new Date();
      const daysUntilExpiry = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length,
    byType: [
      { type: "Employment", count: contracts.filter(c => c.type === "Employment").length },
      { type: "Contractor", count: contracts.filter(c => c.type === "Contractor").length },
      { type: "Internship", count: contracts.filter(c => c.type === "Internship").length },
      { type: "Probation", count: contracts.filter(c => c.type === "Probation").length },
      { type: "Consultancy", count: contracts.filter(c => c.type === "Consultancy").length },
    ],
    renewalRate: 85,
    averageDuration: 24,
  };

  // Helper Functions
  const getStatusColor = (status: ContractStatus): string => {
    const statusMap: Record<ContractStatus, string> = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Expired: "bg-red-100 text-red-800 border-red-200",
      Terminated: "bg-gray-100 text-gray-800 border-gray-200",
      Draft: "bg-blue-100 text-blue-800 border-blue-200",
      "Under Review": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: ContractStatus) => {
    const iconMap: Record<ContractStatus, React.ReactNode> = {
      Active: <CheckCircle className="w-4 h-4" />,
      Pending: <Clock className="w-4 h-4" />,
      Expired: <XCircle className="w-4 h-4" />,
      Terminated: <FileX className="w-4 h-4" />,
      Draft: <FileText className="w-4 h-4" />,
      "Under Review": <AlertCircle className="w-4 h-4" />,
    };
    return iconMap[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getTypeColor = (type: ContractType): string => {
    const typeMap: Record<ContractType, string> = {
      Employment: "bg-blue-100 text-blue-800",
      Contractor: "bg-purple-100 text-purple-800",
      Internship: "bg-green-100 text-green-800",
      Probation: "bg-yellow-100 text-yellow-800",
      Consultancy: "bg-indigo-100 text-indigo-800",
    };
    return typeMap[type] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
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

  const getDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Filter Contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || contract.status === filterStatus;
    const matchesType = filterType === "All" || contract.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const selectedContractData = contracts.find(c => c.id === selectedContract);

  // Event Handlers
  const handleDeleteContract = async () => {
    if (contractToDelete) {
      try {
        await deleteContract(contractToDelete);
        setContractToDelete(null);
        setShowDeleteConfirm(false);
        alert("Contract deleted successfully!");
      } catch {
        alert("Unable to delete the contract. Please try again.");
      }
    }
  };

  const handleAddContract = async (newContract: Contract) => {
    const employeeId = Number(newContract.employeeId);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      alert("Enter a valid numeric employee database ID.");
      return;
    }

    const contractTypes: Record<ContractType, string> = {
      Employment: "PERMANENT",
      Contractor: "FIXED_TERM",
      Internship: "INTERNSHIP",
      Probation: "PROBATION",
      Consultancy: "CONSULTANCY",
    };

    try {
      await createContract({
        employee: employeeId,
        contract_number: `CNT-${Date.now()}`,
        title: newContract.title,
        contract_type: contractTypes[newContract.type],
        start_date: newContract.startDate,
        end_date: newContract.endDate,
        basic_salary: newContract.salary,
        currency: newContract.currency,
        probation_period: newContract.probationPeriod,
        notice_period: newContract.noticePeriod,
        terms: newContract.notes || "",
      });
      setShowAddModal(false);
      alert("New contract created successfully!");
    } catch {
      alert("Unable to create the contract. Check the employee ID and required contract details.");
    }
  };

  const handleEditContract = () => {
    alert("Contract updated successfully!");
    setShowEditModal(false);
  };

  const handleSendForSignature = async (contractId: string) => {
    try {
      await approveContract(contractId);
      alert("Contract approved successfully!");
    } catch {
      alert("Unable to approve the contract. Please try again.");
    }
  };

  const handleRenewContract = async (contractId: string) => {
    const newEndDate = window.prompt("Enter the new contract end date (YYYY-MM-DD):");
    if (!newEndDate) return;

    const contract = contracts.find((item) => item.id === contractId);
    if (!contract) {
      alert("Contract details are unavailable. Refresh and try again.");
      return;
    }

    const currentEndDate = new Date(contract.endDate);
    if (Number.isNaN(currentEndDate.getTime())) {
      alert("This contract has no valid end date to renew from.");
      return;
    }

    currentEndDate.setDate(currentEndDate.getDate() + 1);
    const newStartDate = currentEndDate.toISOString().slice(0, 10);

    try {
      await renewContract({
        id: contractId,
        data: {
          new_start_date: newStartDate,
          new_end_date: newEndDate,
          new_salary: contract.salary,
        },
      });
      alert("Contract renewed successfully!");
    } catch {
      alert("Unable to renew the contract. Please check the new end date.");
    }
  };

  const handleDownloadContract = (contractId: string) => {
    alert(`Downloading contract ${contractId}...`);
  };

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report...`);
  };

  const handleCreateNewTemplate = () => {
    alert("New template created successfully!");
  };

  const statuses: (ContractStatus | "All")[] = ["All", "Active", "Pending", "Expired", "Under Review", "Draft", "Terminated"];
  const types: (ContractType | "All")[] = ["All", "Employment", "Contractor", "Internship", "Probation", "Consultancy"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Contract Management</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {contracts.length} Contracts
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage employee contracts, agreements, and renewals
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshContracts}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                New Contract
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Contracts</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{contractStats.total}</p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Across {contractStats.byType.filter(t => t.count > 0).length} types
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{contractStats.active}</p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              {((contractStats.active / contractStats.total) * 100).toFixed(0)}% of total
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{contractStats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              Requires attention
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Expiring Soon</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{contractStats.expiringSoon}</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-600">
              Within 30 days
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Renewal Rate</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{contractStats.renewalRate}%</p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600">
              +5% from last year
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "contracts", label: "Contracts", icon: <FileText className="w-4 h-4" /> },
              { id: "templates", label: "Templates", icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: "reports", label: "Reports", icon: <PieChart className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Contract Type Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractStats.byType.map((type) => (
                  <div key={type.type} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type.type as ContractType)}`}>
                        {type.type}
                      </span>
                      <span className="text-sm text-slate-500">{type.count} contracts</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${(type.count / contractStats.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {((type.count / contractStats.total) * 100).toFixed(0)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-slate-600" />
                  Status Breakdown
                </h3>
                <div className="space-y-3">
                  {["Active", "Pending", "Expired", "Under Review", "Draft", "Terminated"].map((status) => {
                    const count = contracts.filter(c => c.status === status).length;
                    if (count === 0) return null;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status as ContractStatus)}`}>
                            {getStatusIcon(status as ContractStatus)}
                            {status}
                          </span>
                          <span className="text-slate-600">{count} contracts</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              status === "Active" ? "bg-green-500" :
                              status === "Pending" ? "bg-yellow-500" :
                              status === "Expired" ? "bg-red-500" :
                              status === "Under Review" ? "bg-purple-500" :
                              status === "Draft" ? "bg-blue-500" :
                              "bg-gray-500"
                            }`}
                            style={{ width: `${(count / contractStats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all text-left"
                  >
                    <Plus className="w-5 h-5 text-indigo-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">New Contract</p>
                    <p className="text-xs text-slate-500">Create from template</p>
                  </button>
                  <button className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left">
                    <Upload className="w-5 h-5 text-green-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Upload Contract</p>
                    <p className="text-xs text-slate-500">Add existing contract</p>
                  </button>
                  <button className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left">
                    <FileSpreadsheet className="w-5 h-5 text-purple-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Templates</p>
                    <p className="text-xs text-slate-500">Manage templates</p>
                  </button>
                  <button className="p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all text-left">
                    <Bell className="w-5 h-5 text-yellow-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Renewal Alerts</p>
                    <p className="text-xs text-slate-500">{contractStats.expiringSoon} due soon</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === "contracts" && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, employee, department, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as ContractStatus | "All")}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as ContractType | "All")}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
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

            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Contract
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Salary
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
                      {filteredContracts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No contracts found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredContracts.map((contract) => (
                          <tr key={contract.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-slate-900">{contract.title}</p>
                                <p className="text-sm text-slate-500">{contract.position}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                                  {contract.employeeName.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{contract.employeeName}</p>
                                  <p className="text-xs text-slate-500">{contract.department}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contract.type)}`}>
                                {contract.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <p>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
                                <p className="text-xs text-slate-500">
                                  {getDaysRemaining(contract.endDate)} days remaining
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                              {formatCurrency(contract.salary, contract.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                                {getStatusIcon(contract.status)}
                                {contract.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => { setSelectedContract(contract.id); setViewMode("detail"); }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleSendForSignature(contract.id)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadContract(contract.id)}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
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

                <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-medium">{filteredContracts.length}</span> of{" "}
                    <span className="font-medium">{contracts.length}</span> contracts
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all">
                      2
                    </button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all">
                      3
                    </button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContracts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-14 h-14 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No contracts found</p>
                    </div>
                  </div>
                ) : (
                  filteredContracts.map((contract) => (
                    <div key={contract.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{contract.title}</h3>
                          <p className="text-xs text-slate-500">{contract.position}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                          {getStatusIcon(contract.status)}
                          {contract.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                          {contract.employeeName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{contract.employeeName}</p>
                          <p className="text-xs text-slate-500">{contract.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Type</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.type)}`}>
                            {contract.type}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Salary</p>
                          <p className="font-semibold text-slate-900 text-sm">{formatCurrency(contract.salary, contract.currency)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 col-span-2">
                          <p className="text-xs text-slate-500">Period</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getDaysRemaining(contract.endDate)} days remaining
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>{contract.signedByEmployee && contract.signedByEmployer ? "Signed" : "Pending"}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setSelectedContract(contract.id); setViewMode("detail"); }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
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

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: "t1",
                  name: "Employment Contract",
                  description: "Standard employment contract for full-time employees",
                  type: "Employment",
                  version: "2.1",
                  lastUpdated: "2026-01-15",
                },
                {
                  id: "t2",
                  name: "Contractor Agreement",
                  description: "Agreement for independent contractors and consultants",
                  type: "Contractor",
                  version: "1.8",
                  lastUpdated: "2025-12-10",
                },
                {
                  id: "t3",
                  name: "Internship Agreement",
                  description: "Standard internship agreement for students and graduates",
                  type: "Internship",
                  version: "1.2",
                  lastUpdated: "2025-11-20",
                },
                {
                  id: "t4",
                  name: "Probation Contract",
                  description: "Contract for employees on probation period",
                  type: "Probation",
                  version: "1.0",
                  lastUpdated: "2026-02-01",
                },
                {
                  id: "t5",
                  name: "Consultancy Agreement",
                  description: "Agreement for external consultants and advisors",
                  type: "Consultancy",
                  version: "1.5",
                  lastUpdated: "2025-10-05",
                },
              ].map((template) => (
                <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{template.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(template.type as ContractType)}`}>
                          {template.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">v{template.version}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Updated: {formatDate(template.lastUpdated)}</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all text-xs font-medium">
                        Preview
                      </button>
                      <button className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-all text-xs font-medium">
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Create New Template</h3>
                    <p className="text-sm text-slate-500">Design a custom contract template</p>
                  </div>
                </div>
                <button
                  onClick={handleCreateNewTemplate}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "r1",
                title: "Contract Status Report",
                description: "Overview of all contract statuses",
                icon: <PieChart className="w-6 h-6 text-blue-600" />,
                color: "blue",
              },
              {
                id: "r2",
                title: "Renewal Forecast",
                description: "Upcoming contract renewals and expirations",
                icon: <Calendar className="w-6 h-6 text-green-600" />,
                color: "green",
              },
              {
                id: "r3",
                title: "Contract Type Analysis",
                description: "Distribution of contract types",
                icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
                color: "purple",
              },
              {
                id: "r4",
                title: "Salary Analysis",
                description: "Salary distribution by contract type",
                icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
                color: "yellow",
              },
              {
                id: "r5",
                title: "Compliance Report",
                description: "Contract compliance and signature status",
                icon: <Shield className="w-6 h-6 text-red-600" />,
                color: "red",
              },
              {
                id: "r6",
                title: "Historical Trends",
                description: "Contract trends over time",
                icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
                color: "indigo",
              },
            ].map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 bg-${report.color}-100 rounded-lg`}>
                    {report.icon}
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">New</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{report.description}</p>
                <button
                  onClick={() => handleGenerateReport(report.title)}
                  className="w-full px-4 py-2 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Detail View */}
        {viewMode === "detail" && selectedContractData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("table")}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 text-slate-600 rotate-45" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900">{selectedContractData.title}</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContractData.status)}`}>
                  {getStatusIcon(selectedContractData.status)}
                  {selectedContractData.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRenewContract(selectedContractData.id)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Renew
                </button>
                <button
                  onClick={() => handleSendForSignature(selectedContractData.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <Mail className="w-4 h-4" />
                  Send for Signature
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Employee</p>
                  <p className="font-medium text-slate-900">{selectedContractData.employeeName}</p>
                  <p className="text-sm text-slate-500">{selectedContractData.employeeEmail}</p>
                  <p className="text-xs text-slate-400">{selectedContractData.employeeId}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Position & Department</p>
                  <p className="font-medium text-slate-900">{selectedContractData.position}</p>
                  <p className="text-sm text-slate-500">{selectedContractData.department}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Salary</p>
                  <p className="font-medium text-slate-900">{formatCurrency(selectedContractData.salary, selectedContractData.currency)}</p>
                  <p className="text-xs text-slate-400">Probation: {selectedContractData.probationPeriod} months</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Contract Period</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedContractData.startDate)}</p>
                  <p className="text-sm text-slate-500">to {formatDate(selectedContractData.endDate)}</p>
                  <p className="text-xs text-slate-400">{getDaysRemaining(selectedContractData.endDate)} days remaining</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Signature Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${selectedContractData.signedByEmployee ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {selectedContractData.signedByEmployee ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      Employee
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${selectedContractData.signedByEmployer ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {selectedContractData.signedByEmployer ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      Employer
                    </span>
                  </div>
                  {selectedContractData.signedDate && (
                    <p className="text-xs text-slate-400 mt-1">Signed: {formatDate(selectedContractData.signedDate)}</p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Reviews</p>
                  <p className="font-medium text-slate-900">Last: {selectedContractData.lastReviewDate ? formatDate(selectedContractData.lastReviewDate) : "N/A"}</p>
                  <p className="text-sm text-slate-500">Next: {selectedContractData.nextReviewDate ? formatDate(selectedContractData.nextReviewDate) : "N/A"}</p>
                </div>
              </div>

              {selectedContractData.documents.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-slate-600" />
                    Documents ({selectedContractData.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedContractData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.size} • Uploaded: {formatDate(doc.uploadDate)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContractData.notes && (
                <div className="border border-slate-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                    Notes
                  </h4>
                  <p className="text-sm text-slate-600">{selectedContractData.notes}</p>
                </div>
              )}

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-slate-600" />
                  History
                </h4>
                <div className="space-y-3">
                  {selectedContractData.history.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                        {index < selectedContractData.history.length - 1 && (
                          <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{item.action}</p>
                          <span className="text-sm text-slate-500">{formatDateWithTime(item.date)}</span>
                        </div>
                        <p className="text-sm text-slate-600">By {item.user}</p>
                        {item.note && <p className="text-sm text-slate-500 mt-1">{item.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Templates</p>
              <p className="text-xs text-slate-500">Manage contract templates</p>
            </div>
          </button>
        </div>
      </div>

      {/* Add Contract Modal */}
      <AddContractModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddContract}
      />
    </div>
  );
}
