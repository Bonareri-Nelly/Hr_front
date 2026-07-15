// ==========================================
// COMPONENT: ComplianceTable
// ==========================================

import React from 'react';
import { ComplianceData } from '../types';

interface ComplianceTableProps {
  data: ComplianceData[];
  onExport?: () => void;
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({ data, onExport }) => {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-chart-bar"></i>
        <p>No compliance data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-toolbar">
        <button className="btn-outline btn-sm" onClick={onExport}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>
      <table className="compliance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Branch</th>
            <th>Department</th>
            <th>Completed</th>
            <th>Total Required</th>
            <th>Compliance</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.employeeId}>
              <td><strong>{row.employeeName}</strong></td>
              <td>{row.branch}</td>
              <td>{row.department}</td>
              <td>{row.completed}</td>
              <td>{row.totalRequired}</td>
              <td>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${row.percentage}%` }}></div>
                  </div>
                  <span className={`progress-label ${row.percentage >= 80 ? 'high' : row.percentage >= 50 ? 'medium' : 'low'}`}>
                    {row.percentage}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};