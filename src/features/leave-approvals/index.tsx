import { useMemo, useState } from "react";
import ReviewLeaveModal from "./components/ReviewLeaveModal";
import LeaveReportsAuditModal from "./components/LeaveReportsAuditModal";

import { ROLES } from "../../constants/roles";
import {
  type LeaveRequest,
} from "./utils/approvalWorkflow";
import { LEAVE_STATUS } from "../../constants/leaveStatus";



export default function LeaveApprovals() {

  const [searchTerm, setSearchTerm] = useState("");
  const [reportsOpen, setReportsOpen] = useState(false);

  const [selectedLeaveType, setSelectedLeaveType] =
    useState("All");

  const leaveTypes = [
    "All",
    "Sick",
    "Annual",
    "Compassionate",
    "Maternity",
    "Paternity",
    "Study",
    "Unpaid",
  ];

  const [activeTab, setActiveTab] = useState<
    "Pending" | "Approved" | "Rejected"
  >("Pending");

  const currentUser = {
    id: 101,
    name: "Mary Wanjiku",
    role: ROLES.DEPARTMENT_HEAD,
    department: "ICT",
  };

  const [showFilters, setShowFilters] = useState(false);

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");



  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employee: "Jane Smith",
      department: "ICT",
      employeeRole: ROLES.EMPLOYEE,
      submittedByRole: ROLES.EMPLOYEE,
      leaveType: "Annual Leave",
      startDate: "2026-08-01",
      endDate: "2026-08-05",
      days: 5,
      status: LEAVE_STATUS.PENDING,
      workflowStage: "Pending Department Head Approval",
      currentApprover: {
        role: ROLES.DEPARTMENT_HEAD,
        department: "ICT",
      },
      approvalHistory: [],
    },
    {
      id: 2,
      employee: "Peter Mwangi",
      department: "ICT",
      employeeRole: ROLES.EMPLOYEE,
      submittedByRole: ROLES.EMPLOYEE,
      leaveType: "Sick Leave",
      startDate: "2026-08-10",
      endDate: "2026-08-12",
      days: 3,
      status: LEAVE_STATUS.PENDING,
      workflowStage: "Pending Department Head Approval",
      currentApprover: {
        role: ROLES.DEPARTMENT_HEAD,
        department: "ICT",
      },
      approvalHistory: [],
    },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

 /* const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "12px 24px",
    borderRadius: "10px",
    border: active
      ? "1px solid var(--primary)"
      : "1px solid var(--border-subtle)",
    background: active
      ? "var(--primary)"
      : "var(--surface)",
    color: active
      ? "white"
      : "var(--text-primary)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: ".9rem",
    transition: "all .2s ease",
    minWidth: "150px",
  }); */

  const visibleRequests = useMemo(() => {
    return requests.filter((request) => {

      // Already completed
      if (
        request.status !== LEAVE_STATUS.PENDING
      ) {
        return false;
      }

      // Wrong approver
      if (
        request.currentApprover.role !==
        currentUser.role
      ) {
        return false;
      }

      // Department Heads only see
      // their department
      if (
        currentUser.role ===
        ROLES.DEPARTMENT_HEAD &&
        request.currentApprover.department !==
        currentUser.department
      ) {
        return false;
      }

      return true;
    });
  }, [requests]);

  const selectedRequest = visibleRequests.find(
    (r) => r.id === selectedId
  );

  const pendingRequests = visibleRequests;

  const emptyState = {
    Pending: {
      title: " Good news!",
      message: "No pending leave requests today.",
    },
    Approved: {
      title: "No approvals yet",
      message: "Leave requests you approve will appear here.",
    },
    Rejected: {
      title: "Great work!",
      message: "You haven't rejected any leave requests.",
    },
  };

  const approvedRequests = useMemo(() => {
    return requests.filter((request) =>
      request.approvalHistory.some(
        (history) =>
          history.approver === currentUser.name &&
          history.action === "Approve"
      )
    );
  }, [requests]);

  const rejectedRequests = useMemo(() => {
    return requests.filter((request) =>
      request.approvalHistory.some(
        (history) =>
          history.approver === currentUser.name &&
          history.action === "Reject"
      )
    );
  }, [requests]);

  const displayedRequests = (
    activeTab === "Pending"
      ? pendingRequests
      : activeTab === "Approved"
        ? approvedRequests
        : rejectedRequests
  ).filter((request) => {
    const matchesSearch =
      request.employee
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesLeaveType =
      selectedLeaveType === "All" ||
      request.leaveType
        .toLowerCase()
        .includes(selectedLeaveType.toLowerCase());

    return matchesSearch && matchesLeaveType;
  });



  const handleApprove = () => {
    if (!selectedRequest) return;

    alert("Leave request approved.");

    setRequests((prev) =>
      prev.filter((r) => r.id !== selectedRequest.id)
    );

    setSelectedId(null);
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    alert("Leave request rejected.");

    setRequests((prev) =>
      prev.filter((r) => r.id !== selectedRequest.id)
    );

    setSelectedId(null);
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div><h1 className="page-title">Leave Approvals</h1><p className="page-subtitle">Review leave requests assigned to you.</p></div>
        <button className="button button-secondary" onClick={() => setReportsOpen(true)}>Reports &amp; Audit</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          margin: "24px 0 30px",
        }}
      >
        <button
          onClick={() => setActiveTab("Pending")}
          style={{
            padding: "22px",
            borderRadius: "14px",
            border:
              activeTab === "Pending"
                ? "2px solid var(--primary)"
                : "1px solid var(--border-subtle)",
            background:
              activeTab === "Pending"
                ? "rgba(30, 64, 175, .08)"
                : "white",
            cursor: "pointer",
            transition: ".2s",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: ".82rem",
              color: "var(--text-secondary)",
            }}
          >
            Pending
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {pendingRequests.length}
          </div>
        </button>

        <button
          onClick={() => setActiveTab("Approved")}
          style={{
            padding: "22px",
            borderRadius: "14px",
            border:
              activeTab === "Approved"
                ? "2px solid var(--success)"
                : "1px solid var(--border-subtle)",
            background:
              activeTab === "Approved"
                ? "rgba(34,197,94,.08)"
                : "white",
            cursor: "pointer",
            transition: ".2s",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: ".82rem",
              color: "var(--text-secondary)",
            }}
          >
            Approved
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {approvedRequests.length}
          </div>
        </button>

        <button
          onClick={() => setActiveTab("Rejected")}
          style={{
            padding: "22px",
            borderRadius: "14px",
            border:
              activeTab === "Rejected"
                ? "2px solid var(--danger)"
                : "1px solid var(--border-subtle)",
            background:
              activeTab === "Rejected"
                ? "rgba(239,68,68,.08)"
                : "white",
            cursor: "pointer",
            transition: ".2s",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: ".82rem",
              color: "var(--text-secondary)",
            }}
          >
            Rejected
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {rejectedRequests.length}
          </div>
        </button>

      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {/* Search */}

        <input
          type="text"
          placeholder="Search employee, department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            fontSize: ".9rem",
            outline: "none",
          }}
        />

        {/* Filter */}

        <div
          style={{
            position: "relative",
          }}
        >
          <button
            className="button button-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              minWidth: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <span>⚙ Filters</span>

            <span
              style={{
                transform: showFilters
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: ".2s",
              }}
            >
              ▼
            </span>
          </button>

          {showFilters && (
            <div
              className="panel"
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                width: "200px",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: ".95rem",
                  marginBottom: "4px",
                  textAlign: "center",
                }}
              >
                Filter Requests
              </div>
              <div
                className="panel-body"
                style={{
                  display: "grid",
                  gap: "14px",
                }}
              >

                {/* Department */}

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Department
                  </label>

                  <select
                    value={departmentFilter}
                    onChange={(e) =>
                      setDepartmentFilter(e.target.value)
                    }
                    className="input"
                  >
                    <option>All</option>
                    <option>ICT</option>
                    <option>Finance</option>
                    <option>Human Resource</option>
                    <option>Operations</option>
                  </select>
                </div>

                {/* Sort */}

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Sort By
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="input"
                  >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Most Days</option>
                    <option>Least Days</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setDepartmentFilter("All");
                      setSortBy("Newest");
                      setSearchTerm("");
                      setSelectedLeaveType("All");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "14px",
          marginBottom: "14px",
        }}
      >
        {leaveTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedLeaveType(type)}
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              border:
                selectedLeaveType === type
                  ? "2px solid var(--primary)"
                  : "1px solid var(--border-subtle)",
              background:
                selectedLeaveType === type
                  ? "rgba(30,64,175,.08)"
                  : "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight:
                selectedLeaveType === type
                  ? 600
                  : 500,
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">
            Pending Requests
          </h2>
        </div>

        <div className="panel-body table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Days</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-serif)",
                          fontWeight: 600,
                        }}
                      >
                        {emptyState[activeTab].title}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {emptyState[activeTab].message}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedRequests.map((request) => (
                  <tr
                    key={request.id}
                    style={{
                      cursor: "pointer",
                      transition: "background .2s ease",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--surface-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "")
                    }
                  >
                    <td>{request.employee}</td>

                    <td>{request.department}</td>

                    <td>{request.leaveType}</td>

                    <td>{request.days}</td>

                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "#FFF7E6",
                          color: "#B76E00",
                          fontSize: ".75rem",
                          fontWeight: 600,
                        }}
                      >

                      </span>
                    </td>

                    <td>
                      <button
                        className="button button-primary"
                        onClick={() => setSelectedId(request.id)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewLeaveModal
        open={selectedId !== null}
        request={selectedRequest}
        onClose={() => setSelectedId(null)}
        onApprove={() => handleApprove()}
        onReject={() => handleReject()}
      />
      <LeaveReportsAuditModal open={reportsOpen} onClose={() => setReportsOpen(false)} />
    </div>
  );
}
