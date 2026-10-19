import type { Assignment } from "@/types/assignment";
import { AssignmentRow } from "./AssignmentRow";

type Props = {
    asignments: Assignment[];
    onEdit: (assignment: Assignment) => void;
    onDelete: (assignment: Assignment) => void;
}

export function AssignmentTable({asignments, onEdit, onDelete}: Props) {

        return (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">Zeitslot</th>
                            <th className="px-4 py-3 font-medium">Station</th>
                            <th className="px-4 py-3 font-medium">Mitarbeiter</th>
                            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignments.map((a) => (
                            <AssignmentRow key={a.id} assignment={a} onEdit={onEdit} onDelete={onDelete}/>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}