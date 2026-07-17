const USER_PROFILE_REFERENCE_TIME = new Date("2026-04-01T12:00:00").getTime();

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { authApi } from "@/services/api/auth";
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Calendar as CalendarIcon,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  Clock as ClockIcon,
  Cloud,
  Coffee,
  Copy,
  Crown,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Fingerprint,
  Flag,
  Flame,
  FolderOpen,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  KeyRound,
  Lock,
  Mail as MailIcon,
  MapPin,
  Meh,
  MessageSquare,
  Monitor,
  MoreVertical,
  Phone,
  PieChart,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Smile,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
  Upload,
  User,
  UserCog,
  Users,
  X,
  Zap,
} from "lucide-react";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "security" | "approval" | "update" | "system";
  status: "completed" | "pending" | "failed";
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "Verified" | "Pending" | "Expired" | "Current";
  uploadDate: string;
  expiryDate?: string;
  size: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  scope: string;
  status: "Active" | "Inactive" | "Pending Review";
  level: "Full" | "Read" | "Write" | "Execute";
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  manager: string;
  startDate: string;
  bio: string;
}

export default function UserProfilePage() {
  const queryClient = useQueryClient();
  const currentUser = useQuery({ queryKey: ["auth", "me"], queryFn: authApi.me });
  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "documents" | "activity">("profile");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({ name: "", email: "", phone: "", location: "", department: "", role: "", manager: "", startDate: "", bio: "" });
  const apiProfile = currentUser.data;
  const effectiveProfile = apiProfile ? {
    ...profileData,
    name: apiProfile.username,
    email: apiProfile.email,
    phone: apiProfile.phone_number ?? "",
    role: apiProfile.role?.name ?? "",
  } : profileData;

  // Sample Data
  const permissions: Permission[] = [
    {
      id: "p1",
      name: "Payroll Administration",
      description: "Create runs, approve deductions, publish payslips",
      scope: "All Branches",
      status: "Active",
      level: "Full",
    },
    {
      id: "p2",
      name: "Employee Records",
      description: "View and update staff records across assigned branches",
      scope: "Nairobi HQ, Mombasa, Kisumu",
      status: "Active",
      level: "Write",
    },
    {
      id: "p3",
      name: "Disciplinary Management",
      description: "Open cases, assign hearings, publish outcomes",
      scope: "All Branches",
      status: "Active",
      level: "Full",
    },
    {
      id: "p4",
      name: "Finance Exports",
      description: "Download bank and GL files",
      scope: "Nairobi HQ",
      status: "Pending Review",
      level: "Read",
    },
  ];

  const documents: DocumentItem[] = [
    {
      id: "d1",
      name: "National ID",
      type: "Identification",
      status: "Verified",
      uploadDate: "2024-01-04",
      size: "2.4 MB",
    },
    {
      id: "d2",
      name: "KRA PIN",
      type: "Tax",
      status: "Verified",
      uploadDate: "2024-01-04",
      expiryDate: "2026-12-31",
      size: "1.8 MB",
    },
    {
      id: "d3",
      name: "Employment Contract",
      type: "Legal",
      status: "Current",
      uploadDate: "2024-01-04",
      size: "3.2 MB",
    },
    {
      id: "d4",
      name: "Conflict Disclosure",
      type: "Compliance",
      status: "Pending",
      uploadDate: "2024-06-15",
      size: "0.5 MB",
    },
    {
      id: "d5",
      name: "Professional Certifications",
      type: "Education",
      status: "Expired",
      uploadDate: "2023-08-10",
      expiryDate: "2024-08-10",
      size: "4.1 MB",
    },
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: "a1",
      title: "Changed payroll approval limit",
      description: "Security audit recorded the role update",
      timestamp: "2026-03-30T14:30:00",
      type: "security",
      status: "completed",
    },
    {
      id: "a2",
      title: "Approved branch payroll exceptions",
      description: "Mombasa and Kisumu exception queues cleared",
      timestamp: "2026-03-30T11:20:00",
      type: "approval",
      status: "completed",
    },
    {
      id: "a3",
      title: "Updated emergency contact",
      description: "Employee profile sync completed",
      timestamp: "2026-03-29T16:45:00",
      type: "update",
      status: "completed",
    },
    {
      id: "a4",
      title: "Failed login attempt",
      description: "Suspicious login attempt from IP 192.168.1.1",
      timestamp: "2026-03-29T08:10:00",
      type: "security",
      status: "failed",
    },
    {
      id: "a5",
      title: "Password changed",
      description: "User initiated password change",
      timestamp: "2026-03-28T10:00:00",
      type: "security",
      status: "completed",
    },
  ];

  // Helper Functions
  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Verified: "bg-green-100 text-green-800 border-green-200",
      Current: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Expired: "bg-red-100 text-red-800 border-red-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      Inactive: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusMap[status] || "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Active: <CheckCircle className="w-3 h-3" />,
      Verified: <CheckCircle className="w-3 h-3" />,
      Current: <CheckCircle className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      Pending: <ClockIcon className="w-3 h-3" />,
      "Pending Review": <ClockIcon className="w-3 h-3" />,
      pending: <ClockIcon className="w-3 h-3" />,
      Expired: <AlertCircle className="w-3 h-3" />,
      failed: <AlertCircle className="w-3 h-3" />,
    };
    return iconMap[status] || <AlertCircle className="w-3 h-3" />;
  };

  const getPermissionLevelColor = (level: string): string => {
    const levelMap: Record<string, string> = {
      Full: "bg-purple-100 text-purple-800",
      Write: "bg-blue-100 text-blue-800",
      Read: "bg-green-100 text-green-800",
      Execute: "bg-orange-100 text-orange-800",
    };
    return levelMap[level] || "bg-gray-100 text-gray-800";
  };

  const getActivityTypeColor = (type: string): string => {
    const typeMap: Record<string, string> = {
      security: "bg-red-100 text-red-800",
      approval: "bg-blue-100 text-blue-800",
      update: "bg-green-100 text-green-800",
      system: "bg-purple-100 text-purple-800",
    };
    return typeMap[type] || "bg-gray-100 text-gray-800";
  };

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      security: <Shield className="w-4 h-4" />,
      approval: <CheckCircle className="w-4 h-4" />,
      update: <Edit className="w-4 h-4" />,
      system: <Settings className="w-4 h-4" />,
    };
    return iconMap[type] || <Settings className="w-4 h-4" />;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string): string => {
    const diff = USER_PROFILE_REFERENCE_TIME - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Event Handlers
  const handleSaveProfile = async (): Promise<void> => {
    try {
      await updateProfile.mutateAsync({ email: profileData.email || undefined, phone_number: profileData.phone || undefined });
      setIsEditing(false);
    } catch {
      // The inline error below keeps the page usable without changing its layout.
    }
  };

  const beginEditing = () => {
    setProfileData(effectiveProfile);
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof ProfileData, value: string): void => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Render Functions
  const renderEditField = (field: keyof ProfileData, value: string, type: string = "text") => {
    if (!isEditing) return value;
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="border border-slate-200 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {currentUser.isLoading && <p className="mb-4 text-sm text-slate-500">Loading your profile…</p>}
        {currentUser.isError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to load your profile. Please sign in again and retry.</p>}
        {updateProfile.isError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{updateProfile.error.message}</p>}
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* User Identity */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                  AN
                </div>
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-50 transition-all border border-slate-200">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* User Info */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      effectiveProfile.name
                    )}
                  </h1>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-slate-600">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    effectiveProfile.bio || "No profile description provided."
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MailIcon className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      effectiveProfile.email
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      effectiveProfile.phone || "Not provided"
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      effectiveProfile.location || "Not provided"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <Save className="w-4 h-4" />
                    {updateProfile.isPending ? "Saving…" : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={beginEditing}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <Download className="w-4 h-4" />
                    Export Profile
                  </button>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                    <UserCog className="w-4 h-4" />
                    Manage Access
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Profile Completion</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">96%</p>
              </div>
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: "96%" }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">1 document pending</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Access Level</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">Admin</p>
              </div>
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">HR + Payroll permissions</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Open Approvals</p>
                <p className="text-2xl font-bold text-red-600 mt-1">12</p>
              </div>
              <div className="bg-red-100 p-2.5 rounded-xl">
                <ClockIcon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-600">5 due today</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Last Review</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Jul 2026</p>
              </div>
              <div className="bg-green-100 p-2.5 rounded-xl">
                <CalendarCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">Compliant</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
              { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
              { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
              { id: "activity", label: "Activity", icon: <ClockIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employment Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BriefcaseBusiness className="w-5 h-5 text-slate-600" />
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Department", field: "department" as keyof ProfileData },
                    { label: "Role", field: "role" as keyof ProfileData },
                    { label: "Manager", field: "manager" as keyof ProfileData },
                    { label: "Start Date", field: "startDate" as keyof ProfileData, type: "date" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="font-medium text-slate-900">
                        {isEditing ? (
                          <input
                            type={item.type || "text"}
                            value={effectiveProfile[item.field]}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                            className="border border-slate-200 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        ) : item.field === "startDate" ? (
                          formatDate(effectiveProfile[item.field])
                        ) : (
                          effectiveProfile[item.field] || "Not provided"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access & Permissions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-slate-600" />
                    Access & Permissions
                  </h3>
                  <Link to="/security-audit" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    Review Access
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Permission</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Scope</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Level</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {permissions.map((perm) => (
                        <tr key={perm.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{perm.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{perm.description}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{perm.scope}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPermissionLevelColor(perm.level)}`}>
                              {perm.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(perm.status)}`}>
                              {getStatusIcon(perm.status)}
                              {perm.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Activity Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  Activity Stats
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Approvals", value: "156" },
                    { label: "Pending Reviews", value: "12", highlight: "text-yellow-600" },
                    { label: "Completed Tasks", value: "89%", highlight: "text-green-600" },
                    { label: "Response Time", value: "2.4 hrs" },
                    { label: "Satisfaction Rate", value: "4.8/5", highlight: "text-green-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between text-sm">
                      <span className="text-slate-600">{stat.label}</span>
                      <span className={`font-medium ${stat.highlight || "text-slate-900"}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: <UserCog className="w-5 h-5 text-indigo-600" />, label: "Manage Access", color: "indigo" },
                    { icon: <FileText className="w-5 h-5 text-green-600" />, label: "View Reports", color: "green" },
                    { icon: <Bell className="w-5 h-5 text-yellow-600" />, label: "Notifications", color: "yellow" },
                    { icon: <Settings className="w-5 h-5 text-purple-600" />, label: "Settings", color: "purple" },
                  ].map((action) => (
                    <button key={action.label} className={`p-3 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-all text-left`}>
                      {action.icon}
                      <p className="text-xs font-medium text-slate-700 mt-1">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Password & Authentication */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-slate-600" />
                  Password & Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Password</p>
                      <p className="text-sm text-slate-500">Last changed 18 days ago</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-all"
                    >
                      Change
                    </button>
                  </div>

                  {showPasswordChange && (
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                      {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                        <div key={label}>
                          <label className="text-sm font-medium text-slate-700">{label}</label>
                          <input
                            type="password"
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                        Update Password
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setShowTwoFactor(!showTwoFactor)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        showTwoFactor
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {showTwoFactor ? "Enabled" : "Enable"}
                    </button>
                  </div>

                  {showTwoFactor && (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Two-factor authentication is active</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700 mt-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Authenticator app connected</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Security Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  Recent Security Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity
                    .filter((a) => a.type === "security")
                    .slice(0, 3)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className={`p-1.5 rounded-lg ${getActivityTypeColor(activity.type)}`}>
                          <Shield className="w-3 h-3" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                          <p className="text-xs text-slate-500">{activity.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                          {activity.status}
                        </span>
                      </div>
                    ))}
                </div>
                <Link to="/security-audit" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mt-4">
                  View Full Audit Log
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column - Security Settings */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-600" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Session Timeout",
                      description: "Automatically log out after inactivity",
                      options: ["15 minutes", "30 minutes", "1 hour", "Never"],
                      default: "1 hour",
                    },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{setting.label}</p>
                        <p className="text-sm text-slate-500">{setting.description}</p>
                      </div>
                      <select className="px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                        {setting.options.map((option) => (
                          <option key={option} selected={option === setting.default}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Login Notifications</p>
                      <p className="text-sm text-slate-500">Get alerts for new logins</p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        notifications
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {notifications ? "Enabled" : "Disabled"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Trusted Devices</p>
                      <p className="text-sm text-slate-500">2 devices connected</p>
                    </div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Manage</button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Active Sessions</p>
                      <p className="text-sm text-slate-500">1 active session</p>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">End All</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-slate-600" />
                  Device Management
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "iPhone 15 Pro", type: "phone", lastActive: "Today", current: true },
                    { name: "MacBook Pro", type: "laptop", lastActive: "2 days ago", current: false },
                  ].map((device) => (
                    <div key={device.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={`p-2 ${device.type === "phone" ? "bg-blue-100" : "bg-purple-100"} rounded-lg`}>
                        {device.type === "phone" ? (
                          <Smartphone className={`w-4 h-4 ${device.type === "phone" ? "text-blue-600" : "text-purple-600"}`} />
                        ) : (
                          <Monitor className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{device.name}</p>
                        <p className="text-xs text-slate-500">Last active: {device.lastActive}</p>
                      </div>
                      {device.current && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Current
                        </span>
                      )}
                      {!device.current && (
                        <button className="text-xs text-red-500 hover:text-red-600 font-medium">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Documents & Compliance
              </h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type}</p>
                          <p className="text-xs text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Uploaded: {formatDate(doc.uploadDate)}</span>
                        {doc.expiryDate && <span>Expires: {formatDate(doc.expiryDate)}</span>}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-slate-600" />
                Activity Log
              </h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option>All Types</option>
                  <option>Security</option>
                  <option>Approval</option>
                  <option>Update</option>
                  <option>System</option>
                </select>
                <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/70 rounded-xl transition-all border border-transparent hover:border-slate-200">
                    <div className={`p-2 rounded-lg ${getActivityTypeColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{activity.title}</p>
                          <p className="text-sm text-slate-500">{activity.description}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-500">Showing 5 of 24 activities</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all">
                    1
                  </button>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    2
                  </button>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    3
                  </button>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Your account is protected with enterprise-grade security. All actions are audited and logged.</span>
            <Link to="/security-audit" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 ml-auto">
              View Security Audit
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

