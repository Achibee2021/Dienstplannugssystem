import type { Assignment } from "@/types/assignment";
import { stationHue } from "../StationHue";

type Props = {
    assignment: Assignment;
}

export function EmployeeAssignmentChip({assignment}: Props){
    const {station, timeslot} = assignment;
    const hue = stationHue(station.id);


    return(
        <div 
            className="rounded bg-white shadow-sm border border-slate-200
            px-2 py-1 text-xs"

            style={{borderLeftColor: `hsl(${hue}, 65%, 55%)`, borderLeftWidth: 4}}
        >
            <div className="font-medium text-slate-800 truncate">
                {station.name}
            </div>
            {timeslot && (
                <div className="text-slate-500">
                    {timeslot.startTime.slice(0,5)}-{timeslot.endTime.slice(0,5)}
                </div>
            )}
        </div>
    )
}