import type { Timeslot } from "@/types/timeslots";
import { TimeslotRow } from "./TimeslotRow";

type Props = {
    timeslots: Timeslot[];
    onEdit: (timeslot: Timeslot) => void;
    onDelete: (timeslot: Timeslot) => void;
}

export function TimeslotTable({timeslots, onEdit, onDelete}: Props) {

        return (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Startime</th>
                            <th className="px-4 py-3 font-medium">EndTime</th>
                            <th className="px-4 py-3 font-medium ">ShiftType</th>
                            <th className="px-4 py-3 font-medium">dayOfWeek</th>
                            <th className="px-4 py-3 font-medium text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeslots.map((t) => (
                            <TimeslotRow key={t.id} timeslot={t} onEdit={onEdit} onDelete={onDelete}/>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}