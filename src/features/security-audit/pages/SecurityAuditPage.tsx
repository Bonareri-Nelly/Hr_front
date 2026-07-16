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
  TrendingUp,
  TrendingDown,
  Zap,
  Fingerprint,
  FileCheck,
  Target,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  color: string;
}

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

export default function SecurityAuditPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Animate metrics on mount
    const timer = setTimeout(() => {
      setAnimatedMetrics({
        "Security Score": true,
        "Active Sessions": true,
        "Failed Logins": true,
        "Open Incidents": true,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
          padding: "3px 10px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.color}20`,
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
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "100px",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.color}20`,
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: config.color,
          }}
        />
        {config.label}
      </span>
    );
  };

  const getAuditStatusBadge = (status: AuditLog["status"]) => {
    const config = {
      success: { label: "Success", color: "#16a34a", bg: "#f0fdf4" },
      failure: { label: "Failure", color: "#dc2626", bg: "#fef2f2" },
      pending: { label: "Pending", color: "#d97706", bg: "#fffbeb" },
    };
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 12px",
          borderRadius: "100px",
          fontSize: "11px",
          fontWeight: 600,
          background: config[status].bg,
          color: config[status].color,
          border: `1px solid ${config[status].color}20`,
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: config[status].color,
          }}
        />
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
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexShrink: 0,
              alignItems: "center",
            }}
          >
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
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
              <RefreshCw
                size={16}
                style={{
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                }}
              />
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
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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

        {/* Security Score Overview */}
        <section style={{ marginBottom: "28px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px 44px",
              display: "flex",
              alignItems: "center",
              gap: "48px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(226, 232, 240, 0.6)",
            }}
          >
            <div style={{ position: "relative", width: "130px", height: "130px", flexShrink: 0 }}>
              <svg
                viewBox="0 0 120 120"
                style={{ transform: "rotate(-90deg)", width: "130px", height: "130px" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="9"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="339.292"
                  strokeDashoffset="20.358"
                  style={{
                    transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
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
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1,
                    letterSpacing: "-1px",
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
                    letterSpacing: "0.3px",
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
                gap: "16px 48px",
                flex: 1,
              }}
            >
              {[
                { label: "Risk Level", value: "🟢 Low Risk", color: "#22c55e" },
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
                    padding: "10px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
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
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {securityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const isAnimated = animatedMetrics[metric.label];
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
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  opacity: isAnimated ? 1 : 0,
                  transform: isAnimated ? "translateY(0)" : "translateY(12px)",
                  animation: isAnimated ? "fadeInUp 0.5s ease forwards" : "none",
                  animationDelay: `${index * 0.1}s`,
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
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Icon size={24} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    flex: 1,
                  }}
                >
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

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Security Events */}
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
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
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
                      left: "12px",
                      color: "#94a3b8",
                    }}
                  />
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
                    transition: "all 0.2s",
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
                    transition: "all 0.2s",
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
            <div
              style={{
                padding: "4px 12px 12px 12px",
                maxHeight: "480px",
                overflowY: "auto",
              }}
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "2px solid transparent",
                      marginBottom: "4px",
                      background: selectedEvent === event.id ? "#eef2ff" : "transparent",
                      borderColor: selectedEvent === event.id ? "#4f46e5" : "transparent",
                      animation: "fadeInUp 0.4s ease forwards",
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
                    }}
                    onClick={() => setSelectedEvent(event.id)}
                    onMouseEnter={(e) => {
                      if (selectedEvent !== event.id) {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEvent !== event.id) {
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
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
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
                <div
                  style={{
                    padding: "60px 20px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
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
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
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
            {selectedEvent ? (
              (() => {
                const event = securityEvents.find((e) => e.id === selectedEvent);
                if (!event) return null;
                return (
                  <div style={{ padding: "20px 24px 24px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
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
                      <div style={{ display: "flex", gap: "6px" }}>
                        {getSeverityBadge(event.severity)}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 20px 0",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {event.event}
                    </h4>
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
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#0f172a",
                              }}
                            >
                              {item.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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
                        onClick={() => handleNavigate(`/security/events/${event.id}/investigate`)}
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
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          fontFamily: "inherit",
                          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(79, 70, 229, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(79, 70, 229, 0.3)";
                        }}
                      >
                        <Eye size={15} />
                        Investigate
                      </button>
                      <button
                        onClick={() => handleNavigate(`/security/events/${event.id}/resolve`)}
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
                        onClick={() => handleNavigate(`/security/events/${event.id}/alert`)}
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
              })()
            ) : (
              <div
                style={{
                  padding: "80px 20px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
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
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    style={{
                      transition: "all 0.2s",
                      cursor: "pointer",
                      animation: "fadeInUp 0.4s ease forwards",
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
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
                    <td
                      style={{
                        padding: "12px 16px",
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
              {[
                {
                  name: "ISO 27001",
                  status: "Compliant",
                  color: "#22c55e",
                  width: "100%",
                  path: "/security/compliance/iso27001",
                  icon: ShieldCheck,
                },
                {
                  name: "GDPR",
                  status: "Partial",
                  color: "#f59e0b",
                  width: "85%",
                  path: "/security/compliance/gdpr",
                  icon: Globe,
                },
                {
                  name: "SOC 2",
                  status: "Compliant",
                  color: "#22c55e",
                  width: "95%",
                  path: "/security/compliance/soc2",
                  icon: Database,
                },
                {
                  name: "PCI DSS",
                  status: "Action Required",
                  color: "#ef4444",
                  width: "60%",
                  path: "/security/compliance/pci-dss",
                  icon: Lock,
                },
              ].map((item) => {
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
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </div>
  );
}