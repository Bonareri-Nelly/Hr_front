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
  avatar?: string;
  phone?: string;
  location?: string;
  deductions?: EmployeeDeduction[];
}

interface PayrollHistory {
  id: string;
  payrollId: string;
  action: "Created" | "Submitted" | "Approved" | "Rejected" | "Paid" | "Cancelled" | "Modified" | "Reviewed";
  timestamp: string;
  user: string;
  userRole: string;
  notes?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  status: string;
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
  employeeDeductions: EmployeeDeduction[];
  totalEmployeeDeductions: number;
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
  history: PayrollHistory[];
}

// ==================== PREDEFINED DEDUCTIONS ====================
const PREDEFINED_DEDUCTIONS: DeductionType[] = [
  {
    id: "ded1",
    name: "Federal Income Tax",
    code: "FIT",
    category: "Statutory",
    description: "Federal income tax withholding based on IRS guidelines",
    isPercentage: true,
    rate: 15,
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
    isActive: true,
    isPredefined: false,
    applicableTo: ["All"],
    calculationMethod: "Percentage",
    taxTreatment: "Post-tax",
    effectiveDate: "2024-01-01",
  },
];

export default function EnhancedPayrollApprovalPage() {
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

  const [showDeductionManager, setShowDeductionManager] = useState(false);
  const [showEmployeeDeductionModal, setShowEmployeeDeductionModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [deductionTypes] = useState<DeductionType[]>(PREDEFINED_DEDUCTIONS);
  const [editingEmployeeDeductions, setEditingEmployeeDeductions] = useState<EmployeeDeduction[]>([]);
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryPayrollId, setSelectedHistoryPayrollId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState("All");
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // ==================== SAMPLE EMPLOYEES WITH DEDUCTIONS ====================
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
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      deductions: [
        {
          id: "ed1",
          employeeId: "emp1",
          deductionTypeId: "ded1",
          amount: 1125,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed2",
          employeeId: "emp1",
          deductionTypeId: "ded5",
          amount: 525,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed3",
          employeeId: "emp1",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
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
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      deductions: [
        {
          id: "ed4",
          employeeId: "emp2",
          deductionTypeId: "ded1",
          amount: 1275,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed5",
          employeeId: "emp2",
          deductionTypeId: "ded6",
          amount: 350,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed6",
          employeeId: "emp2",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
        {
          id: "ed7",
          employeeId: "emp2",
          deductionTypeId: "ded8",
          amount: 50,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
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
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      deductions: [
        {
          id: "ed8",
          employeeId: "emp3",
          deductionTypeId: "ded1",
          amount: 930,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed9",
          employeeId: "emp3",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
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
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      deductions: [
        {
          id: "ed10",
          employeeId: "emp4",
          deductionTypeId: "ded1",
          amount: 825,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed11",
          employeeId: "emp4",
          deductionTypeId: "ded9",
          amount: 55,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
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
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      deductions: [
        {
          id: "ed12",
          employeeId: "emp5",
          deductionTypeId: "ded1",
          amount: 720,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed13",
          employeeId: "emp5",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
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
      phone: "+1 (555) 678-9012",
      location: "Boston, MA",
      deductions: [
        {
          id: "ed14",
          employeeId: "emp6",
          deductionTypeId: "ded1",
          amount: 900,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed15",
          employeeId: "emp6",
          deductionTypeId: "ded8",
          amount: 50,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
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
      phone: "+1 (555) 789-0123",
      location: "Los Angeles, CA",
      deductions: [
        {
          id: "ed16",
          employeeId: "emp7",
          deductionTypeId: "ded1",
          amount: 870,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed17",
          employeeId: "emp7",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
        {
          id: "ed18",
          employeeId: "emp7",
          deductionTypeId: "ded9",
          amount: 58,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
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
      phone: "+1 (555) 890-1234",
      location: "Denver, CO",
      deductions: [
        {
          id: "ed19",
          employeeId: "emp8",
          deductionTypeId: "ded1",
          amount: 1080,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed20",
          employeeId: "emp8",
          deductionTypeId: "ded5",
          amount: 504,
          isFixed: false,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: true,
        },
        {
          id: "ed21",
          employeeId: "emp8",
          deductionTypeId: "ded7",
          amount: 75,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
        {
          id: "ed22",
          employeeId: "emp8",
          deductionTypeId: "ded8",
          amount: 50,
          isFixed: true,
          startDate: "2024-01-01",
          isActive: true,
          isMandatory: false,
        },
      ],
    },
  ];

  // ==================== GENERATE PAYROLL RECORDS ====================
  const generatePayrollRecords = (): PayrollItem[] => {
    return employees.map((emp, index) => {
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
      const deductions = { 
        tax, 
        pension, 
        insurance, 
        loan, 
        other: otherDed + totalEmpDeductions
      };
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

      const history: PayrollHistory[] = [
        {
          id: `hist${index}1`,
          payrollId: `pay${String(index + 1).padStart(3, '0')}`,
          action: "Created",
          timestamp: `2026-03-${String(28 - index % 5).padStart(2, '0')}T10:00:00`,
          user: "System",
          userRole: "System",
          status: "Draft",
        },
        ...(statuses[index % statuses.length] !== "Draft" ? [{
          id: `hist${index}2`,
          payrollId: `pay${String(index + 1).padStart(3, '0')}`,
          action: "Submitted" as const,
          timestamp: `2026-03-${String(29 - index % 4).padStart(2, '0')}T10:30:00`,
          user: emp.name,
          userRole: "Employee",
          status: "Pending",
          notes: "Payroll submitted for approval",
        }] : []),
        ...(statuses[index % statuses.length] === "Approved" ? [{
          id: `hist${index}3`,
          payrollId: `pay${String(index + 1).padStart(3, '0')}`,
          action: "Approved" as const,
          timestamp: `2026-03-${String(30 - index % 3).padStart(2, '0')}T14:30:00`,
          user: "John Manager",
          userRole: "Manager",
          status: "Approved",
          notes: "Approved with standard deductions",
          changes: [
            {
              field: "status",
              oldValue: "Pending",
              newValue: "Approved",
            },
          ],
        }] : []),
        ...(statuses[index % statuses.length] === "Rejected" ? [{
          id: `hist${index}3`,
          payrollId: `pay${String(index + 1).padStart(3, '0')}`,
          action: "Rejected" as const,
          timestamp: `2026-03-${String(30 - index % 3).padStart(2, '0')}T14:30:00`,
          user: "John Manager",
          userRole: "Manager",
          status: "Rejected",
          notes: "Needs review of overtime calculations",
          changes: [
            {
              field: "status",
              oldValue: "Pending",
              newValue: "Rejected",
            },
          ],
        }] : []),
      ];

      return {
        id: `pay${String(index + 1).padStart(3, '0')}`,
        employeeId: emp.id,
        employee: emp,
        baseSalary,
        allowances,
        bonuses,
        deductions,
        employeeDeductions: empDeductions,
        totalEmployeeDeductions: totalEmpDeductions,
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
        history,
      };
    });
  };

  const [payrollData, setPayrollData] = useState<PayrollItem[]>(generatePayrollRecords());

  // ==================== TOAST NOTIFICATION ====================
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==================== SUMMARY CALCULATIONS ====================
  const getSummary = () => {
    const totalEmployees = payrollData.length;
    const totalGrossPay = payrollData.reduce((sum, r) => sum + r.grossPay, 0);
    const totalNetPay = payrollData.reduce((sum, r) => sum + r.netPay, 0);
    const totalDeductions = payrollData.reduce((sum, r) => sum + Object.values(r.deductions).reduce((a, b) => a + b, 0), 0);
    const totalBonuses = payrollData.reduce((sum, r) => sum + Object.values(r.bonuses).reduce((a, b) => a + b, 0), 0);
    const totalEmployeeDeductions = payrollData.reduce((sum, r) => sum + r.totalEmployeeDeductions, 0);

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
      totalEmployeeDeductions,
      departments,
      statusBreakdown,
    };
  };

  const summary = getSummary();

  // ==================== HELPER FUNCTIONS ====================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Submitted":
        return <Send className="w-4 h-4 text-blue-600" />;
      case "Created":
        return <Plus className="w-4 h-4 text-slate-600" />;
      case "Paid":
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      case "Modified":
        return <Edit className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
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

  const getStatusCount = (status: string) => {
    return payrollData.filter(r => r.status === status).length;
  };

  const departments = ["All", ...new Set(payrollData.map((r) => r.employee.department))];

  // ==================== FILTER AND SORT ====================
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

  // ==================== APPROVAL HANDLERS ====================
  const handleApprove = (id: string) => {
    setSelectedForAction(id);
    setApprovalNote("");
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = (approved: boolean) => {
    if (selectedForAction) {
      const record = payrollData.find(r => r.id === selectedForAction);
      if (record) {
        const newStatus = approved ? "Approved" : "Rejected";
        const newHistory: PayrollHistory = {
          id: `hist${Date.now()}`,
          payrollId: selectedForAction,
          action: approved ? "Approved" : "Rejected",
          timestamp: new Date().toISOString(),
          user: "Current User",
          userRole: "Approver",
          status: newStatus,
          notes: approvalNote || undefined,
          changes: [
            {
              field: "status",
              oldValue: record.status,
              newValue: newStatus,
            },
          ],
        };

        setPayrollData(prev =>
          prev.map(r =>
            r.id === selectedForAction
              ? {
                  ...r,
                  status: newStatus,
                  approvedDate: approved ? new Date().toISOString() : undefined,
                  approvedBy: approved ? "Current User" : undefined,
                  history: [...r.history, newHistory],
                }
              : r
          )
        );
        
        showToast(
          `Payroll ${approved ? "approved" : "rejected"} successfully for ${record.employee.name}`,
          approved ? "success" : "error"
        );
      }
      setShowApprovalModal(false);
      setApprovalNote("");
      setSelectedForAction(null);
    }
  };

  // ==================== DEDUCTION HANDLERS ====================
  const getEmployeeTotalDeductions = (employeeId: string): number => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.deductions) return 0;
    return emp.deductions
      .filter(d => d.isActive)
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getEmployeeDeductionDetails = (employeeId: string): EmployeeDeduction[] => {
    const emp = employees.find(e => e.id === employeeId);
    return emp?.deductions?.filter(d => d.isActive) || [];
  };

  const handleOpenEmployeeDeductions = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const emp = employees.find(e => e.id === employeeId);
    setEditingEmployeeDeductions(emp?.deductions || []);
    setShowEmployeeDeductionModal(true);
  };

  const handleSaveEmployeeDeductions = () => {
    if (selectedEmployeeId) {
      // Update the employee's deductions
      const updatedEmployees = employees.map(emp => {
        if (emp.id === selectedEmployeeId) {
          return { ...emp, deductions: editingEmployeeDeductions };
        }
        return emp;
      });
      // Regenerate payroll data with new deductions
      const newPayrollData = generatePayrollRecords();
      setPayrollData(newPayrollData);
      setShowEmployeeDeductionModal(false);
      showToast("Employee deductions saved successfully!", "success");
    }
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

  // ==================== HISTORY HANDLERS ====================
  const handleViewHistory = (payrollId: string) => {
    setSelectedHistoryPayrollId(payrollId);
    setHistoryFilter("All");
    setShowHistoryModal(true);
  };

  const getFilteredHistory = () => {
    if (!selectedHistoryPayrollId) return [];
    const record = payrollData.find(r => r.id === selectedHistoryPayrollId);
    if (!record) return [];
    if (historyFilter === "All") return record.history;
    return record.history.filter(h => h.action === historyFilter);
  };

  // ==================== EXPORT HANDLER ====================
  const handleExport = () => {
    showToast("Payroll data exported successfully!", "success");
  };

  // ==================== PRINT HANDLER ====================
  const handlePrint = () => {
    window.print();
  };

  // ==================== PROCESS PAYROLL HANDLER ====================
  const handleProcessPayroll = () => {
    const pendingCount = getStatusCount("Pending");
    if (pendingCount === 0) {
      showToast("No pending payroll items to process!", "info");
      return;
    }
    showToast(`Processing ${pendingCount} pending payroll items...`, "success");
  };

  // ==================== REFRESH HANDLER ====================
  const handleRefresh = () => {
    const newData = generatePayrollRecords();
    setPayrollData(newData);
    showToast("Payroll data refreshed!", "success");
  };

  // ==================== GENERATE REPORT HANDLER ====================
  const handleGenerateReport = () => {
    showToast("Generating payroll report...", "info");
    setTimeout(() => {
      showToast("Report generated successfully!", "success");
    }, 1500);
  };

  // ==================== SEND REMINDERS HANDLER ====================
  const handleSendReminders = () => {
    const pendingCount = getStatusCount("Pending");
    if (pendingCount === 0) {
      showToast("No pending approvals to remind!", "info");
      return;
    }
    showToast(`Sending reminders to ${pendingCount} pending approvals...`, "success");
  };

  // ==================== CONFIGURE SETTINGS HANDLER ====================
  const handleConfigureSettings = () => {
    setShowDeductionManager(true);
  };

  // ==================== VIEW DOCUMENTATION ====================
  const handleViewDocumentation = () => {
    window.open("/docs/payroll", "_blank");
    showToast("Opening documentation...", "info");
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in ${
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
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payroll Management</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {selectedPeriod}
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Review, approve, and manage employee payroll with deduction tracking
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleConfigureSettings}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Settings2 className="w-4 h-4" />
                Deduction Types
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleProcessPayroll}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                <Send className="w-4 h-4" />
                Process Payroll
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
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
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Gross</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.totalGrossPay)}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Net</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.totalNetPay)}
                </p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
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
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Employee Deductions</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(summary.totalEmployeeDeductions)}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Receipt className="w-5 h-5 text-purple-600" />
              </div>
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
              <button
                onClick={handleRefresh}
                className="px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
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
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    viewMode === "cards"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (selectedRecord) {
                      setViewMode("detail");
                    } else {
                      showToast("Please select a record first", "info");
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    viewMode === "detail"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-4 h-4" />
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Employee
                        {sortConfig?.key === "name" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("department")}>
                      <div className="flex items-center gap-1">
                        Department
                        {sortConfig?.key === "department" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("grossPay")}>
                      <div className="flex items-center justify-end gap-1">
                        Gross
                        {sortConfig?.key === "grossPay" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("netPay")}>
                      <div className="flex items-center justify-end gap-1">
                        Net
                        {sortConfig?.key === "netPay" && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort("status")}>
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
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEmployeeDeductions(record.employeeId);
                            }}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 ml-auto"
                          >
                            <Receipt className="w-3 h-3" />
                            {record.totalEmployeeDeductions > 0 
                              ? formatCurrency(record.totalEmployeeDeductions)
                              : "Configure"}
                          </button>
                          {record.totalEmployeeDeductions > 0 && (
                            <div className="text-xs text-slate-400 mt-1">
                              {record.employeeDeductions.filter(d => d.isActive).length} deduction(s)
                            </div>
                          )}
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
                                handleViewHistory(record.id);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View History"
                            >
                              <History className="w-4 h-4" />
                            </button>
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
                Showing <span className="font-medium">{sortedRecords.length}</span> of{" "}
                <span className="font-medium">{payrollData.length}</span> records
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white transition-all">
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
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Deductions</p>
                      <button
                        onClick={() => handleOpenEmployeeDeductions(record.employeeId)}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Receipt className="w-3 h-3" />
                        {record.totalEmployeeDeductions > 0 
                          ? formatCurrency(record.totalEmployeeDeductions)
                          : "Configure"}
                      </button>
                      {record.totalEmployeeDeductions > 0 && (
                        <div className="text-xs text-slate-400">
                          {record.employeeDeductions.filter(d => d.isActive).length} deduction(s)
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
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
                        onClick={() => handleViewHistory(record.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View History"
                      >
                        <History className="w-4 h-4" />
                      </button>
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
          selectedRecord && (() => {
            const selectedRecordData = payrollData.find(r => r.id === selectedRecord);
            if (!selectedRecordData) return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-12 text-center">
                <p className="text-slate-500">Record not found</p>
                <button
                  onClick={() => setViewMode("table")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Back to List
                </button>
              </div>
            );
            return (
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
                    <button
                      onClick={() => handleViewHistory(selectedRecordData.id)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
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
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="p-6">
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
                          <span className="text-slate-600">Overtime ({selectedRecordData.overtime.hours}h)</span>
                          <span className="font-medium">{formatCurrency(selectedRecordData.overtime.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                          <span className="text-slate-900">Total Gross Pay</span>
                          <span className="text-slate-900">{formatCurrency(selectedRecordData.grossPay)}</span>
                        </div>
                      </div>
                    </div>

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
                        {selectedRecordData.totalEmployeeDeductions > 0 && (
                          <div className="flex justify-between text-sm bg-purple-50 p-2 rounded-lg">
                            <span className="text-purple-700 font-medium">Employee Deductions</span>
                            <span className="font-bold text-purple-700">{formatCurrency(selectedRecordData.totalEmployeeDeductions)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                          <span className="text-slate-900">Net Pay</span>
                          <span className="text-blue-600">{formatCurrency(selectedRecordData.netPay)}</span>
                        </div>
                      </div>
                    </div>

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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* ==================== HISTORY MODAL ==================== */}
        {showHistoryModal && selectedHistoryPayrollId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Payroll History
                  </h3>
                  <p className="text-sm text-slate-500">
                    Complete audit trail for payroll #{selectedHistoryPayrollId}
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {["All", "Created", "Submitted", "Approved", "Rejected", "Paid"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      historyFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {getFilteredHistory().length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No history records found for this filter.
                  </div>
                ) : (
                  getFilteredHistory().map((item) => (
                    <div key={item.id} className="relative pl-8 pb-4 border-l-2 border-slate-200 last:border-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white shadow-sm">
                              {getActionIcon(item.action)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {item.action}
                              </h4>
                              <p className="text-sm text-slate-600">
                                By {item.user} • {item.userRole}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-slate-500">
                            {formatDateTime(item.timestamp)}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="mt-2 text-sm text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                            {item.notes}
                          </p>
                        )}
                        {item.changes && item.changes.length > 0 && (
                          <div className="mt-2 text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                            <span className="font-medium">Changes:</span>
                            {item.changes.map((change, idx) => (
                              <span key={idx} className="ml-2">
                                {change.field}:{" "}
                                <span className="text-red-600 line-through">{String(change.oldValue)}</span>
                                {" → "}
                                <span className="text-green-600">{String(change.newValue)}</span>
                                {idx < item.changes!.length - 1 && ", "}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Close
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
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-purple-600" />
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

              <div className="space-y-3">
                {deductionTypes
                  .filter(d => d.isActive)
                  .map(deductionType => {
                    const existing = editingEmployeeDeductions.find(d => d.deductionTypeId === deductionType.id);
                    const isActive = existing?.isActive || false;
                    const isMandatory = deductionType.isPredefined;

                    return (
                      <div key={deductionType.id} className={`border rounded-lg p-4 transition-all ${
                        isActive ? "border-purple-300 bg-purple-50/30" : "border-slate-200"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-900">{deductionType.name}</h4>
                              {isMandatory ? (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Mandatory
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  Voluntary
                                </span>
                              )}
                              {isActive && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{deductionType.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                              <span>Rate: {deductionType.isPercentage ? `${deductionType.rate}%` : `$${deductionType.rate}`}</span>
                              <span>Category: {deductionType.category}</span>
                              {deductionType.cap && <span>Cap: ${deductionType.cap.toLocaleString()}</span>}
                            </div>
                            {isActive && existing && (
                              <div className="mt-1 text-xs text-purple-600">
                                Current amount: {formatCurrency(existing.amount)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            {!isMandatory ? (
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => handleToggleDeductionForEmployee(deductionType.id, e.target.checked)}
                                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                              />
                            ) : (
                              <div className="text-blue-600">
                                <BadgeCheck className="w-5 h-5" />
                              </div>
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

        {/* ==================== APPROVAL MODAL ==================== */}
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

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleGenerateReport}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Generate Report</p>
              <p className="text-xs text-slate-500">Export payroll summary</p>
            </div>
          </button>

          <button
            onClick={handleSendReminders}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Send Reminders</p>
              <p className="text-xs text-slate-500">Notify pending approvals</p>
            </div>
          </button>

          <button
            onClick={handleConfigureSettings}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Configure</p>
              <p className="text-xs text-slate-500">Payroll settings</p>
            </div>
          </button>

          <button
            onClick={handleViewDocumentation}
            className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">View guides</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}