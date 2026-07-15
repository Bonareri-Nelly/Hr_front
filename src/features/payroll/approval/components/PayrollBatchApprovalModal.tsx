import { CheckCircle, X, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

type BatchRecord = {
  id: string;
  employee: { name: string; department: string };
  netPay: number;
  status: string;
};

const money = (amount: number) => `KES ${amount.toLocaleString()}`;

export default function PayrollBatchApprovalModal({ open, records, onClose, onApprove, onReject }: { open: boolean; records: BatchRecord[]; onClose: () => void; onApprove: (ids: string[]) => void; onReject: (id: string, reason: string) => void }) {
  const pendingRecords = useMemo(() => records.filter((record) => record.status === "Pending"), [records]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  if (!open) return null;

  const toggle = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const approveAll = () => { setSelectedIds(pendingRecords.map((record) => record.id)); setConfirming(true); };
  const approveSelected = () => selectedIds.length > 0 && setConfirming(true);
  const confirm = () => { onApprove(selectedIds); setSelectedIds([]); setConfirming(false); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div><h2 className="text-xl font-bold text-slate-900">Batch payroll approval</h2><p className="text-sm text-slate-500">Select pending employee payroll lines for Executive approval.</p></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>
        {confirming ? (
          <div className="p-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900"><strong>{selectedIds.length}</strong> payroll line(s) will be approved. Rejected or unselected items are excluded.</div>
            <div className="mt-5 flex justify-end gap-3"><button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setConfirming(false)}>Back</button><button className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white" onClick={confirm}><CheckCircle size={16} className="mr-2 inline" /> Confirm approval</button></div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4 flex flex-wrap justify-between gap-3"><span className="text-sm text-slate-600">{pendingRecords.length} pending line item(s)</span><div className="flex gap-2"><button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={approveSelected} disabled={selectedIds.length === 0}>Approve Selected</button><button className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white" onClick={approveAll}>Approve All</button></div></div>
            <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-slate-200">
              {pendingRecords.map((record) => (
                <div key={record.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[auto_1fr_auto_220px] md:items-center">
                  <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggle(record.id)} className="h-4 w-4" />
                  <div><p className="font-semibold text-slate-900">{record.employee.name}</p><p className="text-sm text-slate-500">{record.employee.department}</p></div>
                  <strong className="text-blue-600">{money(record.netPay)}</strong>
                  <div className="flex gap-2"><input className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Reject reason" value={rejectionReasons[record.id] ?? ""} onChange={(event) => setRejectionReasons((current) => ({ ...current, [record.id]: event.target.value }))} /><button className="rounded-lg bg-red-600 px-3 py-2 text-white" onClick={() => onReject(record.id, rejectionReasons[record.id] || "Rejected from batch") }><XCircle size={15} /></button></div>
                </div>
              ))}
              {pendingRecords.length === 0 && <div className="p-8 text-center text-slate-500">No pending payroll lines available for batch approval.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
