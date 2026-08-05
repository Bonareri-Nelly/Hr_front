import { useCallback, useEffect, useState } from "react";
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
import PayrollBatchApprovalModal from "../components/PayrollBatchApprovalModal";
import { apiClient } from "@/services/api/client";

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
  payrollRunId?: string;
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

export default function PayrollApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [selectedPeriod] = useState("March 2026");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState<string | null>(null);
  const [showBatchApprovalModal, setShowBatchApprovalModal] = useState(false);
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

  const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);

  // Payroll Creation persists a run and its payslips.  The approval workspace
  // deliberately reads those records instead of maintaining a second mock list.
  const loadPayrollData = useCallback(async () => {
    try {
      const response = await apiClient.get("/payroll/approval-queue/");
      const queue = response.data?.results ?? [];
      const recordGroups = queue.map(({ run, payslips }: { run: any; payslips: any[] }) => {
        return payslips.map((payslip: any): PayrollItem => {
          const approvalStatus: PayrollItem["status"] = run.status === "APPROVED" || run.status === "FINALIZED"
            ? "Approved"
            : payslip.approval_status === "APPROVED"
              ? "Approved"
              : payslip.approval_status === "REJECTED"
                ? "Rejected"
                : payslip.approval_status === "PENDING"
                  ? "Pending"
                  : "Draft";
          const reviewedHistory: PayrollHistory[] = payslip.reviewed_at ? [{
            id: `review-${payslip.id}`,
            payrollId: String(payslip.id),
            action: payslip.approval_status === "REJECTED" ? "Rejected" : "Approved",
            timestamp: payslip.reviewed_at,
            user: payslip.reviewed_by_name || "Approver",
            userRole: "Approver",
            status: approvalStatus,
            notes: payslip.approval_comment || undefined,
          }] : [];
          return {
            id: String(payslip.id),
            payrollRunId: String(run.id),
            employeeId: String(payslip.employee),
            employee: {
              id: String(payslip.employee),
              name: payslip.employee_name || "Employee",
              email: payslip.employee_email || "",
              department: payslip.department_name || "Unassigned",
              position: payslip.designation_name || "",
              joinDate: "",
              employmentType: "Full-time",
              salary: Number(payslip.basic_salary || 0),
            },
            baseSalary: Number(payslip.basic_salary || 0),
            allowances: { housing: 0, transport: 0, medical: 0, education: 0, others: Number(payslip.total_allowances || 0) },
            bonuses: { performance: 0, attendance: 0, project: 0, holiday: 0, other: 0 },
            deductions: { tax: Number(payslip.tax_amount || 0), pension: 0, insurance: 0, loan: 0, other: Math.max(0, Number(payslip.total_deductions || 0) - Number(payslip.tax_amount || 0)) },
            employeeDeductions: [],
            totalEmployeeDeductions: Number(payslip.total_deductions || 0),
            overtime: { hours: 0, rate: 0, amount: 0 },
            leave: { taken: 0, remaining: 0, unpaid: 0 },
            netPay: Number(payslip.net_pay || 0),
            grossPay: Number(payslip.gross_pay || 0),
            payPeriod: { start: `${run.year}-${String(run.month).padStart(2, "0")}-01`, end: `${run.year}-${String(run.month).padStart(2, "0")}-28` },
            status: approvalStatus,
            submittedDate: run.processed_at || run.created_at,
            approvedDate: payslip.reviewed_at || run.approved_at,
            approvedBy: payslip.reviewed_by_name || run.approved_by_name,
            paymentMethod: "Bank Transfer",
            bankDetails: { accountName: payslip.employee_name || "", accountNumber: "", bankName: "" },
            notes: payslip.approval_comment || undefined,
            reviewedBy: payslip.reviewed_by_name,
            reviewDate: payslip.reviewed_at,
            history: [{ id: `created-${payslip.id}`, payrollId: String(payslip.id), action: "Created", timestamp: run.created_at, user: run.processed_by_name || "System", userRole: "Payroll", status: "Draft", notes: "Created from payroll run" }, ...reviewedHistory],
          };
        });
      });
      setPayrollData(recordGroups.flat());
    } catch {
      showToast("Unable to load payroll items from Payroll Creation.", "error");
    }
  }, []);

  useEffect(() => { void loadPayrollData(); }, [loadPayrollData]);

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

  const reviewItems = async (ids: string[], action: "APPROVE" | "REJECT", comment = "") => {
    const selected = payrollData.filter((record) => ids.includes(record.id));
    const groups = selected.reduce<Record<string, string[]>>((all, record) => {
      if (record.payrollRunId) (all[record.payrollRunId] ??= []).push(record.id);
      return all;
    }, {});
    await Promise.all(Object.entries(groups).map(async ([runId, payslipIds]) => {
      await apiClient.post(`/payroll/runs/${runId}/payslips/review/`, {
        payslip_ids: payslipIds.map(Number),
        action,
        comment,
      });
      if (action === "APPROVE") {
        try { await apiClient.post(`/payroll/runs/${runId}/approve/`, { comment }); } catch { /* Remaining items still need review. */ }
      }
    }));
    await loadPayrollData();
  };

  const handleConfirmBatchApproval = async (ids: string[]) => {
    try {
      await reviewItems(ids, "APPROVE", "Approved in batch approval workflow");
      showToast(`${ids.length} payroll record${ids.length === 1 ? "" : "s"} approved successfully`, "success");
    } catch {
      showToast("Unable to approve the selected payroll items.", "error");
    }
  };

  const handleBatchReject = async (id: string, reason: string) => {
    try {
      await reviewItems([id], "REJECT", reason);
      showToast("Payroll record rejected with a reason", "info");
    } catch {
      showToast("Unable to reject the payroll item.", "error");
    }
  };
  const handleConfirmApproval = async (approved: boolean) => {
    if (selectedForAction) {
      const record = payrollData.find(r => r.id === selectedForAction);
      if (record) {
        try {
          await reviewItems([selectedForAction], approved ? "APPROVE" : "REJECT", approvalNote);
          showToast(`Payroll ${approved ? "approved" : "rejected"} successfully for ${record.employee.name}`, approved ? "success" : "error");
        } catch {
          showToast(`Unable to ${approved ? "approve" : "reject"} payroll for ${record.employee.name}.`, "error");
          return;
        }
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
    void loadPayrollData().then(() => showToast("Payroll data refreshed!", "success"));
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
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Payroll operations</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Payroll Approval Center</h1>
            <p className="mt-2 text-slate-600">Review payroll items generated from Payroll Creation before authorising a payroll run.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" />Refresh</button>
            <button onClick={() => void handleConfirmBatchApproval(payrollData.filter((item) => item.status === "Pending").map((item) => item.id))} disabled={!getStatusCount("Pending")} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle className="h-4 w-4" />Approve pending</button>
          </div>
        </header>

        {toast && <div className={`rounded-lg border p-4 text-sm font-medium ${toast.type === "error" ? "border-red-200 bg-red-50 text-red-800" : toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>{toast.message}</div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Payroll items", summary.totalEmployees, "text-slate-900"],
            ["Awaiting review", getStatusCount("Pending"), "text-amber-600"],
            ["Approved", getStatusCount("Approved"), "text-emerald-600"],
            ["Total net pay", formatCurrency(summary.totalNetPay), "text-blue-700"],
          ].map(([label, value, tone]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p></div>)}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-lg font-bold text-slate-900">Payroll review queue</h2><p className="text-sm text-slate-500">Each item is tied to its payroll run and retains the reviewer decision.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search employee" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52" /></div>
              <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option><option>Draft</option></select>
              <select value={filterDepartment} onChange={(event) => setFilterDepartment(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{departments.map((department) => <option key={department}>{department}</option>)}</select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Department</th><th className="px-5 py-3 text-right">Gross pay</th><th className="px-5 py-3 text-right">Net pay</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Review details</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRecords.map((record) => <tr key={record.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{record.employee.name}</p><p className="text-xs text-slate-500">{record.employee.email || "No email"}</p></td>
                  <td className="px-5 py-4 text-slate-600">{record.employee.department}</td>
                  <td className="px-5 py-4 text-right font-medium text-slate-700">{formatCurrency(record.grossPay)}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(record.netPay)}</td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}>{getStatusIcon(record.status)}{record.status}</span></td>
                  <td className="px-5 py-4 text-xs text-slate-500">{record.reviewedBy ? <><p>{record.reviewedBy}</p><p>{record.reviewDate ? formatDateTime(record.reviewDate) : ""}</p>{record.notes && <p className="mt-1 max-w-48 truncate">{record.notes}</p>}</> : "Not reviewed"}</td>
                  <td className="px-5 py-4 text-right">{record.status === "Pending" ? <div className="inline-flex gap-2"><button onClick={() => void handleConfirmBatchApproval([record.id])} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Approve</button><button onClick={() => { const reason = window.prompt("Reason for rejection:"); if (reason?.trim()) void handleBatchReject(record.id, reason.trim()); }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Reject</button></div> : <button onClick={() => handleViewHistory(record.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">View history</button>}</td>
                </tr>)}
                {!sortedRecords.length && <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No payroll items match these filters. Create and submit a payroll run from Payroll Creation to start reviewing it here.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payroll item history</h2>
                  <p className="mt-1 text-sm text-slate-500">Creation and approval decisions recorded for this payroll item.</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex gap-2 border-b border-slate-100 px-5 py-3">
                {["All", "Created", "Approved", "Rejected"].map((filter) => <button key={filter} onClick={() => setHistoryFilter(filter)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${historyFilter === filter ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{filter}</button>)}
              </div>
              <div className="max-h-[55vh] overflow-y-auto p-5">
                {getFilteredHistory().length ? (
                  <ol className="space-y-5 border-l-2 border-slate-200 pl-5">
                    {getFilteredHistory().map((entry) => (
                      <li key={entry.id} className="relative">
                        <span className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-slate-200">{getActionIcon(entry.action)}</span>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div><p className="font-semibold text-slate-900">{entry.action}</p><p className="text-sm text-slate-600">{entry.user} · {entry.userRole}</p></div>
                          <time className="text-xs text-slate-500">{formatDateTime(entry.timestamp)}</time>
                        </div>
                        {entry.notes && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{entry.notes}</p>}
                      </li>
                    ))}
                  </ol>
                ) : <p className="py-8 text-center text-sm text-slate-500">No history entries match this filter.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
