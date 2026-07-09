import { useState } from 'react';
import type { VerificationError, BankFileHistoryItem, BankPaymentPreview } from '..//types/bankIntegration';

export default function BankIntegration() {
  // CONFIGURABLE SETTING: Branch Consolidation Scope State Switcher
  const [isConsolidatedAccount, setIsConsolidatedAccount] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('Nairobi HQ');

  // INTERACTIVE WORKFLOW STATES
  const [selectedBatch] = useState<string>('PR-2026-06-C');
  const [isBatchApproved] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');

  // pre-disbursement verification error log dataset
  const verificationErrors: VerificationError[] = [
    { employeeId: "NX-001420", name: "David Ochieng", issue: "missing account" },
    { employeeId: "NX-001551", name: "Mercy Cherop", issue: "invalid length" }
  ];

  // Bank file generation item preview payload matrix
  const paymentPreviews: BankPaymentPreview[] = [
    { employeeName: "Nancy Karanja", maskedAccount: "••••••••4821", bankName: "Equity Bank", amount: 185005, reference: "PAY-NX001247" },
    { employeeName: "Lilian Wambui", maskedAccount: "••••••••9941", bankName: "KCB Bank", amount: 142300, reference: "PAY-NX001550" },
    { employeeName: "Brian Omondi", maskedAccount: "••••••••1102", bankName: "NCBA Bank", amount: 165450, reference: "PAY-NX001391" }
  ];

  // Historical file registry database rows tracking audit logs
  const [historyLog, setHistoryLog] = useState<BankFileHistoryItem[]>([
    { id: "BF-062", batchRef: "PR-2026-06-01", dateGenerated: "01 Jul 2026, 09:12 AM", generatedBy: "Finance Admin (James M.)", totalAmount: 84650200, status: "confirmed", discrepancy: false },
    { id: "BF-063", batchRef: "PR-2026-06-02", dateGenerated: "01 Jul 2026, 11:34 AM", generatedBy: "Finance Admin (James M.)", totalAmount: 57954800, status: "sent", discrepancy: false },
    { id: "BF-064", batchRef: "PR-2026-06-C", dateGenerated: "Today, 08:15 AM", generatedBy: "Finance Admin (James M.)", totalAmount: 142605000, status: "pending", discrepancy: true }
  ]);

  // Handler 1: Mock decoupled file exporter conversion service layer
  const handleExportCSV = () => {
    if (!isBatchApproved) {
      setFeedbackType('error');
      setFeedbackMsg("CRITICAL LOCK: Cannot export data. Selected source payroll batch must be 'Approved' at the security logic tier first.");
      return;
    }
    
    // Simulate generation of instruction payload strings
    const csvContent = "data:text/csv;charset=utf-8,Employee,Account,Bank,Amount,Reference\n" 
      + paymentPreviews.map(p => `"${p.employeeName}","${p.maskedAccount}","${p.bankName}",${p.amount},"${p.reference}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DISBURSE_EXPORT_${selectedBatch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackType('success');
    setFeedbackMsg(`Successfully generated and downloaded banking instruction file payload for batch ${selectedBatch}.`);
    setTimeout(() => setFeedbackMsg(''), 6000);
  };

  // Handler 2: Bulk Confirmation Statement upload trigger loop
  const handleSimulateStatementUpload = () => {
    setHistoryLog(prev => 
      prev.map(item => item.batchRef === 'PR-2026-06-C' ? { ...item, status: 'confirmed', discrepancy: false } : item)
    );
    setFeedbackType('success');
    setFeedbackMsg("Reconciliation complete! Uploaded bank statement processed: total balances verified, bulk confirmation flag triggers run, discrepancies resolved.");
    setTimeout(() => setFeedbackMsg(''), 6000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* PAGE BRANDING & CONTEXT HEADER */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 shrink-0">
        <div>
          <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">Bank integration & disbursements</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Manual instruction file exports, pre-disbursement account validation hooks, bulk bank text sheet reconciliation
          </p>
        </div>
        
        {/* Branch Configuration Selector Tools Matrix */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold select-none self-start sm:self-auto">
          <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm text-[11px] font-bold text-slate-500">
            <button onClick={() => setIsConsolidatedAccount(true)} className={`px-3 py-1.5 rounded-lg ${isConsolidatedAccount ? 'bg-[#0d1424] text-white' : 'hover:text-slate-800'}`}>Consolidated account</button>
            <button onClick={() => setIsConsolidatedAccount(false)} className={`px-3 py-1.5 rounded-lg ${!isConsolidatedAccount ? 'bg-[#0d1424] text-white' : 'hover:text-slate-800'}`}>Per branch setup</button>
          </div>
          
          {!isConsolidatedAccount && (
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
            >
              <option>Nairobi HQ</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
            </select>
          )}
        </div>
      </div>

      {/* FEEDBACK PROMPT BANNER ALERTS */}
      {feedbackMsg && (
        <div className={`p-4 mb-6 border rounded-xl text-xs font-semibold leading-relaxed animate-in fade-in ${
          feedbackType === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
          feedbackType === 'error' ? 'bg-rose-50 text-rose-800 border-rose-100' :
          'bg-amber-50 text-amber-800 border-amber-100'
        }`}>
          {feedbackType === 'error' ? '🚫' : '✓'} {feedbackMsg}
        </div>
      )}

      {/* SECTION 2: PRE-DISBURSEMENT VALIDATION CHECKS (FLAG SYSTEM) */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm mb-6">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Pre-disbursement account verification</h3>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded tracking-wide uppercase select-none">
            {verificationErrors.length} validation faults logged
          </span>
        </div>
        
        <p className="text-xs text-slate-400 font-normal leading-relaxed mb-4">
          Before generating an instruction pack, our checking engine evaluates target profiles against missing account, character constraints, and digit length checks.
        </p>

        <div className="space-y-2">
          {verificationErrors.map((err) => (
            <div key={err.employeeId} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-medium">
              <span className="text-slate-700">{err.name} <span className="text-[10px] text-slate-400 font-mono">({err.employeeId})</span></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-100/50">
                {err.issue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1 & SECTION 3: BANK FILE PREVIEW & PROCESSING CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 items-start">
        
        {/* Left Segment: Payment Preview Grid Workspace (Spans 3 Columns) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="p-6 px-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-semibold text-slate-800">Instruction file generator preview</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Source Batch: {selectedBatch}</span>
                <div className={`w-2 h-2 rounded-full ${isBatchApproved ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              </div>
            </div>

            {/* Instruction list map table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                    <th className="p-4 pl-8 font-bold">BENEFICIARY EMPLOYEE</th>
                    <th className="p-4 font-bold">BANK MATRIX</th>
                    <th className="p-4 font-bold">MASKED ACCOUNT</th>
                    <th className="p-4 text-right pr-8 font-bold">NET AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
                  {paymentPreviews.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/20 transition-colors">
                      <td className="p-4 pl-8 font-medium text-slate-800">{p.employeeName}</td>
                                            <td className="p-4 text-slate-400 font-medium">{p.bankName}</td>
                      <td className="p-4 text-slate-500 font-mono tracking-wider">{p.maskedAccount}</td>
                      <td className="p-4 text-right pr-8 font-mono font-medium text-slate-700">KES {p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trigger Action Blocks */}
          <div className="p-6 px-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
            <div className="text-xs">
              <span className="text-slate-400 font-medium">Batch running total:</span>
              <span className="text-slate-800 font-bold font-mono ml-1.5 text-sm">KES 142,605,000</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-[#0d1424] hover:bg-slate-900 text-white font-semibold text-[11px] py-2.5 px-6 rounded-xl transition tracking-widest uppercase outline-none shadow-sm"
            >
              Download bank instruction file (CSV)
            </button>
          </div>
        </div>

        {/* Right Segment: Status tracking & bulk statements upload tools (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-4">Manual upload & reconciliation</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4">
              Once you upload the downloaded file manually to your bank's enterprise system, wait for execution, then upload their text response script here to bulk update statuses automatically.
            </p>

            <div className="border border-dashed border-slate-200 hover:border-amber-500/50 rounded-xl p-5 text-center cursor-pointer transition bg-slate-50/30 flex flex-col items-center justify-center min-h-[110px]">
              <span className="text-xl">📄</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-2 uppercase tracking-wide">Drop bank statement spreadsheet</span>
              <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest block mt-0.5">Supports standard bank returns (CSV/TXT)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4 select-none">
            <button
              onClick={handleSimulateStatementUpload}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] uppercase tracking-widest py-3 rounded-xl shadow-sm transition outline-none"
            >
              Simulate statement file processing
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4 & SECTION 5: HISTORICAL DATA REGISTRY & IMMUTABLE AUDIT TRAIL */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 px-8 border-b border-slate-100 bg-white">
          <h3 className="text-sm font-semibold text-slate-800">Immutable distribution & audit history</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/40">
                <th className="p-4 pl-8 font-bold">FILE ID</th>
                <th className="p-4 font-bold">BATCH REF</th>
                <th className="p-4 font-bold">DATE GENERATED</th>
                <th className="p-4 font-bold">GENERATED BY</th>
                <th className="p-4 font-bold">RECONCILIATION FLAG</th>
                <th className="p-4 font-bold">DISBURSEMENT METRIC</th>
                <th className="p-4 pr-8 text-right font-bold">PROCESSING STATE</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
              {historyLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-4 pl-8 font-mono tracking-wide text-slate-800 font-bold">{log.id}</td>
                  <td className="p-4 text-slate-500 font-medium">{log.batchRef}</td>
                  <td className="p-4 text-slate-400 font-medium">{log.dateGenerated}</td>
                  <td className="p-4 text-slate-500 font-medium">{log.generatedBy}</td>
                  
                  {/* Discrepancy Reconciliation Flag cell */}
                  <td className="p-4 font-bold">
                    {log.discrepancy ? (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 lowercase">⚠️ balance variance</span>
                    ) : (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 lowercase">balanced</span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-700">KES {log.totalAmount.toLocaleString()}</td>
                  
                  {/* Final processing state indicator badges */}
                  <td className="p-4 pr-8 text-right">
                    <span className={`inline-block font-bold text-[9px] px-2.5 py-0.5 border rounded uppercase tracking-wide select-none ${
                      log.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      log.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

