import type { Assignment } from "@/types/assignment";
import { Pencil, Trash2 } from "lucide-react";
import { timeslotLabel } from "../weekly-plan/labels";


type Props = {
    assignment: Assignment;
    onEdit: (assignment: Assignment) => void;
    onDelete: (assignment: Assignment) => void;
};


export function AssignmentRow ({assignment, onEdit, onDelete}: Props) {
    //const freeDays = employee.wunschFreiTage ?? [];
      

    return (
        <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-800">
                {assignment.id}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {timeslotLabel(assignment.timeslot)}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {assignment.station.name}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {assignment.employee?.name}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(assignment)}
                        aria-label={`${assignment.id} bearbeiten`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100
                        hover:text-slate-800"
                    >
                        <Pencil className="h-4 w-4"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(assignment)}
                        aria-label={`${assignment.id} löschen`}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-50
                        hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4"/>
                    </button>
                </div>
            </td>
        </tr>
    );
}