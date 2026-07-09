import { useState } from 'react';
import type { HrEscalatedComplaint, GrievanceDashboardData } from '../types/financeGrievances';

export default function FinanceGrievances() {
  // Local mutable state managing progressive status workflow tracks natively
  const [dashboardData, setDashboardData] = useState<GrievanceDashboardData>({
    tickets: [
      {
        id: "FIN-ESC-091",
        employeeId: "NX-001247",
        employeeName: "Nancy Wanjiku Karanja",
        branch: "Nairobi HQ",
        department: "Engineering",
        escalatedDate: "Today, 10:14 AM",
        hrMessage: "Employee logs a variance error regarding the June 2026 Housing Levy deduction match. Running ledger indicates an over-deduction of KES 1,200. Please review contract calculation parameters and adjust.",
        status: "pending"
      },
      {
        id: "FIN-ESC-084",
        employeeId: "NX-001391",
        employeeName: "Brian Omondi",
        branch: "Nairobi HQ",
        department: "IT Support",
        escalatedDate: "Yesterday, 04:30 PM",
        hrMessage: "April bank disbursement failed event needs a manual accounting journal entry correction. Employee provided updated Equity coordinates which have been fully verified at the HR lifecycle level.",
        status: "in progress"
      },
      {
        id: "FIN-ESC-072",
        employeeId: "NX-001550",
        employeeName: "Lilian Wambui",
        branch: "Eldoret Branch",
        department: "HR Operations",
        escalatedDate: "03 Jul 2026",
        hrMessage: "Laptop cash advance deduction rate requires rescheduling from 8 months down to 12 months following personal emergency medical package configurations approval.",
        status: "completed"
      }
    ]
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Strict progressive state machine processing controller loop
  const handleWorkflowTransition = (ticketId: string, nextStatus: 'in progress' | 'completed') => {
    setDashboardData(prev => ({
      ...prev,
      tickets: prev.tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket
      )
    }));

    setFeedbackMsg(`Workflow status for ticket ${ticketId} updated to [${nextStatus}] successfully.`);
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  // Metric aggregates calculation for header overview panels
  const pendingCount = dashboardData.tickets.filter(t => t.status === 'pending').length;
  const activeCount = dashboardData.tickets.filter(t => t.status === 'in progress').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* 1. Header Navigation Context Information */}
      <div className="mb-10 border-b border-slate-100 pb-6 shrink-0">
        <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">HR financial escalations</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Grievances received from HR regarding employee payroll, deduction disputes, or banking failures • <span className="text-orange-600 font-bold">{pendingCount} unassigned actions</span>
        </p>
      </div>

      {/* FEEDBACK SYSTEM COMPLIANCE NOTIFICATIONS BANNER */}
      {feedbackMsg && (
        <div className="p-3.5 mb-6 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-xs font-semibold leading-normal animate-in fade-in">
          ℹ️ {feedbackMsg}
        </div>
      )}

      {/* 2. Top Summary KPI Row Cards Metrics Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[90px]">
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1">Awaiting Assignment</span>
          <span className="text-2xl font-light text-orange-600 font-normal font-mono">{pendingCount} tickets</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[90px]">
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1">Active Investigation</span>
          <span className="text-2xl font-light text-blue-600 font-normal font-mono">{activeCount} processing</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[90px]">
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1">Resolved Historical Vault</span>
          <span className="text-2xl font-light text-emerald-600 font-normal font-mono">
            {dashboardData.tickets.filter(t => t.status === 'completed').length} closed
          </span>
        </div>
      </div>

      {/* 3. Primary Escalations Ledger List Container Card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 px-8 border-b border-slate-100 bg-white">
          <h3 className="text-sm font-semibold text-slate-800">HR operational dispute queue</h3>
        </div>

        {/* Tickets row loop mappings */}
        <div className="divide-y divide-slate-100 px-8">
          {dashboardData.tickets.map((ticket) => (
            <div 
              key={ticket.id}
              className={`py-7 flex flex-col lg:flex-row lg:items-start justify-between gap-6 transition-colors border-l-2 -mx-8 px-8 ${
                ticket.status === 'pending' ? 'bg-orange-50/20 border-l-orange-500' :
                ticket.status === 'in progress' ? 'bg-blue-50/10 border-l-blue-500' :
                'border-l-transparent hover:bg-slate-50/20'
              }`}
            >
              {/* Left Profile Segment Columns: Metadata details */}
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                    {ticket.id}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800">
                    {ticket.employeeName} <span className="text-[10px] text-slate-400 font-mono font-medium">({ticket.employeeId})</span>
                  </h4>
                  <div className="h-3 w-px bg-slate-200 hidden sm:block" />
                  <span className="text-[11px] text-slate-400 font-medium font-sans">
                    {ticket.branch} • {ticket.department} department • Escalated: {ticket.escalatedDate}
                  </span>
                </div>

                {/* Core message narrative expanded from HR admin console */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 text-xs text-slate-600 font-normal leading-relaxed shadow-inner">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block mb-1 font-sans select-none">HR Narrative Context:</span>
                  "{ticket.hrMessage}"
                </div>
              </div>

              {/* Right Profile Segment Columns: Controlled Workflow Actions Switch Matrix */}
              <div className="shrink-0 select-none self-end lg:self-start pt-1">
                {ticket.status === 'completed' ? (
                  /* Immutable status badge displayed once final resolution locks down */
                  <span className="inline-block text-center font-bold px-3 py-1 rounded text-[10px] border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-100 select-none">
                    completed
                  </span>
                ) : ticket.status === 'in progress' ? (
                  /* Progressive input selection restricted strictly to pushing forward into completed state */
                  <button
                    onClick={() => handleWorkflowTransition(ticket.id, 'completed')}
                    className="text-center font-bold px-3 py-1.5 rounded text-[10px] border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-sm outline-none font-semibold relative group"
                  >
                    <span className="group-hover:hidden">in progress</span>
                    <span className="hidden group-hover:inline">resolve issue?</span>
                  </button>
                ) : (
                  /* Initial active pending state option loop trigger allowing processing assignment */
                  <button
                    onClick={() => handleWorkflowTransition(ticket.id, 'in progress')}
                    className="text-center font-bold px-3 py-1.5 rounded text-[10px] border uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-sm outline-none font-semibold relative group"
                  >
                    <span className="group-hover:hidden">pending</span>
                    <span className="hidden group-hover:inline">start processing?</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
