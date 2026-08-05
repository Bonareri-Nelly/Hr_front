import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Search,
  ChevronDown,
  MoreVertical,
  Download,
  Eye,
  FileText,
  AlertCircle,
  TrendingUp,
  Users,
  CreditCard,
  Printer,
  ArrowUpRight,
  Settings,
  RefreshCw,
  Bell,
  BookOpen,
  ChevronLeft,
  Info,
  Send,
  Edit,
  Award,
  Zap,
  Plus,
  UserPlus,
  UserMinus,
  Briefcase,
  Building2,
  Trash2,
  Copy,
  Save,
  X,
  Filter,
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
  Receipt,
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
  Wallet,
  Banknote,
  Building,
  MapPin,
  Phone,
  Flag,
  Upload,
  FileSpreadsheet,
  File,
  FolderOpen,
} from "lucide-react";
import PayrollBatchApprovalModal from "../components/PayrollBatchApprovalModal";
import { usePayrollApproval } from "../hooks/usePayrollApproval";

export default function PayrollApprovalPage() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [selectedForAction, setSelectedForAction] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({ key: "date", direction: "descending" });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [editingEmployeeDeductions, setEditingEmployeeDeductions] = useState<any[]>([]);
  const [selectedHistoryPayrollId, setSelectedHistoryPayrollId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const { runs, isLoading, error, approveRun, rejectRun } = usePayrollApproval();

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: number) => {
    approveRun(id);
    showToast("Payroll run approved successfully", "success");
  };

  const handleReject = (id: number) => {
    rejectRun(id);
    showToast("Payroll run rejected", "error");
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="page-subtitle">Loading payroll approval data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="panel panel-body" style={{ textAlign: "center", padding: "48px" }}>
          <p className="alert alert-error">Unable to load payroll approval data.</p>
        </div>
      </div>
    );
  }

  const filteredRuns = runs.filter((run: any) => {
    const matchesSearch = !searchTerm || 
      run.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.period?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-page payroll-approval-page">
      <div className="dashboard-heading">
        <div>
          <div className="page-kicker">Payroll approval workspace</div>
          <h1 className="page-title">Payroll Approval</h1>
          <p className="page-subtitle">
            Review, approve, and manage payroll runs for all branches.
          </p>
        </div>

        <div className="finance-toolbar">
          <div className="action-row">
            <button className="button button-secondary" onClick={() => {}}>
              <RefreshCw aria-hidden="true" size={15} />
              Refresh
            </button>
            <button className="button button-primary" onClick={() => {}}>
              <Download aria-hidden="true" size={15} />
              Export
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
            <div className="table-filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
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
                {filteredRuns.map((run: any) => (
                  <tr key={run.id}>
                    <td>{run.name}</td>
                    <td>{run.period}</td>
                    <td>KES {run.total_amount?.toLocaleString()}</td>
                    <td>{run.employee_count}</td>
                    <td>
                      <span className={`pill pill-${
                        run.status === "Approved" ? "success" :
                        run.status === "Rejected" ? "danger" :
                        "warning"
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-icon button-success"
                          onClick={() => handleApprove(run.id)}
                          title="Approve"
                          disabled={run.status !== "Pending"}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="button-icon button-danger"
                          onClick={() => handleReject(run.id)}
                          title="Reject"
                          disabled={run.status !== "Pending"}
                        >
                          <XCircle size={16} />
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

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
