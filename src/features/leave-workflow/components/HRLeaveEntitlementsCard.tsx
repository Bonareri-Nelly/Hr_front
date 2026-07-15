import { useEffect, useState } from "react";
import { leavePolicies } from "../constants/leavePolicies";
import type { LeaveEntitlements, LeaveTypeKey } from "../types/leaveWorkflowTypes";

type HRLeaveEntitlementsCardProps = {
  open: boolean;
  entitlements: LeaveEntitlements;
  onClose: () => void;
  onChangeEntitlements: (next: LeaveEntitlements) => void;
};

const order: LeaveTypeKey[] = ["annual", "sick", "maternity", "paternity", "compassionate", "study", "unpaid"];

export default function HRLeaveEntitlementsCard({ open, entitlements, onClose, onChangeEntitlements }: HRLeaveEntitlementsCardProps) {
  const [draft, setDraft] = useState(entitlements);

  useEffect(() => {
    if (open) setDraft(entitlements);
  }, [entitlements, open]);

  if (!open) return null;
  const close = () => { setDraft(entitlements); onClose(); };
  const update = () => { onChangeEntitlements(draft); onClose(); };

  return <div onClick={close} style={overlayStyle}>
    <div className="panel" onClick={(event) => event.stopPropagation()} style={modalStyle}>
      <div className="panel-header"><h2 className="panel-title">Leave Entitlements</h2><button className="button button-secondary" onClick={close}>✕</button></div>
      <div className="panel-body" style={{ display: "grid", gap: 10 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: ".8rem", margin: 0 }}>Update leave balances that apply to all employees.</p>
        {order.map((key) => {
          const value = draft[key];
          const editable = typeof value === "number";
          return <div key={key} style={rowStyle}>
            <strong style={{ fontSize: ".85rem" }}>{leavePolicies[key].label}</strong>
            {editable ? <input type="number" min="0" value={value} style={inputStyle} onChange={(event) => setDraft((current) => ({ ...current, [key]: Number(event.target.value) }))} /> : <span style={{ color: "var(--text-secondary)", fontSize: ".8rem" }}>{String(value)}</span>}
          </div>;
        })}
      </div>
      <div style={footerStyle}><button className="button button-secondary" onClick={close}>Cancel</button><button className="button button-primary" onClick={update}>Update Entitlements</button></div>
    </div>
  </div>;
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 1100, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" };
const modalStyle: React.CSSProperties = { width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" };
const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface)", color: "var(--ink)" };
const footerStyle: React.CSSProperties = { display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 18px", borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap" };
