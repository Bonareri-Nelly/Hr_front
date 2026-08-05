import { Download, X } from "lucide-react";

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
    <div className="modal-backdrop" role="presentation">
      <div className="module-modal" style={{ maxWidth: "720px", maxHeight: "90vh" }}>
        <div className="payroll-modal-header">
          <div>
            <div className="page-kicker">Payslip detail</div>
            <h2>{payslip.payPeriod}</h2>
          </div>
          <button className="panel-action" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="grid-2col" style={{ marginTop: "16px" }}>
          <div className="note" style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy-deepest)", marginBottom: "10px" }}>Earnings</h3>
            <div className="section-stack">
              {payslip.allowances.map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                  <strong style={{ color: "var(--ink)" }}>{money(item.amount)}</strong>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border)", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--ink)" }}>Gross Pay</span>
              <strong style={{ color: "var(--ink)" }}>{money(payslip.grossPay)}</strong>
            </div>
          </div>
          <div className="note" style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy-deepest)", marginBottom: "10px" }}>Deductions</h3>
            <div className="section-stack">
              {deductions.map(([label, amount]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <strong style={{ color: "var(--ink)" }}>{money(amount)}</strong>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border)", fontSize: "0.95rem" }}>
              <span style={{ color: "var(--ink)" }}>Net Pay</span>
              <strong style={{ color: "var(--success)" }}>{money(payslip.netPay)}</strong>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          <span>Run: {payslip.payrollRunId}</span>
          <span>Disbursed: {new Date(payslip.disbursedAt).toLocaleString()}</span>
          <button className="button button-primary button-sm" onClick={() => onDownload(payslip)}><Download size={14} /> Download PDF</button>
        </div>
      </div>
    </div>
  );
}
