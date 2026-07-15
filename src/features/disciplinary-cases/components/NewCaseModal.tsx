import { useState } from "react";

type Props = { open: boolean; onClose: () => void };

export default function NewCaseModal({ open, onClose }: Props) {
  const [saved, setSaved] = useState(false);
  if (!open) return null;
  const close = () => { setSaved(false); onClose(); };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={close}>
    <div className="w-full max-w-2xl rounded-xl border shadow-xl" onClick={(event) => event.stopPropagation()} style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--border)" }}><div><h2 className="text-xl font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-serif)" }}>New Disciplinary Case</h2><p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Create a case from a complaint for HR review.</p></div><button className="rounded-lg px-3 py-2" style={{ border: "1px solid var(--border)" }} onClick={close}>✕</button></div>
      <div className="grid gap-4 p-6 sm:grid-cols-2"><Field label="Employee"><select className={fieldClass}><option>Jane Smith</option><option>Peter Mwangi</option><option>Aisha Khan</option></select></Field><Field label="Department"><select className={fieldClass}><option>ICT</option><option>Finance</option><option>Operations</option></select></Field><Field label="Priority"><select className={fieldClass}><option>Minor</option><option>Major</option></select></Field><Field label="Assign To"><select className={fieldClass}><option>Department Head</option><option>HR</option><option>Branch Manager</option></select></Field><Field label="Complaint Details" wide><textarea rows={5} className={fieldClass} placeholder="Describe the complaint and relevant circumstances." /></Field><div className="sm:col-span-2 rounded-lg border p-4 text-sm" style={{ borderColor: "var(--warning)", backgroundColor: "var(--warning-bg)" }}>The new case will start in <strong>Pending Review</strong>. Notifications and complaint linking are placeholders for now.</div>{saved && <div className="sm:col-span-2 text-sm" style={{ color: "var(--success)" }}>Mock case created successfully. It will appear in the cases list when data persistence is connected.</div>}</div>
      <div className="flex justify-end gap-3 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}><button className="rounded-lg px-5 py-3 text-sm font-medium" style={{ border: "1px solid var(--border)" }} onClick={close}>Cancel</button><button className="rounded-lg px-5 py-3 text-sm font-medium" style={{ backgroundColor: "var(--navy-dark)", color: "white" }} onClick={() => setSaved(true)}>Create Case</button></div>
    </div>
  </div>;
}
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-medium" style={{ color: "var(--ink)" }}>{label}</span>{children}</label>; }
const fieldClass = "w-full rounded-lg border px-4 py-3 text-sm";
