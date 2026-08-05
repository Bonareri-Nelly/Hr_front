import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, ShieldCheck } from "lucide-react";
import { apiClient } from "@/services/api/client";

type PayrollRun = {
  id: number;
  month: number;
  year: number;
  status: string;
  total_amount?: string | number;
  bank_payment_status?: string;
};

type BankPayment = {
  id: number;
  payroll_run: number;
  employee_name: string;
  employee_number: string;
  bank_name: string;
  account_number: string;
  amount: string | number;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
};

const list = <T,>(data: T[] | { results?: T[] }) => Array.isArray(data) ? data : data.results ?? [];

export default function BankIntegrationAccountsPage() {
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [payments, setPayments] = useState<BankPayment[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [runResponse, paymentResponse] = await Promise.all([
        apiClient.get("/payroll/runs/"),
        apiClient.get("/payroll/bank-payments/"),
      ]);
      const liveRuns = list<PayrollRun>(runResponse.data);
      setRuns(liveRuns);
      setPayments(list<BankPayment>(paymentResponse.data));
      setSelectedRunId((current) => current || String(liveRuns.find((run) => ["APPROVED", "FINALIZED"].includes(run.status))?.id ?? ""));
    } catch {
      setError("Unable to load bank disbursement data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const selectedPayments = useMemo(
    () => payments.filter((payment) => String(payment.payroll_run) === selectedRunId),
    [payments, selectedRunId],
  );
  const selectedRun = runs.find((run) => String(run.id) === selectedRunId);
  const total = selectedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const invalid = selectedPayments.filter((payment) => !payment.bank_name || !payment.account_number || payment.account_number.length < 6);
  const canExport = Boolean(selectedRun && ["APPROVED", "FINALIZED"].includes(selectedRun.status) && invalid.length === 0);

  const exportInstructions = async () => {
    if (!selectedRunId) return;
    setError(""); setMessage("");
    try {
      const response = await apiClient.get(`/payroll/runs/${selectedRunId}/bank-payments/export/`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `payroll-${selectedRunId}-bank-instructions.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Bank instruction file exported. Payments are now marked processing.");
      await load();
    } catch {
      setError("Export failed. The payroll must be approved and every employee needs a valid bank account.");
    }
  };

  const reconcilePaid = async () => {
    if (!selectedRunId || selectedPayments.length === 0) return;
    setError(""); setMessage("");
    try {
      await apiClient.post(`/payroll/runs/${selectedRunId}/bank-payments/reconcile/`, {
        payment_ids: selectedPayments.map((payment) => payment.id), status: "PAID",
      });
      setMessage("Bank return reconciled; all payments in this batch are marked paid.");
      await load();
    } catch {
      setError("Reconciliation failed. Check that the selected payroll is approved.");
    }
  };

  return <div className="min-h-screen bg-slate-50 p-6">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-slate-900">Bank integration & disbursements</h1><p className="mt-1 text-slate-600">Export approved payroll instructions and reconcile bank results.</p></div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </header>
      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">{message}</div>}
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">{error}</div>}
      <section className="rounded-xl border bg-white p-5 shadow-sm"><label className="block text-sm font-semibold text-slate-700">Payroll batch</label><select className="mt-2 w-full max-w-xl rounded-lg border p-2" value={selectedRunId} onChange={(event) => setSelectedRunId(event.target.value)}><option value="">Select a payroll run</option>{runs.map((run) => <option key={run.id} value={run.id}>Payroll {run.month}/{run.year} — {run.status}</option>)}</select></section>
      <section className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">Employees</p><p className="text-2xl font-bold">{selectedPayments.length}</p></div><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">Net disbursement</p><p className="text-2xl font-bold">KES {total.toLocaleString()}</p></div><div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">Account validation</p><p className={`text-2xl font-bold ${invalid.length ? "text-rose-600" : "text-emerald-600"}`}>{invalid.length ? `${invalid.length} issue(s)` : "Ready"}</p></div></section>
      <section className="rounded-xl border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="font-bold">Payment instructions</h2><p className="text-sm text-slate-500">Only approved payroll can be exported.</p></div><div className="flex gap-2"><button disabled={!canExport} onClick={() => void exportInstructions()} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Download size={16} /> Export CSV</button><button disabled={!canExport || selectedPayments.length === 0} onClick={() => void reconcilePaid()} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck size={16} /> Reconcile paid</button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Employee</th><th className="p-3">Bank</th><th className="p-3">Account</th><th className="p-3 text-right">Amount</th><th className="p-3">Status</th></tr></thead><tbody>{selectedPayments.map((payment) => <tr key={payment.id} className="border-t"><td className="p-3">{payment.employee_name}<span className="block text-xs text-slate-500">{payment.employee_number}</span></td><td className="p-3">{payment.bank_name || "Missing"}</td><td className="p-3">{payment.account_number ? `••••${payment.account_number.slice(-4)}` : "Missing"}</td><td className="p-3 text-right">KES {Number(payment.amount).toLocaleString()}</td><td className="p-3">{payment.status}</td></tr>)}{!loading && !selectedPayments.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Select a payroll run to view its bank payments.</td></tr>}</tbody></table></div></section>
    </div>
  </div>;
}
