import { useState } from "react";
import {
  Plus,
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
  Copy,
  DollarSign,
  Calendar,
  Users,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  Send,
  Printer,
  Mail,
  UserPlus,
  UserMinus,
  Briefcase,
  Building2,
  TrendingUp,
  Award,
  Percent,
  Receipt,
  Zap,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Upload,
  FileSpreadsheet,
  File,
  FolderOpen,
  Save,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  LayoutGrid,
  List,
  BarChart3,
  PieChart,
  CalendarDays,
  Clock as ClockIcon,
  User,
  Globe,
  Link,
  Shield,
  Settings2,
  Users2,
  TrendingDown,
  BadgeCheck,
  Sparkles,
  UserCog,
  Wallet,
  Banknote,
  Building,
  MapPin,
  Phone,
  History,
  GitBranch,
  GitCommit,
  GitPullRequest,
  UserCheck,
  UserX,
  FileCheck,
  FileX,
  ClockArrowUp,
  ClockArrowDown,
  Timer,
  Workflow,
  Pencil,
  MoreHorizontal,
  ReceiptText,
  ScrollText,
  BadgeDollarSign,
  BriefcaseBusiness,
} from "lucide-react";
import { usePayrollCreation } from "../hooks/usePayrollCreation";

export default function PayrollCreationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [runName, setRunName] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<"Kenya" | "US">("Kenya");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const { runs, isLoading, error, createRun } = usePayrollCreation();

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateRun = () => {
    if (!runName.trim() || !periodStart || !periodEnd) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    createRun({
      name: runName,
      period: `${periodStart}|${periodEnd}`,
      payment_date: paymentDate,
      status: "Draft",
      total_amount: 0,
      employee_count: selectedEmployees.length,
      notes: notes,
    });

    showToast("Payroll run created successfully", "success");
    setRunName("");
    setPaymentDate("");
    setPeriodStart("");
    setPeriodEnd("");
    setNotes("");
    setShowConfirmationModal(false);
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="page-subtitle">Loading payroll creation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="alert alert-error">Unable to load payroll creation data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page payroll-creation-page">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll creation workspace</div>
          <h1 className="page-title">Payroll Creation</h1>
          <p className="page-subtitle">
            Create and manage payroll runs for your organization.
          </p>
        </div>

        <div className="finance-toolbar">
          <div className="action-row">
            <button className="button button-secondary" onClick={() => {}}>
              <RefreshCw aria-hidden="true" size={15} />
              Refresh
            </button>
            <button 
              className="button button-primary" 
              onClick={() => setShowConfirmationModal(true)}
            >
              <Plus aria-hidden="true" size={15} />
              Create Run
            </button>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Payroll Runs</h3>
        </div>
        
        <div className="panel-body">
          <div className="table-controls">
            <div className="table-search">
              <Search aria-hidden="true" size={16} />
              <input
                type="text"
                placeholder="Search payroll runs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="table-search-input"
              />
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Run Name</th>
                  <th>Period</th>
                  <th>Total Amount</th>
                  <th>Employees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run: any) => (
                  <tr key={run.id}>
                    <td>{run.name}</td>
                    <td>{run.period}</td>
                    <td>KES {run.total_amount?.toLocaleString()}</td>
                    <td>{run.employee_count}</td>
                    <td>
                      <span className={`pill pill-${
                        run.status === "Completed" ? "success" :
                        run.status === "Draft" ? "info" :
                        "warning"
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-icon button-secondary"
                          onClick={() => {}}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="button-icon button-secondary"
                          onClick={() => {}}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Create Run Modal */}
      {showConfirmationModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="module-modal" onSubmit={(e) => { e.preventDefault(); handleCreateRun(); }}>
            <div className="payroll-modal-header">
              <div>
                <div className="page-kicker">Payroll run creation</div>
                <h2>Create New Payroll Run</h2>
              </div>
              <button 
                className="panel-action" 
                type="button" 
                onClick={() => setShowConfirmationModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="payroll-modal-grid">
              <label className="field-control">
                <span className="eyebrow">Run name *</span>
                <input 
                  className="select-control" 
                  value={runName} 
                  onChange={(e) => setRunName(e.target.value)} 
                  placeholder="e.g. July 2026 Payroll" 
                  required 
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Payment date *</span>
                <input 
                  className="select-control" 
                  type="date"
                  value={paymentDate} 
                  onChange={(e) => setPaymentDate(e.target.value)} 
                  required 
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Period start *</span>
                <input 
                  className="select-control" 
                  type="date"
                  value={periodStart} 
                  onChange={(e) => setPeriodStart(e.target.value)} 
                  required 
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Period end *</span>
                <input 
                  className="select-control" 
                  type="date"
                  value={periodEnd} 
                  onChange={(e) => setPeriodEnd(e.target.value)} 
                  required 
                />
              </label>
              <label className="field-control">
                <span className="eyebrow">Country</span>
                <select 
                  className="select-control" 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value as any)}
                >
                  <option value="Kenya">Kenya</option>
                  <option value="US">United States</option>
                </select>
              </label>
            </div>
            
            <div className="action-row payroll-modal-actions">
              <button 
                className="button button-secondary" 
                type="button" 
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="button button-primary" 
                type="submit"
              >
                <Plus aria-hidden="true" size={15} /> 
                Create Run
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
