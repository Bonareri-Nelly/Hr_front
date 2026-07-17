import { Clock } from "lucide-react";
import { executiveTheme } from "../../../../theme/executiveTheme";

export default function ClockInOutWidget({ isClockedIn, currentTime, onClockIn, onClockOut }: { isClockedIn: boolean; currentTime: string; onClockIn: () => void; onClockOut: () => void }) {
  return (
    <div className={`${executiveTheme.cardSoft} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div><p className={executiveTheme.eyebrow}>Live attendance</p><h2 className="text-xl font-bold">{isClockedIn ? "Clocked In" : "Clocked Out"}</h2></div>
        <span className={`h-3 w-3 rounded-full ${isClockedIn ? "bg-emerald-400" : "bg-[#c8a45d]"}`} />
      </div>
      <div className="mb-4 flex items-center gap-3 text-[#c9d3df]"><Clock size={18} /><span>{currentTime}</span></div>
      {isClockedIn ? <button className={executiveTheme.dangerButton} onClick={onClockOut}>Clock Out</button> : <button className={executiveTheme.buttonPrimary} onClick={onClockIn}>Clock In</button>}
    </div>
  );
}
