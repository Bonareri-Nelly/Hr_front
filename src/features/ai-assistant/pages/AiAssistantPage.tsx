import { Link } from "react-router-dom";

export default function AiAssistantPage() {
  return <main className="page-container"><section className="panel"><div className="panel-header"><div><h1 className="panel-title">AI Assistant</h1><p className="panel-subtitle">No AI provider is configured for this environment.</p></div></div><div className="panel-body"><p>This screen intentionally does not generate sample responses or fabricated payroll, tax, employee, or compliance information.</p><p>Use the live modules below to view data that is stored in the HR and payroll database.</p><div className="flex gap-3 mt-4"><Link className="button button-primary" to="/payroll/history">Payroll history</Link><Link className="button button-secondary" to="/reports">Reports</Link></div></div></section></main>;
}
