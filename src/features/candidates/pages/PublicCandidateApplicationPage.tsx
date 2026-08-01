import { useState, type FormEvent } from "react";
import { Check, Send, Upload } from "lucide-react";
import api from "../../../services/api/api";
import { executiveTheme } from "../../../theme/executiveTheme";

/** Anonymous, deliberately isolated application page. It never imports HR UI. */
export default function PublicCandidateApplicationPage() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", role: "", branch: "", experience: "", education: "", expected_salary: "" });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/hr-operations/recruitment-applications/", { ...form, documents });
      setSubmitted(true);
    } catch {
      setError("We could not submit your application. Please try again.");
    }
  }

  return <main className={executiveTheme.page}><div className={`${executiveTheme.shell} max-w-3xl`}>
    <header className="mb-7"><p className={executiveTheme.eyebrow}>Careers</p><h1 className={executiveTheme.title}>Candidate application</h1><p className={executiveTheme.subtitle}>Submit your details securely. Only the recruitment team can review this application.</p></header>
    {submitted ? <section className={`${executiveTheme.card} ${executiveTheme.panelPad} text-center`}><Check className="mx-auto text-emerald-300" size={38}/><h2 className="mt-4 text-2xl font-bold text-[#fffaf0]">Application received</h2><p className="mt-2 text-[#c9d3df]">Thank you. The recruitment team will contact you if your application progresses.</p></section> : <form onSubmit={submit} className={`${executiveTheme.card} ${executiveTheme.panelPad} grid gap-4 md:grid-cols-2`}>
      <input required className={executiveTheme.input} placeholder="Full name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
      <input required type="email" className={executiveTheme.input} placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} />
      <input required className={executiveTheme.input} placeholder="Phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      <input required className={executiveTheme.input} placeholder="Role applying for" value={form.role} onChange={(e) => set("role", e.target.value)} />
      <input className={executiveTheme.input} placeholder="Preferred branch (optional)" value={form.branch} onChange={(e) => set("branch", e.target.value)} />
      <input className={executiveTheme.input} placeholder="Expected salary (optional)" value={form.expected_salary} onChange={(e) => set("expected_salary", e.target.value)} />
      <textarea required className={`${executiveTheme.input} min-h-28 md:col-span-2`} placeholder="Experience summary" value={form.experience} onChange={(e) => set("experience", e.target.value)} />
      <textarea required className={`${executiveTheme.input} min-h-24 md:col-span-2`} placeholder="Education and qualifications" value={form.education} onChange={(e) => set("education", e.target.value)} />
      <label className={`${executiveTheme.buttonSecondary} w-fit cursor-pointer md:col-span-2`}><Upload size={16}/> Select supporting document<input className="hidden" type="file" onChange={(e) => e.target.files?.[0] && setDocuments((files) => [...files, e.target.files![0].name])}/></label>
      {documents.length > 0 && <p className="text-sm text-[#c9d3df] md:col-span-2">Selected: {documents.join(", ")}</p>}
      {error && <p role="alert" className="text-sm text-rose-200 md:col-span-2">{error}</p>}
      <button className={`${executiveTheme.buttonPrimary} md:col-span-2`} type="submit"><Send size={16}/> Submit application</button>
    </form>}
  </div></main>;
}
