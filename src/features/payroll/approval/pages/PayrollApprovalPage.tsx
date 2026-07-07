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
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  avatar?: string;
  phone?: string;
  location?: string;
}

interface PayrollItem {
  id: string;
  employeeId: string;
  employee: Employee;
  baseSalary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    education: number;
    others: number;
  };
  bonuses: {
    performance: number;
    attendance: number;
    project: number;
    holiday: number;
    other: number;
  };
  deductions: {
    tax: number;
    pension: number;
    insurance: number;
    loan: number;
    other: number;
  };
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  leave: {
    taken: number;
    remaining: number;
    unpaid: number;
  };
  netPay: number;
  grossPay: number;
  payPeriod: {
    start: string;
    end: string;
  };
  status: "Draft" | "Pending" | "Processing" | "Approved" | "Rejected" | "Paid";
  submittedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  paymentDate?: string;
  paymentMethod: "Bank Transfer" | "Check" | "Cash" | "Wire Transfer";
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  notes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  attachments?: string[];
  history: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
}

interface PayrollSummary {
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalBonuses: number;
  averageSalary: number;
  departments: {
    name: string;
    count: number;
    totalPay: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    amount: number;
  }[];
}

export default function PayrollApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [selectedPeriod] = useState("March 2026");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Sample employees data
  const employees: Employee[] = [
    {
      id: "emp1",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      department: "Engineering",
      position: "Senior Developer",
      joinDate: "2020-03-15",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
    },
    {
      id: "emp2",
      name: "Michael Chen",
      email: "michael.c@company.com",
      department: "Engineering",
      position: "Team Lead",
      joinDate: "2019-06-20",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
    },
    {
      id: "emp3",
      name: "Emily Rodriguez",
      email: "emily.r@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      joinDate: "2021-01-10",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
    },
    {
      id: "emp4",
      name: "David Kim",
      email: "david.k@company.com",
      department: "Sales",
      position: "Sales Executive",
      joinDate: "2022-07-05",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
    },
    {
      id: "emp5",
      name: "Lisa Thompson",
      email: "lisa.t@company.com",
      department: "HR",
      position: "HR Coordinator",
      joinDate: "2021-09-12",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
    },
    {
      id: "emp6",
      name: "James Wilson",
      email: "james.w@company.com",
      department: "Finance",
      position: "Accountant",
      joinDate: "2020-11-03",
      phone: "+1 (555) 678-9012",
      location: "Boston, MA",
    },
    {
      id: "emp7",
      name: "Maria Garcia",
      email: "maria.g@company.com",
      department: "Design",
      position: "UI/UX Designer",
      joinDate: "2022-02-28",
      phone: "+1 (555) 789-0123",
      location: "Los Angeles, CA",
    },
    {
      id: "emp8",
      name: "Robert Taylor",
      email: "robert.t@company.com",
      department: "Operations",
      position: "Operations Manager",
      joinDate: "2018-08-14",
      phone: "+1 (555) 890-1234",
      location: "Denver, CO",
    },
  ];

  // Generate payroll records
  const generatePayrollRecords = (): PayrollItem[] => {
    return employees.map((emp, index) => {
      const baseSalary = [7500, 8500, 6200, 5500, 4800, 6000, 5800, 7200][index % 8];
      const housing = baseSalary * 0.2;
      const transport = baseSalary * 0.08;
      const medical = baseSalary * 0.05;
      const education = baseSalary * 0.03;
      const others = baseSalary * 0.02;
      const performance = [500, 750, 300, 1200, 200, 400, 350, 600][index % 8];
      const attendance = [200, 150, 100, 250, 50, 100, 150, 200][index % 8];
      const project = [300, 400, 200, 0, 0, 250, 300, 350][index % 8];
      const holiday = [200, 200, 100, 300, 100, 150, 200, 250][index % 8];
      const tax = baseSalary * 0.15;
      const pension = baseSalary * 0.07;
      const insurance = baseSalary * 0.03;
      const loan = index % 2 === 0 ? 200 : 0;
      const otherDed = index % 3 === 0 ? 150 : 0;
      const overtimeHours = [8, 5, 3, 10, 0, 6, 4, 7][index % 8];
      const overtimeRate = baseSalary / 160 * 1.5;
      const overtimeAmount = overtimeHours * overtimeRate;

      const allowances = { housing, transport, medical, education, others };
      const bonuses = { performance, attendance, project, holiday, other: 0 };
      const deductions = { tax, pension, insurance, loan, other: otherDed };
      const grossPay = baseSalary + Object.values(allowances).reduce((a, b) => a + b, 0) +
        Object.values(bonuses).reduce((a, b) => a + b, 0) + overtimeAmount;
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const netPay = grossPay - totalDeductions;

      const statuses: PayrollItem["status"][] = [
        "Pending", "Pending", "Approved", "Processing",
        "Rejected", "Pending", "Draft", "Approved"
      ];
      const paymentMethods: PayrollItem["paymentMethod"][] = [
        "Bank Transfer", "Bank Transfer", "Check", "Wire Transfer",
        "Bank Transfer", "Bank Transfer", "Bank Transfer", "Check"
      ];

      return {
        id: `pay${String(index + 1).padStart(3, '0')}`,
        employeeId: emp.id,
        employee: emp,
        baseSalary,
        allowances,
        bonuses,
        deductions,
        overtime: {
          hours: overtimeHours,
          rate: overtimeRate,
          amount: overtimeAmount,
        },
        leave: {
          taken: Math.floor(Math.random() * 5),
          remaining: 15 - Math.floor(Math.random() * 5),
          unpaid: Math.floor(Math.random() * 2),
        },
        netPay,
        grossPay,
        payPeriod: {
          start: "2026-03-01",
          end: "2026-03-31",
        },
        status: statuses[index % statuses.length],
        submittedDate: `2026-03-${String(28 - index % 5).padStart(2, '0')}T10:00:00`,
        approvedDate: statuses[index % statuses.length] === "Approved" ? `2026-03-${String(29 - index % 3).padStart(2, '0')}T14:30:00` : undefined,
        approvedBy: statuses[index % statuses.length] === "Approved" ? "John Manager" : undefined,
        paymentDate: statuses[index % statuses.length] === "Approved" ? `2026-04-${String(1 + index % 3).padStart(2, '0')}T09:00:00` : undefined,
        paymentMethod: paymentMethods[index % paymentMethods.length],
        bankDetails: {
          accountName: emp.name,
          accountNumber: `****${String(1000 + index * 111).slice(-4)}`,
          bankName: ["Chase Bank", "Bank of America", "Wells Fargo", "HSBC", "Silicon Valley Bank", "Citi Bank", "US Bank", "PNC"][index % 8],
          routingNumber: `021${String(100000 + index * 11111).slice(0, 6)}`,
        },
        notes: index % 3 === 0 ? "Special consideration for performance bonus" : undefined,
        reviewedBy: index % 2 === 0 ? "HR Manager" : undefined,
        reviewDate: index % 2 === 0 ? `2026-03-${String(27 - index % 4).padStart(2, '0')}T11:00:00` : undefined,
        history: [
          {
            action: "Created",
            date: `2026-03-${String(28 - index % 5).padStart(2, '0')}T10:00:00`,
            user: "System",
          },
          ...(statuses[index % statuses.length] !== "Draft" ? [{
            action: "Submitted",
            date: `2026-03-${String(29 - index % 4).padStart(2, '0')}T10:30:00`,
            user: emp.name,
          }] : []),
          ...(statuses[index % statuses.length] === "Approved" ? [{
            action: "Approved",
            date: `2026-03-${String(30 - index % 3).padStart(2, '0')}T14:30:00`,
            user: "John Manager",
            note: "Approved with standard deductions",
          }] : []),
        ],
      };
    });
  };

  const [payrollData, setPayrollData] = useState<PayrollItem[]>(generatePayrollRecords());

  // Calculate summary statistics
  const getSummary = (): PayrollSummary => {
    const totalEmployees = payrollData.length;
    const totalGrossPay = payrollData.reduce((sum, r) => sum + r.grossPay, 0);
    const totalNetPay = payrollData.reduce((sum, r) => sum + r.netPay, 0);
    const totalDeductions = payrollData.reduce((sum, r) => sum + Object.values(r.deductions).reduce((a, b) => a + b, 0), 0);
    const totalBonuses = payrollData.reduce((sum, r) => sum + Object.values(r.bonuses).reduce((a, b) => a + b, 0), 0);
    const averageSalary = totalGrossPay / totalEmployees;

    const deptMap = new Map<string, { count: number; totalPay: number }>();
    payrollData.forEach(r => {
      const dept = r.employee.department;
      if (deptMap.has(dept)) {
        const existing = deptMap.get(dept)!;
        deptMap.set(dept, { count: existing.count + 1, totalPay: existing.totalPay + r.netPay });
      } else {
        deptMap.set(dept, { count: 1, totalPay: r.netPay });
      }
    });

    const departments = Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      totalPay: data.totalPay,
    }));

    const statusMap = new Map<string, { count: number; amount: number }>();
    payrollData.forEach(r => {
      if (statusMap.has(r.status)) {
        const existing = statusMap.get(r.status)!;
        statusMap.set(r.status, { count: existing.count + 1, amount: existing.amount + r.netPay });
      } else {
        statusMap.set(r.status, { count: 1, amount: r.netPay });
      }
    });

    const statusBreakdown = Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      amount: data.amount,
    }));

    return {
      totalEmployees,
      totalGrossPay,
      totalNetPay,
      totalDeductions,
      totalBonuses,
      averageSalary,
      departments,
      statusBreakdown,
    };
  };

  const summary = getSummary();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Paid":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "Draft":
        return <Edit className="w-4 h-4" />;
      default:
        return null;
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const departments = ["All", ...new Set(payrollData.map((r) => r.employee.department))];

  const filteredRecords = payrollData.filter((record) => {
    const matchesSearch = record.employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      record.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || record.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "All" || record.employee.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Sort records
  const sortedRecords = [...filteredRecords];
  if (sortConfig) {
    sortedRecords.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      switch (sortConfig.key) {
        case "name":
          aVal = a.employee.name;
          bVal = b.employee.name;
          break;
        case "department":
          aVal = a.employee.department;
          bVal = b.employee.department;
          break;
        case "grossPay":
          aVal = a.grossPay;
          bVal = b.grossPay;
          break;
        case "netPay":
          aVal = a.netPay;
          bVal = b.netPay;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a[sortConfig.key as keyof PayrollItem];
          bVal = b[sortConfig.key as keyof PayrollItem];
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleApprove = (id: string) => {
    setSelectedForAction(id);
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = (approved: boolean) => {
    if (selectedForAction) {
      setPayrollData(prev =>
        prev.map(record =>
          record.id === selectedForAction
            ? {
                ...record,
                status: approved ? "Approved" : "Rejected",
                approvedDate: approved ? new Date().toISOString() : undefined,
                approvedBy: approved ? "Current User" : undefined,
                history: [
                  ...record.history,
                  {
                    action: approved ? "Approved" : "Rejected",
                    date: new Date().toISOString(),
                    user: "Current User",
                    note: approvalNote || undefined,
                  },
                ],
              }
            : record
        )
      );
      setShowApprovalModal(false);
      setApprovalNote("");
      setSelectedForAction(null);
    }
  };

  const getStatusCount = (status: string) => {
    return payrollData.filter(r => r.status === status).length;
  };

  // Selected record for detail view
  const selectedRecordData = payrollData.find(r => r.id === selectedRecord);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payroll Approval</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {selectedPeriod}
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Review and manage employee payroll for the current period
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-4 h-4" />
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
              <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                <Send className="w-4 h-4" />
                Process Payroll
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {summary.totalEmployees}
                </p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {summary.departments.length} departments
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Gross Pay</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.totalGrossPay)}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>↑ 8.5% from last period</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Net Pay</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.totalNetPay)}
                </p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              After all deductions
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {getStatusCount("Pending")}
                </p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Requires your review</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {getStatusCount("Approved")}
                </p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Ready for processing</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
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
                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Paid">Paid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
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

        {/* Main Content */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Employee
                        {sortConfig?.key === "name" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-1">
                        Department
                        {sortConfig?.key === "department" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("grossPay")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Gross Pay
                        {sortConfig?.key === "grossPay" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("netPay")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Net Pay
                        {sortConfig?.key === "netPay" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Status
                        {sortConfig?.key === "status" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="w-14 h-14 text-slate-300" />
                          <p className="text-lg font-medium">No payroll records found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => setSelectedRecord(record.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                              {record.employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {record.employee.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {record.employee.position}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {record.employee.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                          {formatCurrency(record.grossPay)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-bold text-blue-600">
                            {formatCurrency(record.netPay)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(record.id);
                                setViewMode("detail");
                              }}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {record.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(record.id);
                                  }}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(record.id);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
              <p className="text-sm text-slate-600">
                Showing <span className="font-medium">{sortedRecords.length}</span> of{" "}
                <span className="font-medium">{payrollData.length}</span> records
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
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
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedRecords.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-14 h-14 text-slate-300" />
                  <p className="text-lg font-medium text-slate-600">
                    No payroll records found
                  </p>
                </div>
              </div>
            ) : (
              sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                        {record.employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.employee.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {record.employee.position}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="font-medium text-slate-900 text-sm">
                        {record.employee.department}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Gross Pay</p>
                      <p className="font-medium text-slate-900 text-sm">
                        {formatCurrency(record.grossPay)}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                      <p className="text-xs text-slate-500">Net Pay</p>
                      <p className="font-bold text-blue-600 text-lg">
                        {formatCurrency(record.netPay)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(record.submittedDate)}</span>
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
                      {record.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(record.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(record.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Detail View
          selectedRecordData && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode("table")}
                    className="p-2 hover:bg-white rounded-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Payroll Detail
                  </h2>
                  <span className="text-sm text-slate-500">
                    #{selectedRecordData.id}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedRecordData.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(selectedRecordData.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(selectedRecordData.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl shadow-sm">
                    {selectedRecordData.employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedRecordData.employee.name}
                    </h3>
                    <p className="text-slate-600">
                      {selectedRecordData.employee.position} •{" "}
                      {selectedRecordData.employee.department}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span>{selectedRecordData.employee.email}</span>
                      <span>•</span>
                      <span>{selectedRecordData.employee.phone}</span>
                      <span>•</span>
                      <span>Joined {formatDate(selectedRecordData.employee.joinDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Earnings */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Earnings
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Base Salary</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Housing Allowance</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.allowances.housing)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Transport Allowance</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.allowances.transport)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Medical Allowance</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.allowances.medical)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Education Allowance</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.allowances.education)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Overtime ({selectedRecordData.overtime.hours}h)</span>
                        <span className="font-medium">{formatCurrency(selectedRecordData.overtime.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                        <span className="text-slate-900">Total Gross Pay</span>
                        <span className="text-slate-900">{formatCurrency(selectedRecordData.grossPay)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bonuses & Deductions */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      Bonuses & Deductions
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700 mb-1">Bonuses</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Performance Bonus</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedRecordData.bonuses.performance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Attendance Bonus</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedRecordData.bonuses.attendance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Project Bonus</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedRecordData.bonuses.project)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Holiday Bonus</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedRecordData.bonuses.holiday)}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mt-3 mb-1">Deductions</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedRecordData.deductions.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Pension</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedRecordData.deductions.pension)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Insurance</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedRecordData.deductions.insurance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Loan</span>
                        <span className="font-medium text-red-600">{formatCurrency(selectedRecordData.deductions.loan)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                        <span className="text-slate-900">Net Pay</span>
                        <span className="text-blue-600">{formatCurrency(selectedRecordData.netPay)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Payment Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Status</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            selectedRecordData.status
                          )}`}
                        >
                          {getStatusIcon(selectedRecordData.status)}
                          {selectedRecordData.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Payment Method</span>
                        <span className="font-medium">{selectedRecordData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Bank</span>
                        <span className="font-medium">{selectedRecordData.bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Account</span>
                        <span className="font-medium">{selectedRecordData.bankDetails.accountNumber}</span>
                      </div>
                      {selectedRecordData.approvedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Approved</span>
                          <span className="font-medium">{formatDateTime(selectedRecordData.approvedDate)}</span>
                        </div>
                      )}
                      {selectedRecordData.approvedBy && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Approved By</span>
                          <span className="font-medium">{selectedRecordData.approvedBy}</span>
                        </div>
                      )}
                      {selectedRecordData.paymentDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Payment Date</span>
                          <span className="font-medium">{formatDate(selectedRecordData.paymentDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* History Timeline */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    History
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
                            <span className="text-sm text-slate-500">{formatDateTime(item.date)}</span>
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
          )
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Generate Report</p>
              <p className="text-xs text-slate-500">Export payroll summary</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Send Reminders</p>
              <p className="text-xs text-slate-500">Notify pending approvals</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Configure</p>
              <p className="text-xs text-slate-500">Payroll settings</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">View guides</p>
            </div>
          </button>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedForAction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Confirm Action</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Please review the payroll details before approving or rejecting.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Employee</span>
                    <span className="font-medium">
                      {payrollData.find(r => r.id === selectedForAction)?.employee.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Net Pay</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(payrollData.find(r => r.id === selectedForAction)?.netPay || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className="font-medium">Pending</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Add any notes or comments..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmApproval(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleConfirmApproval(true)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

