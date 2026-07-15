import { X } from "lucide-react";
import { executiveTheme } from "../../../../theme/executiveTheme";

export type EmployeeBenefit = { id: string; employeeId: string; planId: string; planName: string; type: "medical" | "insurance" | "other"; status: "active" | "pending" | "expired"; enrolledAt: string; dependents: string[]; coverage: string; cost: number };

export default function BenefitDetailModal({ benefit, onClose }: { benefit: EmployeeBenefit | null; onClose: () => void }) {
  if (!benefit) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className={`${executiveTheme.card} w-full max-w-xl p-5`}><div className="mb-4 flex items-center justify-between"><div><p className={executiveTheme.eyebrow}>{benefit.type}</p><h2 className="text-2xl font-bold">{benefit.planName}</h2></div><button className={executiveTheme.buttonSecondary} onClick={onClose}><X size={16} /></button></div><div className="space-y-3 text-sm text-[#d7e0ec]"><p>{benefit.coverage}</p><p><strong>Employee cost:</strong> KES {benefit.cost.toLocaleString()} / month</p><p><strong>Dependents:</strong> {benefit.dependents.length ? benefit.dependents.join(", ") : "None"}</p><p><strong>Enrolled:</strong> {new Date(benefit.enrolledAt).toLocaleDateString()}</p><span className={executiveTheme.badge}>{benefit.status}</span></div></div></div>;
}
