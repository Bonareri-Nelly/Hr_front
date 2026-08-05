import { Clock } from "lucide-react";

export default function ClockInOutWidget({ isClockedIn, currentTime, onClockIn, onClockOut, disabled = false }: { isClockedIn: boolean; currentTime: string; onClockIn: () => void; onClockOut: () => void; disabled?: boolean }) {
  return (
    <div className="metric-cell">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="metric-label">Live Attendance</p>
          <p className="compact-metric" style={{ fontWeight: 700 }}>{isClockedIn ? "Clocked In" : "Clocked Out"}</p>
        </div>
        <span className={`h-3 w-3 rounded-full ${isClockedIn ? "bg-emerald-500" : "bg-[var(--bronze)]"}`} />
      </div>
      <div className="mb-3 flex items-center gap-2" style={{ color: "var(--text-muted)" }}><Clock size={15} /><span style={{ fontSize: "0.85rem" }}>{currentTime}</span></div>
      {isClockedIn ? <button className="button button-danger" onClick={onClockOut} disabled={disabled}>Clock Out</button> : <button className="button button-primary" onClick={onClockIn} disabled={disabled}>Clock In</button>}
    </div>
  );
}
