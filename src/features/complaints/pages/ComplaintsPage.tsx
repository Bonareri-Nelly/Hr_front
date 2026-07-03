import { useState } from 'react';
import type { ComplaintTicket, ComplaintFormData } from '../types/complaints';

export default function Complaints() {
  // Local form state handling
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: 'Workplace harassment',
    subject: '',
    details: '',
    preferredResolution: 'Investigation requested',
    confidentiality: 'Standard (HR and relevant parties)'
  });

  // Past complaints history feed matching the design image perfectly
  const pastComplaints: ComplaintTicket[] = [
    {
      id: "CMP-2026-018",
      subject: "Workspace noise issue",
      date: "14 Jun",
      status: "resolved",
      updateType: "Resolution",
      updateText: "Facilities moved your desk to the quiet zone effective 20 Jun. Case closed by branch HR."
    },
    {
      id: "CMP-2026-031",
      subject: "Equipment request escalation",
      date: "28 Jun",
      status: "under review",
      updateType: "Status update",
      updateText: "Assigned to branch HR admin. Expected response within 48 hours."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10">
      
      {/* Page Title Branding Header */}
      <div className="mb-10">
        <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">Complaints</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          File and track workplace complaints confidentially
        </p>
      </div>

      {/* Two Column Workspace Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Submit a Complaint Form */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 px-8 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">Submit a complaint</h3>
          </div>
          
          <form className="p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Category Select Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500 transition-colors"
              >
                <option>Workplace harassment</option>
                <option>Facility infrastructure</option>
                <option>Compensation payroll dispute</option>
              </select>
            </div>

            {/* Subject Text Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Subject
              </label>
              <input 
                type="text" 
                placeholder="Brief description of the issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Details Text Area Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Details
              </label>
              <textarea 
                rows={4}
                placeholder="Describe the incident or concern in detail. Include dates, locations, and any witnesses if applicable."
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Preferred Resolution Select Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Preferred resolution
              </label>
              <select 
                value={formData.preferredResolution}
                onChange={(e) => setFormData({...formData, preferredResolution: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500 transition-colors"
              >
                <option>Investigation requested</option>
                <option>Mediation session</option>
                <option>Immediate direct action</option>
              </select>
            </div>

            {/* Confidentiality Level Select Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Confidentiality
              </label>
              <select 
                value={formData.confidentiality}
                onChange={(e) => setFormData({...formData, confidentiality: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500 transition-colors"
              >
                <option>Standard (HR and relevant parties)</option>
                <option>Strictly Confidential (HR Director Only)</option>
                <option>Anonymous Filing</option>
              </select>
            </div>
          </form>
        </div>

        {/* Right Column: My Complaint History Logs */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 px-8 border-b border-slate-100 bg-white">
              <h3 className="text-sm font-semibold text-slate-800">My complaint history</h3>
            </div>
            
            {/* Ticket Loop Element Containers */}
            <div className="p-6 px-8 space-y-6">
              {pastComplaints.map((ticket, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm">
                  {/* Ticket Header Row Layout */}
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 tracking-tight">{ticket.id}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        {ticket.subject}, {ticket.date}
                      </p>
                    </div>
                    {/* Status Pill Badge Switching Style Classes */}
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded tracking-wide font-sans select-none border lowercase ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Sub-block Text Update Resolution Logs */}
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <h5 className="text-[11px] font-bold text-slate-800 mb-1">
                      {ticket.updateType}
                    </h5>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {ticket.updateText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
