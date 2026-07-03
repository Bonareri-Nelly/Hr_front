import React from 'react';

type BankFile = {
  fileName: string;
  status: string;
  amount: number;
};

type PaymentRecord = Record<string, unknown>;

interface DisbursementStatusProps {
  data: {
    stats: {
      totalAmount: number;
      paidCount: number;
      pendingCount: number;
      failedCount: number;
    };
    bankFiles: BankFile[];
    payments: PaymentRecord[];
    failedPayments: PaymentRecord[];
  };
}

const DisbursementStatus: React.FC<DisbursementStatusProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="disbursement-status">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Disbursed</span>
          <span className="stat-value">{formatCurrency(data.stats.totalAmount)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Paid</span>
          <span className="stat-value success">{data.stats.paidCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value warning">{data.stats.pendingCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Failed</span>
          <span className="stat-value danger">{data.stats.failedCount}</span>
        </div>
      </div>

      <div className="bank-files">
        <h4>Bank Files</h4>
        {data.bankFiles.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.fileName}</span>
            <span className="file-status">{file.status}</span>
            <span>{formatCurrency(file.amount)}</span>
          </div>
        ))}
      </div>

      <style>{`
        .disbursement-status {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .stat-value.success {
          color: #2ecc71;
        }
        .stat-value.warning {
          color: #f39c12;
        }
        .stat-value.danger {
          color: #e74c3c;
        }
        .bank-files h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .file-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.9rem;
        }
        .file-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #3498db;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default DisbursementStatus;
