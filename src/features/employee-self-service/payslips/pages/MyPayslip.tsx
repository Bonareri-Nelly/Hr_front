import { AlertCircle, Download, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { executiveTheme } from "../../../../theme/executiveTheme";
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

export default function MyPayslip() {
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

  const visiblePayslips = useMemo(
    () => payslipRows.filter((payslip) => payslip.status === "Disbursed" && payslip.payPeriod.includes(query.trim())),
    [payslipRows, query],
  );

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
    <div className={executiveTheme.page}>
      <div className={executiveTheme.shell}>
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={executiveTheme.eyebrow}>Employee self-service</p>
            <h1 className={executiveTheme.title}>My Payslip</h1>
            <p className={executiveTheme.subtitle}>Read-only payslips appear only after Finance marks the linked payroll run as disbursed.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Search size={16} className="text-[#c8a45d]" />
            <input className="bg-transparent text-sm text-[#fffaf0] outline-none placeholder:text-[#8c98aa]" placeholder="Filter by 2026-06" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </header>

        {notice && <div className="rounded-2xl border border-[#c8a45d]/30 bg-[#c8a45d]/10 p-4 text-sm text-[#f1d99b]">{notice}</div>}

        <section className={`${executiveTheme.card} overflow-hidden`}>
          <div className="grid grid-cols-5 gap-4 border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#8fa0b8]">
            <span>Pay period</span><span>Run reference</span><span>Net pay</span><span>Disbursed</span><span className="text-right">Actions</span>
          </div>
          {visiblePayslips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-[#c9d3df]"><FileText size={36} /><p>No payslips available yet</p></div>
          ) : visiblePayslips.map((payslip) => (
            <div key={payslip.id} className="grid grid-cols-1 gap-3 border-b border-white/5 px-5 py-4 text-sm text-[#f8f4ea] last:border-0 md:grid-cols-5 md:items-center">
              <strong>{payslip.payPeriod}</strong>
              <span className="font-mono text-xs text-[#c9d3df]">{payslip.payrollRunId}</span>
              <span className="font-bold text-[#c8a45d]">{formatMoney(payslip.netPay)}</span>
              <span>{payslip.disbursedAt ? new Date(payslip.disbursedAt).toLocaleDateString() : "—"}</span>
              <div className="flex flex-wrap justify-end gap-2">
                <button className={executiveTheme.buttonSecondary} onClick={() => setSelectedPayslip(payslip)}><Eye size={15} /> View</button>
                <button className={executiveTheme.buttonSecondary} onClick={() => handleDownload(payslip)}><Download size={15} /> Download</button>
                <button className={executiveTheme.buttonPrimary} onClick={() => setQueryPayslip(payslip)}><AlertCircle size={15} /> Raise query</button>
              </div>
            </div>
          ))}
        </section>
      </div>
      <PayslipDetailModal payslip={selectedPayslip} onClose={() => setSelectedPayslip(null)} onDownload={handleDownload} />
      <RaiseQueryModal payslip={queryPayslip} onClose={() => setQueryPayslip(null)} onSubmit={(message) => setNotice(`Query routed to Branch HR Admin: ${message}`)} />
      <PageChatbotWidget page="my-payslip" role="Employee" contextSummary={`${visiblePayslips.length} disbursed payslips visible. Latest net pay ${visiblePayslips[0] ? formatMoney(visiblePayslips[0].netPay) : "none"}.`} quickPrompts={["Why is my deduction different this month?", "What was my latest net pay?", "Can I raise a payroll query?"]} />
    </div>
  );
}
