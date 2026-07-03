import React from 'react';

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  sectionId: string;
  title: string;
  message: string;
  actionable: boolean;
}

interface AlertsExceptionsProps {
  alerts: Alert[];
  className?: string;
}

const AlertsExceptions: React.FC<AlertsExceptionsProps> = ({ alerts, className }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className={`alerts-container ${className || ''}`}>
        <div className="no-alerts">✅ All systems normal</div>
      </div>
    );
  }

  return (
    <div className={`alerts-container ${className || ''}`}>
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`alert ${alert.severity}`}
        >
          <div className="alert-icon">
            {alert.severity === 'critical' && '🔴'}
            {alert.severity === 'warning' && '⚠️'}
            {alert.severity === 'info' && 'ℹ️'}
          </div>
          <div className="alert-content">
            <div className="alert-title">{alert.title}</div>
            <div className="alert-message">{alert.message}</div>
          </div>
          {alert.actionable && (
            <button className="alert-action">Take Action</button>
          )}
        </div>
      ))}

      <style>{`
        .alerts-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .no-alerts {
          text-align: center;
          padding: 12px;
          color: #2ecc71;
          font-weight: 500;
        }
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 8px;
          border-left: 4px solid;
        }
        .alert:last-child {
          margin-bottom: 0;
        }
        .alert.critical {
          background: #fde8e8;
          border-left-color: #e74c3c;
        }
        .alert.warning {
          background: #fef5e7;
          border-left-color: #f39c12;
        }
        .alert.info {
          background: #ebf5fb;
          border-left-color: #3498db;
        }
        .alert-icon {
          font-size: 1.5rem;
        }
        .alert-content {
          flex: 1;
        }
        .alert-title {
          font-weight: 600;
          color: #2c3e50;
        }
        .alert-message {
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        .alert-action {
          padding: 4px 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .alert-action:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default AlertsExceptions;