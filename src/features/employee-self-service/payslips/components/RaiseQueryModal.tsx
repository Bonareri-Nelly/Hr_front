import { Send, X } from "lucide-react";
import { useState } from "react";
import type { Payslip } from "./PayslipDetailModal";

export default function RaiseQueryModal({ payslip, onClose, onSubmit }: { payslip: Payslip | null; onClose: () => void; onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");
  if (!payslip) return null;
  const submit = () => {
    if (!message.trim()) return;
    onSubmit(`${payslip.id} - ${message.trim()}`);
    setMessage("");
    onClose();
  };
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="module-modal" style={{ maxWidth: "520px" }}>
        <div className="payroll-modal-header">
          <div>
            <div className="page-kicker">Branch HR notice</div>
            <h2>Raise payslip query</h2>
          </div>
          <button className="panel-action" onClick={onClose}><X size={16} /></button>
        </div>
        <textarea className="select-control" style={{ width: "100%", minHeight: "120px", marginTop: "16px" }} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the payslip concern..." />
        <div className="action-row payroll-modal-actions">
          <button className="button button-secondary" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Send size={15} /> Route query</button>
        </div>
      </div>
    </div>
  );
}
