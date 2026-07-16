import { useState } from "react";
import {
  Globe,
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Download,
  Printer,
  Calendar,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown, 
  BarChart3,
  PieChart,
  Building2,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  FolderOpen,
  ExternalLink,
  Settings,
  HelpCircle,
  BookOpen,
  Info,
  AlertTriangle,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  Copy,
  Send,
  Mail,
  Zap,
  Star,
  Flag,
  Shield,
  Clock,
  Link,
  Unlink,
  ArrowLeftRight,
  Euro,
  PoundSterling,
  Bitcoin,
  Wallet,
  Landmark,
  Calculator,
  Percent,
  ChartBar,
  Layers,
  Grid,
  List,
  RefreshCcw,
} from "lucide-react";

interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense" | "Payroll";
  category: string;
  currency: string;
  balance: number;
  localBalance: number;
  exchangeRate: number;
  lastSync: string;
  status: "Active" | "Inactive" | "Pending" | "Error";
  integration: "Native" | "SAP" | "Oracle" | "QuickBooks" | "Xero" | "Custom";
  mapping: {
    payrollAccount: string;
    description: string;
    taxCode?: string;
    costCenter?: string;
    department?: string;
  };
  history: {
    date: string;
    action: string;
    amount: number;
    currency: string;
    rate: number;
    status: string;
  }[];
  notes?: string;
}

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  baseRate: number;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
  changePercentage: number;
}

interface GLTransaction {
  id: string;
  date: string;
  reference: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: string;
  exchangeRate: number;
  localAmount: number;
  status: "Posted" | "Pending" | "Failed" | "Reversed";
  source: string;
  postedBy: string;
  postedDate: string;
  notes?: string;
}

interface GLSummary {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  localBalance: number;
  currencies: number;
  exchangeRateCount: number;
  pendingTransactions: number;
  lastSyncDate: string;
  byType: {
    type: string;
    count: number;
    balance: number;
  }[];
  byCurrency: {
    currency: string;
    count: number;
    balance: number;
    localBalance: number;
  }[];
  recentActivity: {
    action: string;
    date: string;
    user: string;
    details: string;
  }[];
}

export default function MultiCurrencyGlIntegrationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCurrency, setFilterCurrency] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "detail">("table");
  const [activeTab, setActiveTab] = useState<"overview" | "accounts" | "transactions" | "currencies">("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  // Sample GL Accounts
  const glAccounts: GLAccount[] = [
    {
      id: "gl1",
      code: "1010",
      name: "Cash - USD",
      type: "Asset",
      category: "Cash and Cash Equivalents",
      currency: "USD",
      balance: 150000,
      localBalance: 150000,
      exchangeRate: 1.0,
      lastSync: "2026-03-30T14:30:00",
      status: "Active",
      integration: "Native",
      mapping: {
        payrollAccount: "Cash-Payroll",
        description: "Payroll cash account",
        costCenter: "CC-001",
        department: "Finance",
      },
      history: [
        {
          date: "2026-03-30T14:30:00",
          action: "Synced",
          amount: 150000,
          currency: "USD",
          rate: 1.0,
          status: "Completed",
        },
        {
          date: "2026-03-29T09:00:00",
          action: "Payroll Posted",
          amount: 45000,
          currency: "USD",
          rate: 1.0,
          status: "Completed",
        },
      ],
    },
    {
      id: "gl2",
      code: "1020",
      name: "Cash - EUR",
      type: "Asset",
      category: "Cash and Cash Equivalents",
      currency: "EUR",
      balance: 85000,
      localBalance: 92000,
      exchangeRate: 1.08,
      lastSync: "2026-03-30T14:30:00",
      status: "Active",
      integration: "SAP",
      mapping: {
        payrollAccount: "Cash-Payroll-EUR",
        description: "Euro payroll account",
        costCenter: "CC-002",
        department: "Finance",
      },
      history: [
        {
          date: "2026-03-30T14:30:00",
          action: "Synced",
          amount: 85000,
          currency: "EUR",
          rate: 1.08,
          status: "Completed",
        },
      ],
    },
    {
      id: "gl3",
      code: "2010",
      name: "Payroll Payable - USD",
      type: "Liability",
      category: "Current Liabilities",
      currency: "USD",
      balance: 120000,
      localBalance: 120000,
      exchangeRate: 1.0,
      lastSync: "2026-03-30T14:30:00",
      status: "Active",
      integration: "Oracle",
      mapping: {
        payrollAccount: "Payroll-Payable",
        description: "Accrued payroll liabilities",
        taxCode: "TAX-2026",
        costCenter: "CC-003",
        department: "Finance",
      },
      history: [
        {
          date: "2026-03-30T14:30:00",
          action: "Updated",
          amount: 120000,
          currency: "USD",
          rate: 1.0,
          status: "Completed",
        },
      ],
    },
    {
      id: "gl4",
      code: "2011",
      name: "Payroll Payable - GBP",
      type: "Liability",
      category: "Current Liabilities",
      currency: "GBP",
      balance: 65000,
      localBalance: 82000,
      exchangeRate: 1.26,
      lastSync: "2026-03-29T16:00:00",
      status: "Active",
      integration: "QuickBooks",
      mapping: {
        payrollAccount: "Payroll-Payable-GBP",
        description: "UK payroll liabilities",
        taxCode: "TAX-UK-2026",
        costCenter: "CC-004",
        department: "Finance",
      },
      history: [
        {
          date: "2026-03-29T16:00:00",
          action: "Synced",
          amount: 65000,
          currency: "GBP",
          rate: 1.26,
          status: "Completed",
        },
      ],
    },
    {
      id: "gl5",
      code: "3010",
      name: "Salary Expense - USD",
      type: "Expense",
      category: "Employee Costs",
      currency: "USD",
      balance: 450000,
      localBalance: 450000,
      exchangeRate: 1.0,
      lastSync: "2026-03-30T14:30:00",
      status: "Active",
      integration: "Native",
      mapping: {
        payrollAccount: "Salary-Expense",
        description: "Base salary expenses",
        costCenter: "CC-005",
        department: "All Departments",
      },
      history: [
        {
          date: "2026-03-30T14:30:00",
          action: "Synced",
          amount: 450000,
          currency: "USD",
          rate: 1.0,
          status: "Completed",
        },
      ],
    },
    {
      id: "gl6",
      code: "3011",
      name: "Salary Expense - EUR",
      type: "Expense",
      category: "Employee Costs",
      currency: "EUR",
      balance: 280000,
      localBalance: 302400,
      exchangeRate: 1.08,
      lastSync: "2026-03-30T10:00:00",
      status: "Pending",
      integration: "Xero",
      mapping: {
        payrollAccount: "Salary-Expense-EUR",
        description: "Euro salary expenses",
        costCenter: "CC-006",
        department: "European Operations",
      },
      history: [
        {
          date: "2026-03-30T10:00:00",
          action: "Synced",
          amount: 280000,
          currency: "EUR",
          rate: 1.08,
          status: "Pending",
        },
      ],
    },
    {
      id: "gl7",
      code: "3020",
      name: "Bonus Expense - USD",
      type: "Expense",
      category: "Employee Costs",
      currency: "USD",
      balance: 75000,
      localBalance: 75000,
      exchangeRate: 1.0,
      lastSync: "2026-03-28T11:00:00",
      status: "Error",
      integration: "SAP",
      mapping: {
        payrollAccount: "Bonus-Expense",
        description: "Performance bonuses",
        costCenter: "CC-007",
        department: "All Departments",
      },
      history: [
        {
          date: "2026-03-28T11:00:00",
          action: "Sync Failed",
          amount: 75000,
          currency: "USD",
          rate: 1.0,
          status: "Error",
        },
      ],
    },
    {
      id: "gl8",
      code: "4010",
      name: "Payroll Tax Payable - USD",
      type: "Liability",
      category: "Tax Liabilities",
      currency: "USD",
      balance: 45000,
      localBalance: 45000,
      exchangeRate: 1.0,
      lastSync: "2026-03-30T14:30:00",
      status: "Active",
      integration: "Oracle",
      mapping: {
        payrollAccount: "Tax-Payable",
        description: "Withheld payroll taxes",
        taxCode: "TAX-2026-03",
        costCenter: "CC-008",
        department: "Finance",
      },
      history: [
        {
          date: "2026-03-30T14:30:00",
          action: "Updated",
          amount: 45000,
          currency: "USD",
          rate: 1.0,
          status: "Completed",
        },
      ],
    },
  ];

  // Sample Currency Rates
  const currencyRates: CurrencyRate[] = [
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      rate: 1.0,
      baseRate: 1.0,
      lastUpdated: "2026-03-30T14:30:00",
      trend: "stable",
      changePercentage: 0,
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      rate: 1.08,
      baseRate: 1.0,
      lastUpdated: "2026-03-30T14:30:00",
      trend: "up",
      changePercentage: 0.5,
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      rate: 1.26,
      baseRate: 1.0,
      lastUpdated: "2026-03-30T13:00:00",
      trend: "down",
      changePercentage: -0.3,
    },
    {
      code: "KES",
      name: "Kenyan Shilling",
      symbol: "KSh",
      rate: 130.5,
      baseRate: 1.0,
      lastUpdated: "2026-03-30T12:00:00",
      trend: "up",
      changePercentage: 0.8,
    },
    {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦",
      rate: 1500.0,
      baseRate: 1.0,
      lastUpdated: "2026-03-30T11:00:00",
      trend: "stable",
      changePercentage: 0,
    },
  ];

  // Sample GL Transactions
  const glTransactions: GLTransaction[] = [
    {
      id: "t1",
      date: "2026-03-30T14:00:00",
      reference: "PAY-2026-03-001",
      description: "March 2026 Payroll - US",
      accountCode: "1010",
      accountName: "Cash - USD",
      debit: 0,
      credit: 45000,
      currency: "USD",
      exchangeRate: 1.0,
      localAmount: 45000,
      status: "Posted",
      source: "Payroll System",
      postedBy: "System",
      postedDate: "2026-03-30T14:30:00",
    },
    {
      id: "t2",
      date: "2026-03-30T14:00:00",
      reference: "PAY-2026-03-001",
      description: "March 2026 Payroll - US",
      accountCode: "3010",
      accountName: "Salary Expense - USD",
      debit: 45000,
      credit: 0,
      currency: "USD",
      exchangeRate: 1.0,
      localAmount: 45000,
      status: "Posted",
      source: "Payroll System",
      postedBy: "System",
      postedDate: "2026-03-30T14:30:00",
    },
    {
      id: "t3",
      date: "2026-03-30T10:00:00",
      reference: "PAY-2026-03-002",
      description: "March 2026 Payroll - EU",
      accountCode: "1020",
      accountName: "Cash - EUR",
      debit: 0,
      credit: 28000,
      currency: "EUR",
      exchangeRate: 1.08,
      localAmount: 30240,
      status: "Pending",
      source: "Payroll System",
      postedBy: "System",
      postedDate: "2026-03-30T10:30:00",
    },
    {
      id: "t4",
      date: "2026-03-29T16:00:00",
      reference: "PAY-2026-03-003",
      description: "March 2026 Payroll - UK",
      accountCode: "2011",
      accountName: "Payroll Payable - GBP",
      debit: 0,
      credit: 22000,
      currency: "GBP",
      exchangeRate: 1.26,
      localAmount: 27720,
      status: "Posted",
      source: "Payroll System",
      postedBy: "System",
      postedDate: "2026-03-29T16:30:00",
    },
    {
      id: "t5",
      date: "2026-03-28T11:00:00",
      reference: "BONUS-2026-Q1",
      description: "Q1 2026 Bonus Payment",
      accountCode: "3020",
      accountName: "Bonus Expense - USD",
      debit: 25000,
      credit: 0,
      currency: "USD",
      exchangeRate: 1.0,
      localAmount: 25000,
      status: "Failed",
      source: "Payroll System",
      postedBy: "System",
      postedDate: "2026-03-28T11:30:00",
      notes: "Sync failed - connection error",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Posted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Error":
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Reversed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
      case "Posted":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Error":
      case "Failed":
        return <AlertCircle className="w-4 h-4" />;
      case "Inactive":
        return <XCircle className="w-4 h-4" />;
      case "Reversed":
        return <RefreshCcw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset":
        return "bg-blue-100 text-blue-800";
      case "Liability":
        return "bg-red-100 text-red-800";
      case "Equity":
        return "bg-purple-100 text-purple-800";
      case "Revenue":
        return "bg-green-100 text-green-800";
      case "Expense":
        return "bg-orange-100 text-orange-800";
      case "Payroll":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationColor = (integration: string) => {
    switch (integration) {
      case "Native":
        return "bg-gray-100 text-gray-800";
      case "SAP":
        return "bg-blue-100 text-blue-800";
      case "Oracle":
        return "bg-red-100 text-red-800";
      case "QuickBooks":
        return "bg-green-100 text-green-800";
      case "Xero":
        return "bg-purple-100 text-purple-800";
      case "Custom":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrencySymbol = (code: string) => {
    const currency = currencyRates.find(c => c.code === code);
    return currency ? currency.symbol : "$";
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Calculate summary
  const summary: GLSummary = {
    totalAccounts: glAccounts.length,
    activeAccounts: glAccounts.filter(a => a.status === "Active").length,
    totalBalance: glAccounts.reduce((sum, a) => sum + a.balance, 0),
    localBalance: glAccounts.reduce((sum, a) => sum + a.localBalance, 0),
    currencies: [...new Set(glAccounts.map(a => a.currency))].length,
    exchangeRateCount: glAccounts.filter(a => a.currency !== "USD").length,
    pendingTransactions: glTransactions.filter(t => t.status === "Pending").length,
    lastSyncDate: glAccounts.reduce((latest, a) => 
      a.lastSync > latest ? a.lastSync : latest, glAccounts[0].lastSync
    ),
    byType: glAccounts.reduce((acc, account) => {
      const type = acc.find(t => t.type === account.type);
      if (type) {
        type.count++;
        type.balance += account.balance;
      } else {
        acc.push({
          type: account.type,
          count: 1,
          balance: account.balance,
        });
      }
      return acc;
    }, [] as { type: string; count: number; balance: number; }[]),
    byCurrency: glAccounts.reduce((acc, account) => {
      const curr = acc.find(c => c.currency === account.currency);
      if (curr) {
        curr.count++;
        curr.balance += account.balance;
        curr.localBalance += account.localBalance;
      } else {
        acc.push({
          currency: account.currency,
          count: 1,
          balance: account.balance,
          localBalance: account.localBalance,
        });
      }
      return acc;
    }, [] as { currency: string; count: number; balance: number; localBalance: number; }[]),
    recentActivity: glAccounts
      .flatMap(a => a.history.map(h => ({
        action: h.action,
        date: h.date,
        user: "System",
        details: `${a.name} - ${formatCurrency(h.amount, a.currency)}`,
      })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10),
  };

  const accountTypes = ["All", ...new Set(glAccounts.map(a => a.type))];
  const currencies = ["All", ...new Set(glAccounts.map(a => a.currency))];
  const statuses = ["All", "Active", "Inactive", "Pending", "Error"];

  const filteredAccounts = glAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.mapping.payrollAccount.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || account.type === filterType;
    const matchesCurrency = filterCurrency === "All" || account.currency === filterCurrency;
    const matchesStatus = filterStatus === "All" || account.status === filterStatus;
    return matchesSearch && matchesType && matchesCurrency && matchesStatus;
  });

  const selectedAccountData = glAccounts.find(a => a.id === selectedAccount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Multi-Currency GL Integration</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  v2.4
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage general ledger accounts with multi-currency support and payroll integration
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsLoading(true)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Sync All
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowMappingModal(true)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Link className="w-4 h-4" />
                Map Account
              </button>
              <button
                onClick={() => setShowSyncModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <RefreshCcw className="w-4 h-4" />
                Sync Now
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(summary.totalBalance, "USD")}
                </p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Local: {formatCurrency(summary.localBalance, "USD")}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">GL Accounts</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {summary.totalAccounts}
                </p>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-green-600">{summary.activeAccounts} active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Currencies</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {summary.currencies}
                </p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {summary.exchangeRateCount} with exchange rates
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending Sync</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {summary.pendingTransactions}
                </p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              Last sync: {formatDateWithTime(summary.lastSyncDate)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PieChart className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "accounts"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Landmark className="w-4 h-4" />
              GL Accounts
              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs">
                {glAccounts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "transactions"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Receipt className="w-4 h-4" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("currencies")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "currencies"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-4 h-4" />
              Currencies & Rates
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Account Type Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-600" />
                Account Distribution by Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary.byType.map((type) => (
                  <div key={type.type} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(type.type)}`}>
                        {type.type}
                      </span>
                      <span className="text-sm text-slate-500">{type.count} accounts</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 mt-2">
                      {formatCurrency(type.balance, "USD")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Currency Distribution
              </h3>
              <div className="space-y-3">
                {summary.byCurrency.map((curr) => (
                  <div key={curr.currency}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        {curr.currency} ({getCurrencySymbol(curr.currency)})
                      </span>
                      <span className="text-slate-600">
                        {curr.count} accounts • {formatCurrency(curr.balance, curr.currency)}
                        <span className="text-slate-400 ml-2">
                          (Local: {formatCurrency(curr.localBalance, "USD")})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"
                        style={{
                          width: `${(curr.localBalance / summary.localBalance) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {summary.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                      {index < summary.recentActivity.length - 1 && (
                        <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <span className="text-sm text-slate-500">{formatDateWithTime(activity.date)}</span>
                      </div>
                      <p className="text-sm text-slate-600">{activity.details}</p>
                      <p className="text-xs text-slate-400">By {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GL Accounts Tab */}
        {activeTab === "accounts" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by account name, code, or payroll mapping..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {accountTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterCurrency}
                      onChange={(e) => setFilterCurrency(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
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
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        viewMode === "cards"
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Currency
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Integration
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                              <Landmark className="w-14 h-14 text-slate-300" />
                              <p className="text-lg font-medium">No GL accounts found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredAccounts.map((account) => (
                          <tr key={account.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-slate-900">{account.name}</p>
                                <p className="text-sm text-slate-500">{account.code}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                                {account.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              {account.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                              {formatCurrency(account.balance, account.currency)}
                              <p className="text-xs text-slate-400">
                                Local: {formatCurrency(account.localBalance, "USD")}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {account.exchangeRate !== 1.0 ? (
                                <span className="font-medium">{formatNumber(account.exchangeRate)}</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}>
                                {getStatusIcon(account.status)}
                                {account.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntegrationColor(account.integration)}`}>
                                {account.integration}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedAccount(account.id);
                                    setViewMode("detail");
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                  <Edit className="w-4 h-4" />
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
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3">
                      <Landmark className="w-14 h-14 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No GL accounts found</p>
                    </div>
                  </div>
                ) : (
                  filteredAccounts.map((account) => (
                    <div key={account.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{account.name}</h3>
                          <p className="text-sm text-slate-500">Code: {account.code}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}>
                          {getStatusIcon(account.status)}
                          {account.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Type</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">Currency</p>
                          <p className="font-medium">{account.currency}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 col-span-2">
                          <p className="text-xs text-slate-500">Balance</p>
                          <p className="font-bold text-slate-900">{formatCurrency(account.balance, account.currency)}</p>
                          <p className="text-xs text-slate-400">Local: {formatCurrency(account.localBalance, "USD")}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIntegrationColor(account.integration)}`}>
                            {account.integration}
                          </span>
                          {account.exchangeRate !== 1.0 && (
                            <span className="text-xs text-slate-500">
                              Rate: {formatNumber(account.exchangeRate)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedAccount(account.id);
                              setViewMode("detail");
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
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

        {/* Detail View */}
        {viewMode === "detail" && selectedAccountData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("table")}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 text-slate-600 rotate-45" />
                </button>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedAccountData.name}
                </h2>
                <span className="text-sm text-slate-500">Code: {selectedAccountData.code}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAccountData.status)}`}>
                  {getStatusIcon(selectedAccountData.status)}
                  {selectedAccountData.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                  <RefreshCcw className="w-4 h-4" />
                  Sync
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Account Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Balance</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedAccountData.balance, selectedAccountData.currency)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Local Balance (USD)</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {formatCurrency(selectedAccountData.localBalance, "USD")}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Exchange Rate</p>
                  <p className="text-xl font-bold text-slate-900">
                    {selectedAccountData.exchangeRate !== 1.0 ? formatNumber(selectedAccountData.exchangeRate) : "Base Currency"}
                  </p>
                </div>
              </div>

              {/* Mapping Details */}
              <div className="border border-slate-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4 text-indigo-600" />
                  Payroll Mapping
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payroll Account</span>
                    <span className="font-medium">{selectedAccountData.mapping.payrollAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Description</span>
                    <span className="font-medium">{selectedAccountData.mapping.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cost Center</span>
                    <span className="font-medium">{selectedAccountData.mapping.costCenter || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Department</span>
                    <span className="font-medium">{selectedAccountData.mapping.department || "N/A"}</span>
                  </div>
                  {selectedAccountData.mapping.taxCode && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-slate-600">Tax Code</span>
                      <span className="font-medium">{selectedAccountData.mapping.taxCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Transaction History
                </h4>
                <div className="space-y-3">
                  {selectedAccountData.history.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                        {index < selectedAccountData.history.length - 1 && (
                          <div className="absolute top-3 left-1 w-0.5 h-full bg-slate-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{item.action}</p>
                          <span className="text-sm text-slate-500">{formatDateWithTime(item.date)}</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Amount: {formatCurrency(item.amount, item.currency)}
                          {item.rate !== 1.0 && ` (Rate: ${formatNumber(item.rate)})`}
                        </p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-600" />
                GL Transactions
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Entry
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Credit
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Currency
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
                  {glTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-900">{transaction.reference}</p>
                          <p className="text-sm text-slate-500">{transaction.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-slate-900">{transaction.accountName}</p>
                        <p className="text-sm text-slate-500">{transaction.accountCode}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-green-600">
                        {transaction.debit > 0 ? formatCurrency(transaction.debit, transaction.currency) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-600">
                        {transaction.credit > 0 ? formatCurrency(transaction.credit, transaction.currency) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-medium">{transaction.currency}</span>
                        <p className="text-xs text-slate-400">
                          Rate: {formatNumber(transaction.exchangeRate)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Currencies Tab */}
        {activeTab === "currencies" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Currency Rates
              </h3>
              <button
                onClick={() => setShowRateModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <RefreshCcw className="w-4 h-4" />
                Update Rates
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currencyRates.map((currency) => (
                  <div key={currency.code} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">{currency.code}</span>
                          <span className="text-sm text-slate-500">{currency.symbol}</span>
                        </div>
                        <p className="text-sm text-slate-500">{currency.name}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        currency.trend === "up" ? "text-green-600" :
                        currency.trend === "down" ? "text-red-600" :
                        "text-slate-600"
                      }`}>
                        {currency.trend === "up" && <ArrowUpRight className="w-4 h-4" />}
                        {currency.trend === "down" && <ArrowDownRight className="w-4 h-4" />}
                        {currency.trend === "stable" && <CheckCircle className="w-4 h-4" />}
                        <span>{Math.abs(currency.changePercentage).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Rate (USD)</span>
                        <span className="font-medium">{formatNumber(currency.rate)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-600">Base Rate</span>
                        <span className="font-medium">{formatNumber(currency.baseRate)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-600">Last Updated</span>
                        <span className="font-medium text-xs">{formatDateWithTime(currency.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>Exchange rates are updated automatically every 6 hours. Rates shown are mid-market rates for reference.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Map Payroll Account</p>
              <p className="text-xs text-slate-500">Connect GL to payroll</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <RefreshCcw className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Sync All Accounts</p>
              <p className="text-xs text-slate-500">Update balances & rates</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Integration Settings</p>
              <p className="text-xs text-slate-500">Configure connections</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Documentation</p>
              <p className="text-xs text-slate-500">GL integration guides</p>
            </div>
          </div>
        </div>

        {/* Mapping Modal */}
        {showMappingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Map GL Account</h3>
                  <p className="text-sm text-slate-500">Connect GL account to payroll</p>
                </div>
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GL Account</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    {glAccounts.map(account => (
                      <option key={account.id}>{account.code} - {account.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Account</label>
                  <input
                    type="text"
                    placeholder="e.g., Salary-Expense"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Account description"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost Center</label>
                    <input
                      type="text"
                      placeholder="Cost center code"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Department name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Link className="w-4 h-4" />
                  Map Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sync Modal */}
        {showSyncModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Syncing Accounts</h3>
                <p className="text-slate-600 mb-4">
                  Synchronizing GL accounts with payroll system...
                </p>
                <div className="bg-slate-50 rounded-xl p-4 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Accounts synced</span>
                      <span className="font-medium">4/8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exchange rates updated</span>
                      <span className="font-medium text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Transactions pending</span>
                      <span className="font-medium text-yellow-600">3</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rate Modal */}
        {showRateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Update Currency Rates</h3>
                  <p className="text-sm text-slate-500">Manually update exchange rates</p>
                </div>
                <button
                  onClick={() => setShowRateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3">
                {currencyRates.filter(c => c.code !== "USD").map((currency) => (
                  <div key={currency.code} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                    <div className="w-10 text-center font-bold text-slate-900">{currency.code}</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        defaultValue={currency.rate}
                        step="0.0001"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-right"
                      />
                    </div>
                    <div className="text-sm text-slate-500">USD</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Update Rates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}