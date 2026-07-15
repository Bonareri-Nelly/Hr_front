import { useState } from "react";
import type { DisciplinaryCase } from "../types";

interface HearingTabProps { caseData: DisciplinaryCase; }

const inputClass = "w-full rounded-lg border px-4 py-3 text-sm";
const sectionStyle: React.CSSProperties = { borderColor: "var(--border)", backgroundColor: "var(--surface)" };
const primaryStyle: React.CSSProperties = { backgroundColor: "var(--navy-dark)", color: "white" };

const HearingTab = ({ caseData }: HearingTabProps) => {
  const [saved, setSaved] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [evidence, setEvidence] = useState("");
  const [verdict, setVerdict] = useState("");

  if (caseData.status === "Pending Review") return <section className="rounded-xl border p-6" style={sectionStyle}>
    <Header title="Schedule Hearing" description="Set the initial hearing details. Calendar conflict checks will be connected later." />
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Hearing Date"><input type="date" className={inputClass} /></Field><Field label="Hearing Time"><input type="time" className={inputClass} /></Field><Field label="Venue" wide><input placeholder="Boardroom A" className={inputClass} /></Field><Field label="HR Notes" wide><textarea rows={4} className={inputClass} placeholder="Record scheduling notes or instructions." /></Field></div>
    <Notice>Calendar conflict detection and reminders will appear here when calendar integration is available.</Notice>
    <Actions><button className="rounded-lg px-5 py-3 text-sm font-medium" style={primaryStyle} onClick={() => setSaved(true)}>{saved ? "Hearing Scheduled" : "Save & Continue"}</button></Actions>
  </section>;

  if (caseData.status === "Hearing Scheduled") return <section className="rounded-xl border p-6" style={sectionStyle}>
    <Header title="Hearing Scheduled" description="The hearing has been scheduled and is awaiting commencement." />
    <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-3" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><div><strong className="block" style={{ color: "var(--ink)" }}>Date & Time</strong>To be confirmed</div><div><strong className="block" style={{ color: "var(--ink)" }}>Venue</strong>To be confirmed</div><div><strong className="block" style={{ color: "var(--ink)" }}>Case</strong>{caseData.id}</div></div>
    {rescheduling && <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="New Date"><input type="date" className={inputClass} /></Field><Field label="New Time"><input type="time" className={inputClass} /></Field><Field label="Revised Venue" wide><input className={inputClass} /></Field></div>}
    <Actions><button className="rounded-lg border px-5 py-3 text-sm font-medium" style={{ borderColor: "var(--border)" }} onClick={() => setRescheduling(!rescheduling)}>{rescheduling ? "Cancel Reschedule" : "Reschedule Hearing"}</button><button className="rounded-lg px-5 py-3 text-sm font-medium" style={primaryStyle}>Conduct Hearing</button></Actions>
  </section>;

  if (caseData.status === "Hearing In Progress") return <section className="rounded-xl border p-6" style={sectionStyle}>
    <Header title="Conduct Hearing" description="Record the evidence, proceedings notes, and recommended verdict." />
    <div className="grid gap-5"><Field label="Evidence & Proceedings Notes"><textarea rows={5} value={evidence} onChange={(event) => setEvidence(event.target.value)} className={inputClass} placeholder="Summarise statements, evidence, and findings." /></Field><Field label="Attachments"><div className="rounded-lg border border-dashed p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Attachment upload placeholder — documents will be connected to storage later.</div></Field><Field label="Verdict"><select value={verdict} onChange={(event) => setVerdict(event.target.value)} className={inputClass}><option value="">Select a verdict</option><option>Case upheld</option><option>Case not upheld</option><option>Further investigation required</option></select></Field></div>
    <Actions><button disabled={!verdict} className="rounded-lg px-5 py-3 text-sm font-medium disabled:opacity-50" style={primaryStyle} onClick={() => setSaved(true)}>{saved ? "Verdict Saved" : "Save Verdict"}</button></Actions>
  </section>;

  if (caseData.status === "Decision Issued") return <section className="rounded-xl border p-6" style={sectionStyle}><Header title="Decision Summary" description="The decision has been issued and recorded in the case timeline." /><div className="rounded-lg border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Decision details will be displayed here once the decision record is connected.</div><Actions><button className="rounded-lg px-5 py-3 text-sm font-medium" style={{ backgroundColor: "var(--danger)", color: "white" }}>Escalate Case</button></Actions></section>;
  return <section className="rounded-xl border p-5" style={sectionStyle}><p className="text-sm" style={{ color: "var(--text-secondary)" }}>No hearing actions are available for this case.</p></section>;
};

function Header({ title, description }: { title: string; description: string }) { return <div className="mb-5"><h3 className="text-xl font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-serif)" }}>{title}</h3><p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{description}</p></div>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-medium" style={{ color: "var(--ink)" }}>{label}</span>{children}</label>; }
function Notice({ children }: { children: React.ReactNode }) { return <div className="mt-5 rounded-lg border p-4 text-sm" style={{ borderColor: "var(--warning)", backgroundColor: "var(--warning-bg)" }}>{children}</div>; }
function Actions({ children }: { children: React.ReactNode }) { return <div className="mt-6 flex justify-end gap-3">{children}</div>; }
export default HearingTab;
