import { Plus } from "lucide-react";
import { useState } from "react";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import LeaveCalendar from "./components/LeaveCalendar";

const leaveBalances = [
  { type: "Annual Leave", value: "16 Days Remaining" },
  { type: "Sick Leave", value: "10 Days Available" },
  { type: "Maternity Leave", value: "Eligible" },
  { type: "Paternity Leave", value: "Eligible" },
  { type: "Compassionate Leave", value: "5 Days" },
  { type: "Study Leave", value: "10 Days" },
  { type: "Unpaid Leave", value: "As Required" },
];

const recentRequests = [
  {
    id: 1,
    type: "Annual Leave",
    period: "09 Jul - 13 Jul 2026",
    days: 5,
    status: "Pending",
  },
  {
    id: 2,
    type: "Sick Leave",
    period: "15 Jun - 16 Jun 2026",
    days: 2,
    status: "Approved",
  },
];

export default function LeaveWorkflow() {

  const [openModal, setOpenModal] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    status: "planned",
  });

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">Leave Workflow</h1>
          <p className="page-subtitle">
            Manage your leave requests and balances.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={14} />
          Apply for Leave
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "12px",
        }}
      >
        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Annual Leave
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            16
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Days Remaining
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Sick Leave
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            10
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Days Available
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Pending Requests
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            1
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Awaiting Approval
          </div>
        </div>

        <div className="summary-card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Approved
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            3
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            This Year
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "14px",
        }}
      >

        {/* RECENT REQUESTS */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Leave Requests</h2>
          </div>

          <div className="panel-body table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.type}</td>
                    <td>{leave.period}</td>
                    <td>{leave.days}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          background:
                            leave.status === "Approved"
                              ? "var(--success-bg)"
                              : "var(--warning-bg)",
                          color:
                            leave.status === "Approved"
                              ? "var(--success)"
                              : "var(--warning)",
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        {/* LEAVE BALANCES */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Leave Balances</h2>
          </div>

          <div className="panel-body">
            {leaveBalances.map((leave) => (
              <div
                key={leave.type}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-subtle)",
                  fontSize: "0.8rem",
                }}
              >
                <span>{leave.type}</span>
                <strong>{leave.value}</strong>
              </div>
            ))}
            <ApplyLeaveModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              setSelectedLeave={setSelectedLeave}
            />
          </div>
        </div>

        <div style={{ marginTop: "32px" }}>
          <LeaveCalendar
            selectedLeave={selectedLeave}
          />
        </div>

      </div>
    </div>
  );
}

