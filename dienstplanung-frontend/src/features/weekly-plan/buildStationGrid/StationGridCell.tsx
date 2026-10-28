import { AssignmentChip } from "./StationAssignmentChip";
import type { GridCell as GridCellModel} from "../types"
import { useDroppable } from "@dnd-kit/core";

type Props = Readonly<{
    cell: GridCellModel;
    onSelect?: (cell: GridCellModel) => void;
}>

export function GridCell({cell, onSelect}: Props){
    const isEmpty = cell.assignments.length === 0;

    const {isOver, setNodeRef} = useDroppable({
        id: `cell-${cell.day}-${cell.station.id}-${cell.timeslot?.id ?? 'empty'}`,
        data: {cell},
    });

    if (isEmpty) {
        return (
            <div 
                ref={setNodeRef}
                className={`border-b border-l border-slate-200
            p-2 min-h-18 bg-white flex items-center
            justify-center text-slate-300 text-lg select-none transition-colors ${
                isOver ? "bg-blue-50 border-blue-300" : "bg-white"
            }`}>{isOver ? "Hier ablegen" : "-"}</div>
        );
    }


    return (
        <div
            ref={setNodeRef}
            className={`border-b border-l border-slate-200 min-h-18 bg-white transition-colors
                 ${isOver ? "bg-blue-50 ring-2 ring-inset ring-blue-400": ""}`}
        >
            <div 
                onClick={() => {onSelect?.(cell)}}
                className="p-2 flex flex-col gap-1 w-full h-full cursor-pointer hover:bg-slate-50 transition-colors">
                {cell.assignments.map((assignment) => (
                    <AssignmentChip key={assignment.id} assignment={assignment}/>
                ))}
            </div>
        </div>
    );
}