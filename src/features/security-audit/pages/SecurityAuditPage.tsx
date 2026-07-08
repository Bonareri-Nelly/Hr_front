import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  ChevronRight,
  Users,
  Lock,
  Key,
  Activity,
  FileText,
  Calendar,
  MoreHorizontal,
  Settings,
  RefreshCw,
  ExternalLink,
  UserCheck,
  UserX,
  Globe,
  Server,
  Database,
  Bell,
  ShieldCheck,
  AlertCircle,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface SecurityMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
}

const securityMetrics: SecurityMetric[] = [
  {
    label: "Security Score",
    value: "94%",
    change: "+5%",
    trend: "up",
    icon: ShieldCheck,
  },
  {
    label: "Active Sessions",
    value: "128",
    change: "+12",
    trend: "up",
    icon: Users,
  },
  {
    label: "Failed Logins",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: UserX,
  },
  {
    label: "Open Incidents",
    value: "7",
    change: "+2",
    trend: "up",
    icon: AlertTriangle,
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

const severityConfig: Record<Severity, { label: string; icon: any; className: string }> = {
  critical: { label: "Critical", icon: AlertCircle, className: "sev-critical" },
  high: { label: "High", icon: AlertTriangle, className: "sev-high" },
  medium: { label: "Medium", icon: Info, className: "sev-medium" },
  low: { label: "Low", icon: Info, className: "sev-low" },
  info: { label: "Info", icon: Info, className: "sev-info" },
};

const statusConfig: Record<Status, { label: string; className: string }> = {
  resolved: { label: "Resolved", className: "status-resolved" },
  investigating: { label: "Investigating", className: "status-investigating" },
  open: { label: "Open", className: "status-open" },
  dismissed: { label: "Dismissed", className: "status-dismissed" },
};

export default function SecurityAuditPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const getSeverityBadge = (severity: Severity) => {
    const config = severityConfig[severity];
    const Icon = config.icon;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          background:
            severity === "critical"
              ? "#fee2e2"
              : severity === "high"
              ? "#fef3c7"
              : severity === "medium"
              ? "#dbeafe"
              : "#f1f5f9",
          color:
            severity === "critical"
              ? "#991b1b"
              : severity === "high"
              ? "#92400e"
              : severity === "medium"
              ? "#1e40af"
              : "#475569",
        }}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: Status) => {
    const config = statusConfig[status];
    return (
      <span
        style={{
          display: "inline-block",
          fontSize: "10px",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          background:
            status === "resolved"
              ? "#dcfce7"
              : status === "investigating"
              ? "#fef3c7"
              : status === "open"
              ? "#fee2e2"
              : "#f1f5f9",
          color:
            status === "resolved"
              ? "#166534"
              : status === "investigating"
              ? "#92400e"
              : status === "open"
              ? "#991b1b"
              : "#475569",
        }}
      >
        {config.label}
      </span>
    );
  };

  const getAuditStatusBadge = (status: AuditLog["status"]) => {
    const config = {
      success: { label: "Success", color: "#dcfce7", textColor: "#166534" },
      failure: { label: "Failure", color: "#fee2e2", textColor: "#991b1b" },
      pending: { label: "Pending", color: "#fef3c7", textColor: "#92400e" },
    };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "3px 10px",
          borderRadius: "100px",
          fontSize: "11px",
          fontWeight: 600,
          background: config[status].color,
          color: config[status].textColor,
        }}
      >
        {config[status].label}
      </span>
    );
  };

  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Navigation handlers
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRunSecurityScan = () => {
    navigate("/security/scan");
  };

  const handleViewAllEvents = () => {
    navigate("/security/events");
  };

  const handleExportLogs = () => {
    navigate("/security/audit/export");
  };

  const handleSettings = () => {
    navigate("/security/settings");
  };

  const handleInvestigate = (eventId: string) => {
    navigate(`/security/events/${eventId}/investigate`);
  };

  const handleMarkResolved = (eventId: string) => {
    navigate(`/security/events/${eventId}/resolve`);
  };

  const handleAlertTeam = (eventId: string) => {
    navigate(`/security/events/${eventId}/alert`);
  };

  const handleViewFullReport = () => {
    navigate("/security/reports");
  };

  const handleReviewFiles = () => {
    navigate("/security/compliance/files");
  };

  const handleWorkforcePlan = () => {
    navigate("/security/workforce-plan");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
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
            alignItems: "flex-start",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              <span>Security</span>
              <ChevronRight size={14} />
              <span style={{ color: "#1e293b", fontWeight: 500 }}>Security & Audit</span>
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 6px 0",
                letterSpacing: "-0.5px",
              }}
            >
              Security & Audit Dashboard
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                maxWidth: "620px",
                lineHeight: 1.5,
              }}
            >
              Monitor security events, audit trails, and compliance status across the organization.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexShrink: 0,
              paddingTop: "4px",
            }}
          >
            <button
              onClick={handleRefresh}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 18px",
                borderRadius: "8px",
                fontSize: "13px",
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
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={handleRunSecurityScan}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 20px -8px rgba(79, 70, 229, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Shield size={16} />
              Run Security Scan
            </button>
          </div>
        </header>

        {/* Security Score Overview */}
        <section style={{ marginBottom: "24px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "32px 40px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
              <svg
                viewBox="0 0 120 120"
                style={{ transform: "rotate(-90deg)", width: "120px", height: "120px" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="339.292"
                  strokeDashoffset="20.358"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  94
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontWeight: 500,
                    marginTop: "2px",
                  }}
                >
                  Security Score
                </span>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 40px",
                flex: 1,
              }}
            >
              {[
                { label: "Risk Level", value: "Low Risk", color: "#22c55e" },
                { label: "Open Issues", value: "7", color: "#0f172a" },
                { label: "Last Scan", value: "2 hours ago", color: "#0f172a" },
                { label: "Compliance", value: "96%", color: "#0f172a" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {securityMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.06)";
                }}
                onClick={() => {
                  if (metric.label === "Security Score") navigate("/security/score");
                  else if (metric.label === "Active Sessions") navigate("/security/sessions");
                  else if (metric.label === "Failed Logins") navigate("/security/failed-logins");
                  else if (metric.label === "Open Incidents") navigate("/security/incidents");
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eef2ff",
                    color: "#4f46e5",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {metric.label}
                  </span>
                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {metric.value}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color:
                        metric.trend === "up"
                          ? "#22c55e"
                          : metric.trend === "down"
                          ? "#ef4444"
                          : "#94a3b8",
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Security Events */}
          <section
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px 12px 20px",
                borderBottom: "1px solid #f1f5f9",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Security Events
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={15}
                    style={{
                      position: "absolute",
                      left: "10px",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: "5px 10px 5px 32px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "13px",
                      width: "200px",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4f46e5";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as Severity | "all")}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    background: "white",
                    color: "#1e293b",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    background: "white",
                    color: "#1e293b",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <button
                  onClick={handleViewAllEvents}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4338ca";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#4f46e5";
                  }}
                >
                  View All
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "4px 8px 8px 8px",
                maxHeight: "480px",
                overflowY: "auto",
              }}
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: "2px solid transparent",
                      marginBottom: "2px",
                      background: selectedEvent === event.id ? "#eef2ff" : "transparent",
                      borderColor: selectedEvent === event.id ? "#4f46e5" : "transparent",
                    }}
                    onClick={() => setSelectedEvent(event.id)}
                    onMouseEnter={(e) => {
                      if (selectedEvent !== event.id) {
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEvent !== event.id) {
                        e.currentTarget.style.background = "transparent";
                      }
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
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                          fontFamily: "monospace",
                        }}
                      >
                        {event.id}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {getSeverityBadge(event.severity)}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#0f172a",
                        }}
                      >
                        {event.event}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{event.timestamp}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span>{event.user}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span>IP: {event.ip}</span>
                        <span style={{ color: "#e2e8f0" }}>•</span>
                        <span
                          style={{
                            background: "#f1f5f9",
                            padding: "1px 8px",
                            borderRadius: "4px",
                            fontWeight: 500,
                            color: "#475569",
                          }}
                        >
                          {event.source}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <Shield size={32} style={{ color: "#cbd5e1", marginBottom: "12px" }} />
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    No security events match your filters
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Event Details */}
          <section
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px 12px 20px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Event Details
              </h3>
              <button
                onClick={handleSettings}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
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
            {selectedEvent ? (
              (() => {
                const event = securityEvents.find((e) => e.id === selectedEvent);
                if (!event) return null;
                return (
                  <div style={{ padding: "16px 20px 20px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                          fontFamily: "monospace",
                        }}
                      >
                        {event.id}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {event.timestamp}
                      </span>
                    </div>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 16px 0",
                      }}
                    >
                      {event.event}
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {[
                        { label: "User", value: event.user },
                        { label: "IP Address", value: event.ip },
                        { label: "Severity", value: getSeverityBadge(event.severity) },
                        { label: "Status", value: getStatusBadge(event.status) },
                        { label: "Source", value: event.source, fullWidth: true },
                      ].map((item) => (
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
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.3px",
                              color: "#94a3b8",
                            }}
                          >
                            {item.label}
                          </span>
                          {typeof item.value === "string" ? (
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#0f172a",
                              }}
                            >
                              {item.value}
                            </span>
                          ) : (
                            item.value
                          )}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <button
                        onClick={() => handleInvestigate(event.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "none",
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          color: "white",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <Eye size={15} />
                        Investigate
                      </button>
                      <button
                        onClick={() => handleMarkResolved(event.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "6px",
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
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                        }}
                      >
                        <CheckCircle2 size={15} />
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleAlertTeam(event.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "6px",
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
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                        }}
                      >
                        <Bell size={15} />
                        Alert Team
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <Shield size={40} style={{ color: "#cbd5e1", marginBottom: "12px" }} />
                <p style={{ margin: 0, fontSize: "14px" }}>
                  Select a security event to view details
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Audit Logs */}
        <section
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px 12px 20px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Audit Logs
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleExportLogs}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "6px",
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                <Download size={15} />
                Export Logs
              </button>
              <button
                onClick={handleSettings}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
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
          <div style={{ overflowX: "auto", padding: "0 4px 4px 4px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr>
                  {["Timestamp", "User", "Action", "Resource", "IP Address", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: "left",
                          padding: "8px 16px",
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          color: "#64748b",
                          borderBottom: "2px solid #f1f5f9",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => navigate(`/security/audit/${log.id}`)}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
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
                        padding: "10px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {log.user}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {log.action}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {log.resource}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {log.ip}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #f8fafc",
                        color: "#1e293b",
                      }}
                    >
                      {getAuditStatusBadge(log.status)}
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
              borderRadius: "12px",
              padding: "24px 28px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <ShieldCheck size={20} style={{ color: "#4f46e5" }} />
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Compliance Status
              </h3>
              <button
                onClick={handleReviewFiles}
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#4338ca";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#4f46e5";
                }}
              >
                Review Files
                <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { 
                  name: "ISO 27001", 
                  status: "Compliant", 
                  color: "#22c55e", 
                  width: "100%",
                  path: "/security/compliance/iso27001"
                },
                { 
                  name: "GDPR", 
                  status: "Partial", 
                  color: "#f59e0b", 
                  width: "85%",
                  path: "/security/compliance/gdpr"
                },
                { 
                  name: "SOC 2", 
                  status: "Compliant", 
                  color: "#22c55e", 
                  width: "95%",
                  path: "/security/compliance/soc2"
                },
                {
                  name: "PCI DSS",
                  status: "Action Required",
                  color: "#ef4444",
                  width: "60%",
                  path: "/security/compliance/pci-dss"
                },
              ].map((item) => (
                <div 
                  key={item.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color:
                          item.status === "Compliant"
                            ? "#16a34a"
                            : item.status === "Partial"
                            ? "#d97706"
                            : "#dc2626",
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
                        background:
                          item.status === "Compliant"
                            ? "linear-gradient(90deg, #22c55e, #16a34a)"
                            : item.status === "Partial"
                            ? "linear-gradient(90deg, #f59e0b, #d97706)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
                        borderRadius: "100px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}