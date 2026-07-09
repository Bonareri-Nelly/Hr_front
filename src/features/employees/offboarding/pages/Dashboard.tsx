// src/features/employees/offboarding/pages/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  User,
  FileText,
  Laptop,
  Briefcase,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useOffboarding } from '../hooks/useOffboarding';
import type { OffboardingCase } from '../types';

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  valueColor?: string;
  trend?: number;
}> = ({ title, value, icon: Icon, description, valueColor = 'text-white', trend }) => (
  <Card className="bg-gradient-to-br from-navy-800/80 to-navy-900/80 border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/10">
    <CardContent className="pt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="rounded-full bg-gold-500/20 p-3">
          <Icon className="h-5 w-5 text-gold-400" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-400">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Initiate Offboarding Modal
const InitiateOffboardingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInitiate: (data: Partial<OffboardingCase>) => Promise<void> | void;
}> = ({ isOpen, onClose, onInitiate }) => {
  const [formData, setFormData] = useState<Partial<OffboardingCase>>({
    employeeName: '',
    employeeEmail: '',
    department: '',
    position: '',
    exitType: 'resignation',
    reason: '',
    lastWorkingDay: '',
  });

  const departments = [
    'Engineering', 'Sales', 'Marketing', 'Finance', 
    'Human Resources', 'Operations', 'IT', 'Customer Support',
    'Research & Development', 'Legal'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onInitiate(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-slate-900">
            <div className="rounded-full bg-gold-500/20 p-2.5">
              <User className="h-6 w-6 text-gold-400" />
            </div>
            <span>Initiate Offboarding</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Start the offboarding process for an employee. All fields marked with <span className="text-red-400">*</span> are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Employee Name <span className="text-red-400">*</span>
              </label>
              <Input
                required
                placeholder="Enter employee name"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="border-gold-500/30 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Employee Email <span className="text-red-400">*</span>
              </label>
              <Input
                required
                type="email"
                placeholder="employee@company.com"
                value={formData.employeeEmail}
                onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })}
                className="border-gold-500/30 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="border-gold-500/30 bg-slate-50 text-slate-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="border-gold-500/20 bg-white">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Position <span className="text-red-400">*</span>
              </label>
              <Input
                required
                placeholder="e.g., Senior Developer, Manager"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="border-gold-500/30 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Exit Type <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.exitType}
                onValueChange={(value) => setFormData({ ...formData, exitType: value as OffboardingCase['exitType'] })}
              >
                <SelectTrigger className="border-gold-500/30 bg-slate-50 text-slate-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <SelectValue placeholder="Select exit type" />
                </SelectTrigger>
                <SelectContent className="border-gold-500/20 bg-white">
                  <SelectItem value="resignation" className="text-slate-900 hover:bg-slate-100">Resignation</SelectItem>
                  <SelectItem value="termination" className="text-slate-900 hover:bg-slate-100">Termination</SelectItem>
                  <SelectItem value="end-of-contract" className="text-slate-900 hover:bg-slate-100">End of Contract</SelectItem>
                  <SelectItem value="retirement" className="text-slate-900 hover:bg-slate-100">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Last Working Day <span className="text-red-400">*</span>
              </label>
              <Input
                required
                type="date"
                value={formData.lastWorkingDay}
                onChange={(e) => setFormData({ ...formData, lastWorkingDay: e.target.value })}
                className="border-gold-500/30 bg-slate-50 text-slate-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Reason for Exit <span className="text-red-400">*</span>
            </label>
            <Input
              required
              placeholder="Enter reason for exit"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="border-gold-500/30 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gold-500/20 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold px-6"
            >
              <Plus className="mr-2 h-4 w-4" />
              Initiate Offboarding
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Employee Details Modal
const EmployeeDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  caseData: OffboardingCase | null;
}> = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-full bg-gold-500/20 p-2.5 ring-1 ring-gold-400/30">
                <User className="h-6 w-6 text-gold-400" />
              </div>
              <span>Offboarding Details</span>
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge className={`${caseData.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'} px-4 py-1.5 text-sm`}>
                {caseData.status.toUpperCase()}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-1.5 text-sm">
                {caseData.exitType.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <DialogDescription className="mt-1 text-gray-300">
            Complete offboarding information for <span className="font-semibold text-gold-300">{caseData.employeeName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Employee Summary Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-gold-300">Employee</p>
              <p className="font-semibold text-white">{caseData.employeeName}</p>
              <p className="text-sm text-gray-300">{caseData.employeeEmail}</p>
            </CardContent>
          </Card>
          <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-gold-300">Department</p>
              <p className="font-semibold text-white">{caseData.department}</p>
              <p className="text-sm text-gray-300">{caseData.position}</p>
            </CardContent>
          </Card>
          <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-gold-300">Last Working Day</p>
              <p className="font-semibold text-white">
                {new Date(caseData.lastWorkingDay).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className={`text-sm ${caseData.daysUntilLastDay > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {caseData.daysUntilLastDay > 0 
                  ? `${caseData.daysUntilLastDay} days remaining`
                  : `${Math.abs(caseData.daysUntilLastDay)} days overdue`}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-gold-300">Progress</p>
              <p className="font-semibold text-white">
                {caseData.progress.percentage}%
              </p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={caseData.progress.percentage} 
                  className="h-2 flex-1 bg-navy-800"
                  indicatorClassName="bg-gold-500"
                />
                <span className="text-sm text-gray-400">
                  {caseData.progress.completed}/{caseData.progress.total}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="bg-navy-700/50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Overview
            </TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Checklist
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Assets
            </TabsTrigger>
            <TabsTrigger value="settlement" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Settlement
            </TabsTrigger>
            <TabsTrigger value="exit-interview" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Exit Interview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-gold-300">
                    <User className="h-4 w-4 text-gold-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Full Name</span>
                    <span className="text-white font-medium">{caseData.employeeName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Email Address</span>
                    <span className="text-white">{caseData.employeeEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Department</span>
                    <span className="text-white">{caseData.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position</span>
                    <span className="text-white">{caseData.position}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-gold-300">
                    <AlertCircle className="h-4 w-4 text-gold-400" />
                    Exit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Exit Type</span>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {caseData.exitType.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Reason</span>
                    <span className="text-white text-right max-w-[60%]">{caseData.reason}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Last Working Day</span>
                    <span className="text-white">
                      {new Date(caseData.lastWorkingDay).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notice Period</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 capitalize">
                      {caseData.noticePeriodStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
              <CardHeader>
                <CardTitle className="text-sm text-gold-300">Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Initiated By</p>
                    <p className="text-white font-medium">{caseData.initiatedByName}</p>
                    <p className="text-xs text-gray-400">{new Date(caseData.initiatedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Case Created</p>
                    <p className="text-white font-medium">{new Date(caseData.caseCreated).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-white font-medium">{new Date(caseData.caseUpdated).toLocaleDateString()}</p>
                  </div>
                  {caseData.dateCompleted && (
                    <div>
                      <p className="text-xs text-gray-400">Completed</p>
                      <p className="text-white font-medium">{new Date(caseData.dateCompleted).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist">
            <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
              <CardHeader>
                <CardTitle className="text-gold-300">Offboarding Checklist</CardTitle>
                <CardDescription className="text-gray-400">
                  Track the progress of each offboarding task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: 'Knowledge Transfer & Handover', status: 'in-progress', owner: 'John Manager', dueDate: '2024-12-10', description: 'Complete documentation and handover of responsibilities' },
                    { item: 'Company Laptop Return', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-14', description: 'Return laptop with all accessories' },
                    { item: 'System Access Revocation', status: 'completed', owner: 'System Admin', dueDate: '2024-12-15', description: 'Revoke all system access and accounts' },
                    { item: 'Final Settlement Calculation', status: 'pending', owner: 'Finance', dueDate: '2024-12-12', description: 'Calculate final pay and deductions' },
                    { item: 'Exit Interview Completion', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-13', description: 'Complete exit interview with employee' },
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gold-500/10 pb-3 last:border-0">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">{task.item}</span>
                            <Badge className={
                              task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-gray-500/20 text-gray-400'
                            }>
                              {task.status}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-0.5">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>Owner: {task.owner}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
              <CardHeader>
                <CardTitle className="text-gold-300">Assets & Access</CardTitle>
                <CardDescription className="text-gray-400">
                  Track asset returns and access revocation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { asset: 'Company Laptop', status: 'Pending Return', condition: 'Good', serial: 'LAP-2024-001' },
                    { asset: 'ID Badge', status: 'Returned', condition: 'Good', serial: 'ID-0042' },
                    { asset: 'Access Card', status: 'Revoked', condition: 'N/A', serial: 'ACC-0123' },
                    { asset: 'Office Keys', status: 'Pending Return', condition: 'Good', serial: 'KEY-007' },
                  ].map((asset, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gold-500/10 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-navy-800/50 p-2 rounded-lg">
                          <Laptop className="h-5 w-5 text-gold-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{asset.asset}</p>
                          <p className="text-xs text-gray-400">Serial: {asset.serial}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Condition: {asset.condition}</span>
                        <Badge className={
                          asset.status === 'Returned' || asset.status === 'Revoked' ? 
                          'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }>
                          {asset.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settlement">
            <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
              <CardHeader>
                <CardTitle className="text-gold-300">Final Settlement</CardTitle>
                <CardDescription className="text-gray-400">
                  Summary of final payment calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3 border-b border-gold-500/10 pb-2">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pro-rated Salary</span>
                        <span className="text-white">$3,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leave Encashment</span>
                        <span className="text-white">$1,200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pending Reimbursements</span>
                        <span className="text-white">$450.00</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gold-500/20 pt-2">
                        <span className="text-gold-400">Total Earnings</span>
                        <span className="text-gold-400">$4,900.00</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3 border-b border-gold-500/10 pb-2">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loan Deductions</span>
                        <span className="text-white">$500.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Asset Non-Return</span>
                        <span className="text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Notice Period Shortfall</span>
                        <span className="text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gold-500/20 pt-2">
                        <span className="text-red-400">Total Deductions</span>
                        <span className="text-red-400">$650.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-gold-500/20 flex justify-between items-center bg-navy-800/50 p-4 rounded-lg">
                  <span className="text-sm text-gray-400">Net Pay</span>
                  <span className="text-2xl font-bold text-gold-400">$4,250.00</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exit-interview">
            <Card className="border border-gold-400/30 bg-gradient-to-br from-navy-800/95 to-navy-900/95 shadow-lg shadow-gold-500/10">
              <CardHeader>
                <CardTitle className="text-gold-300">Exit Interview</CardTitle>
                <CardDescription className="text-gray-400">
                  Employee feedback and exit reasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-navy-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Reason</h4>
                      <p className="text-white">Career growth opportunity</p>
                    </div>
                    <div className="bg-navy-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Would Recommend?</h4>
                      <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                    </div>
                  </div>
                  <div className="bg-navy-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Overall Rating</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-3xl ${star <= 4 ? 'text-gold-400' : 'text-gray-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-navy-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Additional Comments</h4>
                    <p className="text-white">Overall positive experience with the company.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gold-500/20 text-gray-300 hover:text-white hover:bg-navy-700"
          >
            Close
          </Button>
          <Button className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Dashboard Component
const OffboardingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<OffboardingCase | null>(null);

  const { cases, stats, loading, createCase } = useOffboarding({});

  const departments = useMemo(() => {
    if (!cases) return [];
    return Array.from(new Set(cases.map(c => c.department)));
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    return cases.filter(c => {
      const matchSearch = searchTerm === '' || 
        c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = departmentFilter === 'all' || c.department === departmentFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [cases, searchTerm, departmentFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      completed: 'bg-green-500/20 text-green-400 border-green-500/20',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/20',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    };
    return styles[status] || styles.pending;
  };

  const handleViewDetails = (caseItem: OffboardingCase) => {
    setSelectedCase(caseItem);
    setIsDetailsModalOpen(true);
  };

  const handleInitiateOffboarding = async (data: Partial<OffboardingCase>) => {
    await createCase(data);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-navy-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500 border-t-transparent"></div>
          <p className="mt-4 text-white">Loading offboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6">
      {/* Header Section - OFFBOARDING headline is here */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gold-500/20 p-2.5">
                <Briefcase className="h-8 w-8 text-gold-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Offboarding
                </h1>
                <p className="mt-1 text-sm text-gold-300/80">
                  Manage employee exit process across all departments
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsInitiateModalOpen(true)}
            className="bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-lg shadow-gold-500/30 font-semibold px-6 py-2.5 text-base"
          >
            <Plus className="mr-2 h-5 w-5" />
            Initiate Offboarding
          </Button>
        </div>
        
        {/* Decorative divider */}
        <div className="mt-4 h-0.5 w-full bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20"></div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Cases" value={stats.totalCases} icon={Users} trend={5} />
          <StatCard title="Pending" value={stats.pending} icon={Clock} valueColor="text-yellow-400" trend={-3} />
          <StatCard title="In Progress" value={stats.inProgress} icon={AlertCircle} valueColor="text-blue-400" trend={2} />
          <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} valueColor="text-red-400" trend={8} />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} valueColor="text-green-400" trend={12} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-navy-800/40 p-4 backdrop-blur-sm border border-gold-500/10">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, department..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="bg-navy-900/50 border-gold-500/20 pl-10 text-white placeholder:text-gray-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px] bg-navy-900/50 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-gold-500/20">
            <SelectItem value="all" className="text-white hover:bg-navy-700">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="text-white hover:bg-navy-700">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-navy-900/50 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-gold-500/20">
            <SelectItem value="all" className="text-white hover:bg-navy-700">All Status</SelectItem>
            <SelectItem value="pending" className="text-white hover:bg-navy-700">Pending</SelectItem>
            <SelectItem value="in-progress" className="text-white hover:bg-navy-700">In Progress</SelectItem>
            <SelectItem value="overdue" className="text-white hover:bg-navy-700">Overdue</SelectItem>
            <SelectItem value="completed" className="text-white hover:bg-navy-700">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-gold-500/20 text-white hover:bg-navy-700 hover:text-gold-300">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Cases Table */}
      <Card className="bg-navy-800/30 border-gold-500/20 overflow-hidden rounded-xl">
        <CardHeader className="border-b border-gold-500/10 bg-navy-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">Offboarding Cases</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Badge className="bg-gold-500/20 text-gold-400 px-3 py-1.5">
              {filteredCases.filter(c => c.status === 'overdue').length} Overdue
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gold-500/10 hover:bg-transparent bg-navy-800/50">
                <TableHead className="text-gold-300 font-semibold">Employee</TableHead>
                <TableHead className="text-gold-300 font-semibold">Department</TableHead>
                <TableHead className="text-gold-300 font-semibold">Exit Type</TableHead>
                <TableHead className="text-gold-300 font-semibold">Last Working Day</TableHead>
                <TableHead className="text-gold-300 font-semibold">Progress</TableHead>
                <TableHead className="text-gold-300 font-semibold">Status</TableHead>
                <TableHead className="text-gold-300 font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-gray-600" />
                      <p className="text-lg">No offboarding cases found</p>
                      <p className="text-sm">Adjust your filters or initiate a new offboarding process</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
                  <TableRow 
                    key={caseItem.id} 
                    className="border-gold-500/10 hover:bg-navy-700/40 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(caseItem)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{caseItem.employeeName}</div>
                        <div className="text-sm text-gray-400">{caseItem.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-300">{caseItem.department}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                        {caseItem.exitType.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-white">
                          {new Date(caseItem.lastWorkingDay).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${
                          caseItem.daysUntilLastDay > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {caseItem.daysUntilLastDay > 0 
                            ? `${caseItem.daysUntilLastDay} days remaining`
                            : `${Math.abs(caseItem.daysUntilLastDay)} days overdue`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={caseItem.progress.percentage} 
                          className="h-2 w-20 bg-navy-700"
                          indicatorClassName={`${
                            caseItem.progress.percentage === 100 ? 'bg-green-500' : 'bg-gold-500'
                          }`}
                        />
                        <span className="text-sm text-gray-300">
                          {caseItem.progress.completed}/{caseItem.progress.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(caseItem.status)} flex items-center gap-1 border`}>
                        {caseItem.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gold-400 hover:text-gold-300 hover:bg-navy-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(caseItem);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <InitiateOffboardingModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        onInitiate={handleInitiateOffboarding}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />
    </div>
  );
};

export default OffboardingDashboard;