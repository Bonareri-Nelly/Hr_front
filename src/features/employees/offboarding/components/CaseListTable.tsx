// src/features/offboarding/components/CaseListTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import type { OffboardingCase } from '../types';
import { formatDate } from '@/lib/utils';

interface CaseListTableProps { 
  cases: OffboardingCase[];
  loading: boolean;
  onViewCase: (caseId: string) => void;
}

export const CaseListTable: React.FC<CaseListTableProps> = ({
  cases,
  loading,
  onViewCase,
}) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      completed: 'bg-green-500/20 text-green-400 border-green-500/20',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/20',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getExitTypeBadge = (type: string) => {
    const styles = {
      resignation: 'bg-purple-500/20 text-purple-400',
      termination: 'bg-red-500/20 text-red-400',
      'end-of-contract': 'bg-orange-500/20 text-orange-400',
      retirement: 'bg-green-500/20 text-green-400',
    };
    return styles[type as keyof typeof styles] || styles.resignation;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-gold-500/20 bg-navy-800/30">
        <Users className="h-12 w-12 text-gray-500" />
        <p className="mt-4 text-lg text-gray-400">No offboarding cases found</p>
        <p className="text-sm text-gray-500">Adjust your filters or initiate a new offboarding process</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gold-500/20 bg-navy-800/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gold-500/10 hover:bg-navy-700/50">
            <TableHead className="text-gold-300">Employee</TableHead>
            <TableHead className="text-gold-300">Branch</TableHead>
            <TableHead className="text-gold-300">Exit Type</TableHead>
            <TableHead className="text-gold-300">Last Working Day</TableHead>
            <TableHead className="text-gold-300">Progress</TableHead>
            <TableHead className="text-gold-300">Status</TableHead>
            <TableHead className="text-gold-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow 
              key={caseItem.id} 
              className="border-gold-500/10 hover:bg-navy-700/50 cursor-pointer"
              onClick={() => onViewCase(caseItem.id)}
            >
              <TableCell>
                <div>
                  <div className="font-medium text-white">{caseItem.employeeName}</div>
                  <div className="text-sm text-gray-400">{caseItem.position}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-300">{caseItem.branchName}</span>
              </TableCell>
              <TableCell>
                <Badge className={getExitTypeBadge(caseItem.exitType)}>
                  {caseItem.exitType.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-white">{formatDate(caseItem.lastWorkingDay)}</div>
                  <div className="text-xs text-gray-400">
                    {caseItem.daysUntilLastDay > 0 
                      ? `${caseItem.daysUntilLastDay} days remaining`
                      : 'Past due'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress 
                    value={caseItem.progress.percentage} 
                    className="h-2 w-20 bg-navy-700"
                    indicatorClassName={`${
                      caseItem.progress.percentage === 100 
                        ? 'bg-green-500' 
                        : caseItem.hasOverdueItems 
                          ? 'bg-red-500' 
                          : 'bg-gold-500'
                    }`}
                  />
                  <span className="text-sm text-gray-300">
                    {caseItem.progress.completed}/{caseItem.progress.total}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusBadge(caseItem.status)} flex items-center gap-1`}>
                  {getStatusIcon(caseItem.status)}
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
                    onViewCase(caseItem.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};