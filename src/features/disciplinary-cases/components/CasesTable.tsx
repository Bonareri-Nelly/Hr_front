import type { DisciplinaryCase } from "../types";
import { mockCases } from "../data/mockCases";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { Eye } from "lucide-react";

interface CasesTableProps {
    onSelectCase: (disciplinaryCase: DisciplinaryCase) => void;
}

const CasesTable = ({ onSelectCase }: CasesTableProps) => {
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
                        {mockCases.map((item) => (
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