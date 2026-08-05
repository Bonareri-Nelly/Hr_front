import { Send, X } from "lucide-react";
import { useState } from "react";

export default function AttendanceCorrectionModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");
  if (!open) return null;
  const submit = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage("");
    onClose();
  };
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="module-modal w-full max-w-lg">
        <div className="payroll-modal-header">
          <div>
            <div className="page-kicker">HR Admin approval</div>
            <h2>Attendance correction</h2>
          </div>
          <button className="panel-action" onClick={onClose}><X size={16} /></button>
        </div>
        <label className="field-group" style={{ marginTop: "16px" }}>
          <span className="eyebrow">Reason for correction</span>
          <textarea
            className="select-control"
            style={{ width: "100%", minHeight: "120px", fontFamily: "var(--font-sans)", resize: "vertical" }}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Explain the missed clock-in/out..."
          />
        </label>
        <div className="action-row payroll-modal-actions">
          <button className="button button-secondary" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}>
            <Send size={15} aria-hidden="true" /> Send request
          </button>
        </div>
      </div>
    </div>
  );
}
