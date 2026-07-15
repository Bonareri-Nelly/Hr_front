// src/features/offboarding/components/ChecklistView.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  User,
  Building2,
  Laptop,
  Shield,
  DollarSign,
  FileText,
  MessageSquare
} from 'lucide-react';
import type { ChecklistItem } from '../types';

interface ChecklistViewProps {
  caseId: string;
}

// Mock data - replace with actual API call
const mockChecklist: ChecklistItem[] = [
  {
    id: 'check-001',
    caseId: 'off-001',
    category: 'handover',
    item: 'Knowledge Transfer & Handover',
    description: 'Complete documentation and handover of responsibilities',
    status: 'in-progress',
    owner: 'manager-001',
    ownerName: 'John Manager',
    ownerRole: 'manager',
    dueDate: '2024-12-10',
    required: true,
    order: 1,
  },
  {
    id: 'check-002',
    caseId: 'off-001',
    category: 'assets',
    item: 'Company Laptop Return',
    description: 'Return laptop with all accessories',
    status: 'pending',
    owner: 'hr-admin-001',
    ownerName: 'HR Admin',
    ownerRole: 'hr-admin',
    dueDate: '2024-12-14',
    required: true,
    order: 2,
  },
  {
    id: 'check-003',
    caseId: 'off-001',
    category: 'it-access',
    item: 'System Access Revocation',
    description: 'Revoke all system access and accounts',
    status: 'completed',
    owner: 'sysadmin-001',
    ownerName: 'System Admin',
    ownerRole: 'system-admin',
    dueDate: '2024-12-15',
    completedDate: '2024-12-14',
    required: true,
    order: 3,
  },
  // Add more checklist items...
];

export const ChecklistView: React.FC<ChecklistViewProps> = () => {
  const [items, setItems] = useState<ChecklistItem[]>(mockChecklist);

  const getCategoryIcon = (category: string) => {
    const icons = {
      handover: <User className="h-4 w-4" />,
      assets: <Laptop className="h-4 w-4" />,
      'it-access': <Shield className="h-4 w-4" />,
      finance: <DollarSign className="h-4 w-4" />,
      statutory: <Building2 className="h-4 w-4" />,
      'exit-interview': <MessageSquare className="h-4 w-4" />,
      documentation: <FileText className="h-4 w-4" />,
    };
    return icons[category as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      waived: 'bg-gray-500/20 text-gray-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getCategoryName = (category: string) => {
    const names = {
      handover: 'Handover',
      assets: 'Assets',
      'it-access': 'IT Access',
      finance: 'Finance',
      statutory: 'Statutory',
      'exit-interview': 'Exit Interview',
      documentation: 'Documentation',
    };
    return names[category as keyof typeof names] || category;
  };

  const handleToggleStatus = (itemId: string) => {
    setItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const statusMap = {
            'pending': 'in-progress',
            'in-progress': 'completed',
            'completed': 'pending',
            'waived': 'pending',
          };
          const nextStatus = statusMap[item.status as keyof typeof statusMap] ?? 'pending';
          return {
            ...item,
            status: nextStatus as ChecklistItem['status'],
            completedDate: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return item;
      })
    );
  };

  const totalItems = items.length;
  const completedItems = items.filter(i => i.status === 'completed').length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="rounded-lg bg-navy-700/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Checklist Progress</p>
            <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
            <p className="text-sm text-gray-400">
              {completedItems} of {totalItems} items completed
            </p>
          </div>
          <div className="w-64">
            <Progress 
              value={progress} 
              className="h-3 bg-navy-800"
              indicatorClassName="bg-gold-500"
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-navy-700/50 border-gold-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={item.status === 'completed'}
                  onCheckedChange={() => handleToggleStatus(item.id)}
                  className="mt-1 border-gold-500/50 data-[state=checked]:bg-gold-500"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.item}</span>
                        <Badge className={getStatusBadge(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      {getCategoryIcon(item.category)}
                      {getCategoryName(item.category)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <User className="h-3 w-3" />
                      {item.ownerName}
                    </span>
                    {item.dueDate && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {item.completedDate && (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Completed: {new Date(item.completedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};