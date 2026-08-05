import { AlertCircle, Download, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { payrollApi, type PayslipDto } from "../../../../services/api";
import { actions } from "../../../../services/api/resources";
import PayslipDetailModal, { type Payslip } from "../components/PayslipDetailModal";
import RaiseQueryModal from "../components/RaiseQueryModal";

const toNumber = (value: unknown) => Number(value ?? 0);

const normalizePayslip = (item: PayslipDto): Payslip => {
  const deductions = item.deductions && typeof item.deductions === "object" ? item.deductions as Record<string, unknown> : {};
  const allowances = Array.isArray(item.allowances)
    ? item.allowances as { label: string; amount: number }[]
    : [];

  return {
    id: String(item.id),
    employeeId: String(item.employee_id ?? item.employee ?? ""),
    payrollRunId: String(item.payroll_run_id ?? item.payroll_run ?? ""),
    payPeriod: String(item.pay_period ?? ""),
    grossPay: toNumber(item.gross_pay),
    allowances,
    deductions: {
      paye: toNumber(deductions.paye),
      nssf: toNumber(deductions.nssf),
      shif: toNumber(deductions.shif),
      housingLevy: toNumber(deductions.housingLevy ?? deductions.housing_levy),
      other: Array.isArray(deductions.other) ? deductions.other as { label: string; amount: number }[] : [],
    },
    netPay: toNumber(item.net_pay),
    status: item.status === "Disbursed" || item.status === "DISBURSED" ? "Disbursed" : "Pending",
    disbursedAt: String(item.disbursed_at ?? ""),
  };
};
const formatMoney = (amount: number) => `KES ${amount.toLocaleString()}`;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "{}");
  } catch {
    return {};
  }
};

export default function MyPayslip() {
  const user = getCurrentUser();
  const employeeId = user?.employee_id;
  const [query, setQuery] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [queryPayslip, setQueryPayslip] = useState<Payslip | null>(null);
  const [notice, setNotice] = useState("");
  const [payslipRows, setPayslipRows] = useState<Payslip[]>([]);

  useEffect(() => {
    let isMounted = true;

    payrollApi.listPayslips()
      .then((items) => {
        if (isMounted) setPayslipRows(items.map(normalizePayslip));
      })
      .catch(() => {
        if (isMounted) setNotice("Could not load payslips. Check that the backend is running and that you have access.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // FIX: Filter by logged-in employee's ID AND disbursed status
  const visiblePayslips = useMemo(() => {
    return payslipRows.filter((payslip) => {
      const matchesEmployee = employeeId
        ? String(payslip.employeeId) === String(employeeId)
        : true;
      const matchesStatus = payslip.status === "Disbursed";
      const matchesQuery = !query.trim() || payslip.payPeriod.toLowerCase().includes(query.trim().toLowerCase());
      return matchesEmployee && matchesStatus && matchesQuery;
    });
  }, [payslipRows, query, employeeId]);

  const handleDownload = async (payslip: Payslip) => {
    try {
      const response = await actions.downloadPayslip(Number(payslip.id));
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${payslip.payPeriod || payslip.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not download this payslip.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Employee self-service</p>
          <h1 className="page-title">My Payslip</h1>
          <p className="page-subtitle">Read-only payslips appear only after Finance marks the linked payroll run as disbursed.</p>
        </div>
        <div className="action-row">
          <div className="flex items-center gap-2" style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)", padding: "6px 12px" }}>
            <Search size={15} style={{ color: "var(--text-muted)" }} />
            <input className="select-control" style={{ border: "none", padding: "4px 8px", minWidth: "auto" }} placeholder="Filter by period" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Payslips</h3>
        </div>
        {visiblePayslips.length === 0 ? (
          <div className="panel-body" style={{ textAlign: "center", padding: "48px" }}>
            <FileText size={36} style={{ color: "var(--text-muted)" }} />
            <p className="page-subtitle" style={{ marginTop: "8px" }}>No payslips available yet.</p>
          </div>
        ) : (
          <div className="panel-body table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Pay Period</th>
                  <th>Run Reference</th>
                  <th>Net Pay</th>
                  <th>Disbursed</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visiblePayslips.map((payslip) => (
                  <tr key={payslip.id}>
                    <td style={{ fontWeight: 700 }}>{payslip.payPeriod}</td>
                    <td>{payslip.payrollRunId}</td>
                    <td style={{ color: "var(--success)", fontWeight: 700 }}>{formatMoney(payslip.netPay)}</td>
                    <td>{payslip.disbursedAt ? new Date(payslip.disbursedAt).toLocaleDateString() : "—"}</td>
                    <td>
                      <div className="action-row" style={{ gap: "6px" }}>
                        <button className="button button-secondary button-sm" onClick={() => setSelectedPayslip(payslip)}><Eye size={14} /> View</button>
                        <button className="button button-secondary button-sm" onClick={() => handleDownload(payslip)}><Download size={14} /> Download</button>
                        <button className="button button-primary button-sm" onClick={() => setQueryPayslip(payslip)}><AlertCircle size={14} /> Raise query</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <PayslipDetailModal payslip={selectedPayslip} onClose={() => setSelectedPayslip(null)} onDownload={handleDownload} />
      <RaiseQueryModal payslip={queryPayslip} onClose={() => setQueryPayslip(null)} onSubmit={(message) => setNotice(`Query routed to Branch HR Admin: ${message}`)} />
      <PageChatbotWidget page="my-payslip" role="Employee" contextSummary={`${visiblePayslips.length} disbursed payslips visible. Latest net pay ${visiblePayslips[0] ? formatMoney(visiblePayslips[0].netPay) : "none"}.`} quickPrompts={["Why is my deduction different this month?", "What was my latest net pay?", "Can I raise a payroll query?"]} />
    </div>
  );
}
