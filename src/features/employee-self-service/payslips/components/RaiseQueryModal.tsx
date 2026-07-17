import { Send, X } from "lucide-react";
import { useState } from "react";
import { executiveTheme } from "../../../../theme/executiveTheme";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={`${executiveTheme.card} w-full max-w-lg p-5`}>
        <div className="mb-4 flex items-center justify-between"><div><p className={executiveTheme.eyebrow}>Branch HR notice</p><h2 className="text-xl font-bold">Raise payslip query</h2></div><button className={executiveTheme.buttonSecondary} onClick={onClose}><X size={16} /></button></div>
        <textarea className={`${executiveTheme.input} min-h-32 w-full`} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the payslip concern..." />
        <div className="mt-4 flex justify-end gap-2"><button className={executiveTheme.buttonSecondary} onClick={onClose}>Cancel</button><button className={executiveTheme.buttonPrimary} onClick={submit}><Send size={16} /> Route query</button></div>
      </div>
    </div>
  );
}
