import { useState } from 'react';
import { usePerformance } from '../../../hooks';
import {
  TrendingUp, Target, Star, Calendar, Users, Award, Clock, CheckCircle,
  AlertCircle, X, Plus, Search, Filter, ChevronDown, ChevronRight,
  Eye, Edit, Trash2, FileText, User, Building2, BarChart3, PieChart,
  Activity, Bell, Send, MessageSquare, UserCheck, UserX, RefreshCw,
  Download, FileSpreadsheet, File, Settings, HelpCircle, Flag, Crown,
  Briefcase, StarIcon, TrendingDown, TrendingUpIcon, Minus, Check,
  ArrowUp, ArrowDown, MoreVertical, CalendarDays, CheckSquare,
  ClipboardList, UsersRound, LayoutDashboard, Sparkles, Lightbulb,
  TargetIcon, Megaphone, Gift, Medal, Trophy, Zap, Flame, Compass,
  AwardIcon
} from 'lucide-react';

type CycleStatus = 'not_started' | 'in_progress' | 'completed';
type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'missed' | 'carried_forward';
type ReviewType = 'self' | 'manager' | 'peer' | 'cross_functional';
type UserRole = 'employee' | 'department_head' | 'branch_manager' | 'branch_hr_admin' | 'executive' | 'system_admin';

interface Goal {
  id: string; title: string; description: string; target: string; dueDate: string;
  status: GoalStatus; progress: number; createdBy: string; createdAt: string;
  updatedAt: string; changeLog: { date: string; field: string; oldValue: string; newValue: string }[];
}
interface Review {
  id: string; type: ReviewType; reviewerName: string; revieweeName: string;
  rating: number | null; comments: string; submittedAt: string | null;
  status: 'pending' | 'submitted' | 'overdue'; isAnonymous: boolean;
}
interface AppraisalCycle {
  id: string; name: string; description: string; startDate: string; endDate: string;
  reviewPeriod: string; status: CycleStatus; scope: 'org_wide' | 'branch' | 'department';
  scopeId: string | null; ratingScale: { value: number; label: string }[];
  has360Feedback: boolean; reminderFrequency: number; employees: string[];
  employeeStatus: { employeeId: string; status: CycleStatus }[];
  createdAt: string; createdBy: string;
}
interface EmployeePerformance {
  employeeId: string; employeeName: string; department: string; branch: string;
  role: string; goals: Goal[]; reviews: Review[];
  ratingHistory: { cycleId: string; cycleName: string; rating: number; date: string }[];
  currentCycleStatus: CycleStatus;
}

const getGoalStatusColor = (status: GoalStatus) => ({
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  achieved: 'bg-green-100 text-green-700',
  missed: 'bg-red-100 text-red-700',
  carried_forward: 'bg-amber-100 text-amber-700',
}[status] || 'bg-gray-100 text-gray-700');

const getGoalStatusIcon = (status: GoalStatus) => ({
  not_started: Clock,
  in_progress: Activity,
  achieved: CheckCircle,
  missed: X,
  carried_forward: RefreshCw,
}[status] || Clock);

const getCycleStatusColor = (status: CycleStatus) => ({
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}[status] || 'bg-gray-100 text-gray-700');

const getCycleStatusIcon = (status: CycleStatus) => ({
  not_started: Clock,
  in_progress: Activity,
  completed: CheckCircle,
}[status] || Clock);

function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const Icon = getGoalStatusIcon(status);
  const color = getGoalStatusColor(status);
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}><Icon className="w-3 h-3" />{status.replace('_', ' ').toUpperCase()}</span>;
}

function CycleStatusBadge({ status }: { status: CycleStatus }) {
  const Icon = getCycleStatusIcon(status);
  const color = getCycleStatusColor(status);
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}><Icon className="w-3 h-3" />{status.replace('_', ' ').toUpperCase()}</span>;
}

function Toast({ message, type, onClose }: any) {
  const colors = { success: 'bg-green-50 text-green-700 border-green-200', error: 'bg-red-50 text-red-700 border-red-200', info: 'bg-blue-50 text-blue-700 border-blue-200' };
  return <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type] || colors.info}`}><span className="text-sm">{message}</span><button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button></div>;
}

function CyclesTab({ cycles, setCycles, role, onShowToast }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCycle, setNewCycle] = useState({ name: '', description: '', startDate: '', endDate: '', reviewPeriod: '', scope: 'org_wide' as any, has360Feedback: false, reminderFrequency: 7 });
  const canManageCycles = role === 'branch_hr_admin' || role === 'system_admin';
  const handleCreateCycle = () => {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) { onShowToast('Please fill in all required fields.', 'error'); return; }
    const cycle: AppraisalCycle = {
      id: `c${Date.now()}`,
      name: newCycle.name, description: newCycle.description || 'No description provided.',
      startDate: newCycle.startDate, endDate: newCycle.endDate,
      reviewPeriod: newCycle.reviewPeriod || `${newCycle.startDate} to ${newCycle.endDate}`,
      status: 'not_started', scope: newCycle.scope, scopeId: null,
      ratingScale: [{ value: 1, label: 'Needs Improvement' }, { value: 2, label: 'Below Expectations' }, { value: 3, label: 'Meets Expectations' }, { value: 4, label: 'Exceeds Expectations' }, { value: 5, label: 'Exceptional' }],
      has360Feedback: newCycle.has360Feedback, reminderFrequency: newCycle.reminderFrequency,
      employees: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'],
      employeeStatus: ['emp1', 'emp2', 'emp3', 'emp4', 'emp5', 'emp6'].map(id => ({ employeeId: id, status: 'not_started' })),
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'HR Admin',
    };
    setCycles([cycle, ...cycles]);
    setIsCreating(false); setNewCycle({ name: '', description: '', startDate: '', endDate: '', reviewPeriod: '', scope: 'org_wide', has360Feedback: false, reminderFrequency: 7 });
    onShowToast('Appraisal cycle created successfully!', 'success');
  };
  const getEmployeeCount = (cycle: AppraisalCycle) => cycle.employees.length;
  const getCompletionRate = (cycle: AppraisalCycle) => Math.round((cycle.employeeStatus.filter(e => e.status === 'completed').length / cycle.employeeStatus.length) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-semibold text-gray-900">Appraisal Cycles</h2>{canManageCycles && <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"><Plus className="w-4 h-4" /> New Cycle</button>}</div>
      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-700" /> Create New Appraisal Cycle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cycle Name *</label><input type="text" value={newCycle.name} onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })} placeholder="e.g., Annual Performance Review 2026" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" value={newCycle.description} onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })} placeholder="e.g., Full-year performance review" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label><input type="date" value={newCycle.startDate} onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label><input type="date" value={newCycle.endDate} onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Scope</label><select value={newCycle.scope} onChange={(e) => setNewCycle({ ...newCycle, scope: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"><option value="org_wide">Organization-Wide</option><option value="branch">Branch-Specific</option><option value="department">Department-Specific</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Reminder Frequency (days)</label><input type="number" value={newCycle.reminderFrequency} onChange={(e) => setNewCycle({ ...newCycle, reminderFrequency: parseInt(e.target.value) || 7 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div className="col-span-full"><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={newCycle.has360Feedback} onChange={(e) => setNewCycle({ ...newCycle, has360Feedback: e.target.checked })} className="rounded border-gray-300 text-blue-700 focus:ring-blue-700" /> Enable 360-degree feedback (peer and cross-functional reviews)</label></div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200"><button onClick={handleCreateCycle} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition">Create Cycle</button><button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Cancel</button></div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {cycles.map((cycle: AppraisalCycle) => {
          const Icon = getCycleStatusIcon(cycle.status);
          const color = getCycleStatusColor(cycle.status);
          const completionRate = getCompletionRate(cycle);
          return (
            <div key={cycle.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3"><h4 className="font-semibold text-gray-900">{cycle.name}</h4><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}><Icon className="w-3 h-3" />{cycle.status.replace('_', ' ').toUpperCase()}</span></div>
                  <p className="text-sm text-gray-500 mt-1">{cycle.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span>📅 {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}</span>
                    <span>👥 {getEmployeeCount(cycle)} employees</span><span>📊 {completionRate}% complete</span>
                    <span>🔄 {cycle.scope.replace('_', ' ')}</span>{cycle.has360Feedback && <span>🔄 360° feedback</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canManageCycles && cycle.status !== 'completed' && <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => { /* API start cycle */ onShowToast(`Cycle "${cycle.name}" started`, 'success'); }}>Start</button>}
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Eye className="w-4 h-4 text-gray-500" /></button>
                  {canManageCycles && <button className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Edit className="w-4 h-4 text-gray-500" /></button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoalsTab({ employeePerformance, setEmployeePerformance, selectedEmployeeId, setSelectedEmployeeId, role, onShowToast }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target: '', dueDate: '' });
  const employees = Object.values(employeePerformance) as EmployeePerformance[];
  const displayEmployees = role === 'employee' ? employees.filter(e => e.employeeId === 'emp1') : role === 'department_head' ? employees.filter(e => e.department === 'Engineering') : employees;
  const selectedEmp = employeePerformance[selectedEmployeeId] || displayEmployees[0];
  const canCreateGoals = role === 'employee' || role === 'department_head';
  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.dueDate) { onShowToast('Please fill in all required fields.', 'error'); return; }
    if (!selectedEmp) return;
    const goal: Goal = {
      id: `g${Date.now()}`, title: newGoal.title, description: newGoal.description || '', target: newGoal.target || '',
      dueDate: newGoal.dueDate, status: 'not_started', progress: 0,
      createdBy: role === 'department_head' ? 'Department Head' : selectedEmp.employeeName,
      createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
      changeLog: [],
    };
    setEmployeePerformance({ ...employeePerformance, [selectedEmp.employeeId]: { ...selectedEmp, goals: [...(selectedEmp.goals || []), goal] } });
    setIsCreating(false); setNewGoal({ title: '', description: '', target: '', dueDate: '' });
    onShowToast('Goal created successfully!', 'success');
  };
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3"><h2 className="text-lg font-semibold text-gray-900">Goals</h2>{displayEmployees.length > 1 && <select value={selectedEmployeeId || ''} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700">{displayEmployees.map((e: EmployeePerformance) => <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>)}</select>}</div>
        {canCreateGoals && selectedEmp && <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"><Plus className="w-4 h-4" /> New Goal</button>}
      </div>
      {isCreating && selectedEmp && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-700" /> Create New Goal for {selectedEmp.employeeName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label><input type="text" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="e.g., Complete API Migration" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Target</label><input type="text" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="e.g., 100% completion" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div className="col-span-full"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} rows={2} placeholder="Describe the goal..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label><input type="date" value={newGoal.dueDate} onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200"><button onClick={handleCreateGoal} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition">Create Goal</button><button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Cancel</button></div>
        </div>
      )}
      {selectedEmp && selectedEmp.goals && selectedEmp.goals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {selectedEmp.goals.map((goal: Goal) => (
            <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3"><h4 className="font-semibold text-gray-900">{goal.title}</h4><GoalStatusBadge status={goal.status} /></div>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500"><span>🎯 Target: {goal.target}</span><span>📅 Due: {new Date(goal.dueDate).toLocaleDateString()}</span><span>📊 Progress: {goal.progress}%</span><span>👤 Created by: {goal.createdBy}</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${goal.progress}%` }} /></div>
                  {goal.changeLog.length > 0 && <div className="mt-2 text-xs text-gray-400"><span className="font-medium">Change Log:</span>{goal.changeLog.map((log, idx) => <span key={idx} className="ml-2">{log.field}: {log.oldValue} → {log.newValue}</span>)}</div>}
                </div>
                <div className="flex items-center gap-2">{role === 'employee' || role === 'department_head' ? <button className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Edit className="w-4 h-4 text-gray-500" /></button> : null}</div>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><Target className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No goals set for this employee.</p>{canCreateGoals && <p className="text-sm text-gray-400 mt-1">Click "New Goal" to create one.</p>}</div>}
    </div>
  );
}

function ReviewsTab({ employeePerformance, setEmployeePerformance, selectedEmployeeId, setSelectedEmployeeId, role, cycles, onShowToast }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 3, comments: '', type: 'self' as ReviewType });
  const employees = Object.values(employeePerformance) as EmployeePerformance[];
  const displayEmployees = role === 'employee' ? employees.filter(e => e.employeeId === 'emp1') : employees;
  const selectedEmp = employeePerformance[selectedEmployeeId] || displayEmployees[0];
  const canSubmitReview = role === 'employee' || role === 'department_head';
  const handleSubmitReview = () => {
    if (!selectedEmp) return;
    const newReview: Review = {
      id: `r${Date.now()}`, type: reviewData.type,
      reviewerName: role === 'employee' ? selectedEmp.employeeName : 'Department Head',
      revieweeName: selectedEmp.employeeName,
      rating: reviewData.rating, comments: reviewData.comments,
      submittedAt: new Date().toISOString().split('T')[0], status: 'submitted', isAnonymous: false,
    };
    setEmployeePerformance({ ...employeePerformance, [selectedEmp.employeeId]: { ...selectedEmp, reviews: [...(selectedEmp.reviews || []), newReview] } });
    setIsSubmitting(false); setReviewData({ rating: 3, comments: '', type: 'self' });
    onShowToast('Review submitted successfully!', 'success');
  };
  const getPendingReviews = (emp: EmployeePerformance) => emp.reviews?.filter((r: Review) => r.status === 'pending') || [];
  const getSubmittedReviews = (emp: EmployeePerformance) => emp.reviews?.filter((r: Review) => r.status === 'submitted') || [];
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3"><h2 className="text-lg font-semibold text-gray-900">Reviews</h2>{displayEmployees.length > 1 && <select value={selectedEmployeeId || ''} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700">{displayEmployees.map((e: EmployeePerformance) => <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>)}</select>}</div>
        {canSubmitReview && selectedEmp && <button onClick={() => setIsSubmitting(true)} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"><Star className="w-4 h-4" /> Submit Review</button>}
      </div>
      {isSubmitting && selectedEmp && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-blue-700" /> Submit Review for {selectedEmp.employeeName}</h3>
          <div className="grid grid-cols-1 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label><select value={reviewData.type} onChange={(e) => setReviewData({ ...reviewData, type: e.target.value as ReviewType })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"><option value="self">Self-Review</option><option value="manager">Manager Review</option><option value="peer">Peer Review</option><option value="cross_functional">Cross-Functional Review</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label><div className="flex gap-2">{[1,2,3,4,5].map(val => <button key={val} onClick={() => setReviewData({ ...reviewData, rating: val })} className={`w-10 h-10 rounded-lg border transition ${reviewData.rating === val ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'}`}>{val}</button>)}</div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Comments</label><textarea value={reviewData.comments} onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })} rows={4} placeholder="Provide detailed feedback..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700" /></div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200"><button onClick={handleSubmitReview} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition">Submit Review</button><button onClick={() => setIsSubmitting(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Cancel</button></div>
        </div>
      )}
      {selectedEmp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4"><h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Pending Reviews</h4>{getPendingReviews(selectedEmp).length > 0 ? <div className="space-y-3">{getPendingReviews(selectedEmp).map((review: Review) => <div key={review.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3"><p className="text-sm font-medium text-gray-800">{review.type.toUpperCase()} Review</p><p className="text-xs text-gray-500">From: {review.reviewerName}</p><button className="mt-2 text-xs text-blue-700 hover:underline">Complete Review →</button></div>)}</div> : <p className="text-sm text-gray-500">No pending reviews</p>}</div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Submitted Reviews</h4>{getSubmittedReviews(selectedEmp).length > 0 ? <div className="space-y-3">{getSubmittedReviews(selectedEmp).map((review: Review) => <div key={review.id} className="bg-green-50 border border-green-200 rounded-lg p-3"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-gray-800">{review.type.toUpperCase()} Review</p><p className="text-xs text-gray-500">Rating: {review.rating}/5</p></div><span className="text-xs text-green-600">{review.submittedAt}</span></div><p className="text-xs text-gray-600 mt-1">{review.comments}</p></div>)}</div> : <p className="text-sm text-gray-500">No reviews submitted yet</p>}</div>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ employeePerformance, selectedEmployeeId, setSelectedEmployeeId, role }: any) {
  const employees = Object.values(employeePerformance) as EmployeePerformance[];
  const displayEmployees = role === 'employee' ? employees.filter(e => e.employeeId === 'emp1') : employees;
  const selectedEmp = employeePerformance[selectedEmployeeId] || displayEmployees[0];
  const getTrend = (history: { rating: number; date: string }[]) => {
    if (history.length < 2) return 'stable';
    const last = history[history.length - 1].rating;
    const prev = history[history.length - 2].rating;
    if (last > prev) return 'improving';
    if (last < prev) return 'declining';
    return 'stable';
  };
  const getTrendColor = (trend: string) => ({ improving: 'text-green-600', declining: 'text-red-600', stable: 'text-amber-600' }[trend] || 'text-gray-600');
  const getTrendIcon = (trend: string) => ({ improving: TrendingUpIcon, declining: TrendingDown, stable: Minus }[trend] || Minus);
  return (
    <div>
      <div className="flex items-center gap-3 mb-6"><h2 className="text-lg font-semibold text-gray-900">Rating History</h2>{displayEmployees.length > 1 && <select value={selectedEmployeeId || ''} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-700">{displayEmployees.map((e: EmployeePerformance) => <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>)}</select>}</div>
      {selectedEmp && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div><p className="text-sm text-gray-500">Current Average Rating</p><p className="text-3xl font-bold text-gray-900">{selectedEmp.ratingHistory && selectedEmp.ratingHistory.length > 0 ? (selectedEmp.ratingHistory.reduce((sum: number, r: any) => sum + r.rating, 0) / selectedEmp.ratingHistory.length).toFixed(1) : 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Total Reviews</p><p className="text-2xl font-bold text-gray-900">{selectedEmp.ratingHistory?.length || 0}</p></div>
              <div><p className="text-sm text-gray-500">Trend</p>{(() => { const trend = getTrend(selectedEmp.ratingHistory || []); const Icon = getTrendIcon(trend); return <p className={`text-2xl font-bold ${getTrendColor(trend)} flex items-center gap-2`}><Icon className="w-6 h-6" />{trend.toUpperCase()}</p>; })()}</div>
            </div>
          </div>
          {selectedEmp.ratingHistory && selectedEmp.ratingHistory.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full"><thead><tr className="border-b border-gray-200 bg-gray-50"><th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Cycle</th><th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Date</th><th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Rating</th><th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Trend</th></tr></thead><tbody>{selectedEmp.ratingHistory.map((entry: any, idx: number) => { let trend = '—'; let trendColor = 'text-gray-500'; let trendIcon = null; if (idx > 0) { const prev = selectedEmp.ratingHistory[idx - 1].rating; if (entry.rating > prev) { trend = '↑'; trendColor = 'text-green-600'; trendIcon = <TrendingUpIcon className="w-3 h-3 inline" />; } else if (entry.rating < prev) { trend = '↓'; trendColor = 'text-red-600'; trendIcon = <TrendingDown className="w-3 h-3 inline" />; } else { trend = '→'; trendColor = 'text-amber-600'; trendIcon = <Minus className="w-3 h-3 inline" />; } } return <tr key={idx} className="border-b border-gray-100 last:border-0"><td className="py-3 px-4 text-sm text-gray-700">{entry.cycleName}</td><td className="py-3 px-4 text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</td><td className="py-3 px-4 text-sm font-medium text-gray-900">{entry.rating}/5</td><td className={`py-3 px-4 text-sm font-medium ${trendColor}`}>{trendIcon} {trend}</td></tr>; })}</tbody></table>
            </div>
          ) : <div className="bg-white border border-gray-200 rounded-xl p-12 text-center"><TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No rating history available.</p></div>}
        </div>
      )}
    </div>
  );
}

function DashboardTab({ employeePerformance, cycles, role }: any) {
  const employees = Object.values(employeePerformance) as EmployeePerformance[];
  const totalEmployees = employees.length;
  const activeCycles = cycles.filter((c: AppraisalCycle) => c.status === 'in_progress').length;
  const completedCycles = cycles.filter((c: AppraisalCycle) => c.status === 'completed').length;
  const pendingCycles = cycles.filter((c: AppraisalCycle) => c.status === 'not_started').length;
  const allRatings = employees.flatMap(e => e.ratingHistory || []).map((r: any) => r.rating);
  const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) : 0;
  const allGoals = employees.flatMap(e => e.goals || []);
  const completedGoals = allGoals.filter(g => g.status === 'achieved').length;
  const goalCompletionRate = allGoals.length > 0 ? Math.round((completedGoals / allGoals.length) * 100) : 0;
  const cycleCompletionRates = cycles.map((c: AppraisalCycle) => ({ name: c.name, rate: Math.round((c.employeeStatus.filter((e: any) => e.status === 'completed').length / c.employeeStatus.length) * 100) }));
  const departments = ['Engineering', 'Finance', 'HR', 'Sales', 'Operations', 'Customer Support'];
  const deptCompletionRates = departments.map(dept => ({ name: dept, rate: Math.round(50 + Math.random() * 45) }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500">Total Employees</p><p className="text-2xl font-bold text-gray-900">{totalEmployees}</p></div><div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-700" /></div></div></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500">Active Cycles</p><p className="text-2xl font-bold text-gray-900">{activeCycles}</p></div><div className="p-2 bg-green-50 rounded-lg"><Activity className="w-5 h-5 text-green-600" /></div></div></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500">Avg Rating</p><p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}/5</p></div><div className="p-2 bg-amber-50 rounded-lg"><Star className="w-5 h-5 text-amber-600" /></div></div></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500">Goal Completion</p><p className="text-2xl font-bold text-gray-900">{goalCompletionRate}%</p></div><div className="p-2 bg-purple-50 rounded-lg"><Target className="w-5 h-5 text-purple-600" /></div></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-700" /> Cycle Completion</h3><div className="space-y-3">{cycleCompletionRates.map((item: any, idx: number) => <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="text-gray-700">{item.name}</span><span className="text-gray-500">{item.rate}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${item.rate}%` }} /></div></div>)}</div></div>
        <div className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-700" /> Department Completion Rate</h3><div className="space-y-3">{deptCompletionRates.map((item: any, idx: number) => <div key={idx}><div className="flex justify-between text-sm mb-1"><span className="text-gray-700">{item.name}</span><span className="text-gray-500">{item.rate}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${item.rate}%` }} /></div></div>)}</div></div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-blue-700" /> Role-Specific Oversight</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div className="bg-blue-50 rounded-lg p-4"><p className="text-sm font-medium text-blue-700">Department Head</p><p className="text-xs text-blue-600 mt-1">Team completion: {Math.round(60 + Math.random() * 35)}%</p><p className="text-xs text-blue-600">Goal achievement: {Math.round(50 + Math.random() * 45)}%</p></div><div className="bg-purple-50 rounded-lg p-4"><p className="text-sm font-medium text-purple-700">Branch Manager</p><p className="text-xs text-purple-600 mt-1">Branch completion: {Math.round(55 + Math.random() * 40)}%</p><p className="text-xs text-purple-600">Rating distribution: 3.8 avg</p></div><div className="bg-green-50 rounded-lg p-4"><p className="text-sm font-medium text-green-700">HR Admin</p><p className="text-xs text-green-600 mt-1">Overdue reviews: {Math.floor(Math.random() * 5)}</p><p className="text-xs text-green-600">Escalations: {Math.floor(Math.random() * 3)}</p></div><div className="bg-amber-50 rounded-lg p-4"><p className="text-sm font-medium text-amber-700">Executive</p><p className="text-xs text-amber-600 mt-1">Cross-branch trend: {Math.random() > 0.5 ? '↑ Improving' : '→ Stable'}</p><p className="text-xs text-amber-600">Completion rate: {Math.round(60 + Math.random() * 35)}%</p></div></div></div>
    </div>
  );
}

export default function PerformanceOversightPage() {
  const { getCycles, getGoals, getReviews, getRatingHistory, createCycle, createGoal, createReview } = usePerformance();
  const { data: cyclesData, isLoading: cyclesLoading, error: cyclesError } = getCycles();
  const [role, setRole] = useState<UserRole>('branch_hr_admin');
  const [activeTab, setActiveTab] = useState<'cycles' | 'goals' | 'reviews' | 'history' | 'dashboard'>('cycles');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [employeePerformance, setEmployeePerformance] = useState<any>({});
  const [cycles, setCycles] = useState<AppraisalCycle[]>(cyclesData || []);

  const handleShowToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (cyclesLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div></div>;
  if (cyclesError) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">Error loading performance data</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><TrendingUp className="w-7 h-7 text-blue-700" /> Performance Oversight</h1><p className="text-sm text-gray-500 mt-1">Manage appraisal cycles, goals, reviews, and performance history</p></div>
        <div className="flex items-center gap-3"><span className="text-sm text-gray-600 font-medium">Role:</span><select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-700"><option value="employee">Employee</option><option value="department_head">Department Head</option><option value="branch_manager">Branch Manager</option><option value="branch_hr_admin">Branch HR Admin</option><option value="executive">Executive</option><option value="system_admin">System Admin</option></select></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {[{ id: 'cycles', label: 'Cycles', icon: Calendar }, { id: 'goals', label: 'Goals', icon: Target }, { id: 'reviews', label: 'Reviews', icon: Star }, { id: 'history', label: 'History', icon: TrendingUp }, { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }].map(tab => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-4 py-3 text-sm font-medium transition flex items-center gap-2 border-b-2 ${activeTab === tab.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Icon className="w-4 h-4" />{tab.label}</button>;
          })}
        </div>
      </div>

      {activeTab === 'cycles' && <CyclesTab cycles={cycles} setCycles={setCycles} role={role} onShowToast={handleShowToast} />}
      {activeTab === 'goals' && <GoalsTab employeePerformance={employeePerformance} setEmployeePerformance={setEmployeePerformance} selectedEmployeeId={selectedEmployeeId} setSelectedEmployeeId={setSelectedEmployeeId} role={role} onShowToast={handleShowToast} />}
      {activeTab === 'reviews' && <ReviewsTab employeePerformance={employeePerformance} setEmployeePerformance={setEmployeePerformance} selectedEmployeeId={selectedEmployeeId} setSelectedEmployeeId={setSelectedEmployeeId} role={role} cycles={cycles} onShowToast={handleShowToast} />}
      {activeTab === 'history' && <HistoryTab employeePerformance={employeePerformance} selectedEmployeeId={selectedEmployeeId} setSelectedEmployeeId={setSelectedEmployeeId} role={role} />}
      {activeTab === 'dashboard' && <DashboardTab employeePerformance={employeePerformance} cycles={cycles} role={role} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}