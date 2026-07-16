// src/features/offboarding/components/OffboardingCaseDetails.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  ChevronRight,
  Download, 
  Printer
} from 'lucide-react';
import { ChecklistView } from './ChecklistView';
import { AssetsView } from './AssetsView';
import { FinalSettlementView } from './FinalSettlementView';
import { ExitInterviewView } from './ExitInterview';
import type { OffboardingCase } from '../types';

interface OffboardingCaseDetailsProps {
  caseId: string;
  onClose: () => void;
}

// Mock data - replace with actual API call
const mockCase: OffboardingCase = {
  id: 'off-001',
  employeeId: 'emp-001',
  employeeName: 'Jane Doe',
  employeeEmail: 'jane.doe@optimum.com',
  branchId: 'branch-1',
  branchName: 'Headquarters',
  department: 'Engineering',
  position: 'Senior Software Engineer',
  exitType: 'resignation',
  reason: 'Career growth opportunity',
  reasonCategory: 'Career Development',
  lastWorkingDay: '2024-12-15',
  noticePeriodStatus: 'full',
  initiatedBy: 'user-001',
  initiatedByName: 'John Manager',
  initiatedDate: '2024-11-15',
  status: 'in-progress',
  progress: {
    total: 7,
    completed: 4,
    percentage: 57
  },
  caseCreated: '2024-11-15',
  caseUpdated: '2024-12-01',
  hasOverdueItems: false,
  daysUntilLastDay: 14,
  notes: 'Employee has been with company for 3 years. Good performance record.'
};

export const OffboardingCaseDetails: React.FC<OffboardingCaseDetailsProps> = ({
  caseId,
}) => {
  const [caseData] = useState<OffboardingCase>(mockCase);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      overdue: 'bg-red-500/20 text-red-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-navy-700 p-3">
            <User className="h-8 w-8 text-gold-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{caseData.employeeName}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <span>{caseData.position}</span>
              <span className="text-gold-500">•</span>
              <span>{caseData.department}</span>
              <span className="text-gold-500">•</span>
              <span>{caseData.branchName}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className={getStatusBadge(caseData.status)}>
                {caseData.status.replace('-', ' ')}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400">
                {caseData.exitType.replace('-', ' ')}
              </Badge>
              <span className="text-sm text-gray-400">
                Initiated by {caseData.initiatedByName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gold-500/20 text-white">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="border-gold-500/20 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-lg bg-navy-700/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Overall Progress</p>
            <p className="text-2xl font-bold text-white">
              {caseData.progress.percentage}%
            </p>
            <p className="text-sm text-gray-400">
              {caseData.progress.completed} of {caseData.progress.total} steps completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Working Day</p>
              <p className="text-sm font-medium text-white">
                {new Date(caseData.lastWorkingDay).toLocaleDateString()}
              </p>
              {caseData.daysUntilLastDay > 0 ? (
                <p className="text-xs text-green-400">
                  {caseData.daysUntilLastDay} days remaining
                </p>
              ) : (
                <p className="text-xs text-red-400">Past due date</p>
              )}
            </div>
            <div className="w-32">
              <Progress 
                value={caseData.progress.percentage} 
                className="h-3 bg-navy-800"
                indicatorClassName={`${
                  caseData.progress.percentage === 100 
                    ? 'bg-green-500' 
                    : caseData.hasOverdueItems 
                      ? 'bg-red-500' 
                      : 'bg-gold-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-navy-700/50 p-1">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="checklist"
            className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900"
          >
            Checklist
          </TabsTrigger>
          <TabsTrigger 
            value="assets"
            className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900"
          >
            Assets & Access
          </TabsTrigger>
          <TabsTrigger 
            value="settlement"
            className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900"
          >
            Settlement
          </TabsTrigger>
          <TabsTrigger 
            value="exit-interview"
            className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900"
          >
            Exit Interview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab caseData={caseData} />
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistView caseId={caseId} />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsView caseId={caseId} />
        </TabsContent>

        <TabsContent value="settlement">
          <FinalSettlementView caseId={caseId} />
        </TabsContent>

        <TabsContent value="exit-interview">
          <ExitInterviewView caseId={caseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface OverviewTabProps {
  caseData: OffboardingCase;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ caseData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="bg-navy-700/50 border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-white">Case Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between border-b border-gold-500/10 pb-2">
            <span className="text-gray-400">Case ID</span>
            <span className="text-white">{caseData.id}</span>
          </div>
          <div className="flex justify-between border-b border-gold-500/10 pb-2">
            <span className="text-gray-400">Exit Type</span>
            <span className="text-white">{caseData.exitType.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between border-b border-gold-500/10 pb-2">
            <span className="text-gray-400">Reason</span>
            <span className="text-white">{caseData.reason}</span>
          </div>
          <div className="flex justify-between border-b border-gold-500/10 pb-2">
            <span className="text-gray-400">Notice Period</span>
            <span className="text-white">{caseData.noticePeriodStatus}</span>
          </div>
          <div className="flex justify-between border-b border-gold-500/10 pb-2">
            <span className="text-gray-400">Initiated</span>
            <span className="text-white">
              {new Date(caseData.initiatedDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <Badge className="bg-blue-500/20 text-blue-400">
              {caseData.status.replace('-', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-navy-700/50 border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-between bg-gold-500 text-navy-900 hover:bg-gold-400">
            <span>Update Checklist</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between border-gold-500/20 text-white hover:bg-navy-700">
            <span>Process Settlement</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between border-gold-500/20 text-white hover:bg-navy-700">
            <span>Schedule Exit Interview</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between border-gold-500/20 text-white hover:bg-navy-700">
            <span>Generate Documents</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};