import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  X, 
  Calendar, 
  User, 
  Building2, 
  FileCheck, 
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  ChevronDown,
  RefreshCw, 
  Ban,
  FilePlus,
  AlertTriangle,
  Check
} from 'lucide-react';

type ContractType = 'permanent' | 'fixed-term' | 'probation' | 'casual' | 'consultant';
type ContractStatus = 'active' | 'expiring_soon' | 'expired' | 'terminated';

interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  branch: string;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  termsSummary: string;
  salary: number;
  probationPeriod: number | null;
  documentUrl: string | null;
  renewalHistory: { date: string; type: string; note: string }[];
  expiryAlertDays: number;
  attachments: string[];
  notes: string;
}

const mockEmployees = [
  { id: 'emp1', name: 'Sarah Kimani', department: 'Engineering', branch: 'Nairobi HQ' },
  { id: 'emp2', name: 'James Ochieng', department: 'Finance', branch: 'Nairobi HQ' },
  { id: 'emp3', name: 'Grace Wanjiku', department: 'HR', branch: 'Nairobi HQ' },
  { id: 'emp4', name: 'Peter Ndungu', department: 'Sales', branch: 'Mombasa' },
  { id: 'emp5', name: 'Mary Akinyi', department: 'Operations', branch: 'Kisumu' },
  { id: 'emp6', name: 'Robert Otieno', department: 'Customer Support', branch: 'Nairobi HQ' },
  { id: 'emp7', name: 'Alice Nyambura', department: 'R&D', branch: 'Nairobi HQ' },
  { id: 'emp8', name: 'David Mwangi', department: 'Legal', branch: 'Nairobi HQ' },
];

const mockContracts: Contract[] = [
  {
    id: 'c1',
    employeeId: 'emp1',
    employeeName: 'Sarah Kimani',
    department: 'Engineering',
    branch: 'Nairobi HQ',
    contractType: 'permanent',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    status: 'active',
    termsSummary: 'Standard engineering contract with 3-month probation.',
    salary: 850000,
    probationPeriod: 3,
    documentUrl: '/contracts/c1.pdf',
    renewalHistory: [
      { date: '2024-01-15', type: 'initial', note: 'Initial contract' }
    ],
    expiryAlertDays: 45,
    attachments: ['c1_signed.pdf', 'c1_amendment.pdf'],
    notes: 'High performer, recommended for promotion next year.'
  },
  {
    id: 'c2',
    employeeId: 'emp2',
    employeeName: 'James Ochieng',
    department: 'Finance',
    branch: 'Nairobi HQ',
    contractType: 'fixed-term',
    startDate: '2023-03-01',
    endDate: '2024-08-15',
    status: 'expiring_soon',
    termsSummary: 'Finance manager contract, renewable.',
    salary: 950000,
    probationPeriod: null,
    documentUrl: '/contracts/c2.pdf',
    renewalHistory: [
      { date: '2023-03-01', type: 'initial', note: 'Initial contract' }
    ],
    expiryAlertDays: 30,
    attachments: ['c2_signed.pdf'],
    notes: 'Will discuss renewal in July.'
  },
  {
    id: 'c3',
    employeeId: 'emp3',
    employeeName: 'Grace Wanjiku',
    department: 'HR',
    branch: 'Nairobi HQ',
    contractType: 'permanent',
    startDate: '2021-06-01',
    endDate: '2024-06-01',
    status: 'expired',
    termsSummary: 'HR Business Partner contract.',
    salary: 780000,
    probationPeriod: 3,
    documentUrl: '/contracts/c3.pdf',
    renewalHistory: [
      { date: '2021-06-01', type: 'initial', note: 'Initial contract' },
      { date: '2023-06-01', type: 'renewal', note: 'Renewed for 1 year' }
    ],
    expiryAlertDays: 0,
    attachments: ['c3_signed.pdf', 'c3_renewal.pdf'],
    notes: 'Contract expired, new role pending.'
  },
];

const getStatusColor = (status: ContractStatus) => {
  const map = {
    active: 'bg-green-100 text-green-700 border-green-200',
    expiring_soon: 'bg-amber-100 text-amber-700 border-amber-200',
    expired: 'bg-gray-100 text-gray-700 border-gray-200',
    terminated: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: ContractStatus) => {
  const map: Record<ContractStatus, React.ElementType> = {
    active: CheckCircle,
    expiring_soon: AlertCircle,
    expired: X,
    terminated: Ban,
  };
  return map[status] || Clock;
};

const getContractTypeLabel = (type: ContractType) => {
  const map: Record<ContractType, string> = {
    permanent: 'Permanent',
    'fixed-term': 'Fixed-Term',
    probation: 'Probation',
    casual: 'Casual',
    consultant: 'Consultant',
  };
  return map[type] || type;
};

const getDaysUntilExpiry = (endDate: string) => {
  const diff = new Date(endDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

function StatusBadge({ status }: { status: ContractStatus }) {
  const Icon = getStatusIcon(status);
  const color = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

function ContractTypeBadge({ type }: { type: ContractType }) {
  const colors: Record<ContractType, string> = {
    permanent: 'bg-blue-100 text-blue-700',
    'fixed-term': 'bg-purple-100 text-purple-700',
    probation: 'bg-amber-100 text-amber-700',
    casual: 'bg-teal-100 text-teal-700',
    consultant: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
      {getContractTypeLabel(type)}
    </span>
  );
}

function ContractFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterDepartment,
  setFilterDepartment,
}: any) {
  const statuses = ['all', 'active', 'expiring_soon', 'expired', 'terminated'];
  const types = ['all', 'permanent', 'fixed-term', 'probation', 'casual', 'consultant'];
  const departments = ['all', 'Engineering', 'Finance', 'HR', 'Sales', 'Operations', 'Customer Support', 'R&D', 'Legal'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : getContractTypeLabel(t as ContractType)}</option>
          ))}
        </select>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-700"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ContractList({ contracts, onSelect, onRenew, onTerminate, role }: any) {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No contracts found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Employee</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Department</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Type</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Start Date</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">End Date</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Status</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Days Left</th>
              <th className="text-right text-xs text-gray-500 py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract: Contract) => {
              const daysLeft = getDaysUntilExpiry(contract.endDate);
              return (
                <tr
                  key={contract.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => onSelect(contract.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contract.employeeName}</p>
                        <p className="text-xs text-gray-500">{contract.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{contract.department}</td>
                  <td className="py-3 px-4">
                    <ContractTypeBadge type={contract.contractType} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={contract.status} />
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {daysLeft <= 30 ? (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {daysLeft} days
                      </span>
                    ) : (
                      <span className="text-gray-500">{daysLeft} days</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition"
                        onClick={(e) => { e.stopPropagation(); onSelect(contract.id); }}
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {role === 'hr_admin' && (
                        <>
                          <button
                            className="p-1 hover:bg-green-50 rounded transition"
                            onClick={(e) => { e.stopPropagation(); onRenew(contract.id); }}
                          >
                            <RefreshCw className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-red-50 rounded transition"
                            onClick={(e) => { e.stopPropagation(); onTerminate(contract.id); }}
                          >
                            <Ban className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContractDetailModal({ isOpen, onClose, contract, role, onRenew, onTerminate }: any) {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !contract) return null;

  const daysLeft = getDaysUntilExpiry(contract.endDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">{contract.employeeName}</h3>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {contract.department} · {contract.branch}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <div className="flex gap-4">
            {['details', 'documents', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'details' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Type:</span>
                    <ContractTypeBadge type={contract.contractType} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Start:</span>
                    <span className="text-gray-700">{new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">End:</span>
                    <span className="text-gray-700">{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                  {contract.probationPeriod && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Probation:</span>
                      <span className="text-gray-700">{contract.probationPeriod} months</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Days until expiry:</span>
                    <span className={daysLeft <= 30 ? 'text-amber-600 font-medium' : 'text-gray-700'}>
                      {daysLeft} days
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Salary:</span>
                    <span className="text-gray-700 ml-2">
                      KES {contract.salary.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Terms Summary:</span>
                    <p className="text-gray-700 mt-1">{contract.termsSummary}</p>
                  </div>
                  {contract.notes && (
                    <div className="text-sm">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-700 mt-1">{contract.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              {role === 'hr_admin' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onRenew(contract.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Renew Contract
                  </button>
                  <button
                    onClick={() => onTerminate(contract.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Terminate
                  </button>
                  <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              {contract.attachments && contract.attachments.length > 0 ? (
                contract.attachments.map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-700" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                    <button className="text-sm text-blue-700 hover:underline flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>No documents attached</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {contract.renewalHistory && contract.renewalHistory.length > 0 ? (
                contract.renewalHistory.map((entry: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <FileCheck className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {entry.type === 'initial' ? 'Initial Contract' : 'Renewal'}
                        </p>
                        <p className="text-xs text-gray-500">{entry.note}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>No history available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContractRenewalModal({ isOpen, onClose, onConfirm, contract }: any) {
  const [newEndDate, setNewEndDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !contract) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndDate) return;
    onConfirm(contract.id, newEndDate, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Renew Contract</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <p className="text-sm text-gray-900">{contract.employeeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New End Date</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                rows={3}
                placeholder="e.g., Performance satisfactory, renewal for 1 year"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              Confirm Renewal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContractTerminationModal({ isOpen, onClose, onConfirm, contract }: any) {
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !contract) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveDate) return;
    onConfirm(contract.id, effectiveDate, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Terminate Contract</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <p className="text-sm text-gray-900">{contract.employeeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Termination</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                rows={3}
                placeholder="e.g., Resignation, End of contract, Performance issues"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              Confirm Termination
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpiryAlerts({ contracts, onSelect }: any) {
  const expiringContracts = contracts.filter((c: Contract) => 
    getDaysUntilExpiry(c.endDate) <= 30 && c.status !== 'expired' && c.status !== 'terminated'
  ).sort((a: Contract, b: Contract) => getDaysUntilExpiry(a.endDate) - getDaysUntilExpiry(b.endDate));

  if (expiringContracts.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-700">
          {expiringContracts.length} contract{expiringContracts.length > 1 ? 's' : ''} expiring soon
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {expiringContracts.slice(0, 5).map((c: Contract) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="text-xs bg-white px-3 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition flex items-center gap-1"
            >
              {c.employeeName} ({getDaysUntilExpiry(c.endDate)} days)
            </button>
          ))}
          {expiringContracts.length > 5 && (
            <span className="text-xs text-gray-500">+{expiringContracts.length - 5} more</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: any) {
  const colors: Record<string, string> = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type] || colors.info}`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddContractModal({ isOpen, onClose, onConfirm }: any) {
  const [formData, setFormData] = useState({
    employeeId: '',
    contractType: 'permanent' as ContractType,
    startDate: '',
    endDate: '',
    probationPeriod: 3,
    salary: '',
    termsSummary: '',
    notes: '',
    attachments: [] as string[],
  });

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newAttachment, setNewAttachment] = useState('');

  if (!isOpen) return null;

  const handleEmployeeChange = (employeeId: string) => {
    const emp = mockEmployees.find(e => e.id === employeeId);
    setSelectedEmployee(emp);
    setFormData({ ...formData, employeeId });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment.trim()]
      });
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const selectedEmp = mockEmployees.find(e => e.id === formData.employeeId);
    if (!selectedEmp) return;

    const newContract: Contract = {
      id: `c${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: selectedEmp.name,
      department: selectedEmp.department,
      branch: selectedEmp.branch,
      contractType: formData.contractType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
      termsSummary: formData.termsSummary || 'Standard contract',
      salary: parseInt(formData.salary) || 0,
      probationPeriod: formData.contractType === 'probation' ? formData.probationPeriod : null,
      documentUrl: null,
      renewalHistory: [{ date: formData.startDate, type: 'initial', note: 'Initial contract' }],
      expiryAlertDays: getDaysUntilExpiry(formData.endDate),
      attachments: formData.attachments,
      notes: formData.notes || '',
    };

    onConfirm(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FilePlus className="w-6 h-6 text-blue-700" />
              New Contract
            </h3>
            <p className="text-sm text-gray-500 mt-1">Create a new employee contract</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-700" />
              Employee Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  required
                >
                  <option value="">Select Employee</option>
                  {mockEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={selectedEmployee?.department || ''}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Contract Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  required
                >
                  <option value="permanent">Permanent</option>
                  <option value="fixed-term">Fixed-Term</option>
                  <option value="probation">Probation</option>
                  <option value="casual">Casual</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (KES) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., 850000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  required
                  min={formData.startDate || undefined}
                />
              </div>
              {formData.contractType === 'probation' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probation Period (months)</label>
                  <select
                    name="probationPeriod"
                    value={formData.probationPeriod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  >
                    <option value={1}>1 month</option>
                    <option value={2}>2 months</option>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-700" />
              Contract Terms
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms Summary</label>
                <input
                  type="text"
                  name="termsSummary"
                  value={formData.termsSummary}
                  onChange={handleInputChange}
                  placeholder="e.g., Standard engineering contract with 3-month probation"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Any additional notes about this contract..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-700" />
              Document Attachment
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                placeholder="Enter document name..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Add Document
              </button>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Create Contract
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContractManagementPage() {
  const [role] = useState('hr_admin');

  const [contracts, setContracts] = useState(mockContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesType = filterType === 'all' || c.contractType === filterType;
      const matchesDepartment = filterDepartment === 'all' || c.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesType && matchesDepartment;
    });
  }, [contracts, searchTerm, filterStatus, filterType, filterDepartment]);

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const handleSelectContract = (id: string) => {
    setSelectedContractId(id);
    setIsDetailModalOpen(true);
  };

  const handleRenew = (id: string) => {
    setSelectedContractId(id);
    setIsRenewalModalOpen(true);
  };

  const handleTerminate = (id: string) => {
    setSelectedContractId(id);
    setIsTerminationModalOpen(true);
  };

  const handleAddContract = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
    setToast({ message: `Contract created for ${newContract.employeeName}!`, type: 'success' });
    setIsAddModalOpen(false);
  };

  const handleRenewConfirm = (id: string, newEndDate: string, reason: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c };
          updated.endDate = newEndDate;
          updated.status = 'active';
          updated.renewalHistory.push({ date: new Date().toISOString(), type: 'renewal', note: reason });
          return updated;
        }
        return c;
      })
    );
    setToast({ message: 'Contract renewed successfully!', type: 'success' });
    setIsRenewalModalOpen(false);
  };

  const handleTerminateConfirm = (id: string, effectiveDate: string, reason: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, status: 'terminated', endDate: effectiveDate };
        }
        return c;
      })
    );
    setToast({ message: 'Contract terminated successfully!', type: 'success' });
    setIsTerminationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-700" />
            Contract Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employee contracts, renewals, and expirations
          </p>
        </div>
        {role === 'hr_admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        )}
      </div>

      <ExpiryAlerts contracts={filteredContracts} onSelect={handleSelectContract} />

      <ContractFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
      />

      <ContractList
        contracts={filteredContracts}
        onSelect={handleSelectContract}
        onRenew={handleRenew}
        onTerminate={handleTerminate}
        role={role}
      />

      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddContract}
      />

      <ContractDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contract={selectedContract}
        role={role}
        onRenew={handleRenew}
        onTerminate={handleTerminate}
      />

      <ContractRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        onConfirm={handleRenewConfirm}
        contract={selectedContract}
      />

      <ContractTerminationModal
        isOpen={isTerminationModalOpen}
        onClose={() => setIsTerminationModalOpen(false)}
        onConfirm={handleTerminateConfirm}
        contract={selectedContract}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}