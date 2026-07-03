import React, { useState } from 'react';
import type { DocumentItem } from '../types/documents';

export default function MyDocuments() {
  // Local interaction states
  const [selectedCategory, setSelectedCategory] = useState<string>('Curriculum Vitae (CV)');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  
  // Local object map storing selected recipients per file item row dynamically
  const [rowRecipients, setRowRecipients] = useState<{ [key: string]: string }>({});

  // Synchronized state data initialized matching your layout image exactly
  const [library, setLibrary] = useState<DocumentItem[]>([
    { id: "1", title: "Employment contract v4", status: "signed", category: "Contracts", isDraft: false },
    { id: "2", title: "Attendance policy v12", status: "acknowledged", category: "Company Policies", isDraft: false },
    { id: "3", title: "Remote work addendum", status: "pending signature", category: "Contracts", isDraft: false },
    { id: "4", title: "Promotion letter, Apr 2024", status: "filed", category: "Letters", isDraft: false }
  ]);

  // Handler 1: Save file safely into system library storage as a local draft
  const handleLocalUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      setFeedbackMsg("Please enter a custom document label name.");
      return;
    }

    const uniqueId = String(Date.now());
    const newDoc: DocumentItem = {
      id: uniqueId,
      title: `${customTitle.trim()} (${selectedCategory})`,
      status: 'uploaded',
      category: selectedCategory,
      isDraft: true // Saved strictly as a local draft
    };

    setLibrary([newDoc, ...library]);
    // Initialize default dropdown recipient mapping for this specific row entry
    setRowRecipients(prev => ({ ...prev, [uniqueId]: 'Central HR Operations' }));
    setCustomTitle('');
    setFeedbackMsg("Document saved securely in your library storage repository. You can dispatch this file later.");
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  // Handler 2: Late-send dispatch function for any uploaded draft file rows
  const handleLateSend = (id: string) => {
    const targetRecipient = rowRecipients[id] || 'Central HR Operations';
    
    setLibrary(prevLibrary => 
      prevLibrary.map(doc => 
        doc.id === id 
          ? { ...doc, isDraft: false, routedTo: targetRecipient } 
          : doc
      )
    );

    setFeedbackMsg(`Document dispatched directly to ${targetRecipient} successfully!`);
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent">
      
      {/* Title Header Section */}
      <div className="mb-10">
        <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">My documents</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Contracts, letters, acknowledgements, and personal compliance submission portals
        </p>
      </div>

      {/* Two-Column Balanced Workspace Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Hand: Upload Console (Saves Locally only) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl shadow-sm p-6 px-8 min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2 mb-4">
              Upload file to library
            </h3>
            
            {feedbackMsg && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-[11px] font-medium leading-normal animate-in fade-in">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleLocalUpload} className="space-y-4 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Document Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition-colors"
                >
                  <option>Curriculum Vitae (CV)</option>
                  <option>National ID / Passport</option>
                  <option>Academic Certificates</option>
                  <option>Tax Compliance File</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Document Label Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nancy_Karanja_CV"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-amber-500 transition-colors tracking-wide"
                />
              </div>

              <div className="border border-dashed border-slate-200 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/30 flex flex-col items-center justify-center min-h-[90px]">
                <span className="text-base">📁</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  Drag file here or click to browse
                </span>
                <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                  PDF, PNG, JPG up to 10MB
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0d1424] hover:bg-slate-900 text-white font-semibold text-[11px] py-3 px-4 rounded-xl transition-all shadow-sm tracking-widest uppercase outline-none"
                >
                  Upload to Repository
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Hand: Document Library Tracker featuring action buttons for items marked as drafts */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px]">
          <div className="p-6 px-8 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">Document library</h3>
          </div>
          
          <div className="px-8 divide-y divide-slate-100/60">
            {library.map((doc) => (
              <div key={doc.id} className="py-5.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors animate-in slide-in-from-top-1 duration-200">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-normal text-slate-700 block truncate">
                    {doc.title}
                  </span>
                  
                  {/* Subtitle status rendering conditions */}
                  {doc.isDraft ? (
                    <span className="text-[10px] font-bold text-amber-500 block mt-0.5 uppercase tracking-wider">
                      • Local Draft File
                    </span>
                  ) : doc.routedTo ? (
                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                      → Dispatched to: <span className="text-indigo-500 font-semibold">{doc.routedTo}</span>
                    </span>
                  ) : null}
                </div>
                
                {/* Context interaction control zone: displays dynamic recipient selection tools if the row asset is a draft */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center select-none">
                  {doc.isDraft ? (
                    <div className="flex items-center gap-2 border border-slate-100 bg-slate-50/50 rounded-lg p-1">
                      <select
                        value={rowRecipients[doc.id] || 'Central HR Operations'}
                        onChange={(e) => setRowRecipients({ ...rowRecipients, [doc.id]: e.target.value })}
                        className="bg-transparent border-0 text-[10px] font-semibold text-slate-500 outline-none py-1 px-1.5 cursor-pointer"
                      >
                        <option>Central HR Operations</option>
                        <option>Direct Department Head</option>
                        <option>Finance & Payroll Auditing</option>
                      </select>
                      <button
                        onClick={() => handleLateSend(doc.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-md transition shadow-sm outline-none"
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-block text-center font-bold px-2.5 py-0.5 rounded text-[10px] scale-95 border lowercase tracking-wide ${
                      doc.status === 'signed' || doc.status === 'acknowledged' || doc.status === 'filed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' :
                      'bg-blue-50 text-blue-700 border-blue-100/60'
                    }`}>
                      {doc.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

