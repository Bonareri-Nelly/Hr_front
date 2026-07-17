import { Download, X } from "lucide-react";
import { executiveTheme } from "../../../../theme/executiveTheme";

export type Payslip = {
  id: string;
  employeeId: string;
  payrollRunId: string;
  payPeriod: string;
  grossPay: number;
  allowances: { label: string; amount: number }[];
  deductions: { paye: number; nssf: number; shif: number; housingLevy: number; other: { label: string; amount: number }[] };
  netPay: number;
  status: "Disbursed" | "Draft" | "Pending";
  disbursedAt: string;
};

const money = (amount: number) => `KES ${amount.toLocaleString()}`;

export default function PayslipDetailModal({ payslip, onClose, onDownload }: { payslip: Payslip | null; onClose: () => void; onDownload: (payslip: Payslip) => void }) {
  if (!payslip) return null;
  const deductions: [string, number][] = [
    ["PAYE", payslip.deductions.paye],
    ["NSSF", payslip.deductions.nssf],
    ["SHIF", payslip.deductions.shif],
    ["Housing Levy", payslip.deductions.housingLevy],
    ...payslip.deductions.other.map((item) => [item.label, item.amount] as [string, number]),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={`${executiveTheme.card} max-h-[90vh] w-full max-w-3xl overflow-y-auto`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div><p className={executiveTheme.eyebrow}>Payslip detail</p><h2 className="text-2xl font-bold">{payslip.payPeriod}</h2></div>
          <button className={executiveTheme.buttonSecondary} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <section className={executiveTheme.cardSoft + " p-4"}>
            <h3 className="mb-3 font-bold text-[#c8a45d]">Earnings</h3>
            <div className="space-y-2 text-sm">{payslip.allowances.map((item) => <div className="flex justify-between" key={item.label}><span>{item.label}</span><strong>{money(item.amount)}</strong></div>)}</div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-3 text-lg"><span>Gross Pay</span><strong>{money(payslip.grossPay)}</strong></div>
          </section>
          <section className={executiveTheme.cardSoft + " p-4"}>
            <h3 className="mb-3 font-bold text-[#c8a45d]">Deductions</h3>
            <div className="space-y-2 text-sm">{deductions.map(([label, amount]) => <div className="flex justify-between" key={label}><span>{label}</span><strong>{money(amount)}</strong></div>)}</div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-3 text-lg"><span>Net Pay</span><strong className="text-[#c8a45d]">{money(payslip.netPay)}</strong></div>
          </section>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5 text-sm text-[#c9d3df]"><span>Run: {payslip.payrollRunId}</span><span>Disbursed: {new Date(payslip.disbursedAt).toLocaleString()}</span><button className={executiveTheme.buttonPrimary} onClick={() => onDownload(payslip)}><Download size={16} /> Download PDF</button></div>
      </div>
    </div>
  );
}
