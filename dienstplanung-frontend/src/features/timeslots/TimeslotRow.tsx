import type { Timeslot } from "@/types/timeslots";
import { DAY_LABEL, SHIFT_LABEL } from "../weekly-plan/labels";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    timeslot: Timeslot;
    onEdit: (timeslot: Timeslot) => void;
    onDelete: (timeslot: Timeslot) => void;
};


export function TimeslotRow ({timeslot, onEdit, onDelete}: Props) {
    //const freeDays = employee.wunschFreiTage ?? [];

    return (
        <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-800">
                {timeslot.startTime}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {timeslot.endTime}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {SHIFT_LABEL[timeslot.type] ?? timeslot.type}
            </td>
            <td className="px-4 py-3 text-slate-600">
                {DAY_LABEL[timeslot.dayOfWeek] ?? timeslot.dayOfWeek}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(timeslot)}
                        aria-label={`${timeslot.id} bearbeiten`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100
                        hover:text-slate-800"
                    >
                        <Pencil className="h-4 w-4"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(timeslot)}
                        aria-label={`${timeslot.id} löschen`}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-50
                        hover:text-red-700"
                    >
                    <Trash2  className="h-4 w-4"/>
                    </button>
                </div>
            </td>
        </tr>
    );
}