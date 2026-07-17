import { CalendarDays, Eye, Plus } from "lucide-react";
import { useState } from "react";
import PageChatbotWidget from "../../../../components/shared/PageChatbotWidget";
import { executiveTheme } from "../../../../theme/executiveTheme";
import BenefitDetailModal, { type EmployeeBenefit } from "../components/BenefitDetailModal";
import BenefitEnrollModal, { type AvailablePlan } from "../components/BenefitEnrollModal";

const initialBenefits: EmployeeBenefit[] = [
  { id: "BEN-1", employeeId: "EMP-1042", planId: "MED-GOLD", planName: "AAR Medical Gold", type: "medical", status: "active", enrolledAt: "2026-01-10", dependents: ["Spouse", "Child"], coverage: "Inpatient, outpatient, optical, dental and maternity coverage up to KES 3,000,000.", cost: 6200 },
  { id: "BEN-2", employeeId: "EMP-1042", planId: "LIFE-STD", planName: "Group Life Cover", type: "insurance", status: "active", enrolledAt: "2026-01-10", dependents: [], coverage: "Life insurance equal to 3x annual salary with accidental disability rider.", cost: 0 },
];

const availablePlans: AvailablePlan[] = [
  { planId: "PENSION-TOPUP", planName: "Pension Top Up", type: "other" as const, coverage: "Voluntary pension top-up with employer matched contribution up to 3%.", cost: 3500 },
  { planId: "MED-PLUS", planName: "Medical Plus Upgrade", type: "medical" as const, coverage: "Adds international referral and enhanced dental coverage.", cost: 2800 },
];

export default function MyBenefits() {
  const [benefits, setBenefits] = useState(initialBenefits);
  const [selectedBenefit, setSelectedBenefit] = useState<EmployeeBenefit | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const enrollmentOpen = true;

  const enroll = (plan: AvailablePlan) => {
    setBenefits((current) => [{ id: `BEN-${current.length + 1}`, employeeId: "EMP-1042", planId: plan.planId, planName: plan.planName, type: plan.type, status: "pending", enrolledAt: new Date().toISOString(), dependents: [], coverage: plan.coverage, cost: plan.cost }, ...current]);
    setNotice(`${plan.planName} enrollment submitted for Branch HR Admin review.`);
    setEnrollOpen(false);
  };

  return <div className={executiveTheme.page}><div className={executiveTheme.shell}><header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className={executiveTheme.eyebrow}>Employee self-service</p><h1 className={executiveTheme.title}>My Benefits</h1><p className={executiveTheme.subtitle}>View enrolled plans, coverage, dependents and open-enrollment options connected to Benefits Management.</p></div><button className={executiveTheme.buttonPrimary} disabled={!enrollmentOpen} onClick={() => setEnrollOpen(true)}><Plus size={16} /> Enroll</button></header><div className="rounded-2xl border border-[#c8a45d]/30 bg-[#c8a45d]/10 p-4 text-sm text-[#f1d99b]"><CalendarDays size={16} className="mr-2 inline" /> Open enrollment closes in 12 days. Available plans can be submitted for HR review.</div>{notice && <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</div>}<section className="grid gap-4 md:grid-cols-2">{benefits.length === 0 ? <div className={`${executiveTheme.card} p-10 text-center text-[#c9d3df]`}>No benefits enrolled yet</div> : benefits.map((benefit) => <article key={benefit.id} className={`${executiveTheme.card} p-5`}><div className="mb-4 flex items-start justify-between gap-4"><div><p className={executiveTheme.eyebrow}>{benefit.type}</p><h2 className="text-xl font-bold text-[#fffaf0]">{benefit.planName}</h2></div><span className={executiveTheme.badge}>{benefit.status}</span></div><p className="mb-4 text-sm text-[#c9d3df]">{benefit.coverage}</p><div className="mb-4 text-sm text-[#d7e0ec]">Dependents: {benefit.dependents.length || 0}</div><button className={executiveTheme.buttonSecondary} onClick={() => setSelectedBenefit(benefit)}><Eye size={16} /> View details</button></article>)}</section></div><BenefitDetailModal benefit={selectedBenefit} onClose={() => setSelectedBenefit(null)} /><BenefitEnrollModal open={enrollOpen} plans={availablePlans} onClose={() => setEnrollOpen(false)} onEnroll={enroll} /><PageChatbotWidget page="my-benefits" role="Employee" contextSummary={`${benefits.length} plans enrolled. Open enrollment closes in 12 days.`} quickPrompts={["When does open enrollment end?", "What benefits am I enrolled in?", "Can I add dependents?"]} /></div>;
}
