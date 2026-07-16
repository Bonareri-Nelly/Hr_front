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

// ==================== INTERFACES ====================
interface DeductionType {
  id: string;
  name: string;
  code: string;
  category: "Mandatory" | "Voluntary" | "Statutory" | "Benefit";
  description: string;
  isPercentage: boolean;
  rate: number;
  cap?: number;
  isActive: boolean;
  isPredefined: boolean;
  applicableTo: ("All" | "Full-time" | "Part-time" | "Contract" | "Intern")[];
  calculationMethod: "Percentage" | "Fixed" | "Slab";
  taxTreatment: "Pre-tax" | "Post-tax" | "Taxable";
  effectiveDate: string;
  expiryDate?: string;
  isKenyanStatutory?: boolean;
}

interface EmployeeDeduction {
  id: string;
  employeeId: string;
  deductionTypeId: string;
  amount: number;
  isFixed: boolean;
  customRate?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  isMandatory: boolean;
}

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
    nssfNumber?: string;
    nhifNumber?: string;
    kraPin?: string;
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
  deductions?: EmployeeDeduction[];
  payrollHistory?: EmployeePayrollHistory[];
}

interface EmployeePayrollHistory {
  id: string;
  employeeId: string;
  period: { start: string; end: string };
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  paymentDate: string;
  status: "Draft" | "Pending" | "Approved" | "Paid" | "Cancelled";
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

interface PayrollStats {
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalBonuses: number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
  rejectedCount: number;
  draftCount: number;
  averageSalary: number;
  departments: { name: string; count: number; totalPay: number }[];
  monthlyTrend: { month: string; totalPay: number }[];
}

// ==================== KENYAN STATUTORY DEDUCTIONS ====================
const KENYAN_STATUTORY_DEDUCTIONS: DeductionType[] = [
  {
    id: "ken1",
    name: "NSSF (National Social Security Fund)",
    code: "NSSF",
    category: "Statutory",
    description: "Kenya National Social Security Fund contribution - 6% employee, 6% employer",
    isPercentage: true,
    rate: 6,
    cap: 18000,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
    isKenyanStatutory: true,
  },
  {
    id: "ken2",
    name: "NHIF (National Hospital Insurance Fund)",
    code: "NHIF",
    category: "Statutory",
    description: "Kenya National Hospital Insurance Fund - health insurance contribution",
    isPercentage: false,
    rate: 0,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Fixed",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
    isKenyanStatutory: true,
  },
  {
    id: "ken3",
    name: "SHIF (Social Health Insurance Fund)",
    code: "SHIF",
    category: "Statutory",
    description: "Kenya Social Health Insurance Fund - new health insurance scheme",
    isPercentage: true,
    rate: 2.75,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
    isKenyanStatutory: true,
  },
  {
    id: "ken4",
    name: "Housing Levy",
    code: "HL",
    category: "Statutory",
    description: "Kenya Affordable Housing Levy - 1.5% employee, 1.5% employer",
    isPercentage: true,
    rate: 1.5,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
    isKenyanStatutory: true,
  },
  {
    id: "ken5",
    name: "PATL (Pay As You Earn Tax Levy)",
    code: "PATL",
    category: "Statutory",
    description: "Kenya PAYE tax - personal income tax based on KRA tax brackets",
    isPercentage: true,
    rate: 0,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Slab",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
    isKenyanStatutory: true,
  },
];

// ==================== PREDEFINED DEDUCTIONS ====================
const PREDEFINED_DEDUCTIONS: DeductionType[] = [
  ...KENYAN_STATUTORY_DEDUCTIONS,
  {
    id: "ded1",
    name: "Federal Income Tax",
    code: "FIT",
    category: "Statutory",
    description: "Federal income tax withholding based on IRS guidelines",
    isPercentage: true,
    rate: 15,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded2",
    name: "State Income Tax",
    code: "SIT",
    category: "Statutory",
    description: "State income tax withholding",
    isPercentage: true,
    rate: 5,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded3",
    name: "Social Security (FICA)",
    code: "SS",
    category: "Statutory",
    description: "Social Security and Medicare contributions",
    isPercentage: true,
    rate: 6.2,
    cap: 160200,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Slab",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded4",
    name: "Medicare",
    code: "MED",
    category: "Statutory",
    description: "Medicare contribution",
    isPercentage: true,
    rate: 1.45,
    cap: 200000,
    isActive: true,
    isPredefined: true,
    applicableTo: ["All"],
    calculationMethod: "Slab",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded5",
    name: "Pension Plan",
    code: "PENS",
    category: "Benefit",
    description: "Company pension plan contribution",
    isPercentage: true,
    rate: 7,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["Full-time", "Contract"],
    calculationMethod: "Percentage",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded6",
    name: "Health Insurance",
    code: "HI",
    category: "Benefit",
    description: "Health insurance premium",
    isPercentage: false,
    rate: 350,
    cap: undefined,
    isActive: true,
    isPredefined: true,
    applicableTo: ["Full-time"],
    calculationMethod: "Fixed",
    taxTreatment: "Pre-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded7",
    name: "Life Insurance",
    code: "LIFE",
    category: "Benefit",
    description: "Group life insurance",
    isPercentage: false,
    rate: 75,
    cap: undefined,
    isActive: true,
    isPredefined: false,
    applicableTo: ["All"],
    calculationMethod: "Fixed",
    taxTreatment: "Post-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded8",
    name: "Union Dues",
    code: "UNION",
    category: "Voluntary",
    description: "Labor union membership dues",
    isPercentage: false,
    rate: 50,
    cap: undefined,
    isActive: true,
    isPredefined: false,
    applicableTo: ["All"],
    calculationMethod: "Fixed",
    taxTreatment: "Post-tax",
    effectiveDate: "2024-01-01",
  },
  {
    id: "ded9",
    name: "Charitable Contributions",
    code: "CHAR",
    category: "Voluntary",
    description: "Employee charitable donations",
    isPercentage: true,
    rate: 1,
    cap: undefined,
    isActive: true,
    isPredefined: false,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Post-tax",
    effectiveDate: "2024-01-01",
  },
];

// NHIF Contribution Rates (Kenya)
const NHIF_RATES = [
  { min: 0, max: 5999, amount: 150 },
  { min: 6000, max: 7999, amount: 300 },
  { min: 8000, max: 11999, amount: 400 },
  { min: 12000, max: 14999, amount: 500 },
  { min: 15000, max: 19999, amount: 600 },
  { min: 20000, max: 24999, amount: 750 },
  { min: 25000, max: 29999, amount: 850 },
  { min: 30000, max: 34999, amount: 900 },
  { min: 35000, max: 39999, amount: 950 },
  { min: 40000, max: 44999, amount: 1000 },
  { min: 45000, max: 49999, amount: 1100 },
  { min: 50000, max: 59999, amount: 1200 },
  { min: 60000, max: 69999, amount: 1300 },
  { min: 70000, max: 79999, amount: 1400 },
  { min: 80000, max: 89999, amount: 1500 },
  { min: 90000, max: 99999, amount: 1600 },
  { min: 100000, max: Infinity, amount: 1700 },
];

// KRA PAYE Tax Brackets (Kenya)
const PAYE_BRACKETS = [
  { min: 0, max: 24000, rate: 0 },
  { min: 24001, max: 32333, rate: 25 },
  { min: 32334, max: Infinity, rate: 30 },
];

// NSSF Rates (Kenya)
const NSSF_RATES = {
  employeeRate: 6,
  employerRate: 6,
  pensionableEarningsCap: 18000,
};

export default function PayrollCreationPage() {
  // ==================== STATE ====================
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [payrollData, setPayrollData] = useState<EmployeePayrollData[]>([]);
  const [runName, setRunName] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<"Kenya" | "US">("Kenya");

  // View All Payroll Runs
  const [showAllPayrollRuns, setShowAllPayrollRuns] = useState(false);
  const [selectedPayrollRunDetail, setSelectedPayrollRunDetail] = useState<string | null>(null);
  const [showPayrollRunDetailModal, setShowPayrollRunDetailModal] = useState(false);

  // Edit Payroll Run
  const [showEditPayrollRunModal, setShowEditPayrollRunModal] = useState(false);
  const [editingPayrollRunId, setEditingPayrollRunId] = useState<string | null>(null);
  const [editingPayrollRunData, setEditingPayrollRunData] = useState<Partial<PayrollRun>>({});

  // Edit Employee
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editingEmployeeData, setEditingEmployeeData] = useState<Partial<Employee>>({});

  // Payroll Stats
  const [payrollStats, setPayrollStats] = useState<PayrollStats | null>(null);

  // Selected employee for detailed view
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState<string | null>(null);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);

  // Bulk actions
  const [selectedForBulkAction, setSelectedForBulkAction] = useState<string[]>([]);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<"approve" | "reject" | "delete" | "export" | null>(null);

  // Deduction State
  const [showDeductionManager, setShowDeductionManager] = useState(false);
  const [showEmployeeDeductionModal, setShowEmployeeDeductionModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [deductionTypes] = useState<DeductionType[]>(PREDEFINED_DEDUCTIONS);
  const [activeDeductionTab, setActiveDeductionTab] = useState<"all" | "mandatory" | "voluntary" | "statutory">("all");
  const [editingEmployeeDeductions, setEditingEmployeeDeductions] = useState<EmployeeDeduction[]>([]);

  // Employee Admission State
  const [showAdmitEmployeeModal, setShowAdmitEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    department: "",
    position: "",
    employmentType: "Full-time",
    salary: 0,
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
    taxInfo: {
      ssn: "",
      filingStatus: "Single",
      allowances: 1,
      nssfNumber: "",
      nhifNumber: "",
      kraPin: "",
    },
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 3,
    },
    attendance: {
      present: 0,
      absent: 0,
      late: 0,
      overtime: 0,
    },
    deductions: [],
  });
  const [selectedDeductionsForNewEmployee, setSelectedDeductionsForNewEmployee] = useState<EmployeeDeduction[]>([]);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // ==================== SAMPLE EMPLOYEES ====================
  const [employees, setEmployees] = useState<Employee[]>([
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
        nssfNumber: "NSSF123456",
        nhifNumber: "NHIF789012",
        kraPin: "A123456789",
      },
      leaveBalance: { annual: 15, sick: 10, personal: 3 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 8 },
      deductions: [
        {
          id: "ed1",
          employeeId: "emp1",
          deductionTypeId: "ken1",
          amount: 450,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed2",
          employeeId: "emp1",
          deductionTypeId: "ken3",
          amount: 206.25,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed3",
          employeeId: "emp1",
          deductionTypeId: "ken4",
          amount: 112.5,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
      ],
      payrollHistory: [
        {
          id: "ph1",
          employeeId: "emp1",
          period: { start: "2026-03-01", end: "2026-03-31" },
          grossPay: 7500,
          netPay: 6731.25,
          totalDeductions: 768.75,
          paymentDate: "2026-04-05",
          status: "Paid",
          paymentMethod: "Bank Transfer",
          transactionId: "TXN123456",
        },
      ],
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
        nssfNumber: "NSSF234567",
        nhifNumber: "NHIF890123",
        kraPin: "B987654321",
      },
      leaveBalance: { annual: 18, sick: 12, personal: 5 },
      attendance: { present: 21, absent: 1, late: 1, overtime: 5 },
      deductions: [
        {
          id: "ed4",
          employeeId: "emp2",
          deductionTypeId: "ken1",
          amount: 510,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed5",
          employeeId: "emp2",
          deductionTypeId: "ken3",
          amount: 233.75,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed6",
          employeeId: "emp2",
          deductionTypeId: "ken4",
          amount: 127.5,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
      ],
      payrollHistory: [
        {
          id: "ph3",
          employeeId: "emp2",
          period: { start: "2026-03-01", end: "2026-03-31" },
          grossPay: 8500,
          netPay: 7628.75,
          totalDeductions: 871.25,
          paymentDate: "2026-04-05",
          status: "Paid",
          paymentMethod: "Bank Transfer",
          transactionId: "TXN123457",
        },
      ],
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
        nssfNumber: "NSSF345678",
        nhifNumber: "NHIF901234",
        kraPin: "C456789012",
      },
      leaveBalance: { annual: 12, sick: 8, personal: 2 },
      attendance: { present: 20, absent: 0, late: 2, overtime: 3 },
      deductions: [
        {
          id: "ed7",
          employeeId: "emp3",
          deductionTypeId: "ken1",
          amount: 372,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed8",
          employeeId: "emp3",
          deductionTypeId: "ken3",
          amount: 170.5,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
      ],
      payrollHistory: [],
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
        nssfNumber: "NSSF456789",
        nhifNumber: "NHIF012345",
        kraPin: "D567890123",
      },
      leaveBalance: { annual: 10, sick: 6, personal: 1 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 10 },
      deductions: [],
      payrollHistory: [],
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
        nssfNumber: "NSSF567890",
        nhifNumber: "NHIF123456",
        kraPin: "E678901234",
      },
      leaveBalance: { annual: 14, sick: 9, personal: 3 },
      attendance: { present: 19, absent: 2, late: 1, overtime: 0 },
      deductions: [],
      payrollHistory: [],
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
        nssfNumber: "NSSF678901",
        nhifNumber: "NHIF234567",
        kraPin: "F789012345",
      },
      leaveBalance: { annual: 16, sick: 11, personal: 4 },
      attendance: { present: 22, absent: 0, late: 0, overtime: 6 },
      deductions: [],
      payrollHistory: [],
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
        nssfNumber: "NSSF789012",
        nhifNumber: "NHIF345678",
        kraPin: "G890123456",
      },
      leaveBalance: { annual: 11, sick: 7, personal: 2 },
      attendance: { present: 20, absent: 1, late: 1, overtime: 4 },
      deductions: [],
      payrollHistory: [],
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
        nssfNumber: "NSSF890123",
        nhifNumber: "NHIF456789",
        kraPin: "H901234567",
      },
      leaveBalance: { annual: 20, sick: 15, personal: 5 },
      attendance: { present: 21, absent: 0, late: 0, overtime: 7 },
      deductions: [],
      payrollHistory: [],
    },
  ]);

  // ==================== PAYROLL RUNS ====================
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
      history: [
        {
          id: "h1",
          action: "Created",
          timestamp: "2026-03-25T10:00:00",
          user: "HR Admin",
          note: "Payroll run created",
        },
        {
          id: "h2",
          action: "Submitted",
          timestamp: "2026-03-26T09:00:00",
          user: "HR Admin",
          note: "Submitted for approval",
        },
        {
          id: "h3",
          action: "Approved",
          timestamp: "2026-03-28T14:30:00",
          user: "Finance Manager",
          note: "Approved with standard deductions",
        },
      ],
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
      history: [
        {
          id: "h4",
          action: "Created",
          timestamp: "2026-02-25T09:00:00",
          user: "HR Admin",
          note: "Payroll run created",
        },
        {
          id: "h5",
          action: "Approved",
          timestamp: "2026-02-28T16:00:00",
          user: "Finance Manager",
          note: "Approved",
        },
      ],
    },
    {
      id: "pr3",
      name: "January 2026 Payroll",
      period: {
        start: "2026-01-01",
        end: "2026-01-31",
      },
      paymentDate: "2026-02-05",
      status: "Completed",
      employees: ["emp1", "emp2", "emp3", "emp4", "emp5", "emp6", "emp7", "emp8"],
      totalGross: 51200,
      totalNet: 43100,
      totalDeductions: 8100,
      totalBonuses: 4500,
      createdBy: "HR Admin",
      createdAt: "2026-01-25T10:00:00",
      updatedAt: "2026-01-28T14:30:00",
      approvedBy: "Finance Manager",
      approvedAt: "2026-01-28T14:30:00",
      history: [
        {
          id: "h6",
          action: "Created",
          timestamp: "2026-01-25T10:00:00",
          user: "HR Admin",
          note: "Payroll run created",
        },
        {
          id: "h7",
          action: "Approved",
          timestamp: "2026-01-28T14:30:00",
          user: "Finance Manager",
          note: "Approved",
        },
      ],
    },
  ]);

  // ==================== INTERFACES ====================
  interface PayrollRun {
    id: string;
    name: string;
    period: { start: string; end: string };
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
    history?: { id: string; action: string; timestamp: string; user: string; note?: string }[];
  }

  interface PayrollTemplate {
    id: string;
    name: string;
    description: string;
    frequency: "Monthly" | "Bi-weekly" | "Weekly" | "Semi-monthly";
    defaultAllowances: { housing: number; transport: number; medical: number };
    defaultDeductions: { tax: number; pension: number; insurance: number };
    isActive: boolean;
  }

  interface EmployeePayrollData {
    employeeId: string;
    employee: Employee;
    baseSalary: number;
    allowances: { housing: number; transport: number; medical: number; education: number; others: number };
    bonuses: { performance: number; attendance: number; project: number; holiday: number; other: number };
    deductions: { tax: number; pension: number; insurance: number; loan: number; other: number };
    overtime: { hours: number; rate: number; amount: number };
    adjustments: { type: "Add" | "Subtract"; reason: string; amount: number }[];
    grossPay: number;
    netPay: number;
    status: "Pending" | "Calculated" | "Verified" | "Error";
    notes?: string;
  }

  // ==================== TEMPLATES ====================
  const templates: PayrollTemplate[] = [
    {
      id: "t1",
      name: "Standard Monthly",
      description: "Default monthly payroll template with standard allowances",
      frequency: "Monthly",
      defaultAllowances: { housing: 0.2, transport: 0.08, medical: 0.05 },
      defaultDeductions: { tax: 0.15, pension: 0.07, insurance: 0.03 },
      isActive: true,
    },
    {
      id: "t2",
      name: "Kenyan Statutory",
      description: "Payroll template with Kenyan statutory deductions (NSSF, NHIF/SHIF, Housing Levy, PAYE)",
      frequency: "Monthly",
      defaultAllowances: { housing: 0.15, transport: 0.05, medical: 0.03 },
      defaultDeductions: { tax: 0, pension: 0, insurance: 0 },
      isActive: true,
    },
  ];

  // ==================== KENYAN DEDUCTION CALCULATION FUNCTIONS ====================
  const calculateNHIF = (salary: number): number => {
    const rate = NHIF_RATES.find(r => salary >= r.min && salary <= r.max);
    return rate ? rate.amount : 1700;
  };

  const calculateNSSF = (salary: number): number => {
    const pensionableEarnings = Math.min(salary, NSSF_RATES.pensionableEarningsCap);
    return pensionableEarnings * (NSSF_RATES.employeeRate / 100);
  };

  const calculateSHIF = (salary: number): number => {
    return salary * 2.75 / 100;
  };

  const calculateHousingLevy = (salary: number): number => {
    return salary * 1.5 / 100;
  };

  const calculatePAYE = (salary: number): number => {
    const personalRelief = 2400;
    let tax = 0;
    let remainingSalary = salary;

    for (const bracket of PAYE_BRACKETS) {
      if (remainingSalary <= 0) break;
      const taxableAmount = Math.min(remainingSalary, bracket.max - bracket.min + 1);
      tax += taxableAmount * (bracket.rate / 100);
      remainingSalary -= taxableAmount;
    }

    return Math.max(0, tax - personalRelief);
  };

  const calculateKenyanDeductions = (salary: number): { [key: string]: number } => {
    return {
      NSSF: calculateNSSF(salary),
      NHIF: calculateNHIF(salary),
      SHIF: calculateSHIF(salary),
      HousingLevy: calculateHousingLevy(salary),
      PAYE: calculatePAYE(salary),
    };
  };

  // ==================== HELPER FUNCTIONS ====================
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (amount: number) => {
    const currency = selectedCountry === "Kenya" ? "KES" : "USD";
    return new Intl.NumberFormat(selectedCountry === "Kenya" ? "en-KE" : "en-US", {
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ready for Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "Ready for Review":
        return <Clock className="w-4 h-4" />;
      case "Draft":
        return <Edit className="w-4 h-4" />;
      case "Cancelled":
      case "Rejected":
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

  const getStepColor = (step: number) => {
    if (step === currentStep) return "bg-blue-600 text-white";
    if (step < currentStep) return "bg-green-600 text-white";
    return "bg-gray-200 text-gray-600";
  };

  // ==================== EMPLOYEE DEDUCTION FUNCTIONS ====================
  const getEmployeeTotalDeductions = (employeeId: string): number => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.deductions) return 0;
    return emp.deductions
      .filter(d => d.isActive)
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const handleOpenEmployeeDeductions = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const emp = employees.find(e => e.id === employeeId);
    setEditingEmployeeDeductions(emp?.deductions || []);
    setShowEmployeeDeductionModal(true);
  };

  const handleSaveEmployeeDeductions = () => {
    if (selectedEmployeeId) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === selectedEmployeeId) {
          return { ...emp, deductions: editingEmployeeDeductions };
        }
        return emp;
      }));
      showToast("Employee deductions saved successfully!", "success");
    }
    setShowEmployeeDeductionModal(false);
  };

  const handleToggleDeductionForEmployee = (deductionTypeId: string, checked: boolean) => {
    const deductionType = deductionTypes.find(d => d.id === deductionTypeId);
    if (!deductionType) return;

    setEditingEmployeeDeductions(prev => {
      const existing = prev.find(d => d.deductionTypeId === deductionTypeId);
      if (existing) {
        return prev.map(d => 
          d.deductionTypeId === deductionTypeId 
            ? { ...d, isActive: checked }
            : d
        );
      } else {
        if (checked) {
          const emp = employees.find(e => e.id === selectedEmployeeId);
          const newDeduction: EmployeeDeduction = {
            id: `ed_${Date.now()}`,
            employeeId: selectedEmployeeId!,
            deductionTypeId: deductionTypeId,
            amount: deductionType.isPercentage 
              ? (emp?.salary || 0) * (deductionType.rate / 100)
              : deductionType.rate,
            isFixed: !deductionType.isPercentage,
            startDate: new Date().toISOString().split('T')[0],
            isActive: true,
            isMandatory: deductionType.isPredefined,
          };
          return [...prev, newDeduction];
        }
        return prev;
      }
    });
  };

  const handleUpdateDeductionAmount = (deductionTypeId: string, amount: number) => {
    setEditingEmployeeDeductions(prev => 
      prev.map(d => 
        d.deductionTypeId === deductionTypeId 
          ? { ...d, amount }
          : d
      )
    );
  };

  // ==================== EMPLOYEE ADMISSION FUNCTIONS ====================
  const handleAdmitEmployee = () => {
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      employmentType: "Full-time",
      salary: 0,
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      taxInfo: {
        ssn: "",
        filingStatus: "Single",
        allowances: 1,
        nssfNumber: "",
        nhifNumber: "",
        kraPin: "",
      },
      leaveBalance: {
        annual: 15,
        sick: 10,
        personal: 3,
      },
      attendance: {
        present: 0,
        absent: 0,
        late: 0,
        overtime: 0,
      },
      deductions: [],
    });
    setSelectedDeductionsForNewEmployee([]);
    setShowAdmitEmployeeModal(true);
  };

  const handleAddDeductionToNewEmployee = (deductionTypeId: string, amount: number) => {
    const deductionType = deductionTypes.find(d => d.id === deductionTypeId);
    if (!deductionType) return;

    setSelectedDeductionsForNewEmployee(prev => {
      const existing = prev.find(d => d.deductionTypeId === deductionTypeId);
      if (existing) {
        return prev.map(d =>
          d.deductionTypeId === deductionTypeId
            ? { ...d, amount, isActive: true }
            : d
        );
      } else {
        const newDeduction: EmployeeDeduction = {
          id: `temp_${Date.now()}`,
          employeeId: "temp",
          deductionTypeId: deductionTypeId,
          amount: amount || (deductionType.isPercentage 
            ? (newEmployee.salary || 0) * (deductionType.rate / 100)
            : deductionType.rate),
          isFixed: !deductionType.isPercentage,
          startDate: new Date().toISOString().split('T')[0],
          isActive: true,
          isMandatory: deductionType.isPredefined,
          notes: deductionType.isPredefined ? "Mandatory deduction" : "Voluntary deduction",
        };
        return [...prev, newDeduction];
      }
    });
  };

  const handleRemoveDeductionFromNewEmployee = (deductionTypeId: string) => {
    setSelectedDeductionsForNewEmployee(prev => 
      prev.filter(d => d.deductionTypeId !== deductionTypeId)
    );
  };

  const handleSaveNewEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.position || !newEmployee.salary) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    let autoDeductions: EmployeeDeduction[] = [];
    if (selectedCountry === "Kenya") {
      const salary = newEmployee.salary || 0;
      const kenyanDeductions = calculateKenyanDeductions(salary);
      
      const deductionMap = [
        { typeId: "ken1", amount: kenyanDeductions.NSSF, name: "NSSF" },
        { typeId: "ken2", amount: kenyanDeductions.NHIF, name: "NHIF" },
        { typeId: "ken3", amount: kenyanDeductions.SHIF, name: "SHIF" },
        { typeId: "ken4", amount: kenyanDeductions.HousingLevy, name: "Housing Levy" },
        { typeId: "ken5", amount: kenyanDeductions.PAYE, name: "PAYE" },
      ];

      autoDeductions = deductionMap.map(({ typeId, amount, name }) => ({
        id: `ed_${Date.now()}_${typeId}`,
        employeeId: `emp${employees.length + 1}`,
        deductionTypeId: typeId,
        amount: amount,
        isFixed: typeId === "ken2",
        startDate: new Date().toISOString().split('T')[0],
        isActive: amount > 0,
        isMandatory: true,
        notes: `Auto-calculated ${name} contribution`,
      }));
    }

    const allDeductions = [...selectedDeductionsForNewEmployee, ...autoDeductions];
    
    const newEmp: Employee = {
      id: `emp${employees.length + 1}`,
      name: newEmployee.name!,
      email: newEmployee.email!,
      department: newEmployee.department!,
      position: newEmployee.position!,
      joinDate: new Date().toISOString().split('T')[0],
      employmentType: newEmployee.employmentType || "Full-time",
      salary: newEmployee.salary!,
      bankDetails: {
        accountName: newEmployee.bankDetails?.accountName || newEmployee.name!,
        accountNumber: newEmployee.bankDetails?.accountNumber || "****0000",
        bankName: newEmployee.bankDetails?.bankName || "Not Specified",
        routingNumber: newEmployee.bankDetails?.routingNumber || "",
      },
      taxInfo: {
        ssn: newEmployee.taxInfo?.ssn || "***-**-0000",
        filingStatus: newEmployee.taxInfo?.filingStatus || "Single",
        allowances: newEmployee.taxInfo?.allowances || 1,
        nssfNumber: newEmployee.taxInfo?.nssfNumber || "",
        nhifNumber: newEmployee.taxInfo?.nhifNumber || "",
        kraPin: newEmployee.taxInfo?.kraPin || "",
      },
      leaveBalance: {
        annual: newEmployee.leaveBalance?.annual || 15,
        sick: newEmployee.leaveBalance?.sick || 10,
        personal: newEmployee.leaveBalance?.personal || 3,
      },
      attendance: {
        present: 0,
        absent: 0,
        late: 0,
        overtime: 0,
      },
      deductions: allDeductions.map(d => ({
        ...d,
        employeeId: `emp${employees.length + 1}`,
        id: d.id.startsWith('temp_') ? `ed_${Date.now()}_${d.deductionTypeId}` : d.id,
      })),
      payrollHistory: [],
    };

    setEmployees(prev => [...prev, newEmp]);
    setShowAdmitEmployeeModal(false);
    
    const totalDeductions = newEmp.deductions?.filter(d => d.isActive).length || 0;
    showToast(`✅ Employee ${newEmp.name} admitted successfully with ${totalDeductions} deduction(s)!`, "success");
    
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      employmentType: "Full-time",
      salary: 0,
      bankDetails: { accountName: "", accountNumber: "", bankName: "" },
      taxInfo: { ssn: "", filingStatus: "Single", allowances: 1, nssfNumber: "", nhifNumber: "", kraPin: "" },
      leaveBalance: { annual: 15, sick: 10, personal: 3 },
      attendance: { present: 0, absent: 0, late: 0, overtime: 0 },
      deductions: [],
    });
    setSelectedDeductionsForNewEmployee([]);
  };

  // ==================== EDIT EMPLOYEE FUNCTIONS ====================
  const handleEditEmployee = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (emp) {
      setEditingEmployeeId(employeeId);
      setEditingEmployeeData({ ...emp });
      setShowEditEmployeeModal(true);
    }
  };

  const handleSaveEmployeeEdit = () => {
    if (editingEmployeeId && editingEmployeeData) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === editingEmployeeId) {
          return { ...emp, ...editingEmployeeData } as Employee;
        }
        return emp;
      }));
      showToast("Employee details updated successfully!", "success");
      setShowEditEmployeeModal(false);
      setEditingEmployeeId(null);
      setEditingEmployeeData({});
    }
  };

  // ==================== EDIT PAYROLL RUN FUNCTIONS ====================
  const handleEditPayrollRun = (runId: string) => {
    const run = payrollRuns.find(r => r.id === runId);
    if (run) {
      setEditingPayrollRunId(runId);
      setEditingPayrollRunData({ ...run });
      setShowEditPayrollRunModal(true);
    }
  };

  const handleSavePayrollRunEdit = () => {
    if (editingPayrollRunId && editingPayrollRunData) {
      setPayrollRuns(prev => prev.map(run => {
        if (run.id === editingPayrollRunId) {
          const updatedRun = { 
            ...run, 
            ...editingPayrollRunData,
            updatedAt: new Date().toISOString(),
            history: [
              ...(run.history || []),
              {
                id: `h${Date.now()}`,
                action: "Updated",
                timestamp: new Date().toISOString(),
                user: "Current User",
                note: "Payroll run details updated",
              }
            ]
          } as PayrollRun;
          return updatedRun;
        }
        return run;
      }));
      showToast("Payroll run updated successfully!", "success");
      setShowEditPayrollRunModal(false);
      setEditingPayrollRunId(null);
      setEditingPayrollRunData({});
    }
  };

  // ==================== PAYROLL CALCULATION ====================
  const calculatePayrollData = (employeeIds: string[]): EmployeePayrollData[] => {
    return employeeIds.map(id => {
      const emp = employees.find(e => e.id === id)!;
      const baseSalary = emp.salary;
      
      const empDeductions = emp.deductions || [];
      const totalEmpDeductions = empDeductions
        .filter(d => d.isActive)
        .reduce((sum, d) => sum + d.amount, 0);

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
      const deductions = { 
        tax, 
        pension, 
        insurance, 
        loan, 
        other: totalEmpDeductions 
      };
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
        notes: `Employee deductions: ${totalEmpDeductions > 0 ? formatCurrency(totalEmpDeductions) : 'None'}`,
      };
    });
  };

  // ==================== PAYROLL STATS ====================
  const calculatePayrollStats = (): PayrollStats => {
    const totalEmployees = employees.length;
    const totalGrossPay = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalDeductions = employees.reduce((sum, emp) => {
      const empDeductions = emp.deductions || [];
      return sum + empDeductions.filter(d => d.isActive).reduce((s, d) => s + d.amount, 0);
    }, 0);
    const totalNetPay = totalGrossPay - totalDeductions;
    const totalBonuses = employees.reduce((sum, emp) => sum + (emp.salary * 0.1), 0);
    const averageSalary = totalGrossPay / totalEmployees;

    const deptMap = new Map<string, { count: number; totalPay: number }>();
    employees.forEach(emp => {
      const dept = emp.department;
      if (deptMap.has(dept)) {
        const existing = deptMap.get(dept)!;
        deptMap.set(dept, { count: existing.count + 1, totalPay: existing.totalPay + emp.salary });
      } else {
        deptMap.set(dept, { count: 1, totalPay: emp.salary });
      }
    });

    const departments = Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      totalPay: data.totalPay,
    }));

    const monthlyTrend = [
      { month: "Jan", totalPay: 42000 },
      { month: "Feb", totalPay: 44300 },
      { month: "Mar", totalPay: 45600 },
    ];

    return {
      totalEmployees,
      totalGrossPay,
      totalNetPay,
      totalDeductions,
      totalBonuses,
      pendingCount: payrollData.filter(d => d.status === "Pending").length,
      approvedCount: payrollData.filter(d => d.status === "Verified").length,
      paidCount: payrollData.filter(d => d.status === "Calculated").length,
      rejectedCount: 0,
      draftCount: payrollData.filter(d => d.status === "Pending").length,
      averageSalary,
      departments,
      monthlyTrend,
    };
  };

  useEffect(() => {
    setPayrollStats(calculatePayrollStats());
  }, [employees, payrollData]);

  // Keyboard shortcut for new payroll run
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT') {
          setRunName("");
          setPaymentDate("");
          setPeriodStart("");
          setPeriodEnd("");
          setSelectedTemplate("");
          setNotes("");
          setSelectedEmployees([]);
          setPayrollData([]);
          setCurrentStep(1);
          showToast("🔄 Starting a new payroll run!", "info");
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ==================== HANDLERS ====================
  const departments = ["All", ...new Set(employees.map(e => e.department))];
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

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
      showToast("Please select at least one employee.", "error");
      return;
    }
    if (!runName || !paymentDate || !periodStart || !periodEnd) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const newRun: PayrollRun = {
      id: `pr${payrollRuns.length + 1}`,
      name: runName,
      period: { start: periodStart, end: periodEnd },
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
      history: [
        {
          id: `h${Date.now()}`,
          action: "Created",
          timestamp: new Date().toISOString(),
          user: "Current User",
          note: "Payroll run created",
        },
      ],
    };

    setPayrollRuns([newRun, ...payrollRuns]);
    const calculatedData = calculatePayrollData(selectedEmployees);
    setPayrollData(calculatedData);
    setShowConfirmationModal(true);
    setCurrentStep(2);
    showToast("Payroll run created successfully!", "success");
  };

  const handleDeletePayrollRun = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payroll run?")) {
      setPayrollRuns(prev => prev.filter(run => run.id !== id));
      showToast("Payroll run deleted!", "success");
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
        history: [
          {
            id: `h${Date.now()}`,
            action: "Duplicated",
            timestamp: new Date().toISOString(),
            user: "Current User",
            note: `Duplicated from ${run.name}`,
          },
        ],
      };
      setPayrollRuns([newRun, ...payrollRuns]);
      showToast("Payroll run duplicated!", "success");
    }
  };

  const handleOpenDeductionManager = () => {
    setShowDeductionManager(true);
  };

  const handleExportPayroll = () => {
    const data = payrollData.map(d => ({
      Employee: d.employee.name,
      Department: d.employee.department,
      Position: d.employee.position,
      "Base Salary": d.baseSalary,
      Allowances: Object.values(d.allowances).reduce((a, b) => a + b, 0),
      Bonuses: Object.values(d.bonuses).reduce((a, b) => a + b, 0),
      Overtime: d.overtime.amount,
      Deductions: Object.values(d.deductions).reduce((a, b) => a + b, 0),
      "Gross Pay": d.grossPay,
      "Net Pay": d.netPay,
    }));
    console.log("Exported Payroll Data:", data);
    showToast("Payroll data exported successfully!", "success");
  };

  const handleViewEmployeeHistory = (employeeId: string) => {
    setSelectedEmployeeDetail(employeeId);
    setShowEmployeeDetailModal(true);
  };

  const handleBulkAction = (action: "approve" | "reject" | "delete" | "export") => {
    if (selectedEmployees.length === 0) {
      showToast("Please select at least one employee.", "error");
      return;
    }
    setSelectedForBulkAction(selectedEmployees);
    setBulkActionType(action);
    setShowBulkActionModal(true);
  };

  const handleConfirmBulkAction = () => {
    if (bulkActionType === "approve") {
      showToast(`Approved ${selectedForBulkAction.length} employees!`, "success");
    } else if (bulkActionType === "reject") {
      showToast(`Rejected ${selectedForBulkAction.length} employees!`, "success");
    } else if (bulkActionType === "delete") {
      showToast(`Deleted ${selectedForBulkAction.length} employees!`, "success");
    } else if (bulkActionType === "export") {
      handleExportPayroll();
    }
    setShowBulkActionModal(false);
    setSelectedForBulkAction([]);
    setBulkActionType(null);
  };

  // ==================== VIEW ALL PAYROLL RUNS HANDLERS ====================
  const handleViewAllPayrollRuns = () => {
    setShowAllPayrollRuns(true);
  };

  const handleViewPayrollRunDetail = (runId: string) => {
    setSelectedPayrollRunDetail(runId);
    setShowPayrollRunDetailModal(true);
  };

  const getEmployeesForPayrollRun = (employeeIds: string[]): Employee[] => {
    return employees.filter(emp => employeeIds.includes(emp.id));
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            toast.type === "success" ? "bg-green-100 border border-green-200 text-green-800" :
            toast.type === "error" ? "bg-red-100 border border-red-200 text-red-800" :
            "bg-blue-100 border border-blue-200 text-blue-800"
          }`}>
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payroll Management</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {selectedCountry}
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Create, manage, and approve payroll runs for your organization
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Ctrl+N</span>
                <span>or</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">⌘+N</span>
                <span>for new payroll</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value as "Kenya" | "US")}
                  className="appearance-none pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[160px] hover:border-green-300 transition-all cursor-pointer"
                >
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="US">🇺🇸 United States</option>
                </select>
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
              <button
                onClick={handleAdmitEmployee}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-200 hover:shadow-purple-300 transform hover:scale-105 active:scale-95 duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Admit Employee
              </button>
              <button
                onClick={handleOpenDeductionManager}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-green-300 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Settings2 className="w-4 h-4" />
                Deduction Types
              </button>
              <button
                onClick={handleExportPayroll}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-green-300 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-green-300 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
              <button
                onClick={() => {
                  setRunName("");
                  setPaymentDate("");
                  setPeriodStart("");
                  setPeriodEnd("");
                  setSelectedTemplate("");
                  setNotes("");
                  setSelectedEmployees([]);
                  setPayrollData([]);
                  setCurrentStep(1);
                  showToast("🔄 Starting a new payroll run!", "info");
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:scale-105 active:scale-95 duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                New Payroll Run
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden z-40">
          <button
            onClick={() => {
              setRunName("");
              setPaymentDate("");
              setPeriodStart("");
              setPeriodEnd("");
              setSelectedTemplate("");
              setNotes("");
              setSelectedEmployees([]);
              setPayrollData([]);
              setCurrentStep(1);
              showToast("🔄 Starting a new payroll run!", "info");
            }}
            className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl shadow-green-400 hover:shadow-green-500 transform hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Payroll Stats Dashboard */}
        {payrollStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{payrollStats.totalEmployees}</p>
                </div>
                <div className="bg-blue-100 p-2.5 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(payrollStats.totalGrossPay)}</p>
                </div>
                <div className="bg-purple-100 p-2.5 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Net Pay</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(payrollStats.totalNetPay)}</p>
                </div>
                <div className="bg-green-100 p-2.5 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(payrollStats.totalDeductions)}</p>
                </div>
                <div className="bg-red-100 p-2.5 rounded-xl">
                  <Receipt className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{payrollStats.pendingCount}</p>
                </div>
                <div className="bg-yellow-100 p-2.5 rounded-xl">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Avg Salary</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(payrollStats.averageSalary)}</p>
                </div>
                <div className="bg-indigo-100 p-2.5 rounded-xl">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* ==================== STEP 1: SELECT EMPLOYEES ==================== */}
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

            {/* Employee List with Edit Button */}
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
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Deductions
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <Users className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No employees found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map(emp => {
                          const totalDeductions = getEmployeeTotalDeductions(emp.id);
                          return (
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
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEmployeeDeductions(emp.id);
                                  }}
                                  className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all flex items-center gap-1.5 mx-auto"
                                >
                                  <Settings2 className="w-3 h-3" />
                                  {totalDeductions > 0 ? formatCurrency(totalDeductions) : "Configure"}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditEmployee(emp.id);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Edit Employee"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewEmployeeHistory(emp.id);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="View Payroll History"
                                  >
                                    <History className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map(emp => {
                    const totalDeductions = getEmployeeTotalDeductions(emp.id);
                    return (
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
                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-sm text-slate-500">Salary</span>
                          <span className="font-semibold text-slate-900">{formatCurrency(emp.salary)}</span>
                        </div>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-sm text-slate-500">Deductions</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEmployeeDeductions(emp.id);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                          >
                            <Settings2 className="w-3 h-3" />
                            {totalDeductions > 0 ? formatCurrency(totalDeductions) : "Configure"}
                          </button>
                        </div>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-sm text-slate-500">Actions</span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEmployee(emp.id);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit Employee"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEmployeeHistory(emp.id);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Payroll History"
                            >
                              <History className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600">
                  <span className="font-semibold">{selectedEmployees.length}</span> employees selected
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                  Average Deductions:{" "}
                  <span className="font-medium">
                    {selectedEmployees.length > 0
                      ? formatCurrency(
                          selectedEmployees.reduce((sum, id) => {
                            return sum + getEmployeeTotalDeductions(id);
                          }, 0) / selectedEmployees.length
                        )
                      : "$0"}
                  </span>
                </span>
              </div>
              <div className="flex gap-3">
                {selectedEmployees.length > 1 && (
                  <>
                    <button
                      onClick={() => handleBulkAction("approve")}
                      className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Bulk Approve
                    </button>
                    <button
                      onClick={() => handleBulkAction("reject")}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Bulk Reject
                    </button>
                    <button
                      onClick={() => handleBulkAction("export")}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export Selected
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    if (selectedEmployees.length > 0) {
                      setCurrentStep(2);
                    } else {
                      showToast("Please select at least one employee.", "error");
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Continue to Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: CONFIGURE PAYROLL ==================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
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

            {/* Payroll Data Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-600" />
                    Employee Payroll Data
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      ({selectedEmployees.length} employees)
                    </span>
                    {selectedCountry === "Kenya" && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Kenyan Statutory Deductions
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const data = calculatePayrollData(selectedEmployees);
                        setPayrollData(data);
                        showToast("Payroll data recalculated!", "success");
                      }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-all flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Recalculate
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
                      {payrollData.map(data => {
                        const hasStatutory = data.employee.deductions?.some(d => 
                          d.isActive && d.isMandatory && 
                          ["NSSF", "NHIF", "SHIF", "Housing Levy", "PATL"].some(name => 
                            deductionTypes.find(t => t.id === d.deductionTypeId)?.name.includes(name)
                          )
                        );
                        return (
                          <tr key={data.employeeId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                                  {data.employee.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">{data.employee.name}</p>
                                  <p className="text-xs text-slate-500">{data.employee.position}</p>
                                  {hasStatutory && (
                                    <span className="text-[10px] text-blue-600 font-medium">Statutory Deductions</span>
                                  )}
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
                        );
                      })}
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
                      showToast("Please calculate payroll data first.", "error");
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

        {/* ==================== STEP 3: REVIEW & VERIFY ==================== */}
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
                      <span className="text-slate-600">Country</span>
                      <span className="font-medium">{selectedCountry}</span>
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
                      <span className="text-slate-600">Total Deductions</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(payrollData.reduce((sum, d) => sum + Object.values(d.deductions).reduce((a, b) => a + b, 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                      showToast("Payroll saved as draft!", "success");
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

        {/* ==================== STEP 4: CONFIRMATION ==================== */}
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

        {/* ==================== RECENT PAYROLL RUNS ==================== */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Recent Payroll Runs</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {payrollRuns.length}
              </span>
            </div>
            <button 
              onClick={handleViewAllPayrollRuns}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {payrollRuns.slice(0, 3).map(run => (
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
                      {run.history && run.history.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>Last action: {run.history[run.history.length - 1].action}</span>
                          <span>•</span>
                          <span>{formatDateTime(run.history[run.history.length - 1].timestamp)}</span>
                        </div>
                      )}
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
                      <button 
                        onClick={() => handleViewPayrollRunDetail(run.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditPayrollRun(run.id)}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit Payroll Run"
                      >
                        <Edit className="w-4 h-4" />
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

        {/* ==================== VIEW ALL PAYROLL RUNS MODAL ==================== */}
        {showAllPayrollRuns && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    All Payroll Runs
                  </h3>
                  <p className="text-sm text-slate-500">
                    Complete list of all payroll runs
                  </p>
                </div>
                <button
                  onClick={() => setShowAllPayrollRuns(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Run Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Period</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Employees</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Gross Pay</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Pay</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payrollRuns.map(run => (
                      <tr key={run.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                              <FileText className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-medium text-slate-900">{run.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatDate(run.period.start)} - {formatDate(run.period.end)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600">
                          {run.employees.length}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {formatCurrency(run.totalGross)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">
                          {formatCurrency(run.totalNet)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(run.status)}`}>
                            {getStatusIcon(run.status)}
                            {run.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setShowAllPayrollRuns(false);
                                handleViewPayrollRunDetail(run.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowAllPayrollRuns(false);
                                handleEditPayrollRun(run.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Edit Payroll Run"
                            >
                              <Edit className="w-4 h-4" />
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Total: <span className="font-medium">{payrollRuns.length}</span> payroll runs
                </p>
                <button
                  onClick={() => setShowAllPayrollRuns(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAYROLL RUN DETAIL MODAL ==================== */}
        {showPayrollRunDetailModal && selectedPayrollRunDetail && (() => {
          const run = payrollRuns.find(r => r.id === selectedPayrollRunDetail);
          if (!run) return null;
          const runEmployees = getEmployeesForPayrollRun(run.employees);
          
          return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Payroll Run Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      {run.name} • {formatDate(run.period.start)} - {formatDate(run.period.end)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowPayrollRunDetailModal(false);
                        handleEditPayrollRun(run.id);
                      }}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowPayrollRunDetailModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-medium">Total Employees</p>
                    <p className="text-2xl font-bold text-slate-900">{run.employees.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-600 font-medium">Total Gross Pay</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(run.totalGross)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-600 font-medium">Total Net Pay</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(run.totalNet)}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-red-600 font-medium">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(run.totalDeductions)}</p>
                  </div>
                </div>

                {/* Run Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Run Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name</span>
                        <span className="font-medium">{run.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Period</span>
                        <span className="font-medium">{formatDate(run.period.start)} - {formatDate(run.period.end)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payment Date</span>
                        <span className="font-medium">{formatDate(run.paymentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(run.status)}`}>
                          {getStatusIcon(run.status)}
                          {run.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created By</span>
                        <span className="font-medium">{run.createdBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created At</span>
                        <span className="font-medium">{formatDateTime(run.createdAt)}</span>
                      </div>
                      {run.approvedBy && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Approved By</span>
                          <span className="font-medium">{run.approvedBy}</span>
                        </div>
                      )}
                      {run.approvedAt && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Approved At</span>
                          <span className="font-medium">{formatDateTime(run.approvedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">History Timeline</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {run.history && run.history.length > 0 ? (
                        run.history.map((item, index) => (
                          <div key={item.id} className="flex items-start gap-2 text-sm">
                            <div className="relative">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                              {index < run.history!.length - 1 && (
                                <div className="absolute top-3 left-0.5 w-0.5 h-full bg-slate-200"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-900">{item.action}</span>
                                <span className="text-xs text-slate-500">{formatDateTime(item.timestamp)}</span>
                              </div>
                              <p className="text-xs text-slate-600">By {item.user}</p>
                              {item.note && <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No history available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employee List */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm">Employees in this Run</h4>
                    <span className="text-sm text-slate-500">{runEmployees.length} employees</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {runEmployees.map(emp => {
                      const totalDeductions = getEmployeeTotalDeductions(emp.id);
                      return (
                        <div key={emp.id} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{emp.name}</p>
                              <p className="text-xs text-slate-500">{emp.position} • {emp.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-600">Salary: {formatCurrency(emp.salary)}</span>
                            <span className="text-purple-600">Deductions: {formatCurrency(totalDeductions)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setShowPayrollRunDetailModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== EDIT PAYROLL RUN MODAL ==================== */}
        {showEditPayrollRunModal && editingPayrollRunId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-green-600" />
                    Edit Payroll Run
                  </h3>
                  <p className="text-sm text-slate-500">
                    Update payroll run details
                  </p>
                </div>
                <button
                  onClick={() => setShowEditPayrollRunModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Run Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPayrollRunData.name || ""}
                    onChange={(e) => setEditingPayrollRunData({ ...editingPayrollRunData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingPayrollRunData.paymentDate || ""}
                    onChange={(e) => setEditingPayrollRunData({ ...editingPayrollRunData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingPayrollRunData.period?.start || ""}
                    onChange={(e) => setEditingPayrollRunData({ 
                      ...editingPayrollRunData, 
                      period: { ...editingPayrollRunData.period!, start: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingPayrollRunData.period?.end || ""}
                    onChange={(e) => setEditingPayrollRunData({ 
                      ...editingPayrollRunData, 
                      period: { ...editingPayrollRunData.period!, end: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPayrollRunData.status || "Draft"}
                    onChange={(e) => setEditingPayrollRunData({ ...editingPayrollRunData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready for Review">Ready for Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingPayrollRunData.notes || ""}
                    onChange={(e) => setEditingPayrollRunData({ ...editingPayrollRunData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none h-20"
                    placeholder="Add notes about this payroll run..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowEditPayrollRunModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePayrollRunEdit}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EDIT EMPLOYEE MODAL ==================== */}
        {showEditEmployeeModal && editingEmployeeId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    Edit Employee
                  </h3>
                  <p className="text-sm text-slate-500">
                    Update employee details
                  </p>
                </div>
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployeeData.name || ""}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingEmployeeData.email || ""}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployeeData.department || ""}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployeeData.position || ""}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={editingEmployeeData.employmentType || "Full-time"}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Salary (Annual) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingEmployeeData.salary || 0}
                    onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, salary: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                {selectedCountry === "Kenya" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        NSSF Number
                      </label>
                      <input
                        type="text"
                        value={editingEmployeeData.taxInfo?.nssfNumber || ""}
                        onChange={(e) => setEditingEmployeeData({ 
                          ...editingEmployeeData, 
                          taxInfo: { ...editingEmployeeData.taxInfo!, nssfNumber: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        NHIF Number
                      </label>
                      <input
                        type="text"
                        value={editingEmployeeData.taxInfo?.nhifNumber || ""}
                        onChange={(e) => setEditingEmployeeData({ 
                          ...editingEmployeeData, 
                          taxInfo: { ...editingEmployeeData.taxInfo!, nhifNumber: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        KRA PIN
                      </label>
                      <input
                        type="text"
                        value={editingEmployeeData.taxInfo?.kraPin || ""}
                        onChange={(e) => setEditingEmployeeData({ 
                          ...editingEmployeeData, 
                          taxInfo: { ...editingEmployeeData.taxInfo!, kraPin: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployeeEdit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EMPLOYEE DEDUCTION MODAL ==================== */}
        {showEmployeeDeductionModal && selectedEmployeeId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Configure Deductions
                  </h3>
                  <p className="text-sm text-slate-500">
                    Manage mandatory and voluntary deductions for {employees.find(e => e.id === selectedEmployeeId)?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowEmployeeDeductionModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex gap-2 mb-4 border-b border-slate-200">
                {["all", "mandatory", "voluntary", "statutory"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDeductionTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                      activeDeductionTab === tab
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {deductionTypes
                  .filter(d => {
                    if (activeDeductionTab === "all") return d.isActive;
                    if (activeDeductionTab === "mandatory") return d.isActive && d.isPredefined && !d.isKenyanStatutory;
                    if (activeDeductionTab === "voluntary") return d.isActive && !d.isPredefined && !d.isKenyanStatutory;
                    if (activeDeductionTab === "statutory") return d.isActive && d.isKenyanStatutory;
                    return true;
                  })
                  .map(deductionType => {
                    const existing = editingEmployeeDeductions.find(d => d.deductionTypeId === deductionType.id);
                    const isActive = existing?.isActive || false;
                    
                    return (
                      <div key={deductionType.id} className={`border rounded-lg p-4 transition-all ${
                        isActive ? "border-purple-300 bg-purple-50/30" : "border-slate-200"
                      } ${deductionType.isKenyanStatutory ? "border-blue-300 bg-blue-50/20" : ""}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-slate-900">{deductionType.name}</h4>
                              {deductionType.isPredefined ? (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Mandatory
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  Voluntary
                                </span>
                              )}
                              {deductionType.isKenyanStatutory && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                  <BadgeCheck className="w-3 h-3" />
                                  Kenya
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{deductionType.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                              <span>Rate: {deductionType.isPercentage ? `${deductionType.rate}%` : `$${deductionType.rate}`}</span>
                              <span>Category: {deductionType.category}</span>
                              {deductionType.cap && <span>Cap: ${deductionType.cap.toLocaleString()}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            {!deductionType.isPredefined ? (
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => handleToggleDeductionForEmployee(deductionType.id, e.target.checked)}
                                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                              />
                            ) : (
                              <span className="text-blue-600">
                                <BadgeCheck className="w-5 h-5" />
                              </span>
                            )}
                            {isActive && (
                              <input
                                type="number"
                                value={existing?.amount || 0}
                                onChange={(e) => handleUpdateDeductionAmount(deductionType.id, parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="Amount"
                                step="0.01"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowEmployeeDeductionModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployeeDeductions}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Deductions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EMPLOYEE PAYROLL HISTORY MODAL ==================== */}
        {showEmployeeDetailModal && selectedEmployeeDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Payroll History
                  </h3>
                  <p className="text-sm text-slate-500">
                    Complete payroll history for {employees.find(e => e.id === selectedEmployeeDetail)?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowEmployeeDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                {employees.find(e => e.id === selectedEmployeeDetail)?.payrollHistory?.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <History className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No payroll history found for this employee.</p>
                  </div>
                ) : (
                  employees.find(e => e.id === selectedEmployeeDetail)?.payrollHistory?.map((history, index) => (
                    <div key={history.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">
                              {formatDate(history.period.start)} - {formatDate(history.period.end)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                              {history.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-slate-500">Gross Pay:</span>
                              <span className="font-medium ml-1">{formatCurrency(history.grossPay)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Net Pay:</span>
                              <span className="font-medium ml-1 text-green-600">{formatCurrency(history.netPay)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Deductions:</span>
                              <span className="font-medium ml-1 text-red-600">{formatCurrency(history.totalDeductions)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Payment Method:</span>
                              <span className="font-medium ml-1">{history.paymentMethod}</span>
                            </div>
                          </div>
                          {history.transactionId && (
                            <div className="mt-1 text-xs text-slate-400">
                              Transaction ID: {history.transactionId}
                            </div>
                          )}
                          {history.notes && (
                            <div className="mt-1 text-xs text-slate-500">
                              Notes: {history.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          Payment Date: {formatDate(history.paymentDate)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowEmployeeDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DEDUCTION TYPES MANAGER MODAL ==================== */}
        {showDeductionManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-purple-600" />
                    Deduction Types Manager
                  </h3>
                  <p className="text-sm text-slate-500">
                    Manage company-wide deduction types and policies
                  </p>
                </div>
                <button
                  onClick={() => setShowDeductionManager(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{deductionTypes.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Mandatory</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {deductionTypes.filter(d => d.isPredefined && !d.isKenyanStatutory).length}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Voluntary</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {deductionTypes.filter(d => !d.isPredefined && !d.isKenyanStatutory).length}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">Kenyan Statutory</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {deductionTypes.filter(d => d.isKenyanStatutory).length}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deductionTypes.map(deduction => (
                  <div key={deduction.id} className={`border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all ${deduction.isKenyanStatutory ? "border-blue-300 bg-blue-50/10" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{deduction.name}</h4>
                        <p className="text-xs text-slate-500">{deduction.code}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {deduction.isPredefined ? (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            Voluntary
                          </span>
                        )}
                        {deduction.isKenyanStatutory && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            🇰🇪 Kenya
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{deduction.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Rate:</span>{" "}
                        {deduction.isPercentage ? `${deduction.rate}%` : `$${deduction.rate}`}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {deduction.category}
                      </div>
                      <div>
                        <span className="font-medium">Applicable:</span> {deduction.applicableTo.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span> {deduction.calculationMethod}
                      </div>
                      {deduction.cap && (
                        <div className="col-span-2">
                          <span className="font-medium">Cap:</span> ${deduction.cap.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        deduction.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {deduction.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200">
                  <Plus className="w-4 h-4" />
                  Add Deduction Type
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TEMPLATE MODAL ==================== */}
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
                    <button 
                      onClick={() => {
                        showToast(`Using template: ${template.name}`, "success");
                        setShowTemplateModal(false);
                      }}
                      className="mt-3 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BULK ACTION MODAL ==================== */}
        {showBulkActionModal && bulkActionType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Confirm Bulk Action</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Are you sure you want to <span className="font-semibold">{bulkActionType}</span> {selectedForBulkAction.length} selected employees?
              </p>
              <div className="bg-slate-50 rounded-xl p-3 mb-4 max-h-32 overflow-y-auto">
                <ul className="text-sm text-slate-600 space-y-1">
                  {selectedForBulkAction.map(id => {
                    const emp = employees.find(e => e.id === id);
                    return emp ? <li key={id}>• {emp.name}</li> : null;
                  })}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkActionModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBulkAction}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-all ${
                    bulkActionType === "approve" ? "bg-green-600 hover:bg-green-700" :
                    bulkActionType === "reject" ? "bg-red-600 hover:bg-red-700" :
                    bulkActionType === "delete" ? "bg-red-600 hover:bg-red-700" :
                    "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirm {bulkActionType.charAt(0).toUpperCase() + bulkActionType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONFIRMATION MODAL ==================== */}
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