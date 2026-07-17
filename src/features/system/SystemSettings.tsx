import { Check, RotateCcw, Settings } from "lucide-react";
import { useState } from "react";

type Setting = { id: string; label: string; value: string | boolean; type: "text" | "toggle" | "select"; options?: string[]; description: string };

const STORAGE_KEY = "hr_payroll_system_settings";
const defaultSettings: Setting[] = [
  { id: "company_name", label: "Company name", value: "Optimum Computer Solutions", type: "text", description: "Used in system-facing labels and exports." },
  { id: "timezone", label: "Timezone", value: "Africa/Nairobi", type: "select", options: ["Africa/Nairobi", "Africa/Lagos", "Africa/Johannesburg"], description: "The default timezone for dates and time-based workflows." },
  { id: "currency", label: "Currency", value: "KES", type: "select", options: ["KES", "USD", "EUR", "GBP"], description: "Default currency shown in payroll and financial summaries." },
  { id: "email_notifications", label: "Email notifications", value: true, type: "toggle", description: "Send workflow notifications to users by email." },
  { id: "two_factor_auth", label: "Two-factor authentication", value: false, type: "toggle", description: "Require an additional verification factor at sign-in." },
  { id: "session_timeout", label: "Session timeout (minutes)", value: "30", type: "text", description: "Time before an inactive session expires." },
];

const readSettings = (): Setting[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return Array.isArray(saved) ? saved : defaultSettings;
  } catch { return defaultSettings; }
};

export default function SystemSettings() {
  const [settings, setSettings] = useState<Setting[]>(readSettings);
  const [saved, setSaved] = useState(false);
  const update = (id: string, value: string | boolean) => setSettings((current) => current.map((setting) => setting.id === id ? { ...setting, value } : setting));
  const save = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); setSaved(true); window.setTimeout(() => setSaved(false), 3000); };
  const reset = () => { setSettings(defaultSettings); localStorage.removeItem(STORAGE_KEY); setSaved(false); };

  return <div className="dashboard-page executive-consistent-page p-6 lg:p-8"><header className="dashboard-heading"><div><p className="page-kicker">System administration</p><h1 className="page-title">System settings</h1><p className="page-subtitle">Manage the preferences used throughout the HR and payroll workspace.</p></div><div className="action-row"><button className="button button-secondary" onClick={reset}><RotateCcw size={15} /> Reset</button><button className="button button-primary" onClick={save}><Settings size={15} /> Save changes</button></div></header>{saved && <div className="note"><Check size={16} /> Settings saved in this browser.</div>}<section className="panel"><div className="panel-header"><div><h2 className="panel-title">General configuration</h2><p className="panel-description">These settings are retained locally until a system-settings API is enabled.</p></div></div><div className="panel-body space-y-1">{settings.map((setting) => <div key={setting.id} className="flex flex-col gap-3 border-b border-[var(--border-subtle)] py-5 last:border-0 md:flex-row md:items-center md:justify-between"><div><label className="font-semibold text-[var(--ink)]" htmlFor={setting.id}>{setting.label}</label><p className="mt-1 text-sm text-[var(--text-secondary)]">{setting.description}</p></div>{setting.type === "toggle" ? <button id={setting.id} type="button" role="switch" aria-checked={Boolean(setting.value)} onClick={() => update(setting.id, !setting.value)} className={`relative h-7 w-12 rounded-full transition ${setting.value ? "bg-[var(--navy-deepest)]" : "bg-[var(--border)]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${setting.value ? "left-6" : "left-1"}`} /></button> : setting.type === "select" ? <select id={setting.id} className="min-w-52 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]" value={String(setting.value)} onChange={(event) => update(setting.id, event.target.value)}>{setting.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input id={setting.id} className="min-w-52 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]" value={String(setting.value)} onChange={(event) => update(setting.id, event.target.value)} />}</div>)}</div></section></div>;
}
