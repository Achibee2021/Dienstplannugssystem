import type { Assignment } from "@/types/assignment"
import { stationHue } from "../StationHue";
import { useDraggable } from "@dnd-kit/core";

type Props = Readonly<{
    assignment: Assignment;
}>



export function AssignmentChip({assignment}: Props) {
    const {employee, station} = assignment;

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: assignment.id,
        data: {assignment},
        disabled: !employee
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    if (!employee) {
        return (
            <div className="rounded border border-dashed border-amber-400 bg-amber-50 px-2 py-1 text-xs italic text-amber-700">
                Nicht zugewiesen.
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`rounded bg-white shadow-sm border border-slate-200 px-2 py-1 
            text-sm font-medium text-slate-800 flex items-center gap-2 ${isDragging ? 
                "opacity-50 cursor-grabbin" : "cursor-grab hover:bg-slate-50"
            }`}
        >
            <div>
                <span className="inline-block w-1 self-stretch rounded-full"
                    style={{backgroundColor: `hsl(${stationHue(station.id)}, 65%, 55%)`}}
                />
                <span className="wrap-break-word">{employee.name}</span>
                
            </div>
        </div>
    );
}