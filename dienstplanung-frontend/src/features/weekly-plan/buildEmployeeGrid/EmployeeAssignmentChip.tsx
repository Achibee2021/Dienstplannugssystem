import type { Assignment } from "@/types/assignment";
import { stationHue } from "../StationHue";
import { useDraggable } from "@dnd-kit/core";

type Props = {
    readonly assignment: Assignment;
}

export function EmployeeAssignmentChip({assignment}: Props){
    const {employee, station, timeslot} = assignment;
    const hue = stationHue(station.id);

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: assignment.id,
        data: {assignment},
        disabled: !employee,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return(
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}

            className={`rounded bg-white shadow-sm border border-slate-200
            pl-2 pr-2 py-1 text-xs ${isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab hover:bg-slate-50"} `}

            style={{
                ...style,
                borderLeftColor: `hsl(${hue}, 65%, 55%)`, borderLeftWidth: 4}}
        >
            <div className="font-medium text-slate-800 truncate">
                {station.name}
            </div>
            {timeslot && (
                <div className="text-slate-500 flex items-center gap-1">
                    <span>{timeslot.startTime.slice(0,5)}-{timeslot.endTime.slice(0,5)}</span>
                    {timeslot.crossesMidnight && (
                    <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-1 rounded" title="Geht über Mitternacht">+1</span>
                )}
                </div>   
            )}
        </div>
    )
}