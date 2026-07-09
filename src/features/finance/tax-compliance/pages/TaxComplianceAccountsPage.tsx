import { useState } from 'react';
import type { TaxComplianceDashboardData, ComplianceFilingObligation } from '../types/taxCompliance';

export default function TaxCompliance() {
  // CONFIGURABLE SCOPE SETTINGS
  const [selectedBranch, setSelectedBranch] = useState<string>('Org-wide Consolidated');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Primary state data structured exactly to match the compliance rules, data schemas, and parameters
  const [complianceData, setComplianceData] = useState<TaxComplianceDashboardData>({
    config: [
      { name: "PAYE", method: "Tiered/Bracket-based", employerContribution: "0%", frequency: "Monthly", deadlineRule: "9th of following month" },
      { name: "NSSF", method: "Percentage with Cap", employerContribution: "6% matching", frequency: "Monthly", deadlineRule: "9th of following month" },
      { name: "SHIF (Formerly NHIF)", method: "Percentage of Gross", employerContribution: "0%", frequency: "Monthly", deadlineRule: "9th of following month" },
      { name: "Housing Levy", method: "Percentage of Gross", employerContribution: "1.5% matching", frequency: "Monthly", deadlineRule: "9th of following month" }
    ],
    obligations: [
      { id: "OBL-401", deductionType: "PAYE Summary Pack", period: "June 2026", daysRemaining: 1, status: "In Progress" },
      { id: "OBL-402", deductionType: "Housing Levy Return", period: "June 2026", daysRemaining: 1, status: "Not Started" },
      { id: "OBL-403", deductionType: "SHIF Contribution Register", period: "June 2026", daysRemaining: 1, status: "Filed", proofFile: "KRA_SHIF_RECEIPT_4821.pdf" },
      { id: "OBL-390", deductionType: "NSSF Statutory Filing", period: "May 2026", daysRemaining: -29, status: "Overdue" }
    ],
    errors: [
      { employeeId: "NX-001290", name: "David Ochieng", missingField: "Missing Tax PIN / KRA ID" },
      { employeeId: "NX-001402", name: "Mercy Cherop", missingField: "Missing NSSF Registration Number" }
    ]
  });

  // Handler 1: Proof of filing attachment mock upload triggers
  const handleAttachProof = (obligationId: string) => {
    setComplianceData(prev => ({
      ...prev,
      obligations: prev.obligations.map(obl => 
        obl.id === obligationId ? { ...obl, status: 'Filed', proofFile: 'UPLOADED_RECEIPT_ATTACHED.pdf' } : obl
      )
    }));
    setFeedbackMsg("Proof of statutory filing attached successfully! Obligation marked as Filed and committed to audit trails.");
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  // Handler 2: Exportable decoupled text data compiler reporting service
  const handleDownloadReport = (type: string) => {
    const reportData = `data:text/plain;charset=utf-8, Nexus Corp Statutory Report\nPeriod: June 2026\nType: ${type}\nScope: ${selectedBranch}\nGenerated for manual tax authority portal upload.`;
    const encodedUri = encodeURI(reportData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `STAT_REPORT_${type.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* PAGE HEADER & DYNAMIC BRANCH FILTERS */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 shrink-0">
        <div>
          <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">Tax & statutory compliance</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Dynamic statutory logic tracking, filing countdowns, documentation trails, missing data warnings
          </p>
        </div>
        
        {/* Branch scope dropdown selector */}
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

      {/* FEEDBACK PROMPT NOTIFICATIONS BANNER */}
      {feedbackMsg && (
        <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold leading-normal animate-in fade-in">
          ✓ {feedbackMsg}
        </div>
      )}

      {/* CRITICAL URGENCY ALERT BANNER: VISIBLE DEADLINE THREAT HIGHLIGHTER */}
      <div className="p-4 mb-6 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs font-semibold text-rose-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-lg">🚨</span>
          <div>
            <p className="font-bold">CRITICAL PENALTY THREAT WINDOW</p>
            <p className="text-[11px] font-normal text-rose-600 mt-0.5">June cycles filings lock in less than 24 hours. Missed submissions trigger real statutory financial interest fines.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono tracking-widest bg-white text-rose-700 px-2 py-0.5 rounded border border-rose-200 select-none uppercase font-bold">urgent action</span>
      </div>

      {/* SECTION 4: MISSING STATUTORY IDENTIFIER ERROR FLAGS BAR */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm mb-6">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Pre-filing data accuracy assertions</h3>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded select-none tracking-wide uppercase">
            {complianceData.errors.length} data blocks compromised
          </span>
        </div>
        <p className="text-xs text-slate-400 font-normal leading-relaxed mb-4">
          The following employee records lack valid tax authority index identifiers. These exceptions must be routed back to Branch HR Admin for correction before filing periods close.
        </p>
        <div className="space-y-2">
          {complianceData.errors.map((err) => (
            <div key={err.employeeId} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-medium">
              <span className="text-slate-700 font-semibold">{err.name} <span className="text-[10px] text-slate-400 font-mono">({err.employeeId})</span></span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded lowercase font-sans select-none">
                {err.missingField}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1 & SECTION 2: FILING STATUS TRACKER AND SUMMARY GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 items-start">
        
        {/* Left Column Segment Container: Filing Obligations Tracker (Spans 3 Columns) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px]">
          <div className="p-6 px-8 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">Filing status manager</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="p-4 pl-8 font-bold">OBLIGATION OWD</th>
                  <th className="p-4 font-bold">PERIOD</th>
                  <th className="p-4 font-bold">COUNTDOWN</th>
                  <th className="p-4 font-bold">STATUS</th>
                  <th className="p-4 pr-8 text-right font-bold">EVALUATION ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
                {complianceData.obligations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-4 pl-8 font-bold text-slate-800">{row.deductionType}</td>
                    <td className="p-4 text-slate-400 font-semibold">{row.period}</td>
                    
                    {/* Countdown indicator columns rendering customized alerts for deadlines */}
                    <td className="p-4 font-mono font-medium">
                      {row.status === 'Filed' ? (
                        <span className="text-slate-300 font-sans font-bold">complete</span>
                      ) : row.daysRemaining < 0 ? (
                        <span className="text-rose-600 font-bold font-sans">overdue {Math.abs(row.daysRemaining)}d</span>
                      ) : (
                        <span className="text-orange-600 font-bold font-sans">due in {row.daysRemaining}d</span>
                      )}
                    </td>

                    {/* Status Badge layout mapping loops */}
                    <td className="p-4">
                      <span className={`inline-block text-center font-bold px-2 py-0.5 rounded text-[10px] scale-95 border lowercase select-none tracking-wide ${
                        row.status === 'Filed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        row.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                row.status === 'Not Started' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    {/* Proof file submission triggers grid fields actions */}
                    <td className="p-4 pr-8 text-right select-none">
                      {row.status === 'Filed' && row.proofFile ? (
                        <span className="text-[10px] font-mono text-slate-400 font-medium italic truncate max-w-[120px] inline-block">
                          📎 {row.proofFile}
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleAttachProof(row.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold hover:underline transition"
                        >
                          attach receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column Segment Container: Configurable Deduction Type Calculations Matrix */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px]">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Active dynamic rate structures</h3>
            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">audit logs</button>
          </div>
          <p className="text-xs text-slate-400 font-normal leading-relaxed mb-4">
            Statutory rates apply calculation logic dynamically based on active dates to prevent retroactive alterations during audit sweeps.
          </p>
          <div className="space-y-4">
            {complianceData.config.map((item, i) => (
              <div key={i} className="text-xs border border-slate-50 bg-slate-50/20 p-3 rounded-xl flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">{item.name}</h4>
                  <p className="text-slate-400 text-[10px] mt-0.5 font-medium">{item.method} • rule: {item.deadlineRule}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-600 border border-slate-100 rounded-md block select-none">
                    Co. matching: {item.employerContribution}
                  </span>
                  <button 
                    onClick={() => handleDownloadReport(item.name)}
                    className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold mt-2 inline-block transition hover:underline"
                  >
                    export pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

