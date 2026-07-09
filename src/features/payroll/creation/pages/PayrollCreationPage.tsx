import { useState, useEffect } from "react";
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
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary: number;
  hourlyRate?: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  taxInfo: {
    ssn: string;
    filingStatus: string;
    allowances: number;
  };
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
  attendance: {
    present: number;
    absent: number;
    late: number;
    overtime: number;
  };
}

interface PayrollRun {
  id: string;
  name: string;
  period: {
    start: string;
    end: string;
  };
  paymentDate: string;
  status: "Draft" | "In Progress" | "Ready for Review" | "Approved" | "Completed" | "Cancelled";
  employees: string[];
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalBonuses: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

interface PayrollTemplate {
  id: string;
  name: string;
  description: string;
  frequency: "Monthly" | "Bi-weekly" | "Weekly" | "Semi-monthly";
  defaultAllowances: {
    housing: number;
    transport: number;
    medical: number;
  };
  defaultDeductions: {
    tax: number;
    pension: number;
    insurance: number;
  };
  isActive: boolean;
}

interface EmployeePayrollData {
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
  adjustments: {
    type: "Add" | "Subtract";
    reason: string;
    amount: number;
  }[];
  grossPay: number;
  netPay: number;
  status: "Pending" | "Calculated" | "Verified" | "Error";
  notes?: string;
}

export default function PayrollCreationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPayrollRun, setSelectedPayrollRun] = useState<string | null>(null);
  const [payrollData, setPayrollData] = useState<EmployeePayrollData[]>([]);
  const [runName, setRunName] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);

  // Sample employees data
  const employees: Employee[] = [
    {
      id: "emp1",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      department: "Engineering",
      position: "Senior Developer",
      joinDate: "2020-03-15",
      employmentType: "Full-time",
      salary: 7500,
      bankDetails: {
        accountName: "Sarah Johnson",
        accountNumber: "****4567",
        bankName: "Chase Bank",
        routingNumber: "021000021",
      },
      taxInfo: {
        ssn: "***-**-1234",
        filingStatus: "Single",
        allowances: 2,
      },
      leaveBalance: { annual: 15, sick: 10, personal: 3 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 8 },
    },
    {
      id: "emp2",
      name: "Michael Chen",
      email: "michael.c@company.com",
      department: "Engineering",
      position: "Team Lead",
      joinDate: "2019-06-20",
      employmentType: "Full-time",
      salary: 8500,
      bankDetails: {
        accountName: "Michael Chen",
        accountNumber: "****8901",
        bankName: "Bank of America",
        routingNumber: "026009593",
      },
      taxInfo: {
        ssn: "***-**-2345",
        filingStatus: "Married",
        allowances: 3,
      },
      leaveBalance: { annual: 18, sick: 12, personal: 5 },
      attendance: { present: 21, absent: 1, late: 1, overtime: 5 },
    },
    {
      id: "emp3",
      name: "Emily Rodriguez",
      email: "emily.r@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      joinDate: "2021-01-10",
      employmentType: "Full-time",
      salary: 6200,
      bankDetails: {
        accountName: "Emily Rodriguez",
        accountNumber: "****2345",
        bankName: "Wells Fargo",
        routingNumber: "121000248",
      },
      taxInfo: {
        ssn: "***-**-3456",
        filingStatus: "Single",
        allowances: 1,
      },
      leaveBalance: { annual: 12, sick: 8, personal: 2 },
      attendance: { present: 20, absent: 0, late: 2, overtime: 3 },
    },
    {
      id: "emp4",
      name: "David Kim",
      email: "david.k@company.com",
      department: "Sales",
      position: "Sales Executive",
      joinDate: "2022-07-05",
      employmentType: "Full-time",
      salary: 5500,
      bankDetails: {
        accountName: "David Kim",
        accountNumber: "****6789",
        bankName: "HSBC",
        routingNumber: "021001088",
      },
      taxInfo: {
        ssn: "***-**-4567",
        filingStatus: "Married",
        allowances: 2,
      },
      leaveBalance: { annual: 10, sick: 6, personal: 1 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 10 },
    },
    {
      id: "emp5",
      name: "Lisa Thompson",
      email: "lisa.t@company.com",
      department: "HR",
      position: "HR Coordinator",
      joinDate: "2021-09-12",
      employmentType: "Full-time",
      salary: 4800,
      bankDetails: {
        accountName: "Lisa Thompson",
        accountNumber: "****0123",
        bankName: "Citi Bank",
        routingNumber: "021000089",
      },
      taxInfo: {
        ssn: "***-**-5678",
        filingStatus: "Single",
        allowances: 1,
      },
      leaveBalance: { annual: 14, sick: 9, personal: 3 },
      attendance: { present: 19, absent: 2, late: 1, overtime: 0 },
    },
    {
      id: "emp6",
      name: "James Wilson",
      email: "james.w@company.com",
      department: "Finance",
      position: "Accountant",
      joinDate: "2020-11-03",
      employmentType: "Full-time",
      salary: 6000,
      bankDetails: {
        accountName: "James Wilson",
        accountNumber: "****4567",
        bankName: "US Bank",
        routingNumber: "091000022",
      },
      taxInfo: {
        ssn: "***-**-6789",
        filingStatus: "Married",
        allowances: 2,
      },
      leaveBalance: { annual: 16, sick: 11, personal: 4 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 6 },
    },
    {
      id: "emp7",
      name: "Maria Garcia",
      email: "maria.g@company.com",
      department: "Design",
      position: "UI/UX Designer",
      joinDate: "2022-02-28",
      employmentType: "Full-time",
      salary: 5800,
      bankDetails: {
        accountName: "Maria Garcia",
        accountNumber: "****7890",
        bankName: "PNC Bank",
        routingNumber: "043000096",
      },
      taxInfo: {
        ssn: "***-**-7890",
        filingStatus: "Single",
        allowances: 1,
      },
      leaveBalance: { annual: 11, sick: 7, personal: 2 },
      attendance: { present: 20, absent: 1, late: 1, overtime: 4 },
    },
    {
      id: "emp8",
      name: "Robert Taylor",
      email: "robert.t@company.com",
      department: "Operations",
      position: "Operations Manager",
      joinDate: "2018-08-14",
      employmentType: "Full-time",
      salary: 7200,
      bankDetails: {
        accountName: "Robert Taylor",
        accountNumber: "****9012",
        bankName: "Silicon Valley Bank",
        routingNumber: "121140399",
      },
      taxInfo: {
        ssn: "***-**-8901",
        filingStatus: "Married",
        allowances: 3,
      },
      leaveBalance: { annual: 20, sick: 15, personal: 5 },
      attendance: { present: 21, absent: 0, late: 0, overtime: 7 },
    },
  ];

  // Sample payroll templates
  const templates: PayrollTemplate[] = [
    {
      id: "t1",
      name: "Standard Monthly",
      description: "Default monthly payroll template with standard allowances",
      frequency: "Monthly",
      defaultAllowances: {
        housing: 0.2,
        transport: 0.08,
        medical: 0.05,
      },
      defaultDeductions: {
        tax: 0.15,
        pension: 0.07,
        insurance: 0.03,
      },
      isActive: true,
    },
    {
      id: "t2",
      name: "Executive Package",
      description: "Enhanced benefits for executive employees",
      frequency: "Monthly",
      defaultAllowances: {
        housing: 0.25,
        transport: 0.1,
        medical: 0.08,
      },
      defaultDeductions: {
        tax: 0.18,
        pension: 0.08,
        insurance: 0.04,
      },
      isActive: true,
    },
    {
      id: "t3",
      name: "Contractor Base",
      description: "Simple template for contract workers",
      frequency: "Bi-weekly",
      defaultAllowances: {
        housing: 0,
        transport: 0,
        medical: 0,
      },
      defaultDeductions: {
        tax: 0.12,
        pension: 0,
        insurance: 0,
      },
      isActive: false,
    },
  ];

  // Sample payroll runs
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([
    {
      id: "pr1",
      name: "March 2026 Payroll",
      period: {
        start: "2026-03-01",
        end: "2026-03-31",
      },
      paymentDate: "2026-04-05",
      status: "Completed",
      employees: ["emp1", "emp2", "emp3", "emp4", "emp5", "emp6", "emp7", "emp8"],
      totalGross: 54300,
      totalNet: 45600,
      totalDeductions: 8700,
      totalBonuses: 5200,
      createdBy: "HR Admin",
      createdAt: "2026-03-25T10:00:00",
      updatedAt: "2026-03-28T14:30:00",
      approvedBy: "Finance Manager",
      approvedAt: "2026-03-28T14:30:00",
    },
    {
      id: "pr2",
      name: "February 2026 Payroll",
      period: {
        start: "2026-02-01",
        end: "2026-02-28",
      },
      paymentDate: "2026-03-05",
      status: "Completed",
      employees: ["emp1", "emp2", "emp3", "emp4", "emp5", "emp6", "emp7", "emp8"],
      totalGross: 52800,
      totalNet: 44300,
      totalDeductions: 8500,
      totalBonuses: 4800,
      createdBy: "HR Admin",
      createdAt: "2026-02-25T09:00:00",
      updatedAt: "2026-02-28T16:00:00",
      approvedBy: "Finance Manager",
      approvedAt: "2026-02-28T16:00:00",
    },
  ]);

  // Calculate employee payroll data
  const calculatePayrollData = (employeeIds: string[]): EmployeePayrollData[] => {
    return employeeIds.map(id => {
      const emp = employees.find(e => e.id === id)!;
      const baseSalary = emp.salary;
      const housing = baseSalary * 0.2;
      const transport = baseSalary * 0.08;
      const medical = baseSalary * 0.05;
      const education = baseSalary * 0.03;
      const others = baseSalary * 0.02;
      const performance = baseSalary * 0.1;
      const attendance = 200;
      const project = 300;
      const holiday = 150;
      const tax = baseSalary * 0.15;
      const pension = baseSalary * 0.07;
      const insurance = baseSalary * 0.03;
      const loan = id === "emp2" ? 200 : 0;
      const overtimeHours = emp.attendance.overtime;
      const overtimeRate = (baseSalary / 160) * 1.5;
      const overtimeAmount = overtimeHours * overtimeRate;

      const allowances = { housing, transport, medical, education, others };
      const bonuses = { performance, attendance, project, holiday, other: 0 };
      const deductions = { tax, pension, insurance, loan, other: 0 };
      const grossPay = baseSalary + Object.values(allowances).reduce((a, b) => a + b, 0) +
        Object.values(bonuses).reduce((a, b) => a + b, 0) + overtimeAmount;
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const netPay = grossPay - totalDeductions;

      return {
        employeeId: id,
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
        adjustments: [],
        grossPay,
        netPay,
        status: "Calculated",
        notes: "",
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ready for Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "Ready for Review":
        return <Clock className="w-4 h-4" />;
      case "Draft":
        return <Edit className="w-4 h-4" />;
      case "Cancelled":
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

  const departments = ["All", ...new Set(employees.map(e => e.department))];
  const statuses = ["All", "Draft", "In Progress", "Ready for Review", "Approved", "Completed", "Cancelled"];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const selectedEmployeesData = employees.filter(emp => selectedEmployees.includes(emp.id));

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  const handleToggleEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleCreatePayroll = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    if (!runName || !paymentDate || !periodStart || !periodEnd) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRun: PayrollRun = {
      id: `pr${payrollRuns.length + 1}`,
      name: runName,
      period: {
        start: periodStart,
        end: periodEnd,
      },
      paymentDate: paymentDate,
      status: "Draft",
      employees: selectedEmployees,
      totalGross: 0,
      totalNet: 0,
      totalDeductions: 0,
      totalBonuses: 0,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes,
    };

    setPayrollRuns([newRun, ...payrollRuns]);
    const calculatedData = calculatePayrollData(selectedEmployees);
    setPayrollData(calculatedData);
    setShowConfirmationModal(true);
    setCurrentStep(2);
  };

  const handleDeletePayrollRun = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payroll run?")) {
      setPayrollRuns(prev => prev.filter(run => run.id !== id));
    }
  };

  const handleDuplicatePayrollRun = (id: string) => {
    const run = payrollRuns.find(r => r.id === id);
    if (run) {
      const newRun: PayrollRun = {
        ...run,
        id: `pr${payrollRuns.length + 1}`,
        name: `${run.name} (Copy)`,
        status: "Draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPayrollRuns([newRun, ...payrollRuns]);
    }
  };

  const getStepColor = (step: number) => {
    if (step === currentStep) return "bg-blue-600 text-white";
    if (step < currentStep) return "bg-green-600 text-white";
    return "bg-gray-200 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payroll Creation</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  New Run
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Create and manage payroll runs for your organization
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
              >
                <Plus className="w-4 h-4" />
                New Payroll Run
              </button>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${getStepColor(1)}`}>
                1
              </div>
              <span className={`text-sm font-medium ${currentStep === 1 ? "text-slate-900" : "text-slate-500"}`}>
                Select Employees
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${getStepColor(2)}`}>
                2
              </div>
              <span className={`text-sm font-medium ${currentStep === 2 ? "text-slate-900" : "text-slate-500"}`}>
                Configure Payroll
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${getStepColor(3)}`}>
                3
              </div>
              <span className={`text-sm font-medium ${currentStep === 3 ? "text-slate-900" : "text-slate-500"}`}>
                Review & Verify
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 4 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${getStepColor(4)}`}>
                4
              </div>
              <span className={`text-sm font-medium ${currentStep === 4 ? "text-slate-900" : "text-slate-500"}`}>
                Confirm & Submit
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Employees */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Select Employees for Payroll
                  </h2>
                  <p className="text-sm text-slate-500">
                    Choose employees to include in this payroll run
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {selectedEmployees.length} selected
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    {selectedEmployees.length === filteredEmployees.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="p-6">
              {viewMode === "list" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <Users className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No employees found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map(emp => (
                          <tr
                            key={emp.id}
                            className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                              selectedEmployees.includes(emp.id) ? "bg-green-50/50" : ""
                            }`}
                            onClick={() => handleToggleEmployee(emp.id)}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(emp.id)}
                                onChange={() => handleToggleEmployee(emp.id)}
                                className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                                  {emp.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{emp.name}</p>
                                  <p className="text-sm text-slate-500">{emp.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                {emp.department}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {emp.position}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(emp.employmentType)}`}>
                                {emp.employmentType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900">
                              {formatCurrency(emp.salary)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map(emp => (
                    <div
                      key={emp.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedEmployees.includes(emp.id)
                          ? "border-green-500 bg-green-50/50 shadow-md"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handleToggleEmployee(emp.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                            {emp.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{emp.name}</h3>
                            <p className="text-sm text-slate-500">{emp.position}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={() => handleToggleEmployee(emp.id)}
                          className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="w-4 h-4" />
                        <span>{emp.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{emp.employmentType}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between">
                        <span className="text-sm text-slate-500">Salary</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(emp.salary)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">{selectedEmployees.length}</span> employees selected
              </p>
              <button
                onClick={() => {
                  if (selectedEmployees.length > 0) {
                    setCurrentStep(2);
                  } else {
                    alert("Please select at least one employee.");
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
              >
                <ArrowUpRight className="w-4 h-4" />
                Continue to Configuration
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Configure Payroll */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Run Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                Payroll Run Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Run Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={runName}
                    onChange={(e) => setRunName(e.target.value)}
                    placeholder="e.g., March 2026 Payroll"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a template...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or special instructions..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Employee Payroll Data Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-600" />
                    Employee Payroll Data
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      ({selectedEmployees.length} employees)
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const data = calculatePayrollData(selectedEmployees);
                        setPayrollData(data);
                      }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-all flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Recalculate
                    </button>
                    <button
                      onClick={() => setShowEmployeeModal(true)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-all flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit Values
                    </button>
                  </div>
                </div>
              </div>

              {payrollData.length > 0 ? (
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Employee</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Base Salary</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Allowances</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Bonuses</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Overtime</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Deductions</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Gross Pay</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Net Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrollData.map(data => (
                        <tr key={data.employeeId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                                {data.employee.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 text-sm">{data.employee.name}</p>
                                <p className="text-xs text-slate-500">{data.employee.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            {formatCurrency(data.baseSalary)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-600">
                            {formatCurrency(Object.values(data.allowances).reduce((a, b) => a + b, 0))}
                          </td>
                          <td className="px-4 py-3 text-right text-green-600">
                            {formatCurrency(Object.values(data.bonuses).reduce((a, b) => a + b, 0))}
                          </td>
                          <td className="px-4 py-3 text-right text-blue-600">
                            {formatCurrency(data.overtime.amount)}
                          </td>
                          <td className="px-4 py-3 text-right text-red-600">
                            {formatCurrency(Object.values(data.deductions).reduce((a, b) => a + b, 0))}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900">
                            {formatCurrency(data.grossPay)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">
                            {formatCurrency(data.netPay)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-14 h-14 text-slate-300" />
                    <p className="text-lg font-medium">No payroll data calculated</p>
                    <p className="text-sm">Click "Recalculate" to generate payroll data</p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Employees</p>
                    <p className="text-lg font-bold text-slate-900">{selectedEmployees.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Gross</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(payrollData.reduce((sum, d) => sum + d.grossPay, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Net</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(payrollData.reduce((sum, d) => sum + d.netPay, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Deductions</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(payrollData.reduce((sum, d) => sum + Object.values(d.deductions).reduce((a, b) => a + b, 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (payrollData.length > 0) {
                      setCurrentStep(3);
                    } else {
                      alert("Please calculate payroll data first.");
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  Review & Verify
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Verify */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Review & Verify</h3>
                  <p className="text-sm text-slate-500">
                    Please review all payroll details before submission
                  </p>
                </div>
              </div>

              {/* Run Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Run Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name</span>
                      <span className="font-medium">{runName || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Period</span>
                      <span className="font-medium">
                        {periodStart && periodEnd ? `${formatDate(periodStart)} - ${formatDate(periodEnd)}` : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payment Date</span>
                      <span className="font-medium">{paymentDate ? formatDate(paymentDate) : "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Template</span>
                      <span className="font-medium">{selectedTemplate || "None selected"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Financial Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Employees</span>
                      <span className="font-medium">{selectedEmployees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Gross Pay</span>
                      <span className="font-medium">
                        {formatCurrency(payrollData.reduce((sum, d) => sum + d.grossPay, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Net Pay</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(payrollData.reduce((sum, d) => sum + d.netPay, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Bonuses</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(payrollData.reduce((sum, d) => sum + Object.values(d.bonuses).reduce((a, b) => a + b, 0), 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Deductions</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(payrollData.reduce((sum, d) => sum + Object.values(d.deductions).reduce((a, b) => a + b, 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee List for Review */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-sm">Employee Details</h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {payrollData.map(data => (
                    <div key={data.employeeId} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                          {data.employee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{data.employee.name}</p>
                          <p className="text-xs text-slate-500">{data.employee.position} • {data.employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600">Gross: {formatCurrency(data.grossPay)}</span>
                        <span className="font-bold text-green-600">Net: {formatCurrency(data.netPay)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Configuration
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to save this as a draft?")) {
                      alert("Payroll saved as draft!");
                      setCurrentStep(1);
                    }
                  }}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  <Send className="w-4 h-4" />
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Payroll Submitted Successfully!
              </h2>
              <p className="text-slate-600 mb-6">
                Your payroll run "{runName}" has been submitted for approval.
                You will be notified once it's reviewed.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Run Name</span>
                    <span className="font-medium">{runName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employees</span>
                    <span className="font-medium">{selectedEmployees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Net Pay</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(payrollData.reduce((sum, d) => sum + d.netPay, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      Pending Approval
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setRunName("");
                    setSelectedEmployees([]);
                    setPayrollData([]);
                    setPeriodStart("");
                    setPeriodEnd("");
                    setPaymentDate("");
                    setNotes("");
                  }}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Another Run
                </button>
                <button
                  onClick={() => window.location.href = "/payroll/approval"}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <Eye className="w-4 h-4" />
                  View Approval Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Payroll Templates</h3>
                  <p className="text-sm text-slate-500">Manage and create payroll templates</p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="border border-slate-200 rounded-xl p-4 hover:border-green-300 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${template.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {template.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>Frequency: {template.frequency}</p>
                      <p>Housing: {(template.defaultAllowances.housing * 100).toFixed(0)}%</p>
                      <p>Tax: {(template.defaultDeductions.tax * 100).toFixed(0)}%</p>
                    </div>
                    <button className="mt-3 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Payroll Runs */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Recent Payroll Runs</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {payrollRuns.length}
              </span>
            </div>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {payrollRuns.map(run => (
              <div key={run.id} className="px-6 py-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{run.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{formatDate(run.period.start)} - {formatDate(run.period.end)}</span>
                        <span>•</span>
                        <span>{run.employees.length} employees</span>
                        <span>•</span>
                        <span>Payment: {formatDate(run.paymentDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(run.totalNet)}</p>
                      <p className="text-xs text-slate-500">Net Pay</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(run.status)}`}>
                      {getStatusIcon(run.status)}
                      {run.status}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicatePayrollRun(run.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePayrollRun(run.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Payroll Run Created!</h3>
                <p className="text-slate-600 mb-4">
                  Your payroll run has been successfully created and is ready for review.
                </p>
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setCurrentStep(3);
                  }}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all w-full"
                >
                  Review Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
