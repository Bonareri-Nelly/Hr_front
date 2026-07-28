import type { DisciplinaryCase } from "../types";
import { useQuery } from "@tanstack/react-query";
import { resources } from "../../../services/api/resources";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { Eye } from "lucide-react";

interface CasesTableProps {
    onSelectCase: (disciplinaryCase: DisciplinaryCase) => void;
}

const CasesTable = ({ onSelectCase }: CasesTableProps) => {
    const cases = useQuery({ queryKey: ["disciplinary-cases-table"], queryFn: () => resources.disciplinaryCases.list() });
    const records = (cases.data ?? []).map((item: any): DisciplinaryCase => ({
        id: String(item.id), complaintId: String(item.id), incidentId: String(item.id), employee: item.employee_name || `Employee #${item.employee}`,
        department: "—", complaint: item.description || "—", priority: item.severity === "MINOR" ? "Minor" : "Major",
        status: ({ OPEN: "Pending Review", UNDER_INVESTIGATION: "Pending Review", HEARING_SCHEDULED: "Hearing Scheduled", RESOLVED: "Decision Issued", APPEALED: "Appealed", CLOSED: "Closed" } as Record<string, DisciplinaryCase["status"]>)[item.status] || "Pending Review",
        nextAction: item.status === "HEARING_SCHEDULED" ? "Conduct Hearing" : item.status === "CLOSED" ? "Case Closed" : "Schedule Hearing",
        assignedTo: "HR", hearing: item.hearing_date ? { date: item.hearing_date, time: "", venue: "", platform: "Physical", status: "Scheduled", notes: "", rescheduleHistory: [] } : undefined,
    }));
    return (
        <div
            className="overflow-hidden rounded-xl border"
            style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
            }}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead
                        style={{
                            backgroundColor: "var(--background)",
                        }}
                    >
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Case ID
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Employee
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Complaint
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Department
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Priority
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Hearing
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Assigned To
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onSelectCase(item)}
                                className="cursor-pointer transition hover:bg-black/5"
                                style={{
                                    borderTop: "1px solid var(--border)",
                                }}
                            >
                                <td className="px-6 py-4 font-medium">{item.id}</td>

                                <td className="px-6 py-4">{item.employee}</td>

                                <td className="px-6 py-4">{item.complaint}</td>

                                <td className="px-6 py-4">{item.department}</td>

                                <td className="px-6 py-4">
                                    <PriorityBadge priority={item.priority} />
                                </td>


                                <td className="px-6 py-4">
                                    <StatusBadge status={item.status} />
                                </td>

                                <td className="px-6 py-4">
                                    {item.assignedTo}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <Eye
                                        size={18}
                                        style={{ color: "var(--text-secondary)" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CasesTable;
