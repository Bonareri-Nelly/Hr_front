import { useState } from 'react';
import type { BenefitsCostData, ProviderInvoiceRow } from '../types/benefitsCost';

export default function BenefitsCostManagement() {
  // CONFIGURABLE SETTINGS: Branch Scope Selector 
  const [selectedBranch, setSelectedBranch] = useState<string>('Org-wide Consolidated');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Primary state data structured precisely to capture financial variables from your requirements
  const [financeData, setDashboardData] = useState<BenefitsCostData>({
    budgets: [
      { category: "Medical Insurance (Family Plan)", allocated: 45000000, actualSpend: 46200000, variance: -1200000, status: "over" },
      { category: "Corporate Wellness & Health Pack", allocated: 12000000, actualSpend: 11400000, variance: 600000, status: "under" },
      { category: "Pension Scheme Matching Fund", allocated: 35000000, actualSpend: 35000000, variance: 0, status: "balanced" }
    ],
    invoices: [
      { id: "INV-BEN-902", provider: "Jubilee Insurance Ltd", benefitCovered: "Medical Insurance", amountDue: 15400000, dueDate: "15 Jul 2026", status: "Pending", reconciliationMismatch: true, enrollmentDiffText: "Invoice bills for 869 staff; HR Admin records show 864 enrolled." },
      { id: "INV-BEN-884", provider: "AAR Health Care", benefitCovered: "Corporate Wellness", amountDue: 3800000, dueDate: "10 Jul 2026", status: "Pending", reconciliationMismatch: false },
      { id: "INV-BEN-712", provider: "CPF Financial Services", benefitCovered: "Pension Scheme", amountDue: 11600000, dueDate: "05 Jul 2026", status: "Paid", reconciliationMismatch: false }
    ],
    projectedGrowth: 5, // 5% modeling parameter
    projectedCostIncrease: 2310000 // Z calculation outcome metric
  });

  // Handler 1: Update payment status manually inside Finance view
  const handleMarkAsPaid = (invoiceId: string) => {
    setDashboardData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'Paid', reconciliationMismatch: false } : inv
      )
    }));
    setFeedbackMsg(`Invoice ${invoiceId} successfully marked as PAID. Reconciled items committed to GL logs.`);
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  // Handler 2: Exportable statutory reports per branch summary sheet client compiler
  const handleDownloadReport = (reportType: string) => {
    const reportString = `data:text/plain;charset=utf-8, Nexus Corp Benefits Cost Allocation Report\nScope: ${selectedBranch}\nType: ${reportType}\nGenerated for corporate audit files matching compliance benchmarks.`;
    const encodedUri = encodeURI(reportString);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BENEFITS_COST_REPORT_${reportType.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* PAGE HEADER & BRANCH CONFIGURATION FILTERS */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 shrink-0">
        <div>
          <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">Benefits cost management</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Provider invoicing ledger tracking, multi-branch budget variances, enrollment count reconciliation
          </p>
        </div>
        
        <select 
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs text-slate-700 outline-none shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <option>Org-wide Consolidated</option>
          <option>Nairobi HQ Branch</option>
          <option>Mombasa Branch</option>
          <option>Kisumu Branch</option>
        </select>
      </div>

      {/* FEEDBACK SYSTEM PROMPT NOTIFICATIONS BANNER */}
      {feedbackMsg && (
        <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold leading-normal animate-in fade-in">
          ✓ {feedbackMsg}
        </div>
      )}

      {/* SECTION 6 & SECTION 3: RECONCILIATION MISMATCH & OVERRUN ALERT BANNER */}
      <div className="p-4 mb-6 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs font-semibold text-rose-800 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-lg">🚨</span>
          <div>
            <p className="font-bold">CRITICAL FINANCE RECONCILIATION EXCEPTION FILED</p>
            <p className="text-[11px] font-normal text-rose-600 mt-0.5">Jubilee Insurance invoice reports an enrollment mismatch variance. Provider bills for 5 extra units vs current active HR Admin enrollment logs.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono tracking-widest bg-white text-rose-700 px-2 py-0.5 rounded border border-rose-200 uppercase font-bold select-none">mismatch flag</span>
      </div>

      {/* SECTION 1: BUDGET ALLOCATION & VARIANCE VIEW SHEET MATRIX */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 px-8 border-b border-slate-100 bg-white flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800">Budget vs actual allocation ledger</h3>
          <button onClick={() => handleDownloadReport("YTD Budget Variance")} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition">export spreadsheet</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/40">
                <th className="p-4 pl-8 font-bold">BENEFIT CATEGORY LINK</th>
                <th className="p-4 font-bold">PERIOD ALLOCATED</th>
                <th className="p-4 font-bold">ACTUAL OUTFLOW SPEND</th>
                <th className="p-4 font-bold">NET VARIANCE BALANCE</th>
                <th className="p-4 pr-8 text-right font-bold">TRACK STATE</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
              {financeData.budgets.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-4 pl-8 font-bold text-slate-800">{b.category}</td>
                  <td className="p-4 font-mono font-medium">KES {b.allocated.toLocaleString()}</td>
                  <td className="p-4 font-mono font-medium">KES {b.actualSpend.toLocaleString()}</td>
                  <td className="p-4 font-mono font-semibold">
                    <span className={b.variance < 0 ? 'text-rose-600' : b.variance > 0 ? 'text-emerald-600' : 'text-slate-400'}>
                      {b.variance < 0 ? `- KES ${Math.abs(b.variance).toLocaleString()}` : b.variance > 0 ? `+ KES ${b.variance.toLocaleString()}` : 'balanced'}
                    </span>
                  </td>
                  <td className="p-4 pr-8 text-right">
                    <span className={`inline-block font-bold text-[9px] px-2 py-0.5 border rounded uppercase tracking-wide select-none ${
                      b.status === 'under' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      b.status === 'over' ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {b.status} budget
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 & SECTION 4: PROVIDER INVOICES QUEUE VS GROWTH IMPACT MODELING GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Provider Payment Tracking List Table (Spans 3 Columns) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px]">
          <div className="p-6 px-8 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">Benefit provider contract invoicing queue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="p-4 pl-8 font-bold">VENDOR VENDOR</th>
                  <th className="p-4 font-bold">INVOICED AMOUNT</th>
                  <th className="p-4 font-bold">DEADLINE DATE</th>
                  <th className="p-4 font-bold">STATE</th>
                  <th className="p-4 pr-8 text-right font-bold">FINANCE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
                {financeData.invoices.map((row) => (
                  <tr key={row.id} className={`hover:bg-slate-50/20 transition-colors ${row.reconciliationMismatch ? 'bg-rose-50/10' : ''}`}>
                    <td className="p-4 pl-8">
                      <span className="font-bold text-slate-800 block">{row.provider}</span>
                                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{row.benefitCovered} • {row.id}</span>
                      {row.reconciliationMismatch && (
                        <span className="text-[9px] font-bold text-rose-500 block mt-1 leading-snug">⚠️ {row.enrollmentDiffText}</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-700">KES {row.amountDue.toLocaleString()}</td>
                    <td className="p-4 font-mono font-semibold text-slate-400">{row.dueDate}</td>
                    <td className="p-4">
                      <span className={`inline-block font-bold text-[9px] px-2 py-0.5 border rounded uppercase tracking-wide select-none ${
                        row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-orange-50 text-orange-700 border-orange-100 animate-pulse'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 pr-8 text-right select-none">
                      {row.status !== 'Paid' ? (
                        <button 
                          onClick={() => handleMarkAsPaid(row.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold hover:underline transition"
                        >
                          mark paid
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 font-medium italic">invoice closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Forecasting & Impact Modeling Dashboard Panel (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Enrollment trend forecasting</h3>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">predictive</span>
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed mb-4">
              Simple trend impact modeling pulling aggregate enrollment parameters from Benefits Overview datasets.
            </p>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl shadow-inner text-xs border border-slate-800 space-y-4">
              <div>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-1">If enrollment grows by:</span>
                <span className="text-xl font-light text-white font-mono tracking-tight">{financeData.projectedGrowth}% next period</span>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Projected cost increases by:</span>
                <span className="text-base font-bold text-white font-mono">+ KES {financeData.projectedCostIncrease.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Provider renewal tracking notifications area */}
          <div className="pt-3 border-t border-slate-50 text-[10px] font-semibold text-slate-400 italic bg-slate-50/50 p-2 rounded-xl text-center">
            🔔 Contract Renewal Alert: Jubilee Medical agreement expires in 90 days. Plan budget calibration cycles accordingly.
          </div>
        </div>

      </div>

    </div>
  );
}


