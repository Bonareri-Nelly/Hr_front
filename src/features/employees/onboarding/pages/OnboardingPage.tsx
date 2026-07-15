// src/features/employees/onboarding/pages/Dashboard.tsx
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
  Calendar,
  UserPlus,
  ChevronRight,
  Building2,
  FileCheck,
  Package,
  MessageSquare
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
import { useOnboarding } from '../hooks/useOnboarding';
import type { OnboardingCase } from '../types';
import { formatDate } from '@/lib/utils';

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

// Initiate Onboarding Modal
const InitiateOnboardingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInitiate: (data: any) => void;
}> = ({ isOpen, onClose, onInitiate }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    managerId: '',
    department: '',
    position: '',
    branchId: 'branch-1',
    notes: '',
  });

  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'IT'];
  const branches = [
    { id: 'branch-1', name: 'Headquarters' },
    { id: 'branch-2', name: 'North Region' },
    { id: 'branch-3', name: 'South Region' },
    { id: 'branch-4', name: 'East Region' },
    { id: 'branch-5', name: 'West Region' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInitiate(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-full bg-gold-500/20 p-2.5">
              <UserPlus className="h-6 w-6 text-gold-400" />
            </div>
            <span>Initiate Onboarding</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Start the onboarding process for a new employee
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Employee Name <span className="text-red-400">*</span>
              </label>
              <Input
                required
                placeholder="Enter employee name"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="bg-navy-900/60 border-gold-500/20 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Start Date <span className="text-red-400">*</span>
              </label>
              <Input
                required
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-navy-900/60 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Department <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="bg-navy-900/60 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-gold-500/20">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-white hover:bg-navy-700">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Position <span className="text-red-400">*</span>
              </label>
              <Input
                required
                placeholder="Enter position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="bg-navy-900/60 border-gold-500/20 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Branch <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.branchId}
                onValueChange={(value) => setFormData({ ...formData, branchId: value })}
              >
                <SelectTrigger className="bg-navy-900/60 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-gold-500/20">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id} className="text-white hover:bg-navy-700">
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Manager
              </label>
              <Input
                placeholder="Enter manager name"
                value={formData.managerId}
                onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                className="bg-navy-900/60 border-gold-500/20 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
            <Input
              placeholder="Additional notes about the onboarding"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-navy-900/60 border-gold-500/20 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gold-500/20 text-gray-300 hover:text-white hover:bg-navy-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold px-6"
            >
              <Plus className="mr-2 h-4 w-4" />
              Initiate Onboarding
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
  caseData: OnboardingCase | null;
}> = ({ isOpen, onClose, caseData }) => {
  if (!caseData) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'not-started': 'bg-gray-500/20 text-gray-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      'completed': 'bg-green-500/20 text-green-400',
      'overdue': 'bg-red-500/20 text-red-400',
      'on-hold': 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[status] || colors['not-started'];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-full bg-gold-500/20 p-2.5">
                <User className="h-6 w-6 text-gold-400" />
              </div>
              <span>Onboarding Details</span>
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(caseData.status)} px-4 py-1.5 text-sm`}>
                {caseData.status.replace('-', ' ')}
              </Badge>
              <Badge className="bg-gold-500/20 text-gold-400 px-4 py-1.5 text-sm">
                {caseData.department}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-gray-400 mt-1">
            Complete onboarding information for <span className="text-gold-300">{caseData.employeeName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Employee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card className="bg-navy-800/60 border-gold-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-400">Employee</p>
              <p className="text-white font-semibold">{caseData.employeeName}</p>
              <p className="text-sm text-gray-400">{caseData.employeeEmail}</p>
            </CardContent>
          </Card>
          <Card className="bg-navy-800/60 border-gold-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-400">Department</p>
              <p className="text-white font-semibold">{caseData.department}</p>
              <p className="text-sm text-gray-400">{caseData.position}</p>
            </CardContent>
          </Card>
          <Card className="bg-navy-800/60 border-gold-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-white font-semibold">
                {new Date(caseData.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className={`text-sm ${caseData.daysUntilStart > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {caseData.daysUntilStart > 0 
                  ? `${caseData.daysUntilStart} days until start`
                  : `${Math.abs(caseData.daysUntilStart)} days ago`}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-navy-800/60 border-gold-500/20">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-white font-semibold">
                {caseData.progress.percentage}%
              </p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={caseData.progress.percentage} 
                  className="h-2 flex-1 bg-navy-800"
                  indicatorClassName="bg-gold-500"
                />
                <span className="text-sm text-gray-400">
                  {caseData.progress.completedSteps}/{caseData.progress.totalSteps}
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
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Documents
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Equipment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-navy-800/60 border-gold-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
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

              <Card className="bg-navy-800/60 border-gold-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold-400" />
                    Onboarding Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Start Date</span>
                    <span className="text-white">
                      {new Date(caseData.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Manager</span>
                    <span className="text-white">{caseData.managerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/10 pb-2">
                    <span className="text-gray-400">Branch</span>
                    <span className="text-white">{caseData.branchName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge className={getStatusColor(caseData.status)}>
                      {caseData.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <TabsContent value="tasks">
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Onboarding Tasks</CardTitle>
                <CardDescription className="text-gray-400">
                  Tasks to be completed for this onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                {caseData.tasks && caseData.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between border-b border-gold-500/10 pb-3 last:border-0">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 
                            task.status === 'overdue' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-medium">{task.title}</span>
                              <Badge className={
                                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 
                                task.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }>
                                {task.status}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-400 mt-0.5">{task.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Assigned to: {task.assignedToName}</span>
                              {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                              <Badge className={
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-gray-400">No tasks assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Required Documents</CardTitle>
                <CardDescription className="text-gray-400">
                  Documents needed for onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                {caseData.documents && caseData.documents.length > 0 ? (
                  <div className="space-y-3">
                    {caseData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg bg-navy-800/50 p-4 border border-gold-500/10 hover:border-gold-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gold-500/10 p-2.5">
                            <FileText className="h-5 w-5 text-gold-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{doc.documentName}</p>
                            <p className="text-xs text-gray-400">{doc.documentType.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <Badge className={
                          doc.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                          doc.status === 'uploaded' ? 'bg-yellow-500/20 text-yellow-400' :
                          doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-gray-400">No documents required</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Equipment & Assets</CardTitle>
                <CardDescription className="text-gray-400">
                  Equipment assigned for this onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                {caseData.equipment && caseData.equipment.length > 0 ? (
                  <div className="space-y-3">
                    {caseData.equipment.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg bg-navy-800/50 p-4 border border-gold-500/10 hover:border-gold-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gold-500/10 p-2.5">
                            <Laptop className="h-5 w-5 text-gold-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.itemName}</p>
                            <p className="text-xs text-gray-400">{item.equipmentType.replace('-', ' ')}</p>
                            {item.serialNumber && <p className="text-xs text-gray-500">SN: {item.serialNumber}</p>}
                          </div>
                        </div>
                        <Badge className={
                          item.status === 'received' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'assigned' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-gray-400">No equipment assigned</p>
                  </div>
                )}
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
const OnboardingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<OnboardingCase | null>(null);

  const { cases, stats, loading, refetch } = useOnboarding({});

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
      'not-started': 'bg-gray-500/20 text-gray-400 border-gray-500/20',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/20',
      'overdue': 'bg-red-500/20 text-red-400 border-red-500/20',
      'on-hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    };
    return styles[status] || styles['not-started'];
  };

  const handleViewDetails = (caseItem: OnboardingCase) => {
    setSelectedCase(caseItem);
    setIsDetailsModalOpen(true);
  };

  const handleInitiateOnboarding = (data: any) => {
    console.log('Initiating onboarding for:', data);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-navy-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500 border-t-transparent"></div>
          <p className="mt-4 text-white">Loading onboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page executive-consistent-page min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gold-500/20 p-2.5">
                <UserPlus className="h-8 w-8 text-gold-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Onboarding
                </h1>
                <p className="mt-1 text-sm text-gold-300/80">
                  Manage employee onboarding process across all departments
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsInitiateModalOpen(true)}
            className="bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-lg shadow-gold-500/30 font-semibold px-6 py-2.5 text-base"
          >
            <Plus className="mr-2 h-5 w-5" />
            Initiate Onboarding
          </Button>
        </div>
        <div className="mt-4 h-0.5 w-full bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20"></div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Cases" value={stats.totalCases} icon={Users} trend={5} />
          <StatCard title="Not Started" value={stats.notStarted} icon={Clock} valueColor="text-gray-400" trend={-3} />
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
            <SelectValue placeholder="Department" />
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
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-gold-500/20">
            <SelectItem value="all" className="text-white hover:bg-navy-700">All Status</SelectItem>
            <SelectItem value="not-started" className="text-white hover:bg-navy-700">Not Started</SelectItem>
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
              <CardTitle className="text-white text-lg">Onboarding Cases</CardTitle>
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
                <TableHead className="text-gold-300 font-semibold">Start Date</TableHead>
                <TableHead className="text-gold-300 font-semibold">Progress</TableHead>
                <TableHead className="text-gold-300 font-semibold">Status</TableHead>
                <TableHead className="text-gold-300 font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-gray-600" />
                      <p className="text-lg">No onboarding cases found</p>
                      <p className="text-sm">Adjust your filters or initiate a new onboarding process</p>
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
                      <div className="text-sm">
                        <div className="text-white">
                          {new Date(caseItem.startDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${
                          caseItem.daysUntilStart > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {caseItem.daysUntilStart > 0 
                            ? `${caseItem.daysUntilStart} days until start`
                            : `${Math.abs(caseItem.daysUntilStart)} days ago`}
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
                          {caseItem.progress.completedSteps}/{caseItem.progress.totalSteps}
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
      <InitiateOnboardingModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        onInitiate={handleInitiateOnboarding}
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

export default OnboardingDashboard;
