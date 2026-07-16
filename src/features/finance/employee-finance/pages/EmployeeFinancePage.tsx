import React, { useState } from 'react';
import type { FullFinancialProfile, BankDisbursementRecord } from '../types/employeeFinance';

export default function EmployeeFinancialProfile() {
  // SEARCH GATE STATES
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProfile, setActiveProfile] = useState<FullFinancialProfile | null>(null);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // DYNAMIC PROCESSING WORKBENCH STATES
  const [adjustmentType, setAdjustmentType] = useState<string>('Bonus');
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>(''); 
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Individual dataset mirroring Nancy's database parameters with audit context
  const mockEmployeeDb: { [key: string]: FullFinancialProfile } = {
    "NX-001247": {
      summary: { name: "Nancy Wanjiku Karanja", id: "NX-001247", branch: "Nairobi HQ", department: "Engineering", grade: "E4", status: "Active", grossSalary: 245000 },
      breakdown: {
        basic: 185000,
        allowances: [{ label: "Housing allowance", value: 45000 }, { label: "Transport allowance", value: 15000 }],
        deductions: [{ label: "PAYE Tax", value: 52460 }, { label: "NSSF matching", value: 2160 }, { label: "SHIF Premium", value: 1700 }, { label: "Housing levy", value: 3675 }]
      },
      identifiers: { taxPin: "A001247895K", nssf: "NSSF-9948210", shif: "SHIF-8830114", isComplete: true },
      bankDetails: { bankName: "Equity Bank Kenya", accountNumber: "1240182474821", branchCode: "EQ-001" },
      history: [
        { date: "01 Apr 2024", previous: 220000, updated: 245000, approvedBy: "Finance Exec (Mary C.)" },
        { date: "14 Mar 2022", previous: 0, updated: 220000, approvedBy: "HR Admin Board" }
      ],
      disbursements: [
        { period: "June 2026", runRef: "PR-2026-06-C", status: "confirmed", amount: 185005 },
        { period: "May 2026", runRef: "PR-2026-05-01", status: "confirmed", amount: 185005 },
        { period: "Apr 2026", runRef: "PR-2026-04-01", status: "failed", amount: 185005, reason: "Account closed or invalid routing segment" }
      ],
      notes: [
        { timestamp: "01 Jul 2026, 09:14 AM", author: "James M. (Finance)", text: "Re-verified details following the Apr failure. Employee provided updated Equity coordinates." }
      ]
    }
  };

  // Handler 1: Secure Search Gateway with Mandatory Audit Logger Hook
  const handleProfileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchQuery.trim().toUpperCase();
    const profile = mockEmployeeDb[cleanId];

    if (profile) {
      setActiveProfile(profile);
      const timestamp = new Date().toLocaleString();
      // SECURITY COMPLIANCE RULE: Log access immediately to the immutable trail store
      setAuditLog(prev => [`AUDIT: Profile ${cleanId} accessed by Finance Admin on ${timestamp}`, ...prev]);
      setFeedbackMsg('');
    } else {
      setActiveProfile(null);
      setFeedbackMsg("No employee profile found. Access query matches zero direct file indexes.");
    }
  };

  // Handler 2: Post New Internal Finance Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeProfile) return;

    const newNote = {
      timestamp: new Date().toLocaleString(),
      author: "Finance Admin (James M.)",
      text: newNoteText.trim()
    };

    setActiveProfile({
      ...activeProfile,
      notes: [newNote, ...activeProfile.notes],
    });
    setNewNoteText('');
  };

  // Handler 3: Routing Payroll Adjustment Request Workbench
  const handleInitiateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentAmount || !adjustmentReason.trim() || !activeProfile) return;

    // PROTECTION RULE: Route through status pending workflow, do not mutate database directly
    setFeedbackMsg(`Workflow Triggered: ${adjustmentType} of KES ${Number(adjustmentAmount).toLocaleString()} initiated for ${activeProfile.summary.name}. Request routed to system approver queue.`);
    setAdjustmentAmount('');
    setAdjustmentReason('');
    setTimeout(() => setFeedbackMsg(''), 6000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* PAGE HEADER NAVIGATION PACK */}
      <div className="mb-10 border-b border-slate-100 pb-6 shrink-0">
        <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">Employee financial drill-down</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Secure need-based individual ledger profiles, unmasked verification tracks, audit logged queries only
        </p>
      </div>

      {/* SECURE INPUT ACCESS SEARCH GATEWAY */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <form onSubmit={handleProfileSearch} className="flex-1 flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            placeholder="Search by Employee ID (e.g. NX-001247)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition shadow-inner font-mono uppercase tracking-widest"
          />
          <button 
            type="submit"
            className="bg-[#0d1424] hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl transition shadow-sm whitespace-nowrap outline-none"
          >
            Query Financial Profile
          </button>
        </form>

        {/* Live Active Audit Counter Metrics indicator */}
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right border-l border-slate-100 pl-6 hidden md:block">
          <span className="text-indigo-600 block text-sm font-mono tracking-tight font-semibold">{auditLog.length}</span>
          audited actions inside pool
        </div>
      </div>

      {/* FEEDBACK SYSTEM COMPLIANCE NOTIFICATIONS BANNER */}
      {feedbackMsg && (
        <div className="p-4 mb-6 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-xs font-semibold leading-relaxed animate-in fade-in">
          ℹ️ {feedbackMsg}
        </div>
      )}

      {/* IF PROFILE OBJECT RETRIEVED, DISPLAY WORKSPACE SECTIONS GRID CANVAS */}
      {activeProfile ? (
        <div className="space-y-6">
          
          {/* SECTION 1: EMPLOYEE PROFILE MASTER SUMMARY HEADER CARD */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase mb-1">Employee name</span>
              <span className="text-xs font-bold text-slate-800">{activeProfile.summary.name}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase mb-1">ID / Job grade</span>
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">{activeProfile.summary.id} • {activeProfile.summary.grade}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase mb-1">Branch / Dept</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.summary.branch} • {activeProfile.summary.department}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase mb-1">Gross running salary</span>
              <span className="text-sm font-bold font-mono text-slate-800">KES {activeProfile.summary.grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* BLOCK SECTION ROW: STATUTORY RECORDS VS COMBINED UNMASKED ACCOUNT CHANNELS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* SECTION 4: Statutory Deductions & Identifiers Verification Card */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[290px] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-4">Statutory identifiers index</h3>
                <div className="space-y-3.5 text-xs pt-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">KRA Tax PIN</span>
                    <span className="text-slate-700 font-mono tracking-wider font-semibold">{activeProfile.identifiers.taxPin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">NSSF Account Number</span>
                    <span className="text-slate-700 font-mono tracking-wider font-semibold">{activeProfile.identifiers.nssf}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">SHIF Index Identity</span>
                    <span className="text-slate-700 font-mono tracking-wider font-semibold">{activeProfile.identifiers.shif}</span>
                  </div>
                </div>
              </div>
                            <div className="pb-1" />
            </div>

          </div> {/* Closes BLOCK SECTION ROW */}

          {/* SECTION 2 & SECTION 3: COMPONENT DETAIL BALANCES & DISBURSEMENT HISTORY TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* Left Segment: Salary Detail Component lists (Spans 2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px]">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-3 mb-4">Current period itemized breakdown</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-800 font-bold bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <span>Basic Base Pay</span>
                  <span className="font-mono">KES {activeProfile.breakdown.basic.toLocaleString()}</span>
                </div>
                
                {/* Allowances Mapping Loops */}
                {activeProfile.breakdown.allowances.map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-2 py-0.5">
                    <span className="text-slate-400 font-medium">+ {item.label}</span>
                    <span className="text-slate-600 font-mono">KES {item.value.toLocaleString()}</span>
                  </div>
                ))}

                {/* Deductions Mapping Loops */}
                {activeProfile.breakdown.deductions.map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-2 py-0.5 text-rose-600">
                    <span className="text-slate-400 font-medium">- {item.label}</span>
                    <span className="font-mono text-rose-500/90">KES {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Segment: Disbursement run historical records list table (Spans 3 Columns) */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px]">
              <div className="p-6 px-8 border-b border-slate-100 bg-white">
                <h3 className="text-sm font-semibold text-slate-800">Historical payout disbursement runs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                      <th className="p-4 pl-8 font-bold">PERIOD</th>
                      <th className="p-4 font-bold">BATCH RUN</th>
                      <th className="p-4 font-bold">NET PUNCH</th>
                      <th className="p-4 pr-8 text-right font-bold">DISBURSEMENT STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
                    {activeProfile.disbursements.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/20 transition-colors">
                        <td className="p-4 pl-8 font-bold text-slate-800">{row.period}</td>
                        <td className="p-4 text-slate-400 font-medium font-mono">{row.runRef}</td>
                        <td className="p-4 text-slate-600 font-mono font-medium">KES {row.amount.toLocaleString()}</td>
                        <td className="p-4 pr-8 text-right">
                          <span className={`inline-block text-center font-bold px-2 py-0.5 rounded text-[10px] scale-95 border lowercase select-none tracking-wide ${
                            row.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div> {/* Closes layout row splits */}

          {/* SECTION 7 & SECTION 9: INTERACTIVE ADJUSTMENT WORKBENCH & INTERNAL NOTES */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* Left Segment: Propose compensation adjustments (Spans 3 Columns) */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[350px]">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-4">Propose compensation adjustment</h3>
              
              <form onSubmit={handleInitiateAdjustment} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Adjustment Modality</label>
                    <select value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition-colors">
                      <option>Bonus (One-off payout)</option>
                      <option>Correction (Salary differential arrears)</option>
                      <option>One-off Deduction (Expense recovery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Amount (KES)</label>
                    <input type="number" placeholder="e.g. 15000" value={adjustmentAmount} onChange={(e) => setAdjustmentAmount(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition shadow-inner font-mono font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Justification Reason</label>
                  <textarea rows={2} placeholder="Explain the context and necessity of this manual override payload modification adjustment..." value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-amber-500 transition resize-none leading-relaxed" />
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-[#0d1424] hover:bg-slate-900 text-white font-semibold text-[10px] py-2.5 px-6 rounded-xl transition tracking-widest uppercase outline-none shadow-sm">
                    Route Request To Approver
                  </button>
                </div>
              </form>
            </div>

            {/* Right Segment: Confidential operational notebook memos (Spans 2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-4">Finance operational memos</h3>
                <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                  {activeProfile.notes.map((note, i) => (
                    <div key={i} className="text-xs bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                      <p className="text-slate-600 leading-relaxed font-normal">"{note.text}"</p>
                      <span className="text-[9px] font-bold text-slate-400 block mt-1.5">{note.author} • {note.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memo formulation input fields */}
              <form onSubmit={handleAddNote} className="flex gap-2 border-t border-slate-50 pt-3 mt-4">
                <input type="text" placeholder="Append confidential operational note..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500 transition font-medium" />
                <button type="submit" className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-widest px-3 rounded-xl transition outline-none">add</button>
              </form>
            </div>

          </div> {/* Closes adjustments and notes split */}

          {/* LOWER SECTION CANVAS CONTAINER: IMMUTABLE AUDIT TRAIL LOG SHEET VIEWPORT */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2 mb-3">Profile inquiry access audit logging sheet</h3>
            <div className="space-y-2 max-h-[100px] overflow-y-auto pt-1 pr-1 font-mono text-[10px] font-bold text-slate-400">
              {auditLog.length > 0 ? (
                auditLog.map((log, idx) => (
                  <div key={idx} className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 truncate">{log}</div>
                ))
              ) : (
                <div className="text-slate-300 font-normal italic py-1">No active lookup operations recorded inside current session frames.</div>
              )}
            </div>
          </div>

        </div>
              ) : (
        /* Empty data search landing fallback illustration placeholder */
        <div className="bg-white border border-slate-100 rounded-xl p-12 shadow-sm min-h-[460px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100/50 mb-4 text-2xl select-none shadow-sm">🔍</div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Awaiting Employee Profile Query</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
            Input a valid corporate Employee identifier index inside the query panel control hub above to fetch unmasked ledger details, payroll tracking sheets, and compliance trail matrices.
          </p>
        </div>
      )}

    </div>
  );
}


              


