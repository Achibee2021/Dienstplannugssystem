import type { Assignment } from "@/types/assignment"
import { stationHue } from "../StationHue";
//import type { Station } from "@/types/station";

type Props = {
    assignment: Assignment;
}



export function AssignmentChip({assignment}: Props) {
    const {employee, station} = assignment;

    if (!employee) {
        return (
            <div className="rounded border border-dashed border-amber-400 bg-amber-50 px-2 py-1 text-xs italic text-amber-700">
                Nicht zugewiesen.
            </div>
        );
    }

    return (
        <div className="rounded bg-white shadow-sm border border-slate-200 px-2 py-1 
        text-sm font-medium text-slate-800 flex items-center gap-2">
            <span className="inline-block w-1 self-stretch rounded-full"
                style={{backgroundColor: `hsl(${stationHue(station.id)}, 65%, 55%)`}}
            />
            <span className="wrap-break-word">{employee.name}</span>
        </div>
    );
}