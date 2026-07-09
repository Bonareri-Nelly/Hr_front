// src/features/offboarding/components/FinalSettlementView.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
} from 'lucide-react';
import type { FinalSettlement } from '../types';

interface FinalSettlementViewProps {
  caseId: string;
}

// Mock data - replace with actual API call
const mockSettlement: FinalSettlement = {
  id: 'sett-001',
  caseId: 'off-001',
  employeeId: 'emp-001',
  proRatedSalary: 3250.00,
  leaveEncashment: 1200.00,
  pendingReimbursements: 450.00,
  otherEarnings: 0,
  totalEarnings: 4900.00,
  loanDeductions: 500.00,
  assetNonReturnDeduction: 0,
  noticePeriodShortfall: 0,
  otherDeductions: 150.00,
  totalDeductions: 650.00,
  netPay: 4250.00,
  finalPAYE: 850.00,
  finalNSSF: 108.00,
  finalNHIF: 45.00,
  finalHousingLevy: 85.00,
  status: 'pending-review',
  createdAt: '2024-12-01',
  updatedAt: '2024-12-01',
};

export const FinalSettlementView: React.FC<FinalSettlementViewProps> = () => {
  const [settlement, setSettlement] = useState<FinalSettlement>(mockSettlement);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettlement, setEditedSettlement] = useState(settlement);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-500/20 text-gray-400',
      'pending-review': 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
      paid: 'bg-blue-500/20 text-blue-400',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSaveSettlement = () => {
    setSettlement(editedSettlement);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Final Settlement</h3>
          <p className="text-sm text-gray-400">Calculate and approve final payment</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusBadge(settlement.status)}>
            {settlement.status.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(settlement.totalEarnings)}
                </p>
              </div>
              <div className="rounded-full bg-green-500/20 p-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Deductions</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(settlement.totalDeductions)}
                </p>
              </div>
              <div className="rounded-full bg-red-500/20 p-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Net Pay</p>
                <p className="text-2xl font-bold text-gold-400">
                  {formatCurrency(settlement.netPay)}
                </p>
              </div>
              <div className="rounded-full bg-gold-500/20 p-2">
                <DollarSign className="h-5 w-5 text-gold-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Statutory Total</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(
                    settlement.finalPAYE +
                    settlement.finalNSSF +
                    settlement.finalNHIF +
                    settlement.finalHousingLevy
                  )}
                </p>
              </div>
              <div className="rounded-full bg-blue-500/20 p-2">
                <Calculator className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Earnings */}
        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-white">Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Pro-rated Salary</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.proRatedSalary}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      proRatedSalary: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.proRatedSalary)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Leave Encashment</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.leaveEncashment}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      leaveEncashment: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.leaveEncashment)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Pending Reimbursements</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.pendingReimbursements}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      pendingReimbursements: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.pendingReimbursements)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Other Earnings</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.otherEarnings}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      otherEarnings: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.otherEarnings)
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gold-500/20">
              <span className="font-medium text-gold-400">Total Earnings</span>
              <span className="font-medium text-gold-400">
                {formatCurrency(settlement.totalEarnings)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card className="bg-navy-700/50 border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-white">Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Loan Deductions</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.loanDeductions}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      loanDeductions: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.loanDeductions)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Asset Non-Return</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.assetNonReturnDeduction}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      assetNonReturnDeduction: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.assetNonReturnDeduction)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Notice Period Shortfall</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.noticePeriodShortfall}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      noticePeriodShortfall: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.noticePeriodShortfall)
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-500/10 pb-2">
              <span className="text-gray-400">Other Deductions</span>
              <span className="text-white">
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedSettlement.otherDeductions}
                    onChange={(e) => setEditedSettlement({
                      ...editedSettlement,
                      otherDeductions: parseFloat(e.target.value) || 0
                    })}
                    className="w-32 bg-navy-800 text-white border-gold-500/20"
                  />
                ) : (
                  formatCurrency(settlement.otherDeductions)
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gold-500/20">
              <span className="font-medium text-red-400">Total Deductions</span>
              <span className="font-medium text-red-400">
                {formatCurrency(settlement.totalDeductions)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statutory Details */}
      <Card className="bg-navy-700/50 border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-white">Statutory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-gray-400">Final PAYE</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(settlement.finalPAYE)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Final NSSF</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(settlement.finalNSSF)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Final NHIF</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(settlement.finalNHIF)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Housing Levy</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(settlement.finalHousingLevy)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-gold-500/20 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettlement}
              className="bg-gold-500 text-navy-900 hover:bg-gold-400"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-gold-500/20 text-white"
            >
              Edit Settlement
            </Button>
            <Button className="bg-gold-500 text-navy-900 hover:bg-gold-400">
              Submit for Review
            </Button>
          </>
        )}
      </div>
    </div>
  );
};