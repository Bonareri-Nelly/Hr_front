// ============================================================
// SecurityAuditPage.tsx - Main Security & Audit Dashboard
// ============================================================

import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Search,
  ChevronRight,
  Users,
  Lock,
  Activity,
  FileText,
  MoreHorizontal,
  Settings,
  RefreshCw,
  UserX,
  Globe,
  Server,
  Database,
  Bell,
  ShieldCheck,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  X,
  Edit,
  FileCheck,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// TYPES
// ============================================================

type Severity = "critical" | "high" | "medium" | "low" | "info";
type Status = "resolved" | "investigating" | "open" | "dismissed";

interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ip: string;
  severity: Severity;
  status: Status;
  source: string;
  description?: string;
  affectedSystems?: string[];
  recommendations?: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "failure" | "pending";
}

interface ComplianceItem {
  name: string;
  status: "Compliant" | "Partial" | "Action Required";
  color: string;
  width: string;
  path: string;
  icon: any;
  description: string;
  lastAudit: string;
}

interface SecurityMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  color: string;
}

// ============================================================
// DATA
// ============================================================

const severityConfig: Record<Severity, { label: string; icon: any; color: string; bg: string }> = {
  critical: { label: "Critical", icon: AlertCircle, color: "#dc2626", bg: "#fef2f2" },
  high: { label: "High", icon: AlertTriangle, color: "#d97706", bg: "#fffbeb" },
  medium: { label: "Medium", icon: Info, color: "#2563eb", bg: "#eff6ff" },
  low: { label: "Low", icon: Info, color: "#6b7280", bg: "#f9fafb" },
  info: { label: "Info", icon: Info, color: "#6b7280", bg: "#f9fafb" },
};

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  resolved: { label: "Resolved", color: "#16a34a", bg: "#f0fdf4" },
  investigating: { label: "Investigating", color: "#d97706", bg: "#fffbeb" },
  open: { label: "Open", color: "#dc2626", bg: "#fef2f2" },
  dismissed: { label: "Dismissed", color: "#6b7280", bg: "#f9fafb" },
};

const securityMetrics: SecurityMetric[] = [
  {
    label: "Security Score",
    value: "94%",
    change: "+5%",
    trend: "up",
    icon: ShieldCheck,
    color: "#4f46e5",
  },
  {
    label: "Active Sessions",
    value: "128",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "#0ea5e9",
  },
  {
    label: "Failed Logins",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: UserX,
    color: "#ef4444",
  },
  {
    label: "Open Incidents",
    value: "7",
    change: "+2",
    trend: "up",
    icon: AlertTriangle,
    color: "#f59e0b",
  },
];

const securityEvents: SecurityEvent[] = [
  {
    id: "SEC-2026-001",
    timestamp: "2026-07-08 09:42:15",
    event: "Multiple failed login attempts",
    user: "john.doe@company.com",
    ip: "192.168.1.45",
    severity: "high",
    status: "investigating",
    source: "Authentication Service",
    description: "Multiple failed login attempts detected from IP 192.168.1.45.",
    affectedSystems: ["Authentication Service", "User Database"],
    recommendations: ["Enable MFA for user", "Block source IP", "Reset user password"],
  },
  {
    id: "SEC-2026-002",
    timestamp: "2026-07-08 08:15:22",
    event: "Suspicious API access pattern detected",
    user: "api-gateway",
    ip: "10.0.0.23",
    severity: "critical",
    status: "open",
    source: "API Gateway",
    description: "Unusual API call pattern detected from internal service.",
    affectedSystems: ["API Gateway", "Database Service"],
    recommendations: ["Review API logs", "Rotate API keys", "Implement rate limiting"],
  },
  {
    id: "SEC-2026-003",
    timestamp: "2026-07-08 07:30:45",
    event: "Unauthorized access attempt to payroll data",
    user: "unknown",
    ip: "203.0.113.42",
    severity: "critical",
    status: "investigating",
    source: "Payroll Service",
    description: "Attempted access to payroll data from unauthorized IP address.",
    affectedSystems: ["Payroll Service", "Employee Database"],
    recommendations: ["Block source IP", "Review access logs", "Notify security team"],
  },
  {
    id: "SEC-2026-004",
    timestamp: "2026-07-08 06:55:10",
    event: "Password change - admin account",
    user: "admin@company.com",
    ip: "192.168.1.10",
    severity: "medium",
    status: "resolved",
    source: "Identity Service",
    description: "Admin password was changed from internal IP.",
    affectedSystems: ["Identity Service"],
    recommendations: ["Verify identity of user", "Enable additional MFA"],
  },
  {
    id: "SEC-2026-005",
    timestamp: "2026-07-08 06:12:33",
    event: "Suspicious file download activity",
    user: "jane.smith@company.com",
    ip: "192.168.1.67",
    severity: "medium",
    status: "dismissed",
    source: "File Storage",
    description: "Large volume of files downloaded in short time period.",
    affectedSystems: ["File Storage", "User Account"],
    recommendations: ["Review download logs", "Implement download limits"],
  },
  {
    id: "SEC-2026-006",
    timestamp: "2026-07-08 05:40:18",
    event: "New device registration from unusual location",
    user: "robert.kim@company.com",
    ip: "198.51.100.88",
    severity: "low",
    status: "resolved",
    source: "Device Management",
    description: "Device registration from location not previously associated with user.",
    affectedSystems: ["Device Management"],
    recommendations: ["Verify device ownership", "Enable device trust"],
  },
];

const auditLogs: AuditLog[] = [
  {
    id: "AUD-2026-001",
    timestamp: "2026-07-08 09:45:12",
    user: "angela.njeri@company.com",
    action: "Payroll Run Approval",
    resource: "Payroll - July 2026",
    ip: "192.168.1.120",
    status: "success",
  },
  {
    id: "AUD-2026-002",
    timestamp: "2026-07-08 09:30:05",
    user: "brian.otieno@company.com",
    action: "User Role Update",
    resource: "User: emp-045",
    ip: "192.168.1.45",
    status: "success",
  },
  {
    id: "AUD-2026-003",
    timestamp: "2026-07-08 09:15:44",
    user: "grace.wanjiru@company.com",
    action: "Security Policy Change",
    resource: "MFA Policy",
    ip: "192.168.1.78",
    status: "failure",
  },
  {
    id: "AUD-2026-004",
    timestamp: "2026-07-08 08:55:30",
    user: "sam.mwangi@company.com",
    action: "Data Export",
    resource: "Employee Records - 214 records",
    ip: "192.168.1.90",
    status: "success",
  },
  {
    id: "AUD-2026-005",
    timestamp: "2026-07-08 08:30:18",
    user: "mercy.achieng@company.com",
    action: "API Key Regeneration",
    resource: "API Key: payroll-service",
    ip: "192.168.1.34",
    status: "pending",
  },
];

const complianceItems: ComplianceItem[] = [
  {
    name: "ISO 27001",
    status: "Compliant",
    color: "#22c55e",
    width: "100%",
    path: "/security/compliance/iso27001",
    icon: ShieldCheck,
    description: "Information Security Management System",
    lastAudit: "2026-06-15",
  },
  {
    name: "GDPR",
    status: "Partial",
    color: "#f59e0b",
    width: "85%",
    path: "/security/compliance/gdpr",
    icon: Globe,
    description: "General Data Protection Regulation",
    lastAudit: "2026-05-20",
  },
  {
    name: "SOC 2",
    status: "Compliant",
    color: "#22c55e",
    width: "95%",
    path: "/security/compliance/soc2",
    icon: Database,
    description: "System and Organization Controls",
    lastAudit: "2026-06-30",
  },
  {
    name: "PCI DSS",
    status: "Action Required",
    color: "#ef4444",
    width: "60%",
    path: "/security/compliance/pci-dss",
    icon: Lock,
    description: "Payment Card Industry Data Security Standard",
    lastAudit: "2026-04-10",
  },
];

// ============================================================
// COMPONENT: SecurityEventBadges - Helper for rendering badges
// ============================================================

const SecurityEventBadges: React.FC<{ severity: Severity; status: Status }> = ({ severity, status }) => {
  const SeverityIcon = severityConfig[severity].icon;
  const severityColor = severityConfig[severity].color;
  const severityBg = severityConfig[severity].bg;
  const statusColor = statusConfig[status].color;
  const statusBg = statusConfig[status].bg;

  return (
    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          background: severityBg,
          color: severityColor,
          border: `1px solid ${severityColor}20`,
        }}
      >
        <SeverityIcon size={12} />
        {severityConfig[severity].label}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          background: statusBg,
          color: statusColor,
          border: `1px solid ${statusColor}20`,
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: statusColor,
          }}
        />
        {statusConfig[status].label}
      </span>
    </div>
  );
};

// ============================================================
// COMPONENT: SecurityEventDetails
// ============================================================

const SecurityEventDetails: React.FC<{ event: SecurityEvent; onClose: () => void }> = ({ event, onClose }) => {
  const navigate = useNavigate();
  const SeverityIcon = severityConfig[event.severity].icon;
  const severityColor = severityConfig[event.severity].color;
  const severityBg = severityConfig[event.severity].bg;
  const statusColor = statusConfig[event.status].color;
  const statusBg = statusConfig[event.status].bg;

  return (
    <div style={{ padding: "20px 24px 24px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#94a3b8",
                fontFamily: "monospace",
                letterSpacing: "0.3px",
              }}
            >
              {event.id}
            </span>
          </div>
          <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
            {event.event}
          </h4>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "100px",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            background: severityBg,
            color: severityColor,
            border: `1px solid ${severityColor}20`,
          }}
        >
          <SeverityIcon size={12} />
          {severityConfig[event.severity].label}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "100px",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            background: statusBg,
            color: statusColor,
            border: `1px solid ${statusColor}20`,
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: statusColor,
            }}
          />
          {statusConfig[event.status].label}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 20px",
          marginBottom: "20px",
          background: "#f8fafc",
          padding: "16px",
          borderRadius: "10px",
        }}
      >
        {[
          { label: "User", value: event.user, icon: Users },
          { label: "IP Address", value: event.ip, icon: Server },
          { label: "Source", value: event.source, icon: Database, fullWidth: true },
          { label: "Timestamp", value: event.timestamp, icon: Clock, fullWidth: true },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                gridColumn: item.fullWidth ? "1 / -1" : "auto",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icon size={12} />
                {item.label}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {event.description && (
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Description</span>
          <p style={{ fontSize: "14px", color: "#1e293b", margin: "4px 0 0 0", lineHeight: 1.6 }}>
            {event.description}
          </p>
        </div>
      )}

      {event.affectedSystems && (
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Affected Systems</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
            {event.affectedSystems.map((system) => (
              <span
                key={system}
                style={{
                  padding: "3px 12px",
                  borderRadius: "6px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {system}
              </span>
            ))}
          </div>
        </div>
      )}

      {event.recommendations && (
        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Recommendations</span>
          <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px", fontSize: "14px", color: "#1e293b" }}>
            {event.recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: "4px" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          paddingTop: "16px",
          borderTop: "1px solid #f1f5f9",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => navigate(`/security/events/${event.id}/investigate`)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            border: "none",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(79, 70, 229, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(79, 70, 229, 0.3)";
          }}
        >
          <Eye size={15} />
          Investigate
        </button>
        <button
          onClick={() => navigate(`/security/events/${event.id}/resolve`)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            border: "1px solid #e2e8f0",
            background: "white",
            color: "#1e293b",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <CheckCircle2 size={15} />
          Mark Resolved
        </button>
        <button
          onClick={() => navigate(`/security/events/${event.id}/alert`)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            border: "1px solid #e2e8f0",
            background: "white",
            color: "#1e293b",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Bell size={15} />
          Alert Team
        </button>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENT: SecurityScanPage
// ============================================================

const SecurityScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{ completed: boolean; issues: number; fixes: number } | null>(
    null
  );

  const handleStartScan = () => {
    setScanning(true);
    setProgress(0);
    setScanResults(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanResults({
            completed: true,
            issues: Math.floor(Math.random() * 5) + 1,
            fixes: Math.floor(Math.random() * 3),
          });
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
  };

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/security")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#64748b",
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          marginBottom: "24px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#64748b";
        }}
      >
        <ArrowLeft size={16} />
        Back to Security Dashboard
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(226,232,240,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={32} style={{ color: "#4f46e5" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Security Scan
            </h1>
            <p style={{ fontSize: "15px", color: "#64748b", margin: "4px 0 0 0" }}>
              Run a comprehensive security scan across all systems
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Systems to Scan
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginTop: "4px",
                }}
              >
                12
              </span>
            </div>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Estimated Time
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginTop: "4px",
                }}
              >
                2-3 minutes
              </span>
            </div>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Last Scan
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginTop: "4px",
                }}
              >
                3 days ago
              </span>
            </div>
          </div>
        </div>

        {scanning ? (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                  Scanning in progress...
                </span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#4f46e5" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#f1f5f9",
                  borderRadius: "100px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                    borderRadius: "100px",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {["Authentication", "Authorization", "Data Security", "Network Security", "Endpoint Protection", "Compliance"].map(
                (item, idx) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: progress > (idx + 1) * 16 ? "#22c55e" : "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {progress > (idx + 1) * 16 && <CheckCircle2 size={10} style={{ color: "white" }} />}
                    </div>
                    <span style={{ fontSize: "13px", color: progress > (idx + 1) * 16 ? "#0f172a" : "#94a3b8" }}>
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ) : scanResults ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <CheckCircle2 size={32} style={{ color: "#22c55e" }} />
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                  Scan Complete
                </h3>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Security scan finished successfully
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Issues Found
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: scanResults.issues > 0 ? "#ef4444" : "#22c55e",
                    marginTop: "4px",
                  }}
                >
                  {scanResults.issues}
                </span>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Fixes Applied
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#22c55e",
                    marginTop: "4px",
                  }}
                >
                  {scanResults.fixes}
                </span>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Security Score
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#4f46e5",
                    marginTop: "4px",
                  }}
                >
                  94%
                </span>
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <button
                onClick={handleStartScan}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.35)";
                }}
              >
                <RefreshCw size={16} style={{ marginRight: "8px" }} />
                Run New Scan
              </button>
              <button
                onClick={() => navigate("/security")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStartScan}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              border: "none",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
              transition: "all 0.2s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.35)";
            }}
          >
            <Shield size={20} style={{ marginRight: "10px" }} />
            Start Security Scan
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// COMPONENT: SecuritySettingsPage
// ============================================================

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Authentication",
      icon: Lock,
      settings: [
        { name: "Multi-Factor Authentication", status: "Enabled", description: "Require MFA for all users" },
        { name: "Password Policy", status: "Strong", description: "Minimum 12 characters, special characters required" },
        { name: "Session Timeout", status: "30 minutes", description: "Auto-logout after inactivity" },
        { name: "Single Sign-On", status: "Enabled", description: "SSO via Okta" },
      ],
    },
    {
      title: "Access Control",
      icon: Shield,
      settings: [
        { name: "Role-Based Access", status: "Active", description: "RBAC enabled with 5 roles" },
        { name: "IP Whitelisting", status: "Enabled", description: "Restricted to company IPs" },
        { name: "API Key Management", status: "Rotated monthly", description: "Keys expire every 30 days" },
      ],
    },
    {
      title: "Monitoring & Alerts",
      icon: Bell,
      settings: [
        { name: "Real-time Alerts", status: "Active", description: "Alert on suspicious activities" },
        { name: "Audit Logging", status: "Enabled", description: "All activities logged" },
        { name: "Threat Detection", status: "Active", description: "AI-powered threat detection" },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/security")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#64748b",
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          marginBottom: "24px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#64748b";
        }}
      >
        <ArrowLeft size={16} />
        Back to Security Dashboard
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(226,232,240,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={28} style={{ color: "#4f46e5" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Security Settings
            </h1>
            <p style={{ fontSize: "15px", color: "#64748b", margin: "4px 0 0 0" }}>
              Configure your organization's security policies
            </p>
          </div>
        </div>

        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Icon size={18} style={{ color: "#4f46e5" }} />
                {section.title}
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                {section.settings.map((setting) => (
                  <div
                    key={setting.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 18px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #f1f5f9",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f1f5f9";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#f1f5f9";
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                        {setting.name}
                      </span>
                      <span style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>
                        {setting.description}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color:
                            setting.status.includes("Enabled") || setting.status.includes("Active")
                              ? "#22c55e"
                              : "#f59e0b",
                          background:
                            setting.status.includes("Enabled") || setting.status.includes("Active")
                              ? "#f0fdf4"
                              : "#fffbeb",
                          padding: "3px 12px",
                          borderRadius: "100px",
                        }}
                      >
                        {setting.status}
                      </span>
                      <button
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 500,
                          border: "1px solid #e2e8f0",
                          background: "white",
                          color: "#1e293b",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <Edit size={12} style={{ marginRight: "4px" }} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// COMPONENT: SecurityCompliancePage
// ============================================================

const SecurityCompliancePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompliance, setSelectedCompliance] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/security")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#64748b",
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          marginBottom: "24px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#64748b";
        }}
      >
        <ArrowLeft size={16} />
        Back to Security Dashboard
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(226,232,240,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileCheck size={28} style={{ color: "#4f46e5" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Compliance Management
            </h1>
            <p style={{ fontSize: "15px", color: "#64748b", margin: "4px 0 0 0" }}>
              Track and manage compliance certifications
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {complianceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                style={{
                  padding: "20px 24px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setSelectedCompliance(item.name === selectedCompliance ? null : item.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f1f5f9";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icon size={20} style={{ color: item.color }} />
                    <div>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
                        {item.name}
                      </span>
                      <span style={{ display: "block", fontSize: "13px", color: "#64748b" }}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: item.color,
                        background: `${item.color}15`,
                        padding: "3px 12px",
                        borderRadius: "100px",
                      }}
                    >
                      {item.status}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Last audit: {item.lastAudit}</span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "#f1f5f9",
                    borderRadius: "100px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: item.width,
                      height: "100%",
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: "100px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>

                {selectedCompliance === item.name && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0 0 8px 0" }}>
                      Compliance Details
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#94a3b8",
                          }}
                        >
                          Status
                        </span>
                        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: item.color }}>
                          {item.status}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#94a3b8",
                          }}
                        >
                          Compliance Score
                        </span>
                        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                          {item.width}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#94a3b8",
                          }}
                        >
                          Last Audit
                        </span>
                        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                          {item.lastAudit}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#94a3b8",
                          }}
                        >
                          Next Audit
                        </span>
                        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                          Q4 2026
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 500,
                          border: "none",
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          color: "white",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <FileText size={14} style={{ marginRight: "6px" }} />
                        View Documentation
                      </button>
                      <button
                        style={{
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 500,
                          border: "1px solid #e2e8f0",
                          background: "white",
                          color: "#1e293b",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <Eye size={14} style={{ marginRight: "6px" }} />
                        View Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const SecurityAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "32px 40px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              <span>🏢 Dashboard</span>
              <ChevronRight size={14} />
              <span style={{ color: "#1e293b", fontWeight: 500 }}>Security & Audit</span>
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 4px 0",
                letterSpacing: "-0.7px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              Security & Audit Dashboard
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#22c55e",
                  background: "#f0fdf4",
                  padding: "3px 12px",
                  borderRadius: "100px",
                  border: "1px solid #bbf7d0",
                }}
              >
                ● Live
              </span>
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                maxWidth: "640px",
                lineHeight: 1.6,
              }}
            >
              Monitor security events, audit trails, and compliance status across your organization
              in real-time.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0, alignItems: "center" }}>
            <button
              onClick={handleRefresh}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid #e2e8f0",
                background: "white",
                color: "#1e293b",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
              }}
            >
              <RefreshCw size={16} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
            <button
              onClick={() => handleNavigate("/security/scan")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(79, 70, 229, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(79, 70, 229, 0.35)";
              }}
            >
              <Shield size={16} />
              Run Security Scan
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {securityMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(226, 232, 240, 0.6)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => {
                  const paths: Record<string, string> = {
                    "Security Score": "/security/score",
                    "Active Sessions": "/security/sessions",
                    "Failed Logins": "/security/failed-logins",
                    "Open Incidents": "/security/incidents",
                  };
                  handleNavigate(paths[metric.label]);
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${metric.color}15`,
                    color: metric.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {metric.label}
                  </span>
                  <span
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.7px",
                      lineHeight: 1.2,
                    }}
                  >
                    {metric.value}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color:
                        metric.trend === "up"
                          ? "#22c55e"
                          : metric.trend === "down"
                          ? "#ef4444"
                          : "#94a3b8",
                    }}
                  >
                    {metric.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Grid - Security Events & Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Security Events List */}
          <section
            style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px 16px 24px",
                borderBottom: "1px solid #f1f5f9",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertCircle size={18} style={{ color: "#4f46e5" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                  Security Events
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "1px 10px",
                    borderRadius: "100px",
                  }}
                >
                  {filteredEvents.length}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={15} style={{ position: "absolute", left: "12px", color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: "7px 12px 7px 36px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "13px",
                      width: "180px",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      background: "#f8fafc",
                      color: "#0f172a",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4f46e5";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                      e.currentTarget.style.background = "white";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  />
                </div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as Severity | "all")}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="all">All Severity</option>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <button
                  onClick={() => handleNavigate("/security/events")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  View All
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div style={{ padding: "4px 12px 12px 12px", maxHeight: "480px", overflowY: "auto" }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: "2px solid transparent",
                      marginBottom: "4px",
                      background: selectedEventId === event.id ? "#eef2ff" : "transparent",
                      borderColor: selectedEventId === event.id ? "#4f46e5" : "transparent",
                    }}
                    onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                    onMouseEnter={(e) => {
                      if (selectedEventId !== event.id) {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEventId !== event.id) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#94a3b8",
                          fontFamily: "monospace",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {event.id}
                      </span>
                      <SecurityEventBadges severity={event.severity} status={event.status} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                        {event.event}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{event.timestamp}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span style={{ fontWeight: 500, color: "#64748b" }}>{event.user}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span>IP: {event.ip}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span
                          style={{
                            background: "#f1f5f9",
                            padding: "2px 10px",
                            borderRadius: "6px",
                            fontWeight: 500,
                            color: "#475569",
                            fontSize: "11px",
                          }}
                        >
                          {event.source}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
                  <Shield size={40} style={{ color: "#cbd5e1", marginBottom: "16px" }} />
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>
                    No security events match your filters
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#cbd5e1" }}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Event Details */}
          <section
            style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px 16px 24px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Eye size={18} style={{ color: "#4f46e5" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                  Event Details
                </h3>
              </div>
              <button
                onClick={() => handleNavigate("/security/settings")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#64748b",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
            {selectedEventId ? (
              <SecurityEventDetails
                event={securityEvents.find((e) => e.id === selectedEventId)!}
                onClose={() => setSelectedEventId(null)}
              />
            ) : (
              <div style={{ padding: "80px 20px", textAlign: "center", color: "#94a3b8" }}>
                <Shield size={48} style={{ color: "#cbd5e1", marginBottom: "16px" }} />
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "#64748b" }}>
                  Select a security event
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#cbd5e1" }}>
                  Click on any event to view its details here
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Audit Logs */}
        <section
          style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(226, 232, 240, 0.6)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px 16px 24px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FileText size={18} style={{ color: "#4f46e5" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                Audit Logs
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  background: "#f1f5f9",
                  padding: "1px 10px",
                  borderRadius: "100px",
                }}
              >
                {auditLogs.length}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleNavigate("/security/audit/export")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <Download size={15} />
                Export Logs
              </button>
              <button
                onClick={() => handleNavigate("/security/settings")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#64748b",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
          <div style={{ overflowX: "auto", padding: "0 8px 8px 8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Timestamp", "User", "Action", "Resource", "IP Address", "Status"].map((header) => (
                    <th
                      key={header}
                      style={{
                        textAlign: "left",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: "#94a3b8",
                        borderBottom: "2px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => handleNavigate(`/security/audit/${log.id}`)}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.timestamp}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                        fontWeight: 500,
                      }}
                    >
                      {log.user}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {log.action}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#64748b",
                      }}
                    >
                      {log.resource}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#64748b",
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                    >
                      {log.ip}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 12px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background:
                            log.status === "success"
                              ? "#f0fdf4"
                              : log.status === "failure"
                              ? "#fef2f2"
                              : "#fffbeb",
                          color:
                            log.status === "success"
                              ? "#16a34a"
                              : log.status === "failure"
                              ? "#dc2626"
                              : "#d97706",
                          border: `1px solid ${
                            log.status === "success"
                              ? "#bbf7d0"
                              : log.status === "failure"
                              ? "#fecaca"
                              : "#fde68a"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background:
                              log.status === "success"
                                ? "#16a34a"
                                : log.status === "failure"
                                ? "#dc2626"
                                : "#d97706",
                          }}
                        />
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compliance Status */}
        <section>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px 32px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4f46e5",
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Compliance Status
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#22c55e",
                  background: "#f0fdf4",
                  padding: "2px 12px",
                  borderRadius: "100px",
                  border: "1px solid #bbf7d0",
                  marginLeft: "4px",
                }}
              >
                96% Compliant
              </span>
              <button
                onClick={() => handleNavigate("/security/compliance/files")}
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eef2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Review Files
                <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: "grid", gap: "18px" }}>
              {complianceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    style={{
                      cursor: "pointer",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      transition: "all 0.2s",
                      background: "#fafbfc",
                      border: "1px solid transparent",
                    }}
                    onClick={() => handleNavigate(item.path)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fafbfc";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Icon size={16} style={{ color: item.color }} />
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: item.color,
                          background: `${item.color}15`,
                          padding: "3px 12px",
                          borderRadius: "100px",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "#f1f5f9",
                        borderRadius: "100px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: item.width,
                          height: "100%",
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                          borderRadius: "100px",
                          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CSS Animations */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default SecurityAuditPage;
export { SecurityScanPage, SecuritySettingsPage, SecurityCompliancePage };