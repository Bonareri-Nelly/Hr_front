import { useState, useEffect } from "react";
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
  Ban
} from "lucide-react";

type ContractStatus = "Active" | "Pending" | "Expired" | "Terminated" | "Draft" | "Under Review";
type ContractType = "Employment" | "Contractor" | "Internship" | "Probation" | "Consultancy";
type ContractTone = "success" | "warning" | "danger" | "info" | "neutral";

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

function AmendmentModal({ isOpen, onClose, contract, onConfirm }: any) {
  const [formData, setFormData] = useState({
    contractType: contract?.type || 'Employment',
    endDate: contract?.endDate || '',
    salary: contract?.salary || '',
    termsSummary: contract?.notes || '',
    notes: contract?.notes || '',
    reason: '',
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        contractType: contract.type,
        endDate: contract.endDate,
        salary: contract.salary,
        termsSummary: contract.notes || '',
        notes: contract.notes || '',
        reason: '',
      });
    }
  }, [contract]);

  if (!isOpen || !contract) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) {
      alert('Please provide a reason for the amendment.');
      return;
    }
    onConfirm(contract.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">Amend Contract – {contract.employeeName}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contract Type</label>
              <select name="contractType" value={formData.contractType} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Employment">Employment</option>
                <option value="Contractor">Contractor</option>
                <option value="Internship">Internship</option>
                <option value="Probation">Probation</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary ({contract.currency})</label>
              <input type="number" name="salary" value={formData.salary} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Terms / Notes</label>
              <textarea name="termsSummary" value={formData.termsSummary} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Amendment <span className="text-red-500">*</span></label>
              <textarea name="reason" value={formData.reason} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
            <button type="submit" className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2">Confirm Amendment</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RenewalModal({ isOpen, onClose, contract, onConfirm }: any) {
  const [newEndDate, setNewEndDate] = useState('');
  const [reason, setReason] = useState('');
  if (!isOpen || !contract) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndDate) return;
    onConfirm(contract.id, newEndDate, reason);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Renew Contract</h3><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Employee</label><p className="text-slate-900">{contract.employeeName}</p></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">New End Date</label><input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required min={new Date().toISOString().split('T')[0]} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Reason / Notes</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} placeholder="e.g., Performance satisfactory, renewal for 1 year" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">Confirm Renewal</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TerminationModal({ isOpen, onClose, contract, onConfirm }: any) {
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  if (!isOpen || !contract) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveDate) return;
    onConfirm(contract.id, effectiveDate, reason);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Terminate Contract</h3><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Employee</label><p className="text-slate-900">{contract.employeeName}</p></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Effective Date</label><input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required min={new Date().toISOString().split('T')[0]} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Reason for Termination</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} placeholder="e.g., Resignation, End of contract, Performance issues" required /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">Confirm Termination</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContractManagementPage() {
  const {
    contracts,
    isLoading,
    error,
    createContract,
    renewContract,
    terminateContract,
    amendContract,
    deleteContract,
  } = useContracts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContractStatus | "All">("All");
  const [filterType, setFilterType] = useState<ContractType | "All">("All");
  const [activeTab, setActiveTab] = useState<"overview" | "contracts" | "templates" | "reports">("overview");
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [contractToAmend, setContractToAmend] = useState<Contract | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [contractToRenew, setContractToRenew] = useState<Contract | null>(null);
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [contractToTerminate, setContractToTerminate] = useState<Contract | null>(null);
  const [showMoreDropdown, setShowMoreDropdown] = useState<string | null>(null);

  const contractStats = {
    total: contracts?.length || 0,
    active: contracts?.filter((c: any) => c.status === "Active").length || 0,
    pending: contracts?.filter((c: any) => c.status === "Pending").length || 0,
    expired: contracts?.filter((c: any) => c.status === "Expired").length || 0,
    expiringSoon: contracts?.filter((c: any) => {
      if (!c.endDate) return false;
      const endDate = new Date(c.endDate);
      const today = new Date();
      const daysUntilExpiry = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length || 0,
    byType: [
      { type: "Employment", count: contracts?.filter((c: any) => c.type === "Employment").length || 0 },
      { type: "Contractor", count: contracts?.filter((c: any) => c.type === "Contractor").length || 0 },
      { type: "Internship", count: contracts?.filter((c: any) => c.type === "Internship").length || 0 },
      { type: "Probation", count: contracts?.filter((c: any) => c.type === "Probation").length || 0 },
      { type: "Consultancy", count: contracts?.filter((c: any) => c.type === "Consultancy").length || 0 },
    ],
    renewalRate: 85,
    averageDuration: 24,
  };

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

  const filteredContracts = contracts?.filter((contract: any) => {
    const matchesSearch = contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.employeeEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || contract.status === filterStatus;
    const matchesType = filterType === "All" || contract.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const selectedContractData = contracts?.find((c: any) => c.id === selectedContract);

  const handleDeleteContract = async () => {
    if (contractToDelete) {
      if (window.confirm("Are you sure you want to delete this contract?")) {
        try {
          await deleteContract(contractToDelete);
          setContractToDelete(null);
          setShowDeleteConfirm(false);
          alert("Contract deleted successfully!");
        } catch (err) {
          alert("Failed to delete contract");
        }
      }
    }
  };

  const handleAddContract = async (data: any) => {
    try {
      await createContract(data);
      setShowAddModal(false);
      alert("Contract created successfully!");
    } catch (err) {
      alert("Failed to create contract");
    }
  };

  const handleEditContract = () => {
    alert("Contract updated successfully!");
    setShowEditModal(false);
  };

  const handleSendForSignature = (contract: any) => {
    alert(`Contract "${contract.title}" sent for signature to ${contract.employeeEmail}`);
  };

  const handleRenewContract = (contract: any) => {
    setContractToRenew(contract);
    setShowRenewalModal(true);
  };

  const handleAmendContract = (contract: any) => {
    setContractToAmend(contract);
    setShowAmendmentModal(true);
  };

  const handleTerminateContract = (contract: any) => {
    setContractToTerminate(contract);
    setShowTerminationModal(true);
  };

  const handleConfirmRenewal = async (id: string, newEndDate: string, reason: string) => {
    try {
      await renewContract({ id, data: { new_end_date: newEndDate, reason } });
      setShowRenewalModal(false);
      setContractToRenew(null);
      alert("Contract renewed successfully!");
    } catch (err) {
      alert("Failed to renew contract");
    }
  };

  const handleConfirmAmendment = async (id: string, data: any) => {
    try {
      await amendContract({ id, data });
      setShowAmendmentModal(false);
      setContractToAmend(null);
      alert("Contract amended successfully!");
    } catch (err) {
      alert("Failed to amend contract");
    }
  };

  const handleConfirmTermination = async (id: string, effectiveDate: string, reason: string) => {
    try {
      await terminateContract({ id, data: { termination_date: effectiveDate, reason } });
      setShowTerminationModal(false);
      setContractToTerminate(null);
      alert("Contract terminated successfully!");
    } catch (err) {
      alert("Failed to terminate contract");
    }
  };

  const handleDownloadContract = (contractId: string) => {
    alert(`Downloading contract ${contractId}...`);
  };

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report...`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterType('All');
  };

  const handleViewDocument = (docName: string) => {
    alert(`Viewing document: ${docName}`);
  };

  const handleDownloadDocument = (docName: string) => {
    alert(`Downloading document: ${docName}`);
  };

  const handleUseTemplate = (templateName: string) => {
    alert(`Using template: ${templateName}`);
  };

  const handlePreviewTemplate = (templateName: string) => {
    alert(`Previewing template: ${templateName}`);
  };

  const handleCreateTemplate = () => {
    alert('Creating new template...');
  };

  const handleUploadContract = () => {
    alert('Upload contract dialog opened...');
  };

  const handleRenewalAlerts = () => {
    alert(`Showing renewal alerts (${contractStats.expiringSoon} contracts expiring soon)`);
  };

  const handleViewTemplates = () => {
    setActiveTab('templates');
  };

  const handleMoreAction = (action: string, contractId: string) => {
    setShowMoreDropdown(null);
    alert(`${action} action triggered for contract ${contractId}`);
  };

  const toggleMoreDropdown = (contractId: string) => {
    setShowMoreDropdown(showMoreDropdown === contractId ? null : contractId);
  };

  const statuses: (ContractStatus | "All")[] = ["All", "Active", "Pending", "Expired", "Under Review", "Draft", "Terminated"];
  const types: (ContractType | "All")[] = ["All", "Employment", "Contractor", "Internship", "Probation", "Consultancy"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 max-w-4xl mx-auto mt-10">
        <h3 className="font-semibold">Error loading contracts</h3>
        <p className="text-sm">{(error as any)?.message || "Failed to load contracts. Please try again."}</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Contract Management</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {contracts?.length || 0} Contracts
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage employee contracts, agreements, and renewals
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setIsLoadingLocal(true); setTimeout(() => setIsLoadingLocal(false), 1000); }}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLocal ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => alert('Exporting data...')}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
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
              Across {contractStats.byType.filter((t: any) => t.count > 0).length} types
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
              {contractStats.total > 0 ? ((contractStats.active / contractStats.total) * 100).toFixed(0) : 0}% of total
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

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Contract Type Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractStats.byType.map((type: any) => (
                  <div key={type.type} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type.type)}`}>
                        {type.type}
                      </span>
                      <span className="text-sm text-slate-500">{type.count} contracts</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${contractStats.total > 0 ? (type.count / contractStats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {contractStats.total > 0 ? ((type.count / contractStats.total) * 100).toFixed(0) : 0}% of total
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
                    const count = contracts?.filter((c: any) => c.status === status).length || 0;
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
                            style={{ width: `${contractStats.total > 0 ? (count / contractStats.total) * 100 : 0}%` }}
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
                  <button
                    onClick={handleUploadContract}
                    className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left"
                  >
                    <Upload className="w-5 h-5 text-green-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Upload Contract</p>
                    <p className="text-xs text-slate-500">Add existing contract</p>
                  </button>
                  <button
                    onClick={handleViewTemplates}
                    className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-purple-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Templates</p>
                    <p className="text-xs text-slate-500">Manage templates</p>
                  </button>
                  <button
                    onClick={handleRenewalAlerts}
                    className="p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all text-left"
                  >
                    <Bell className="w-5 h-5 text-yellow-600 mb-1" />
                    <p className="text-sm font-medium text-slate-700">Renewal Alerts</p>
                    <p className="text-xs text-slate-500">{contractStats.expiringSoon} due soon</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
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
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contract</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
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
                        filteredContracts.map((contract: any) => (
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
                                  {contract.employeeName?.split(" ").map((n: string) => n[0]).join("") || "U"}
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
                                  onClick={() => handleSendForSignature(contract)}
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
                                <div className="relative">
                                  <button
                                    onClick={() => toggleMoreDropdown(contract.id)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {showMoreDropdown === contract.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 py-1">
                                      <button onClick={() => handleMoreAction('Edit', contract.id)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <Edit className="w-4 h-4" /> Edit
                                      </button>
                                      <button onClick={() => handleMoreAction('Copy', contract.id)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <Copy className="w-4 h-4" /> Copy
                                      </button>
                                      <button onClick={() => {
                                        setContractToDelete(contract.id);
                                        setShowDeleteConfirm(true);
                                      }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
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
                    <span className="font-medium">{contracts?.length || 0}</span> contracts
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert('Previous page')}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all"
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
                      1
                    </button>
                    <button
                      onClick={() => alert('Page 2')}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all"
                    >
                      2
                    </button>
                    <button
                      onClick={() => alert('Page 3')}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all"
                    >
                      3
                    </button>
                    <button
                      onClick={() => alert('Next page')}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all"
                    >
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
                  filteredContracts.map((contract: any) => (
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
                          {contract.employeeName?.split(" ").map((n: string) => n[0]).join("") || "U"}
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
                          <button
                            onClick={() => handleDownloadContract(contract.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
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
                      <button
                        onClick={() => handlePreviewTemplate(template.name)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all text-xs font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template.name)}
                        className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-all text-xs font-medium"
                      >
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
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </button>
              </div>
            </div>
          </div>
        )}

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
                  onClick={() => handleRenewContract(selectedContractData)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Renew
                </button>
                <button
                  onClick={() => handleAmendContract(selectedContractData)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-amber-50 transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Amend
                </button>
                <button
                  onClick={() => handleTerminateContract(selectedContractData)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Terminate
                </button>
                <button
                  onClick={() => window.open(`/employees/${selectedContractData.employeeId}`, '_blank')}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>
                <button
                  onClick={() => handleSendForSignature(selectedContractData)}
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

              {selectedContractData.documents && selectedContractData.documents.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-slate-600" />
                    Documents ({selectedContractData.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedContractData.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {doc.name} <span className="text-xs text-slate-400 ml-1">v{index + 1}</span>
                            </p>
                            <p className="text-xs text-slate-500">{doc.size} • Uploaded: {formatDate(doc.uploadDate)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDocument(doc.name)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc.name)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
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
                  {selectedContractData.history?.map((item: any, index: number) => (
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
          <button
            onClick={handleViewTemplates}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">View Templates</p>
              <p className="text-xs text-slate-500">Manage contract templates</p>
            </div>
          </button>
        </div>

        <AmendmentModal
          isOpen={showAmendmentModal}
          onClose={() => setShowAmendmentModal(false)}
          contract={contractToAmend}
          onConfirm={handleConfirmAmendment}
        />
        <RenewalModal
          isOpen={showRenewalModal}
          onClose={() => setShowRenewalModal(false)}
          contract={contractToRenew}
          onConfirm={handleConfirmRenewal}
        />
        <TerminationModal
          isOpen={showTerminationModal}
          onClose={() => setShowTerminationModal(false)}
          contract={contractToTerminate}
          onConfirm={handleConfirmTermination}
        />

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)}></div>
            <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Contract</h3>
              <p className="text-sm text-slate-600">Are you sure you want to delete this contract? This action cannot be undone.</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDeleteContract}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}