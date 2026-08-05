import { Download, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { resources, type ApiRecord } from "../../../../services/api/resources";

const value = (item: ApiRecord, key: string) => String(item[key] ?? "—");

const currentDepartment = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("current_user") ??
        localStorage.getItem("user") ??
        "{}"
    ) as Record<string, unknown>;

    return String(user.department_name ?? user.department ?? "") || undefined;
  } catch {
    return undefined;
  }
};

export default function DepartmentDashboardPage() {
  const client = useQueryClient();
  const departmentName = currentDepartment();

  const employees = useQuery({
    queryKey: ["department", "employees"],
    queryFn: () => resources.employees.list(),
  });

  const attendance = useQuery({
    queryKey: ["department", "attendance"],
    queryFn: () => resources.attendanceRecords.list(),
  });

  const leave = useQuery({
    queryKey: ["department", "leave"],
    queryFn: () => resources.leaveRequests.list(),
  });

  const reviews = useQuery({
    queryKey: ["department", "reviews"],
    queryFn: () => resources.performanceReviews.list(),
  });

  const team = useMemo(
    () =>
      (employees.data ?? []).filter(
        (item) =>
          !departmentName ||
          value(item, "department_name") === departmentName ||
          value(item, "department") === departmentName
      ),
    [employees.data, departmentName]
  );

  const ids = useMemo(
    () => new Set(team.map((item) => Number(item.id))),
    [team]
  );

  const records = useMemo(
    () =>
      (attendance.data ?? []).filter((item) => ids.has(Number(item.employee))),
    [attendance.data, ids]
  );

  const pendingLeave = useMemo(
    () =>
      (leave.data ?? []).filter(
        (item) =>
          ids.has(Number(item.employee)) &&
          String(item.status).toLowerCase().includes("pending")
      ),
    [leave.data, ids]
  );

  const present = useMemo(
    () =>
      records.filter((item) =>
        ["Present", "Late"].includes(value(item, "status"))
      ).length,
    [records]
  );

  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  const exportReport = () => {
    const csv =
      "Employee,Status,Date,Check in,Check out\n" +
      records
        .map((item) =>
          [
            value(item, "employee_name"),
            value(item, "status"),
            value(item, "date"),
            value(item, "check_in"),
            value(item, "check_out"),
          ]
            .map((field) => `"${field}"`)
            .join(",")
        )
        .join("\n");

    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = "department-attendance.csv";
    link.click();
    URL.revokeObjectURL(href);
  };

  const refresh = () => client.invalidateQueries({ queryKey: ["department"] });
  const loading =
    employees.isLoading || attendance.isLoading || leave.isLoading || reviews.isLoading;

  return (
    <main className="dashboard-page">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-kicker">Department operations</p>
          <h1 className="page-title">
            {departmentName ?? "Department"} dashboard
          </h1>
          <p className="page-subtitle">
            Live staff, attendance, leave, and review data within your permitted
            department scope.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="button button-secondary" onClick={refresh}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            className="button button-primary"
            onClick={exportReport}
            disabled={!records.length}
          >
            <Download size={15} /> Export attendance
          </button>
        </div>
      </header>

      <section className="metrics mt-5">
        <div className="metric-cell">
          <div className="metric-label">Team members</div>
          <div className="metric-value">{team.length}</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Attendance rate</div>
          <div className="metric-value">{rate}%</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Pending leave</div>
          <div className="metric-value">{pendingLeave.length}</div>
        </div>
        <div className="metric-cell">
          <div className="metric-label">Performance reviews</div>
          <div className="metric-value">
            {(reviews.data ?? []).filter((item) => ids.has(Number(item.employee))).length}
          </div>
        </div>
      </section>

      <section className="panel mt-5">
        <div className="panel-header">
          <h2 className="panel-title">Today’s attendance</h2>
        </div>
        <div className="panel-body table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check in</th>
                <th>Check out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading live records…</td>
                </tr>
              ) : records.length ? (
                records.map((item) => (
                  <tr key={item.id}>
                    <td>{value(item, "employee_name")}</td>
                    <td>{value(item, "date")}</td>
                    <td>{value(item, "check_in")}</td>
                    <td>{value(item, "check_out")}</td>
                    <td>{value(item, "status")}</td>
                    <td>{value(item, "hours_worked")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No attendance records in this department.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel mt-5">
        <div className="panel-header">
          <h2 className="panel-title">Pending leave approvals</h2>
        </div>
        <div className="panel-body table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeave.length ? (
                pendingLeave.map((item) => (
                  <tr key={item.id}>
                    <td>{value(item, "employee_name")}</td>
                    <td>{value(item, "leave_type_name")}</td>
                    <td>{value(item, "start_date")}</td>
                    <td>{value(item, "end_date")}</td>
                    <td>{value(item, "status")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No pending leave requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
