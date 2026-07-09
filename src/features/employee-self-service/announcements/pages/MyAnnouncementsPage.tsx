import { useState } from 'react';
import type { Announcement } from '../types/announcements';

export default function MyAnnouncements() {
  // Master tracking array representing state-bound announcement logs ready for API replacement
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ANN-101",
      title: "Q3 Statutory Compliance & Tax Declaration Refresher",
      content: "All engineering department personnel must verify and append signatures to the revised KRA policy forms before the payroll system migration locks. Failure to submit within the review window logs a mandatory pipeline exception.",
      senderRole: "HR Operations",
      senderName: "Mary Chebet",
      dateSent: "Today, 08:30 AM",
      deadline: "10 Jul 2026",
      isRead: false
    },
    {
      id: "ANN-102",
      title: "Nairobi HQ Main Wing Fiber Network Upgrade Downtime",
      content: "Central IT operations will schedule server room physical maintenance loops this coming weekend. Core local local networks will experience structural drops. Plan remote work task assignments accordingly.",
      senderRole: "Branch Manager",
      senderName: "Peter Kariuki",
      dateSent: "Yesterday, 02:15 PM",
      isRead: false
    },
    {
      id: "ANN-103",
      title: "Mandatory Team Alignment Sync: Remote Log Protocols",
      content: "Our upcoming scrum review will evaluate biometric backup overrides and geofence tolerance margins. Ensure your weekly milestones are posted ahead of the calibration block lock.",
      senderRole: "Department Head",
      senderName: "Alice Njoki",
      dateSent: "3 Jul 2026",
      deadline: "12 Jul 2026",
      isRead: true
    }
  ]);

  // Drawer modal layout state controllers tracking selections
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Controller 1: Global state patch to mark all objects as acknowledged
  const handleMarkAllRead = () => {
    setAnnouncements(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  // Controller 2: Target item activation drawer click handler forcing an inline read flag state update
  const handleOpenAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncements(prev =>
      prev.map(item => item.id === announcement.id ? { ...item, isRead: true } : item)
    );
  };

  // Calculate unread totals to display inside header context metrics dynamically
  const unreadCount = announcements.filter(item => !item.isRead).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent relative h-full flex flex-col">
      
      {/* 1. Header Information Context Control Bar */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 shrink-0">
        <div>
          <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">My announcements</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            Broadcast directives from administration authorities • <span className="text-indigo-600 font-bold">{unreadCount} unread broadcast signals</span>
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto outline-none"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* 2. Main Announcement Feed Ledger Box */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-6 px-8 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-sm font-semibold text-slate-800">Inbox bulletins</h3>
        </div>

        <div className="divide-y divide-slate-100/70 overflow-y-auto flex-1 px-8">
          {announcements.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenAnnouncement(item)}
              className={`py-5.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition relative -mx-8 px-8 border-l-2 ${
                !item.isRead 
                  ? 'bg-slate-50/40 border-l-amber-500 font-medium' 
                  : 'border-l-transparent hover:bg-slate-50/20'
              }`}
            >
              {/* Left Segment: Meta Authors and Titles */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold tracking-wide uppercase">
                  {/* Origin Badging dynamic styling triggers */}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                    item.senderRole === 'HR Operations' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/40' :
                    item.senderRole === 'Branch Manager' ? 'bg-blue-50 text-blue-700 border border-blue-100/40' :
                    'bg-slate-100 text-slate-700 border border-slate-200/40'
                  }`}>
                    {item.senderRole}
                  </span>
                  <span className="text-slate-400 font-medium">issued by {item.senderName} • {item.dateSent}</span>
                </div>
                
                <h4 className={`text-xs tracking-tight transition-colors leading-snug ${
                  !item.isRead ? 'text-slate-900 font-bold' : 'text-slate-700 font-normal'
                }`}>
                  {item.title}
                </h4>
              </div>

              {/* Right Segment: Deadline Indicators */}
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center select-none text-[10px]">
                {item.deadline && (
                  <span className="font-bold px-2 py-0.5 rounded text-orange-700 bg-orange-50 border border-orange-100/60 tracking-wide lowercase">
                    due: {item.deadline}
                  </span>
                )}
                
                {/* Visual Unread Active Tracker Circle Dot Node */}
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shrink-0 block mx-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIDE-DRAWER DRAWER PANEL INTERFACES OVERLAY */}
      {selectedAnnouncement && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
          {/* Main Backdrop click area to lock out element panel frames */}
          <div className="flex-1" onClick={() => setSelectedAnnouncement(null)} />
          
          {/* Active Container Drawer Panel */}
          <div className="w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header Close Row Component */}
              <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {selectedAnnouncement.id}
                </span>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 font-bold hover:text-slate-800 transition shadow-sm outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Core Text Layout Elements */}
              <div className="p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase mb-3">
                    <span className="bg-[#0d1424] text-white px-2 py-0.5 rounded">
                      {selectedAnnouncement.senderRole}
                    </span>
                    <span className="text-slate-400">{selectedAnnouncement.senderName} • {selectedAnnouncement.dateSent}</span>
                  </div>
                  <h3 className="text-base font-serif font-normal text-slate-900 tracking-tight leading-snug">
                    {selectedAnnouncement.title}
                  </h3>
                </div>

                {/* Main Narrative Block Body description strings */}
                <p className="text-xs text-slate-600 font-normal leading-relaxed whitespace-pre-wrap bg-slate-50/40 p-5 rounded-xl border border-slate-100">
                  {selectedAnnouncement.content}
                </p>

                {/* Nested Urgency Action Tracking Warning if deadlines exist */}
                {selectedAnnouncement.deadline && (
                  <div className="p-4 bg-orange-50 border border-orange-100 text-orange-800 rounded-xl text-xs font-semibold leading-normal">
                    ⚠️ Required compliance timeline marker is mapped to this broadcast request. Please execute completion parameters before <span className="font-bold underline">{selectedAnnouncement.deadline}</span>.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Panel Acknowledgement Information Lock Node */}
            <div className="p-6 px-8 border-t border-slate-50 bg-slate-50/30 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                                className="bg-[#0d1424] hover:bg-slate-900 text-white font-semibold text-[10px] py-2.5 px-6 rounded-xl transition tracking-widest uppercase outline-none shadow-sm"
              >
                Acknowledge Directive
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

