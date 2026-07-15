import { Send, X } from "lucide-react";
import { useState } from "react";
import { executiveTheme } from "../../../../theme/executiveTheme";
import type { EmployeeBenefit } from "./BenefitDetailModal";

export type AvailablePlan = Omit<EmployeeBenefit, "id" | "employeeId" | "status" | "enrolledAt" | "dependents">;

export default function BenefitEnrollModal({ open, plans, onClose, onEnroll }: { open: boolean; plans: AvailablePlan[]; onClose: () => void; onEnroll: (plan: AvailablePlan) => void }) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.planId ?? "");
  if (!open) return null;
  const selected = plans.find((plan) => plan.planId === selectedPlanId) ?? plans[0];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className={`${executiveTheme.card} w-full max-w-xl p-5`}><div className="mb-4 flex items-center justify-between"><div><p className={executiveTheme.eyebrow}>Open enrollment</p><h2 className="text-xl font-bold">Enroll in a plan</h2></div><button className={executiveTheme.buttonSecondary} onClick={onClose}><X size={16} /></button></div><select className={`${executiveTheme.input} mb-4 w-full`} value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)}>{plans.map((plan) => <option key={plan.planId} value={plan.planId}>{plan.planName}</option>)}</select>{selected && <div className={`${executiveTheme.cardSoft} mb-4 p-4 text-sm text-[#d7e0ec]`}><p className="font-bold text-[#fffaf0]">{selected.coverage}</p><p className="mt-2">Cost: KES {selected.cost.toLocaleString()} / month</p></div>}<div className="flex justify-end gap-2"><button className={executiveTheme.buttonSecondary} onClick={onClose}>Cancel</button><button className={executiveTheme.buttonPrimary} onClick={() => selected && onEnroll(selected)}><Send size={16} /> Submit enrollment</button></div></div></div>;
}
