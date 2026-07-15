import { useState } from 'react';
import type { EmployeeDashboardData } from '../types/attendance';

// Extends types locally to hold monthly variations and activity logs
interface PunchHistoryLog {
  timestamp: string;
  action: 'clock in' | 'clock out';
  method: string;
  location: string;
  status: 'synced' | 'overridden';
}

export default function Dashboard() {
  // Navigation array tracking layout cycles
  const months = ["January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026"];
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(months.length - 1); // Defaults to latest month

  // Interactive punch console states
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [punchMessage, setPunchMessage] = useState<string>('');

  const dashboardData: EmployeeDashboardData = {
    user: {
      name: "Nancy",
      location: "Nairobi HQ",
      department: "Engineering department"
    },
    stats: [
      { label: "LEAVE BALANCE", value: "12 days" },
      { label: "ATTENDANCE THIS MONTH", value: "98.2%" },
      { label: "NEXT APPRAISAL", value: "8 Jul" },
      { label: "PENDING REQUESTS", value: 2 },
    ],
    calendarDays: [
      { dayNumber: 1, status: 'attended' }, { dayNumber: 2, status: 'attended' },
      { dayNumber: 3, status: 'attended' }, { dayNumber: 4, status: 'attended' },
      { dayNumber: 5, status: 'missed' },   { dayNumber: 6, status: 'attended' },
      { dayNumber: 7, status: 'attended' }, { dayNumber: 8, status: 'attended' },
      { dayNumber: 9, status: 'attended' }, { dayNumber: 10, status: 'attended' },
      { dayNumber: 11, status: 'attended' }, { dayNumber: 12, status: 'attended' },
      { dayNumber: 13, status: 'attended' }, { dayNumber: 14, status: 'attended' },
      { dayNumber: 15, status: 'attended' }, { dayNumber: 16, status: 'attended' },
      { dayNumber: 17, status: 'attended' }, { dayNumber: 18, status: 'attended' },
      { dayNumber: 19, status: 'attended' }, { dayNumber: 20, status: 'attended' },
      { dayNumber: 21, status: 'attended' }, { dayNumber: 22, status: 'attended' },
      { dayNumber: 23, status: 'attended' }, { dayNumber: 24, status: 'attended' },
      { dayNumber: 25, status: 'attended' }, { dayNumber: 26, status: 'attended' },
      { dayNumber: 27, status: 'attended' }, { dayNumber: 28, status: 'attended' },
      { dayNumber: 29, status: 'attended' }, { dayNumber: 30, status: 'pending' },
      { dayNumber: 31, status: 'empty' }
    ],
    actions: [],
    timeline: []
  };

  // Mock historic punch events list ready for your dynamic backend hooks payload mapping
  const historicalLogs: PunchHistoryLog[] = [
    { timestamp: "30 Jun, 17:12", action: "clock out", method: "Fingerprint scanner", location: "Nairobi HQ - Wing B", status: "synced" },
    { timestamp: "30 Jun, 07:58", action: "clock in", method: "Biometric Facial", location: "Nairobi HQ - Main Gate", status: "synced" },
    { timestamp: "29 Jun, 17:05", action: "clock out", method: "GPS mobile app", location: "Remote - Client Site", status: "overridden" },
    { timestamp: "29 Jun, 08:31", action: "clock in", method: "Manual Override Panel", location: "Nairobi HQ - Wing B", status: "overridden" }
  ];

  const handleManualPunch = (type: 'in' | 'out') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (type === 'in') {
      setIsClockedIn(true);
      setPunchMessage(`Manual Clock In recorded at ${time}. Flagged for HR regularisation.`);
    } else {
      setIsClockedIn(false);
      setPunchMessage(`Manual Clock Out recorded at ${time}. Flagged for HR regularisation.`);
    }
    setTimeout(() => setPunchMessage(''), 5000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10 selection:bg-transparent">
      
      {/* Welcome Heading Banner */}
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-900 tracking-tight">Welcome back, {dashboardData.user.name}</h2>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          {dashboardData.user.location}, {dashboardData.user.department}
        </p>
      </div>

      {/* KPI Stats Top Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dashboardData.stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[110px]">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              {stat.label}
            </span>
            <span className="text-3xl font-light text-slate-800 mt-2 block">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Primary Row Content: Biometric System Override & Calendar Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        
        {/* Attendance Grid Tracking Calendar Matrix (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[330px] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-50">
            
            {/* Month Paging Navigation Buttons Block */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentMonthIdx(prev => Math.max(0, prev - 1))}
                disabled={currentMonthIdx === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 font-bold hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm outline-none"
              >
                ‹
              </button>
              <h3 className="text-sm font-semibold text-slate-800 min-w-[100px] text-center">
                {months[currentMonthIdx]}
              </h3>
              <button 
                onClick={() => setCurrentMonthIdx(prev => Math.min(months.length - 1, prev + 1))}
                disabled={currentMonthIdx === months.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 font-bold hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm outline-none"
              >
                ›
              </button>
            </div>

            {/* Visual Legend Indicator Pills */}
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 select-none">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Absent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Processing</span>
            </div>
          </div>

          {/* Calendar Days Output Block */}
          <div className="grid grid-cols-7 gap-3 text-center text-xs flex-1 items-center pb-2">
            {dashboardData.calendarDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-semibold transition-all select-none border ${
                  day.status === 'attended' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  day.status === 'missed' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  day.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-slate-50 text-slate-300 border-slate-100 opacity-40 cursor-not-allowed'
                }`}>
                  {day.dayNumber}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biometric Failure / Punch Override Controller Panel Block */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[330px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2 mb-4">
              Biometric override console
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4">
              If physical scanner systems fail to register your punch protocols, execute a geo-validated manual backup record down below.
            </p>
            
            {/* Transient Success Feedback Messages Banner */}
            {punchMessage && (
              <div className="p-3 mb-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-[11px] font-medium leading-normal animate-in fade-in duration-200">
                {punchMessage}
              </div>
            )}
          </div>

          {/* Interactive Trigger Button Elements */}
          <div className="flex gap-3 mb-1 select-none">
            {!isClockedIn ? (
              <button 
                onClick={() => handleManualPunch('in')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl shadow-sm transition outline-none"
              >
                Manual clock in
              </button>
            ) : (
              <button 
                onClick={() => handleManualPunch('out')}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl shadow-sm transition outline-none"
              >
                Manual clock out
              </button>
            )}
          </div>
        </div>

      </div>
          {/* Secondary Bottom Row: Detailed Day-by-Day Activity Logs Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 px-8 border-b border-slate-100 bg-white">
          <h3 className="text-sm font-semibold text-slate-800">Punch activity logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="p-4.5 pl-8 font-bold">TIMESTAMP</th>
                <th className="p-4.5 font-bold">ACTION</th>
                <th className="p-4.5 font-bold">VERIFICATION METHOD</th>
                <th className="p-4.5 font-bold">TERMINAL LOCATION</th>
                <th className="p-4.5 pr-8 text-right font-bold">SYNC STATUS</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-50 font-normal">
              {historicalLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4.5 pl-8 font-mono tracking-wide text-slate-700">{log.timestamp}</td>
                  <td className="p-4.5 font-semibold uppercase text-[10px] text-slate-800">
                    <span className={log.action === 'clock in' ? 'text-emerald-600' : 'text-slate-500'}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4.5 text-slate-500 font-medium">{log.method}</td>
                  <td className="p-4.5 text-slate-400 font-medium">{log.location}</td>
                  
                  {/* Status Badge Columns matching core app style frameworks */}
                  <td className="p-4.5 pr-8 text-right">
                    <span className={`inline-block font-bold text-[9px] px-2 py-0.5 border rounded uppercase tracking-wide select-none ${
                      log.status === 'synced' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' : 'bg-blue-50 text-blue-700 border-blue-100/60'
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

