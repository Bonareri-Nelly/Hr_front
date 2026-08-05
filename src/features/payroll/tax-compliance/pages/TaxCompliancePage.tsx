import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { apiClient } from "@/services/api/client";

type TaxBand = { id: number; name: string; min_income: string | number; max_income: string | number | null; rate: string | number; effective_from: string; is_active: boolean };
type StatutoryRate = { id: number; name: string; code: string; statutory_type: string; rate: string | number; is_percentage: boolean; effective_from: string; is_active: boolean };
type Payslip = { tax_amount: string | number; total_deductions: string | number; payroll_run: number; payroll_month: number; payroll_year: number };
const list = <T,>(data: T[] | { results?: T[] }) => Array.isArray(data) ? data : data.results ?? [];

export default function TaxCompliancePage() {
  const [bands, setBands] = useState<TaxBand[]>([]);
  const [rates, setRates] = useState<StatutoryRate[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [bandResponse, rateResponse, payslipResponse] = await Promise.all([
        apiClient.get("/payroll/tax-bands/"), apiClient.get("/payroll/statutory-rates/"), apiClient.get("/payroll/payslips/"),
      ]);
      setBands(list<TaxBand>(bandResponse.data));
      setRates(list<StatutoryRate>(rateResponse.data));
      setPayslips(list<Payslip>(payslipResponse.data));
    } catch { setError("Unable to load tax and statutory compliance data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const totalTax = payslips.reduce((sum, payslip) => sum + Number(payslip.tax_amount), 0);
  const totalDeductions = payslips.reduce((sum, payslip) => sum + Number(payslip.total_deductions), 0);
  const activeBandCount = bands.filter((band) => band.is_active).length;
  const activeRateCount = rates.filter((rate) => rate.is_active).length;
  const latestPeriod = useMemo(() => payslips.reduce<{ month: number; year: number } | undefined>((latest, slip) => !latest || slip.payroll_year * 12 + slip.payroll_month > latest.year * 12 + latest.month ? { month: slip.payroll_month, year: slip.payroll_year } : latest, undefined), [payslips]);

  return <div className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-slate-900">Tax & compliance</h1><p className="mt-1 text-slate-600">Live payroll tax bands, statutory rates, and payroll deductions.</p></div><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></header>
    {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">{error}</div>}
    <section className="grid gap-4 md:grid-cols-4"><Card label="PAYE collected" value={`KES ${totalTax.toLocaleString()}`} /><Card label="Total deductions" value={`KES ${totalDeductions.toLocaleString()}`} /><Card label="Active tax bands" value={String(activeBandCount)} /><Card label="Active statutory rates" value={String(activeRateCount)} /></section>
    <section className="rounded-xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-bold">PAYE tax bands</h2><p className="text-sm text-slate-500">Bands applicable to the payroll period are selected by their effective date.</p></div><Table headers={["Name", "Income range", "Rate", "Effective from", "Status"]} rows={bands.map((band) => [band.name, `KES ${Number(band.min_income).toLocaleString()} – ${band.max_income === null ? "Above" : `KES ${Number(band.max_income).toLocaleString()}`}`, `${band.rate}%`, band.effective_from, band.is_active ? "Active" : "Inactive"])} /></section>
    <section className="rounded-xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-bold">Statutory deductions</h2><p className="text-sm text-slate-500">Current statutory rates used in calculation.</p></div><Table headers={["Code", "Deduction", "Type", "Rate", "Effective from", "Status"]} rows={rates.map((rate) => [rate.code, rate.name, rate.statutory_type, `${rate.rate}${rate.is_percentage ? "%" : ""}`, rate.effective_from, rate.is_active ? "Active" : "Inactive"])} /></section>
    <section className="rounded-xl border bg-emerald-50 p-5 text-emerald-900"><div className="flex items-center gap-2 font-semibold"><ShieldCheck size={18} /> Compliance calculation status</div><p className="mt-1 text-sm">{latestPeriod ? `Payroll calculations are available through ${latestPeriod.month}/${latestPeriod.year}.` : "No generated payroll is available yet."}</p></section>
  </div></div>;
}

function Card({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>; }
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{headers.map((header) => <th key={header} className="p-3 font-medium">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t">{row.map((cell, cellIndex) => <td key={cellIndex} className="p-3">{cell}</td>)}</tr>)}{!rows.length && <tr><td colSpan={headers.length} className="p-8 text-center text-slate-500">No configuration found.</td></tr>}</tbody></table></div>; }
