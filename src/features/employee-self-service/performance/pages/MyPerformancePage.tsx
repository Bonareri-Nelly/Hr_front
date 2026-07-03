import { useState } from 'react';
import type { MyPerformanceData } from '../types/performance';

export default function MyPerformance() {
  // Comprehensive mock data block matching the weighted scoring model and feature requirements
  const performanceData: MyPerformanceData = {
    overallScore: 4.2,
    maxOverallScore: 5.0,
    ratingBand: "Exceeds Expectations",
    trend: "improved",
    daysRemaining: 5,
    nextReviewDate: "8 Jul 2026",
    breakdown: [
      { label: "Goal Achievement", weight: 40, score: 4.5, maxScore: 5.0, summary: "Strong execution across core features." },
      { label: "Competency Rating", weight: 30, score: 4.0, maxScore: 5.0, summary: "Solid leadership and code quality skills." },
      { label: "Attendance History", weight: 15, score: 4.9, maxScore: 5.0, summary: "Excellent presence consistency this month." },
      { label: "Manager Feedback", weight: 15, score: 3.8, maxScore: 5.0, summary: "Constructive collaboration metrics registered." }
    ],
    goals: [
      { id: "G-101", title: "Ship authentication module integration paths", progress: 100, status: "completed" },
      { id: "G-102", title: "Mentor two internal junior frontend engineers", progress: 65, status: "in progress" },
      { id: "G-103", title: "Reduce total production deploy layout time by 20%", progress: 40, status: "at risk" }
    ],
    competencies: [
      { name: "Technical Communication", rating: 4.5, managerComment: "Articulates architecture changes clearly to Python teams.", suggestedTraining: "Advanced System Design Docs" },
      { name: "Team Alignment & Synergy", rating: 4.0, managerComment: "Always supportive during blocker resolution sessions.", suggestedTraining: "Collaborative Git Workflows" },
      { name: "Problem Solving Velocity", rating: 3.5, managerComment: "Good delivery, focus on narrowing debugging loops.", suggestedTraining: "Chrome DevTools Optimization Mastery" }
    ],
    managerFeedback: "Excellent technical depth, actively supports team growth. Highly dependable during the June payroll release cycle.",
    incrementEligible: true,
    history: [
      { cycle: "Jun 2025 cycle", score: 3.8, milestone: "Joined Nairobi HQ" },
      { cycle: "Dec 2025 cycle", score: 4.0, milestone: "Promoted to Senior" },
      { cycle: "Jun 2026 cycle", score: 4.2, milestone: "Annual Review Window Open" }
    ]
  };

  // State Management for Interactive/Unique Features
  const [activeExpandedComponent, setActiveExpandedComponent] = useState<string | null>(null);
  const [selfAssessmentText, setSelfAssessmentText] = useState<string>('');
  const [isSelfAssessmentSubmitted, setIsSelfAssessmentSubmitted] = useState<boolean>(false);
  const [privateReflectionText, setPrivateReflectionText] = useState<string>('');
  const [isReviewAcknowledged, setIsReviewAcknowledged] = useState<boolean>(false);
  const [acknowledgementComment, setAcknowledgementComment] = useState<string>('');

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent font-sans">
      
      {/* PAGE HEADER SECTION */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">My performance</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            First-person growth story, transparent metrics, feedback loops, and development indicators
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto outline-none"
        >
          Export performance summary (PDF)
        </button>
      </div>

      {/* SECTION 1: PERFORMANCE SNAPSHOT & EXPLAINER INSIGHT BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Large Score Card Gauge Layout */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">OVERALL APPRAISAL RATING</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100/60 lowercase">
              {performanceData.ratingBand}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-[54px] font-light text-slate-800 tracking-tighter leading-none">
              {performanceData.overallScore.toFixed(1)}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              / {performanceData.maxOverallScore.toFixed(1)}
            </span>
            <span className="text-emerald-500 font-bold text-sm tracking-tight ml-2">
              ↑ improved
            </span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-2 pt-2 border-t border-slate-50">
            {performanceData.daysRemaining} days left in cycle • next review: {performanceData.nextReviewDate}
          </div>
        </div>

        {/* Unique Feature: Plain-Language "What's driving your score" Explainer */}
        <div className="lg:col-span-2 bg-slate-900 text-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">What's driving your score</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed pr-4">
              Your overall rating is currently strong at <span className="text-white font-bold">{performanceData.overallScore}</span>, mainly powered by high objective completion metrics inside the engineering roadmap. Your attendance metrics remain perfect. Note that expanding collaboration scores before your next review window on {performanceData.nextReviewDate} will secure visibility optimization traits.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">
            Automated insight client engine • secure view-only
          </div>
        </div>
      </div>

      {/* SECTION 2 & SECTION 3: SCORE BREAKDOWN GRID & GOAL SETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
        
        {/* Score Breakdown (Weighted Components) Container Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[360px]">
          <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-3 mb-4">Score breakdown</h3>
          <div className="space-y-4">
            {performanceData.breakdown.map((item, idx) => {
              const percentage = (item.score / item.maxScore) * 100;
              const isExpanded = activeExpandedComponent === item.label;
              return (
                <div key={idx} className="border border-slate-50 bg-slate-50/20 p-3.5 rounded-xl cursor-pointer hover:border-slate-100 transition" onClick={() => setActiveExpandedComponent(isExpanded ? null : item.label)}>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                    <span className="text-slate-700">{item.label} <span className="text-[10px] text-slate-400 font-normal font-mono">({item.weight}%)</span></span>
                    <span className="text-slate-600 font-mono">{item.score} / {item.maxScore}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                  </div>
                  {isExpanded && (
                    <p className="text-[11px] text-slate-400 mt-2 font-medium bg-white p-2 rounded border border-slate-50/50 animate-in fade-in duration-150 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals & KPIs Tracker Card Segment */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[360px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-800">Goals & KPIs</h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 active metrics</span>
            </div>
            
            <div className="space-y-4">
              {performanceData.goals.map((goal) => (
                <div key={goal.id} className="text-xs">
                  <div className="flex justify-between items-start mb-1 font-medium">
                    <span className="text-slate-700 max-w-[70%] font-semibold leading-tight">{goal.title}</span>
                    <span className={`inline-block font-bold text-[9px] px-2 py-0.5 rounded border lowercase tracking-wide select-none ${
                      goal.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' :
                      goal.status === 'in progress' ? 'bg-blue-50 text-blue-700 border-blue-100/60' :
                      'bg-orange-50 text-orange-700 border-orange-100/60'
                    }`}>
                      {goal.status}
                                        </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Unique Feature: Check-in Nudge Prompt Wrapper */}
          <div className="mt-4 pt-3 border-t border-slate-50 text-center">
            <p className="text-[10px] font-medium text-slate-400 italic">Have an intermediate update? Complete regular project check-ins via your target timeline workflows.</p>
          </div>
        </div>

      </div>

      {/* SECTION 4 & SECTION 5: COMPETENCIES, SUGGESTED TRAINING & FEEDBACK MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        
        {/* Competency Ratings and Training Hub Tie-Ins (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px]">
          <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-3 mb-4">Competency evaluation & growth links</h3>
          <div className="divide-y divide-slate-50 text-xs">
            {performanceData.competencies.map((comp, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-center mb-1 font-semibold">
                  <span className="text-slate-800">{comp.name}</span>
                  <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{comp.rating.toFixed(1)} / 5.0</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed italic mb-2">" {comp.managerComment} "</p>
                {/* Pulling Dynamic Suggestions directly from the internal training hub matrix */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50/40 p-1.5 px-3 rounded-lg w-fit border border-indigo-100/30">
                  <span>🎓 Recommended training link:</span>
                  <span className="underline cursor-pointer hover:text-indigo-800">{comp.suggestedTraining}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section Block containing Static and Submission review forms */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-3 mb-4">Feedback & Self-review</h3>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-4 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Manager evaluation narrative</h4>
              <p className="text-slate-600 leading-relaxed font-normal">"{performanceData.managerFeedback}"</p>
            </div>
          </div>

          {/* Interactive Self Assessment input block element textareas */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Your Cycle Self-Assessment</label>
            <textarea
              rows={3}
              disabled={isSelfAssessmentSubmitted}
              value={selfAssessmentText}
              onChange={(e) => setSelfAssessmentText(e.target.value)}
              placeholder="Record your achievements and self-reflections for this window..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-amber-500 transition disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-none leading-relaxed"
            />
            {!isSelfAssessmentSubmitted ? (
              <button 
                onClick={() => { if(selfAssessmentText.trim()) setIsSelfAssessmentSubmitted(true); }}
                className="w-full bg-[#0d1424] hover:bg-slate-900 text-white font-semibold text-[10px] uppercase tracking-widest py-2 rounded-xl shadow-sm transition outline-none"
              >
                Submit Self-Review
              </button>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-2 text-center block select-none">
                ✓ Self-review locked & submitted to HR manager
              </span>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 6 & UNIQUE FEATURES: PERFORMANCE MOVEMENT TIMELINE & PERSONAL JOURNAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        
        {/* Growth Trend Historical Matrix Block (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[290px]">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">Performance growth trajectory</h3>
            {/* Promotion Eligibility indicator flag tie-in element block */}
            {performanceData.incrementEligible && (
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 rounded px-2 py-0.5 uppercase tracking-wider animate-pulse">
                Eligible for Annual Increment Review
              </span>
            )}
          </div>
          
          {/* Sequential Trajectory Nodes mapping historic reviews securely */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {performanceData.history.map((hist, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 text-center flex flex-col justify-between min-h-[110px]">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">{hist.cycle}</span>
                <span className="text-3xl font-light text-slate-800 tracking-tight block my-1">{hist.score.toFixed(1)}</span>
                <span className="text-[11px] font-medium text-slate-500 block truncate">{hist.milestone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Feature: Private Reflection Space (Journal completely unseen by manager) */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm min-h-[290px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2 mb-3">Private reflection space</h3>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed mb-3">
              This sandbox area is a personal journal <span className="font-semibold text-slate-700">completely invisible to your manager or HR admins</span>. Use it to freely scratch metrics, questions, or notes ahead of feedback syncs.
            </p>
          </div>
          <textarea
            rows={4}
            value={privateReflectionText}
            onChange={(e) => setPrivateReflectionText(e.target.value)}
            placeholder="Jot down notes or reflections for yourself here..."
            className="w-full bg-slate-50/40 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-amber-500 transition resize-none leading-relaxed flex-1"
          />
        </div>

      </div>

      {/* COMPLIANCE ACKNOWLEDGEMENT FOOTER BANNER SECTION */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-4">Official cycle acknowledgement</h3>
        {!isReviewAcknowledged ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-normal">
              By confirming acknowledgement below, you verify that you have officially read and reviewed this performance appraisal cycle payload computation dataset alongside your structural reporting matrix head.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Optional feedback comments back to your reporting manager..."
                value={acknowledgementComment}
                onChange={(e) => setAcknowledgementComment(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition"
              />
              <button
                onClick={() => setIsReviewAcknowledged(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl transition shadow-sm outline-none whitespace-nowrap"
              >
                Acknowledge Review Received
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 select-none">
            <div>
              <p>✓ Appraisal Cycle Certified & Formally Acknowledged</p>
              {acknowledgementComment.trim() && (
                                <p className="text-[11px] font-normal text-emerald-600 mt-1">Returned note: "{acknowledgementComment.trim()}"</p>
              )}
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-white border border-emerald-100/60 p-1 px-2.5 rounded-md">
              SIGNED: {new Date().toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}


