import React, { useState } from 'react';

interface ReportsExportsProps {
  data: {
    approvals?: {
      pendingCount?: number;
    };
  };
  branchIds: string[];
}

const ReportsExports: React.FC<ReportsExportsProps> = ({ data, branchIds }) => {
  const [selectedReport, setSelectedReport] = useState('payroll-summary');
  const [dateRange, setDateRange] = useState('this-month');
  const pendingApprovals = data?.approvals?.pendingCount ?? 0;

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting ${selectedReport} as ${format} for branches:`, branchIds);
    alert(`Exporting ${selectedReport} as ${format}...`);
  };

  return (
    <div className="reports-exports">
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type</label>
          <select 
            value={selectedReport} 
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="payroll-summary">Payroll Summary</option>
            <option value="ytd-payroll">YTD Payroll Report</option>
            <option value="tax-report">Tax Report</option>
            <option value="budget-report">Budget Report</option>
            <option value="audit-report">Audit Report</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="control-group">
          <label>Export Format</label>
          <div className="export-buttons">
            <button onClick={() => handleExport('excel')}>
              📊 Excel
            </button>
            <button onClick={() => handleExport('pdf')}>
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      <div className="report-preview">
        <h4>Report Preview</h4>
        <div className="preview-content">
          <p>Selected: {selectedReport.replace('-', ' ').toUpperCase()}</p>
          <p>Branches: {branchIds.includes('all') ? 'All' : branchIds.length}</p>
          <p>Period: {dateRange.replace('-', ' ').toUpperCase()}</p>
          <p>Pending approvals: {pendingApprovals}</p>
          <div className="preview-placeholder">
            📋 Report preview will appear here
          </div>
        </div>
      </div>

      <style>{`
        .reports-exports {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
        }
        .report-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .control-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #7f8c8d;
        }
        .control-group select {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.9rem;
          background: white;
        }
        .export-buttons {
          display: flex;
          gap: 8px;
        }
        .export-buttons button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .export-buttons button:first-child {
          background: #27ae60;
          color: white;
        }
        .export-buttons button:first-child:hover {
          background: #229954;
        }
        .export-buttons button:last-child {
          background: #e74c3c;
          color: white;
        }
        .export-buttons button:last-child:hover {
          background: #c0392b;
        }
        .report-preview h4 {
          margin-bottom: 12px;
          color: #2c3e50;
        }
        .preview-content {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
        }
        .preview-content p {
          margin: 4px 0;
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        .preview-placeholder {
          margin-top: 16px;
          padding: 32px;
          text-align: center;
          background: white;
          border: 2px dashed #e0e0e0;
          border-radius: 4px;
          color: #bdc3c7;
        }
      `}</style>
    </div>
  );
};

export default ReportsExports;
