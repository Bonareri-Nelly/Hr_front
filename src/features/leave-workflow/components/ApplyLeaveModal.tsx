import { useEffect, useMemo, useState } from "react";
import { leavePolicies } from "../constants/leavePolicies";
import { mockEmployees } from "../data/mockEmployees";
import { calculateEndDate } from "../utils/dateCalculator";
import { getMinimumStartDate } from "../utils/leaveDates";

type ApplyLeaveModalProps = {
  open: boolean;
  onClose: () => void;
  employeeGender: "Male" | "Female";
  setSelectedLeave: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
    leaveType: string;
    status: string;
  }>>;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function ApplyLeaveModal({
  open,
  onClose,
  employeeGender,
  setSelectedLeave,
}: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [coveringEmployeeId, setCoveringEmployeeId] = useState("");
  const [coveringQuery, setCoveringQuery] = useState("");
  const [step, setStep] = useState<"form" | "summary" | "success">("form");
  const [errors, setErrors] = useState({ leaveType: "", reason: "", startDate: "", endDate: "" });

  const policy = leaveType ? leavePolicies[leaveType as keyof typeof leavePolicies] : null;
  const availableLeaveTypes = useMemo(
    () => Object.entries(leavePolicies).filter(([key]) =>
      key !== "maternity" || employeeGender === "Female"
        ? key !== "paternity" || employeeGender === "Male"
        : false
    ),
    [employeeGender]
  );
  const coveringEmployees = useMemo(() => {
    const query = coveringQuery.trim().toLowerCase();
    return mockEmployees.filter((employee) =>
      !query || `${employee.name} ${employee.department}`.toLowerCase().includes(query)
    );
  }, [coveringQuery]);
  const selectedCoveringEmployee = mockEmployees.find((employee) => employee.id === coveringEmployeeId);
  const minimumStartDate = policy ? getMinimumStartDate(policy.noticeDays) : "";
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return "--";
    const difference = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    return difference < 1 ? "Invalid" : `${difference} day${difference === 1 ? "" : "s"}`;
  }, [endDate, startDate]);

  useEffect(() => {
    if (policy?.fixedDays && startDate) {
      setLeaveDays(String(policy.fixedDays));
      setEndDate(formatDate(calculateEndDate(new Date(startDate), policy.fixedDays, policy.countsWeekends, policy.countsPublicHolidays)));
    }
  }, [policy, startDate]);

  if (!open) return null;

  const resetAndClose = () => {
    setLeaveType(""); setReason(""); setStartDate(""); setEndDate(""); setLeaveDays("");
    setCoveringEmployeeId(""); setCoveringQuery(""); setErrors({ leaveType: "", reason: "", startDate: "", endDate: "" }); setStep("form"); onClose();
  };
  const syncLeave = (nextStart = startDate, nextEnd = endDate, nextType = leaveType) =>
    setSelectedLeave({ startDate: nextStart, endDate: nextEnd, leaveType: nextType, status: "planned" });
  const validate = () => {
    const next = {
      leaveType: leaveType ? "" : "Please select a leave type.",
      reason: reason ? "" : "Please select a reason.",
      startDate: startDate ? "" : "Please select a start date.",
      endDate: endDate ? "" : "Please select an end date.",
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  return <div onClick={resetAndClose} style={overlayStyle}>
    <div className="panel" onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }}>
      <div className="panel-header">
        <h2 className="panel-title">{step === "summary" ? "Review Leave Request" : "Apply for Leave"}</h2>
        {step === "form" && <button className="button button-secondary" onClick={resetAndClose}>✕</button>}
      </div>
      <div className="panel-body">
        {step === "form" && <div style={{ display: "grid", gap: 18 }}>
          <div style={twoColumnStyle}>
            <Field label="Leave Type" error={errors.leaveType}>
              <select value={leaveType} style={fieldStyle} onChange={(event) => { setLeaveType(event.target.value); setReason(""); setStartDate(""); setEndDate(""); syncLeave("", "", event.target.value); }}>
                <option value="">Select Leave Type</option>
                {availableLeaveTypes.map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
              </select>
            </Field>
            <Field label="Reason" error={errors.reason}>
              <select value={reason} disabled={!policy} style={fieldStyle} onChange={(event) => setReason(event.target.value)}>
                <option value="">{policy ? "Select Reason" : "Select Leave Type First"}</option>
                {policy?.reasons.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div style={noticeStyle}>{policy ? `${policy.label}: ${policy.emergency ? "available immediately" : `${policy.noticeDays} days' notice required`}.` : "Select a leave type to view its notice period."}</div>
          <div style={dateGridStyle}>
            <Field label="Start Date" error={errors.startDate}><input type="date" min={minimumStartDate} value={startDate} style={fieldStyle} onChange={(event) => { setStartDate(event.target.value); syncLeave(event.target.value); }} /></Field>
            <Field label="End Date" error={errors.endDate}><input type="date" min={startDate || minimumStartDate} value={endDate} style={fieldStyle} onChange={(event) => { setEndDate(event.target.value); syncLeave(startDate, event.target.value); }} /></Field>
            <Field label="Leave Days"><input type="number" min="1" disabled={!policy?.editableDays} value={leaveDays} style={fieldStyle} onChange={(event) => { const value = event.target.value; setLeaveDays(value); if (startDate && Number(value) > 0) setEndDate(formatDate(calculateEndDate(new Date(startDate), Number(value), policy?.countsWeekends ?? false, policy?.countsPublicHolidays ?? false))); }} /></Field>
            <Field label="Total Days"><div style={{ ...fieldStyle, display: "flex", alignItems: "center", background: "var(--background-secondary)" }}>{totalDays}</div></Field>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={labelStyle}>Employee Covering Your Duties</label>
            <input value={coveringQuery} placeholder="Search by employee name or department" style={fieldStyle} onChange={(event) => setCoveringQuery(event.target.value)} />
            <select value={coveringEmployeeId} style={fieldStyle} onChange={(event) => setCoveringEmployeeId(event.target.value)}>
              <option value="">Select relieving employee (optional)</option>
              {coveringEmployees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} — {employee.department}</option>)}
            </select>
            <small style={{ color: "var(--text-secondary)" }}>This employee will temporarily cover your responsibilities during your leave.</small>
          </div>
        </div>}
        {step === "summary" && <div style={{ display: "grid", gap: 10 }}>
          <SummaryRow label="Leave Type" value={policy?.label ?? "-"} /><SummaryRow label="Reason" value={reason} /><SummaryRow label="Start Date" value={startDate} /><SummaryRow label="End Date" value={endDate} /><SummaryRow label="Relieving Employee" value={selectedCoveringEmployee?.name ?? "Not selected"} />
        </div>}
        {step === "success" && <div style={{ textAlign: "center", padding: "24px 0" }}><div style={{ fontSize: "2.5rem" }}>✓</div><h2>Leave Request Submitted</h2><p style={{ color: "var(--text-secondary)" }}>Your leave request has been forwarded for review.</p></div>}
      </div>
      <div style={footerStyle}>
        {step === "form" && <><button className="button button-secondary" onClick={resetAndClose}>Cancel</button><button className="button button-primary" onClick={() => validate() && setStep("summary")}>Review Request</button></>}
        {step === "summary" && <><button className="button button-secondary" onClick={() => setStep("form")}>Edit</button><button className="button button-primary" onClick={() => setStep("success")}>Submit Request</button></>}
        {step === "success" && <button className="button button-primary" onClick={resetAndClose}>Done</button>}
      </div>
    </div>
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <div><label style={labelStyle}>{label}</label>{children}{error && <p style={{ color: "var(--danger)", fontSize: ".75rem", margin: "6px 0 0" }}>{error}</p>}</div>; }
function SummaryRow({ label, value }: { label: string; value: string }) { return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}><strong>{label}</strong><span>{value}</span></div>; }

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, zIndex: 1000 };
const twoColumnStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };
const dateGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 };
const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontSize: ".8rem", fontWeight: 600 };
const fieldStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface)", color: "var(--ink)", fontSize: ".8rem", boxSizing: "border-box" };
const noticeStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 8, background: "var(--info-bg)", color: "var(--text-secondary)", fontSize: ".8rem" };
const footerStyle: React.CSSProperties = { borderTop: "1px solid var(--border-subtle)", padding: "14px 18px", display: "flex", justifyContent: "flex-end", gap: 10 };
