// src/features/employees/offboarding/pages/Dashboard.tsx
import React, { useState, useMemo, useRef } from 'react';
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
  Upload,
  X,
  File,
  Download,
  Trash2,
  TrendingUp, 
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
import { useOffboarding } from '../hooks/useOffboarding';
import type { OffboardingCase, Employee, UploadedFile } from '../types';

// Mock employees data for search
const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-001', name: 'Jane Doe', email: 'jane.doe@optimum.com', department: 'Engineering', position: 'Senior Software Engineer', branchId: 'branch-1', branchName: 'Headquarters' },
  { id: 'emp-002', name: 'John Smith', email: 'john.smith@optimum.com', department: 'Sales', position: 'Sales Manager', branchId: 'branch-2', branchName: 'North Region' },
  { id: 'emp-003', name: 'Mary Johnson', email: 'mary.johnson@optimum.com', department: 'Marketing', position: 'Marketing Specialist', branchId: 'branch-3', branchName: 'South Region' },
  { id: 'emp-004', name: 'Robert Wilson', email: 'robert.wilson@optimum.com', department: 'Finance', position: 'Accountant', branchId: 'branch-4', branchName: 'East Region' },
  { id: 'emp-005', name: 'Sarah Brown', email: 'sarah.brown@optimum.com', department: 'Human Resources', position: 'HR Manager', branchId: 'branch-1', branchName: 'Headquarters' },
  { id: 'emp-006', name: 'Michael Davis', email: 'michael.davis@optimum.com', department: 'IT', position: 'IT Support Specialist', branchId: 'branch-5', branchName: 'West Region' },
  { id: 'emp-007', name: 'Emily Wilson', email: 'emily.wilson@optimum.com', department: 'Operations', position: 'Operations Manager', branchId: 'branch-2', branchName: 'North Region' },
];

// Mock Performance Data
const mockPerformanceData = {
  employeeId: 'emp-001',
  currentRating: 4.2,
  lastReviewDate: '2024-11-15',
  averageRating: 4.0,
  totalReviews: 3,
  performanceHistory: [
    {
      id: 'perf-001',
      employeeId: 'emp-001',
      reviewPeriod: 'Q4 2024',
      overallRating: 4.2,
      ratings: [
        { category: 'Technical Skills', score: 4, maxScore: 5, comments: 'Excellent technical abilities' },
        { category: 'Communication', score: 4, maxScore: 5, comments: 'Good team communication' },
        { category: 'Leadership', score: 3, maxScore: 5, comments: 'Developing leadership skills' },
        { category: 'Problem Solving', score: 5, maxScore: 5, comments: 'Outstanding problem solver' },
        { category: 'Teamwork', score: 4, maxScore: 5, comments: 'Great team player' },
      ],
      strengths: ['Technical expertise', 'Problem solving', 'Mentoring juniors'],
      areasForImprovement: ['Public speaking', 'Strategic thinking'],
      goalsAchieved: ['Completed AI project', 'Led sprint team', 'Improved code quality'],
      managerComments: 'Excellent performer with great potential for growth.',
      reviewerName: 'John Manager',
      reviewDate: '2024-11-15',
    },
    {
      id: 'perf-002',
      employeeId: 'emp-001',
      reviewPeriod: 'Q3 2024',
      overallRating: 4.0,
      ratings: [
        { category: 'Technical Skills', score: 4, maxScore: 5, comments: 'Strong technical skills' },
        { category: 'Communication', score: 3, maxScore: 5, comments: 'Good communication' },
        { category: 'Leadership', score: 3, maxScore: 5, comments: 'Shows leadership potential' },
        { category: 'Problem Solving', score: 4, maxScore: 5, comments: 'Good problem solver' },
        { category: 'Teamwork', score: 4, maxScore: 5, comments: 'Works well with team' },
      ],
      strengths: ['Code quality', 'Team collaboration', 'Meeting deadlines'],
      areasForImprovement: ['Documentation', 'Delegation'],
      goalsAchieved: ['Delivered product features', 'Improved testing coverage'],
      managerComments: 'Consistent performer with good results.',
      reviewerName: 'John Manager',
      reviewDate: '2024-08-15',
    },
  ],
  recentStrengths: ['Technical expertise', 'Problem solving', 'Team collaboration'],
  recentImprovements: ['Communication', 'Strategic thinking'],
};

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

// Employee Search Component
const EmployeeSearch: React.FC<{
  onSelect: (employee: Employee) => void;
  selectedEmployee?: Employee | null;
}> = ({ onSelect, selectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const results = MOCK_EMPLOYEES.filter(emp =>
        emp.name.toLowerCase().includes(term.toLowerCase()) ||
        emp.email.toLowerCase().includes(term.toLowerCase()) ||
        emp.id.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    setSearchTerm(employee.name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search employee by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
          className="bg-navy-900/60 border-gold-500/20 pl-10 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
        />
        {selectedEmployee && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => {
              setSearchTerm('');
              onSelect(null as any);
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gold-500/20 bg-navy-800 shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((employee) => (
            <div
              key={employee.id}
              className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-navy-700 transition-colors border-b border-gold-500/10 last:border-0"
              onClick={() => handleSelect(employee)}
            >
              <div>
                <p className="text-white font-medium">{employee.name}</p>
                <p className="text-sm text-gray-400">{employee.email} • {employee.department}</p>
              </div>
              <Badge variant="outline" className="border-gold-500/20 text-gold-400">
                {employee.position}
              </Badge>
            </div>
          ))}
        </div>
      )}
      
      {selectedEmployee && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-navy-800/50 border border-gold-500/10">
          <div>
            <p className="text-xs text-gray-400">Name</p>
            <p className="text-sm text-white font-medium">{selectedEmployee.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm text-white">{selectedEmployee.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Department</p>
            <p className="text-sm text-white">{selectedEmployee.department}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// File Upload Component
const FileUpload: React.FC<{
  files: UploadedFile[];
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove: (fileId: string) => void;
}> = ({ files, onFileUpload, onFileRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const file = fileList[0];
    const uploadedFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
    };
    onFileUpload(uploadedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-400" />;
    if (type.includes('csv')) return <File className="h-5 w-5 text-green-400" />;
    if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-400" />;
    return <File className="h-5 w-5 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragging
            ? 'border-gold-500 bg-gold-500/10'
            : 'border-gold-500/30 hover:border-gold-500/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-400">
          Drag & drop files here or <span className="text-gold-400 cursor-pointer hover:underline">browse</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, CSV, DOC, DOCX (Max 10MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.csv,.doc,.docx"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg bg-navy-800/50 p-3 border border-gold-500/10"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm text-white font-medium">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gold-400"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => onFileRemove(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Initiate Offboarding Modal
const InitiateOffboardingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInitiate: (data: any) => void;
}> = ({ isOpen, onClose, onInitiate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    exitType: 'resignation',
    reason: '',
    lastWorkingDay: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleEmployeeSelect = (employee: Employee | null) => {
    setSelectedEmployee(employee);
  };

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles([...uploadedFiles, file]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    
    const data = {
      employee: selectedEmployee,
      ...formData,
      attachments: uploadedFiles,
    };
    onInitiate(data);
    onClose();
    setSelectedEmployee(null);
    setFormData({ exitType: 'resignation', reason: '', lastWorkingDay: '' });
    setUploadedFiles([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-full bg-gold-500/20 p-2.5">
              <User className="h-6 w-6 text-gold-400" />
            </div>
            <span>Initiate Offboarding</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Search for an employee or upload supporting documents for the offboarding process.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Employee <span className="text-red-400">*</span>
            </label>
            <EmployeeSearch
              onSelect={handleEmployeeSelect}
              selectedEmployee={selectedEmployee}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Exit Type <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.exitType}
                onValueChange={(value) => setFormData({ ...formData, exitType: value })}
              >
                <SelectTrigger className="bg-navy-900/60 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <SelectValue placeholder="Select exit type" />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-gold-500/20">
                  <SelectItem value="resignation" className="text-white hover:bg-navy-700">Resignation</SelectItem>
                  <SelectItem value="termination" className="text-white hover:bg-navy-700">Termination</SelectItem>
                  <SelectItem value="end-of-contract" className="text-white hover:bg-navy-700">End of Contract</SelectItem>
                  <SelectItem value="retirement" className="text-white hover:bg-navy-700">Retirement</SelectItem>
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
                className="bg-navy-900/60 border-gold-500/20 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Reason for Exit <span className="text-red-400">*</span>
            </label>
            <Input
              required
              placeholder="Enter reason for exit"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="bg-navy-900/60 border-gold-500/20 text-white placeholder:text-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Supporting Documents
            </label>
            <FileUpload
              files={uploadedFiles}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
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
              disabled={!selectedEmployee}
              className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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

  const mockDocuments: UploadedFile[] = [
    { id: 'doc-1', name: 'resignation_letter.pdf', size: 245000, type: 'application/pdf', url: '#', uploadDate: '2024-12-01' },
    { id: 'doc-2', name: 'exit_interview_form.csv', size: 12000, type: 'text/csv', url: '#', uploadDate: '2024-12-02' },
  ];

  const documents = caseData.attachments?.length ? caseData.attachments : mockDocuments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-full bg-gold-500/20 p-2.5">
                <User className="h-6 w-6 text-gold-400" />
              </div>
              <span>Offboarding Details</span>
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge className={`${caseData.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} px-4 py-1.5 text-sm`}>
                {caseData.status.toUpperCase()}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20 px-4 py-1.5 text-sm">
                {caseData.exitType.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-gray-400 mt-1">
            Complete offboarding information for <span className="text-gold-300">{caseData.employeeName}</span>
          </DialogDescription>
        </DialogHeader>

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
              <p className="text-sm text-gray-400">Last Working Day</p>
              <p className="text-white font-semibold">
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
              <MessageSquare className="h-4 w-4 mr-2" />
              Exit Feedback & Performance
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 rounded-md px-4 py-1.5">
              Documents
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

            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Case Timeline</CardTitle>
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
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Offboarding Checklist</CardTitle>
                <CardDescription className="text-gray-400">
                  Track the progress of each offboarding task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: 'Knowledge Transfer & Handover', status: 'in-progress', owner: 'John Manager', dueDate: '2024-12-10' },
                    { item: 'Company Laptop Return', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-14' },
                    { item: 'System Access Revocation', status: 'completed', owner: 'System Admin', dueDate: '2024-12-15' },
                    { item: 'Final Settlement Calculation', status: 'pending', owner: 'Finance', dueDate: '2024-12-12' },
                    { item: 'Exit Interview Completion', status: 'pending', owner: 'HR Admin', dueDate: '2024-12-13' },
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
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Assets & Access</CardTitle>
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
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Final Settlement</CardTitle>
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

          {/* Exit Feedback & Performance Tab - Updated */}
          <TabsContent value="exit-interview">
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-gold-400" />
                      Exit Feedback & Performance Review
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Comprehensive exit feedback with performance linkage
                    </CardDescription>
                  </div>
                  <Badge className="bg-gold-500/20 text-gold-400">
                    Performance Linked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Current Performance Rating</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gold-400">
                              {mockPerformanceData.currentRating}
                            </span>
                            <span className="text-sm text-gray-400">/ 5.0</span>
                          </div>
                        </div>
                        <div className="rounded-full bg-gold-500/20 p-2">
                          <TrendingUp className="h-5 w-5 text-gold-400" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-green-400">↑ 0.2</span>
                        <span className="text-xs text-gray-400">from last review</span>
                      </div>
                    </div>
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-xs text-gray-400">Last Performance Review</p>
                      <p className="text-white font-semibold">
                        {new Date(mockPerformanceData.lastReviewDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400">Total Reviews: {mockPerformanceData.totalReviews}</p>
                    </div>
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-xs text-gray-400">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">
                          {mockPerformanceData.averageRating}
                        </span>
                        <span className="text-sm text-gray-400">/ 5.0</span>
                      </div>
                      <p className="text-xs text-gray-400">across all reviews</p>
                    </div>
                  </div>

                  {/* Exit Interview Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Reason</h4>
                      <p className="text-white">Career growth opportunity</p>
                    </div>
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Would Recommend?</h4>
                      <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                    </div>
                  </div>

                  {/* Performance vs Exit Rating Comparison */}
                  <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Performance vs Exit Rating</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Average Performance Rating</p>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-32 bg-navy-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${(mockPerformanceData.averageRating / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-white">{mockPerformanceData.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Exit Interview Rating</p>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-32 bg-navy-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full" 
                              style={{ width: '80%' }}
                            />
                          </div>
                          <span className="text-sm text-white">4.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-navy-700/50 rounded-lg">
                      <p className="text-xs text-gray-400">Performance Linkage</p>
                      <p className="text-sm text-white mt-1">
                        Employee's exit rating (4.0) is consistent with their performance history (avg 4.0). 
                        This suggests a positive correlation between performance and exit sentiment.
                      </p>
                    </div>
                  </div>

                  {/* Performance History */}
                  <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Performance History</h4>
                    <div className="space-y-3">
                      {mockPerformanceData.performanceHistory.map((review, index) => (
                        <div key={index} className="border-b border-gold-500/10 pb-3 last:border-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{review.reviewPeriod}</p>
                              <p className="text-xs text-gray-400">Reviewed by {review.reviewerName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className={`text-sm ${star <= Math.round(review.overallRating) ? 'text-gold-400' : 'text-gray-600'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-white">{review.overallRating.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">
                              {review.ratings[0]?.score}/5 {review.ratings[0]?.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                              {review.ratings[1]?.score}/5 {review.ratings[1]?.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                              {review.ratings[2]?.score}/5 {review.ratings[2]?.category}
                            </span>
                          </div>
                          {review.managerComments && (
                            <p className="text-sm text-gray-400 mt-1 italic">"{review.managerComments}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Areas for Improvement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <h4 className="text-sm font-medium text-green-400 mb-2">Recent Strengths</h4>
                      <ul className="space-y-1">
                        {mockPerformanceData.recentStrengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {mockPerformanceData.recentImprovements.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                            <AlertCircle className="h-3 w-3 text-yellow-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Additional Comments */}
                  <div className="bg-navy-800/50 p-4 rounded-lg border border-gold-500/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Additional Comments</h4>
                    <p className="text-white">Overall positive experience with the company. Good growth opportunities but limited in current role.</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gold-500/10 pt-4">
                    <span>Submitted by: <span className="text-white">Employee</span></span>
                    <span>Date: <span className="text-white">December 10, 2024</span></span>
                    <Badge className="bg-blue-500/20 text-blue-400">Confidential</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="bg-navy-800/60 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Supporting Documents</CardTitle>
                <CardDescription className="text-gray-400">
                  All uploaded documents related to this offboarding case
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg bg-navy-800/50 p-4 border border-gold-500/10 hover:border-gold-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gold-500/10 p-2.5">
                            {doc.type.includes('pdf') ? (
                              <FileText className="h-6 w-6 text-red-400" />
                            ) : doc.type.includes('csv') ? (
                              <File className="h-6 w-6 text-green-400" />
                            ) : (
                              <FileText className="h-6 w-6 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-400">
                              Uploaded on {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gold-400 hover:text-gold-300 hover:bg-navy-700"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-gray-400">No documents uploaded for this case</p>
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
const OffboardingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<OffboardingCase | null>(null);

  const { cases, stats, loading, refetch } = useOffboarding({});

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

  const handleInitiateOffboarding = (data: any) => {
    console.log('Initiating offboarding for:', data);
    refetch();
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
    <div className="offboarding-page executive-consistent-page min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6">
      {/* Header Section */}
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
