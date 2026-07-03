import { useState } from 'react';
import type { EmployeeDashboardData, AssignedTask } from '../types/dashboard';
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData>({
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
    actions: [
      { title: "Check in", description: "GPS-verified attendance" },
      { title: "Request leave", description: "Annual, sick, compassionate" },
      { title: "View payslip", description: "June 2026 available" },
      { title: "My training", description: "1 mandatory pending" },
      { title: "File complaint", description: "Confidential submission" },
      { title: "Ask HR bot", description: "Leave, pay, policies" },
    ],
    timeline: [
      { date: "Mar 2022", title: "Joined Engineering", description: "Onboarded into Nairobi HQ grade E4" },
      { date: "Apr 2024", title: "Promoted to Senior", description: "Salary revised to band E4-upper" },
      { date: "Jun 2026", title: "Annual review open", description: "Self-review due 8 Jul" },
    ],
    // Primary mutable task registry data metrics
    tasks: [
      { id: "TSK-401", title: "Update tax computation module documentation", dueDate: "10 Jul", assignedBy: "Alice Njoki", status: "in progress" },
      { id: "TSK-405", title: "Review new team member onboarding access tickets", dueDate: "14 Jul", assignedBy: "Alice Njoki", status: "pending" },
      { id: "TSK-392", title: "Acknowledge updated remote work policy guidelines", dueDate: "30 Jun", assignedBy: "Alice Njoki", status: "completed" }
    ]
  });

  // Safe progressive workflow logic updater block
  const handleStatusChange = (id: string, nextStatus: 'in progress' | 'completed') => {
    setDashboardData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, status: nextStatus } : task
      )
    }));
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

      {/* Bottom Layout Architecture Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column Stack: Houses Quick Actions + Tasks Assigned Workspace Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Panel Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-6">Quick actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dashboardData.actions.map((action, idx) => (
                <button 
                  key={idx} 
                  className="border border-slate-100 bg-white hover:bg-slate-50 rounded-xl p-5 text-left transition min-h-[100px] flex flex-col justify-between outline-none"
                >
                  <h4 className="text-sm font-bold text-slate-800">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tasks Assigned Section Block */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-2">
              Tasks assigned
            </h3>
            
            {/* Task Rows List Container */}
            <div className="divide-y divide-slate-100/60">
              {dashboardData.tasks.map((task) => (
                <div key={task.id} className="py-4.5 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Assigned by: <span className="text-slate-500 font-semibold">{task.assignedBy}</span> • Due: <span className="font-semibold text-slate-500">{task.dueDate}</span>
                    </p>
                  </div>

                  {/* Interactive Status Dropdown Workflow Interface Selection Block */}
                  <div className="shrink-0 select-none">
                    {task.status === 'completed' ? (
                      /* Immutable Locked State Component styling once final resolution triggers */
                      <span className="inline-block text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-emerald-50 text-emerald-700 border-emerald-100/60 tracking-wide">
                        completed
                      </span>
                    ) : task.status === 'in progress' ? (
                      /* Progressive Option Selection Restricted Strictly to Completed Pushing Forward */
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-blue-50 text-blue-700 border-blue-100/60 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all tracking-wide outline-none relative group"
                      >
                        <span className="group-hover:hidden">in progress</span>
                        <span className="hidden group-hover:inline">mark complete?</span>
                      </button>
                    ) : (
                      /* Initial Pending Phase Trigger Drop block allowing upgrade into active execution tracks */
                      <button
                        onClick={() => handleStatusChange(task.id, 'in progress')}
                        className="text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-orange-50 text-orange-700 border-orange-100/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all tracking-wide outline-none relative group"
                      >
                        <span className="group-hover:hidden">pending</span>
                        <span className="hidden group-hover:inline">start task?</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Stack: Timeline Feed Card Sidebar */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[380px]">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">My timeline</h3>
          <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-8">
            {dashboardData.timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-4 ring-white" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">
                  {event.date}
                </span>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
