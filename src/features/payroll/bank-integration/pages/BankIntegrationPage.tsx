<<<<<<< HEAD
import { useState } from "react";
import {
  Building2,
  Banknote,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  Link,
  DollarSign,
  Clock,
  FileText,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  HelpCircle,
} from "lucide-react";

const BANK_INTEGRATION_REFERENCE_TIME = new Date("2026-04-01T12:00:00").getTime();

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: "Checking" | "Savings" | "Business";
  currency: string;
  balance: number;
  status: "Active" | "Pending" | "Inactive" | "Error";
  lastSync: string;
  connectionType: "API" | "Manual" | "File";
  transactions: number;
  bankCode: string;
  branchCode?: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  manager?: string;
  phone?: string;
  email?: string;
  website?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
  status: "Completed" | "Pending" | "Failed";
  reference: string;
  accountId: string;
}

export default function BankIntegrationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample bank accounts data
  const bankAccounts: BankAccount[] = [
    {
      id: "1",
      bankName: "Chase Bank",
      accountName: "Main Operating Account",
      accountNumber: "****4567",
      accountType: "Business",
      currency: "USD",
      balance: 245000,
      status: "Active",
      lastSync: "2026-03-30T14:30:00",
      connectionType: "API",
      transactions: 156,
      bankCode: "021000021",
      routingNumber: "021000021",
      swiftCode: "CHASUS33",
      country: "USA",
      manager: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "chase@company.com",
      website: "www.chase.com",
      createdAt: "2025-01-15T10:00:00",
      updatedAt: "2026-03-30T14:30:00",
    },
    {
      id: "2",
      bankName: "Bank of America",
      accountName: "Payroll Account",
      accountNumber: "****8901",
      accountType: "Business",
      currency: "USD",
      balance: 87000,
      status: "Active",
      lastSync: "2026-03-29T09:15:00",
      connectionType: "API",
      transactions: 89,
      bankCode: "026009593",
      routingNumber: "026009593",
      swiftCode: "BOFAUS3N",
      country: "USA",
      manager: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      email: "bofa@company.com",
      website: "www.bankofamerica.com",
      createdAt: "2025-03-20T11:30:00",
      updatedAt: "2026-03-29T09:15:00",
    },
    {
      id: "3",
      bankName: "Wells Fargo",
      accountName: "Vendor Payments",
      accountNumber: "****2345",
      accountType: "Checking",
      currency: "USD",
      balance: 120000,
      status: "Pending",
      lastSync: "2026-03-28T16:45:00",
      connectionType: "Manual",
      transactions: 45,
      bankCode: "121000248",
      routingNumber: "121000248",
      swiftCode: "WFBIUS6S",
      country: "USA",
      manager: "Michael Chen",
      phone: "+1 (555) 456-7890",
      email: "wellsfargo@company.com",
      website: "www.wellsfargo.com",
      createdAt: "2025-06-10T13:20:00",
      updatedAt: "2026-03-28T16:45:00",
    },
    {
      id: "4",
      bankName: "HSBC",
      accountName: "International Account",
      accountNumber: "****6789",
      accountType: "Business",
      currency: "EUR",
      balance: 65000,
      status: "Active",
      lastSync: "2026-03-30T11:00:00",
      connectionType: "API",
      transactions: 34,
      bankCode: "HSBCGB2L",
      swiftCode: "HSBCGB2L",
      iban: "GB29HBUK1234567890",
      country: "UK",
      manager: "Emily Rodriguez",
      phone: "+44 20 1234 5678",
      email: "hsbc@company.com",
      website: "www.hsbc.com",
      createdAt: "2025-09-05T09:45:00",
      updatedAt: "2026-03-30T11:00:00",
    },
    {
      id: "5",
      bankName: "Silicon Valley Bank",
      accountName: "Investment Account",
      accountNumber: "****0123",
      accountType: "Savings",
      currency: "USD",
      balance: 450000,
      status: "Error",
      lastSync: "2026-03-27T08:30:00",
      connectionType: "API",
      transactions: 23,
      bankCode: "121140399",
      routingNumber: "121140399",
      swiftCode: "SVBKUS6S",
      country: "USA",
      manager: "David Kim",
      phone: "+1 (555) 789-0123",
      email: "svb@company.com",
      website: "www.svb.com",
      createdAt: "2026-01-20T14:00:00",
      updatedAt: "2026-03-27T08:30:00",
    },
  ];

  // Sample recent transactions
  const recentTransactions: BankTransaction[] = [
    {
      id: "t1",
      date: "2026-03-30T10:30:00",
      description: "Payroll - March 2026",
      amount: 125000,
      type: "Debit",
      status: "Completed",
      reference: "PAY-2026-03",
      accountId: "1",
    },
    {
      id: "t2",
      date: "2026-03-29T15:20:00",
      description: "Client Payment - Acme Corp",
      amount: 45000,
      type: "Credit",
      status: "Completed",
      reference: "INV-2026-089",
      accountId: "1",
    },
    {
      id: "t3",
      date: "2026-03-28T09:45:00",
      description: "Vendor Payment - Office Supplies",
      amount: 3500,
      type: "Debit",
      status: "Pending",
      reference: "PO-2026-456",
      accountId: "3",
    },
    {
      id: "t4",
      date: "2026-03-27T14:10:00",
      description: "International Transfer",
      amount: 12000,
      type: "Debit",
      status: "Completed",
      reference: "TRF-2026-123",
      accountId: "4",
    },
    {
      id: "t5",
      date: "2026-03-26T11:30:00",
      description: "Interest Payment",
      amount: 2500,
      type: "Credit",
      status: "Completed",
      reference: "INT-2026-03",
      accountId: "5",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Inactive":
        return <XCircle className="w-4 h-4" />;
      case "Error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Business":
        return "bg-blue-100 text-blue-800";
      case "Checking":
        return "bg-purple-100 text-purple-800";
      case "Savings":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeColor = (type: string) => {
    return type === "Credit" ? "text-green-600" : "text-red-600";
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = BANK_INTEGRATION_REFERENCE_TIME - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredAccounts = bankAccounts.filter((account) => {
    const matchesSearch =
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm);
    const matchesStatus =
      filterStatus === "All" || account.status === filterStatus;
    const matchesType =
      filterType === "All" || account.accountType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = bankAccounts.filter((a) => a.status === "Active").length;
  const errorAccounts = bankAccounts.filter((a) => a.status === "Error").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Bank Integration
                </h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  v2.4
                </span>
              </div>
              <p className="text-slate-600 ml-1">
                Manage connected bank accounts and monitor transactions
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
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Total Balance
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>8.2% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Connected Accounts
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {bankAccounts.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{activeAccounts} active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {bankAccounts.reduce((sum, acc) => sum + acc.transactions, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <span>Last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Integration Status
                </p>
                <p className="text-2xl font-bold mt-1">
                  {errorAccounts > 0 ? (
                    <span className="text-red-600">{errorAccounts} Errors</span>
                  ) : (
                    <span className="text-green-600">All Active</span>
                  )}
                </p>
              </div>
              <div className={errorAccounts > 0 ? "bg-red-100 p-3 rounded-xl" : "bg-green-100 p-3 rounded-xl"}>
                {errorAccounts > 0 ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
              <Shield className="w-3 h-3" />
              <span>Secure connections</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by bank, account name, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Error">Error</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                >
                  <option value="All">All Types</option>
                  <option value="Business">Business</option>
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
              <button className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Advanced</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {filteredAccounts.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200/60">
              <div className="flex flex-col items-center gap-3">
                <Building2 className="w-16 h-16 text-slate-300" />
                <p className="text-lg font-medium text-slate-600">
                  No bank accounts found
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting your filters or add a new account
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                </button>
              </div>
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {account.bankName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {account.accountName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-slate-500">Balance</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-500">Account</p>
                      <p className="text-sm font-medium text-slate-900">
                        {account.accountNumber}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-500">Type</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(
                          account.accountType
                        )}`}
                      >
                        {account.accountType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          account.status
                        )}`}
                      >
                        {getStatusIcon(account.status)}
                        {account.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {account.connectionType}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Last sync</p>
                      <p className="text-xs text-slate-700 font-medium">
                        {formatTimeAgo(account.lastSync)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-all flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Sync
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Transactions
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {recentTransactions.length}
              </span>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((transaction) => {
              const account = bankAccounts.find(
                (a) => a.id === transaction.accountId
              );
              return (
                <div
                  key={transaction.id}
                  className="px-6 py-3 hover:bg-slate-50/70 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "Credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "Credit" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(transaction.date)}</span>
                        <span>•</span>
                        <span className="font-mono">{transaction.reference}</span>
                        {account && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">
                              {account.bankName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${getTransactionTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type === "Credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Connect New Bank</p>
              <p className="text-xs text-slate-500">Link via API or manual</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Export Statement</p>
              <p className="text-xs text-slate-500">Download reports</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Integration Settings</p>
              <p className="text-xs text-slate-500">Configure connections</p>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-all flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">Help & Support</p>
              <p className="text-xs text-slate-500">Documentation & guides</p>
            </div>
          </button>
        </div>

        {/* Add Account Modal - Simplified version */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Add Bank Account
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Connect a new bank account for payroll processing
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Chase Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Main Operating Account"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    <option>Business</option>
                    <option>Checking</option>
                    <option>Savings</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



=======
import ModulePlaceholderPage from "../../../../components/shared/ModulePlaceholderPage";

export default function BankIntegrationAccountsPage() {
  return <ModulePlaceholderPage title="Bank Integration (Accounts)" />;
}
>>>>>>> 72d0d7946e4ebc46e832ea6538481baa3779a816
