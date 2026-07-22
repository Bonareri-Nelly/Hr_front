import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Users,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Banknote,
  CalendarDays,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { payrollApi } from "../../../../services/api/payroll";
import "./PayrollPage.css";

type PayrunStatus = "processing" | "approved" | "pending" | "completed" | "failed";

interface Payrun {
  id: string;
  period: string;
  date: string;
  amount: string;
  employees: number;
  status: PayrunStatus;
  type: "monthly" | "bonus" | "commission";
}

interface EmployeePayroll {
  id: string;
  name: string;
  department: string;
  basicPay: string;
  allowances: string;
  deductions: string;
  netPay: string;
  status: "processed" | "pending" | "review";
}

const statusConfig: Record<PayrunStatus, { label: string; icon: any; className: string }> = {
  processing: {
    label: "Processing",
    icon: Clock,
    className: "status-processing",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "status-approved",
  },
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "status-pending",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "status-completed",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    className: "status-failed",
  },
};

export default function PayrollPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayrun, setSelectedPayrun] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [payruns, setPayruns] = useState<Payrun[]>([]);
  const [employeePayrolls, setEmployeePayrolls] = useState<EmployeePayroll[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayrollData = async () => {
      try {
        const [runs, payslips] = await Promise.all([
          payrollApi.listRuns().catch(() => []),
          payrollApi.listPayslips().catch(() => []),
        ]);

        const mappedPayruns: Payrun[] = (runs as Array<Record<string, unknown>>).map((run) => ({
          id: String(run.id ?? ''),
          period: run.pay_period ? String(run.pay_period) : `${run.month ?? ''}/${run.year ?? ''}`,
          date: String(run.created_at ?? ''),
          amount: `KES ${Number(run.total_amount ?? 0).toLocaleString()}`,
          employees: Number(run.employee_count ?? 0),
          status: (String(run.status ?? 'completed').toLowerCase() as PayrunStatus),
          type: 'monthly' as const,
        }));

        const mappedPayrolls: EmployeePayroll[] = (payslips as Array<Record<string, unknown>>).map((payslip) => ({
          id: String(payslip.id ?? ''),
          name: String(payslip.employee_name ?? 'Employee'),
          department: String(payslip.department ?? 'Operations'),
          basicPay: `KES ${Number(payslip.gross_pay ?? 0).toLocaleString()}`,
          allowances: `KES ${Number(payslip.allowances ?? 0).toLocaleString()}`,
          deductions: `KES ${Number(payslip.deductions ?? 0).toLocaleString()}`,
          netPay: `KES ${Number(payslip.net_pay ?? 0).toLocaleString()}`,
          status: (payslip.status === 'processed' ? 'processed' : 'pending') as EmployeePayroll['status'],
        }));

        setPayruns(mappedPayruns);
        setEmployeePayrolls(mappedPayrolls);
        setSelectedPayrun((mappedPayruns[0]?.id ?? '') as string);
      } catch {
        setError("Could not load payroll data. Check that the backend is running and that you have access.");
      }
    };

    loadPayrollData();
  }, []);

  const totalPayroll = employeePayrolls.reduce((sum, item) => sum + Number(item.netPay.replace(/[^0-9.-]/g, "")), 0);
  const activeEmployees = new Set(employeePayrolls.map((item) => item.name)).size;
  const pendingApprovals = payruns.filter((run) => ["pending", "processing"].includes(run.status)).length;

  const getStatusBadge = (status: PayrunStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`payrun-status ${config.className}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getEmployeeStatusBadge = (status: EmployeePayroll["status"]) => {
    const config = {
      processed: { label: "Processed", className: "emp-status-processed" },
      pending: { label: "Pending", className: "emp-status-pending" },
      review: { label: "Under Review", className: "emp-status-review" },
    };
    return <span className={`employee-status ${config[status].className}`}>{config[status].label}</span>;
  };

  const filteredEmployees = employeePayrolls.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPayrunData = payruns.find((p) => p.id === selectedPayrun);

  return (
    <div className="payroll-page">
      <div className="payroll-container">
        {/* Header */}
        <header className="payroll-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span>HR Operations</span>
              <ChevronRight size={14} />
              <span className="breadcrumb-current">Payroll</span>
            </div>
            <h1 className="page-title">Payroll Overview</h1>
            <p className="page-description">
              Manage payroll runs, view employee compensation details, and track approval status across departments.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn btn-primary">
              <Plus size={16} />
              New Payrun
            </button>
          </div>
        </header>
        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats Overview */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <CreditCard size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Payroll</span>
              <span className="stat-value">KES {totalPayroll.toLocaleString()}</span>
              <span className="stat-change positive">
                <TrendingUp size={14} />
                2.2% from last month
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <Users size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Active Employees</span>
              <span className="stat-value">{activeEmployees}</span>
              <span className="stat-change">+8 this quarter</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <CalendarDays size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pay Runs</span>
              <span className="stat-value">{payruns.length}</span>
              <span className="stat-change">This financial year</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pending Approvals</span>
              <span className="stat-value">{pendingApprovals}</span>
              <span className="stat-change">Require immediate action</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="payroll-grid">
          {/* Payrun History */}
          <section className="panel panel-payruns">
            <div className="panel-header">
              <h3 className="panel-title">Recent Pay Runs</h3>
              <button className="panel-link">
                View All
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="payrun-list">
              {payruns.map((payrun) => (
                <div
                  key={payrun.id}
                  className={`payrun-item ${selectedPayrun === payrun.id ? "active" : ""}`}
                  onClick={() => setSelectedPayrun(payrun.id)}
                >
                  <div className="payrun-info">
                    <div className="payrun-period">{payrun.period}</div>
                    <div className="payrun-meta">
                      <span>{payrun.date}</span>
                      <span className="payrun-dot">•</span>
                      <span>{payrun.employees} employees</span>
                      <span className="payrun-dot">•</span>
                      <span className="payrun-type">{payrun.type}</span>
                    </div>
                  </div>
                  <div className="payrun-right">
                    <span className="payrun-amount">{payrun.amount}</span>
                    {getStatusBadge(payrun.status)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Payrun Details */}
          <section className="panel panel-details">
            <div className="panel-header">
              <h3 className="panel-title">Payrun Details</h3>
              <div className="panel-actions">
                <button className="btn-icon" title="Settings">
                  <Settings size={18} />
                </button>
                <button className="btn-icon" title="More">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
            {selectedPayrunData ? (
              <div className="payrun-details">
                <div className="details-header">
                  <div>
                    <h4>{selectedPayrunData.period}</h4>
                    <p>{selectedPayrunData.date}</p>
                  </div>
                  <div className="details-summary">
                    <div>
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value">{selectedPayrunData.amount}</span>
                    </div>
                    <div>
                      <span className="detail-label">Employees</span>
                      <span className="detail-value">{selectedPayrunData.employees}</span>
                    </div>
                    <div>
                      <span className="detail-label">Status</span>
                      {getStatusBadge(selectedPayrunData.status)}
                    </div>
                  </div>
                </div>
                <div className="details-actions">
                  <button className="btn btn-primary btn-sm">
                    <Eye size={15} />
                    View Full Report
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <Download size={15} />
                    Download Summary
                  </button>
                  {selectedPayrunData.status === "processing" && (
                    <button className="btn btn-success btn-sm">
                      <CheckCircle2 size={15} />
                      Approve Payrun
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="payrun-empty">
                <p>Select a pay run to view details</p>
              </div>
            )}
          </section>
        </div>

        {/* Employee Payroll List */}
        <section className="panel panel-employees">
          <div className="panel-header">
            <h3 className="panel-title">Employee Payroll Details</h3>
            <div className="panel-toolbar">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, department, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="btn-icon" title="Filter">
                <Filter size={18} />
              </button>
              <button className="btn btn-secondary btn-sm">
                <Download size={15} />
                Export
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Basic Pay</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-cell">
                          <span className="employee-name">{emp.name}</span>
                          <span className="employee-id">{emp.id}</span>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td className="amount-cell">{emp.basicPay}</td>
                      <td className="amount-cell text-green">{emp.allowances}</td>
                      <td className="amount-cell text-red">{emp.deductions}</td>
                      <td className="amount-cell amount-bold">{emp.netPay}</td>
                      <td>{getEmployeeStatusBadge(emp.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      <div className="empty-content">
                        <FileText size={32} />
                        <p>No employees found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
