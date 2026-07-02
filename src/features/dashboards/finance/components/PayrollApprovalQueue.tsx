import React, { useState } from 'react';

interface PayrollBatch {
  id: string;
  branchName: string;
  period: string;
  amount: number;
  employeeCount: number;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'review' | 'flagged' | 'approved';
}

interface ApprovalData {
  pending: PayrollBatch[];
  readyForDisbursement: PayrollBatch[];
  rejected: PayrollBatch[];
  history: PayrollBatch[];
  pendingCount: number;
}

interface PayrollApprovalQueueProps {
  data: ApprovalData;
  onApprove: (payrollId: string, notes?: string) => Promise<void>;
  onReject: (payrollId: string, reason: string) => Promise<void>;
  onFlag: (payrollId: string, flags: string[], notes?: string) => Promise<void>;
}

const PayrollApprovalQueue: React.FC<PayrollApprovalQueueProps> = ({
  data,
  onApprove,
  onReject,
  onFlag
}) => {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'ready' | 'rejected'>('pending');

  const getTabData = () => {
    switch (selectedTab) {
      case 'pending': return data.pending || [];
      case 'ready': return data.readyForDisbursement || [];
      case 'rejected': return data.rejected || [];
      default: return [];
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApproveClick = (batchId: string) => {
    const notes = prompt('Enter approval notes (optional):');
    onApprove(batchId, notes || undefined);
  };

  const handleRejectClick = (batchId: string) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason && reason.trim()) {
      onReject(batchId, reason);
    }
  };

  const handleFlagClick = (batchId: string) => {
    const flags = ['review_needed'];
    const notes = prompt('Please enter flag notes:');
    onFlag(batchId, flags, notes || undefined);
  };

  return (
    <div className="approval-queue">
      <div className="tabs">
        <button
          className={`tab ${selectedTab === 'pending' ? 'active' : ''}`}
          onClick={() => setSelectedTab('pending')}
        >
          Pending ({data.pendingCount})
        </button>
        <button
          className={`tab ${selectedTab === 'ready' ? 'active' : ''}`}
          onClick={() => setSelectedTab('ready')}
        >
          Ready for Disbursement
        </button>
        <button
          className={`tab ${selectedTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setSelectedTab('rejected')}
        >
          Rejected
        </button>
      </div>

      <div className="batch-list">
        {getTabData().length === 0 ? (
          <div className="empty-state">
            <p>No {selectedTab} payroll batches</p>
          </div>
        ) : (
          getTabData().map((batch) => (
            <div key={batch.id} className="batch-card">
              <div className="batch-header">
                <div className="batch-info">
                  <h4>{batch.branchName}</h4>
                  <span className="batch-period">{batch.period}</span>
                </div>
                <div className="batch-amount">
                  <span className="amount">{formatCurrency(batch.amount)}</span>
                  <span className="employee-count">{batch.employeeCount} employees</span>
                </div>
              </div>

              <div className="batch-details">
                <span>Submitted by: {batch.submittedBy}</span>
                <span>Date: {formatDate(batch.submittedAt)}</span>
                <span className={`status ${batch.status}`}>
                  {batch.status.toUpperCase()}
                </span>
              </div>

              {selectedTab === 'pending' && (
                <div className="batch-actions">
                  <button
                    className="action-button approve"
                    onClick={() => handleApproveClick(batch.id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="action-button reject"
                    onClick={() => handleRejectClick(batch.id)}
                  >
                    ❌ Reject
                  </button>
                  <button
                    className="action-button flag"
                    onClick={() => handleFlagClick(batch.id)}
                  >
                    ⚠️ Flag
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .approval-queue {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 16px;
        }
        .tab {
          padding: 10px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #7f8c8d;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }
        .tab:hover {
          color: #2c3e50;
        }
        .tab.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }
        .batch-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
        }
        .batch-card {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          transition: all 0.2s ease;
        }
        .batch-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .batch-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .batch-info h4 {
          margin: 0;
          color: #2c3e50;
        }
        .batch-period {
          font-size: 0.85rem;
          color: #7f8c8d;
        }
        .batch-amount {
          text-align: right;
        }
        .amount {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          display: block;
        }
        .employee-count {
          font-size: 0.85rem;
          color: #7f8c8d;
        }
        .batch-details {
          display: flex;
          gap: 16px;
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 12px;
        }
        .status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status.pending {
          background: #f39c12;
          color: white;
        }
        .status.review {
          background: #3498db;
          color: white;
        }
        .status.flagged {
          background: #e74c3c;
          color: white;
        }
        .status.approved {
          background: #2ecc71;
          color: white;
        }
        .batch-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .action-button {
          padding: 6px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .action-button.approve {
          background: #2ecc71;
          color: white;
        }
        .action-button.approve:hover {
          background: #27ae60;
        }
        .action-button.reject {
          background: #e74c3c;
          color: white;
        }
        .action-button.reject:hover {
          background: #c0392b;
        }
        .action-button.flag {
          background: #f39c12;
          color: white;
        }
        .action-button.flag:hover {
          background: #d68910;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default PayrollApprovalQueue;
