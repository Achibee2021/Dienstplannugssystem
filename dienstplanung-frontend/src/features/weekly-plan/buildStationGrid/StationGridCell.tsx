import { AssignmentChip } from "./StationAssignmentChip";
import type { GridCell as GridCellModel} from "../types"

type Props = {
    cell: GridCellModel;
    onSelect?: (cell: GridCellModel) => void;
}

export function GridCell({cell, onSelect}: Props){
    const isEmpty = cell.assignments.length === 0;

    if (isEmpty) {
        return (
            <div className="border-b border-l border-slate-200
            p-2 min-h-18 bg-white flex items-center
            justify-center text-slate-300 text-lg select-none">-</div>
        );
    }


    return (
        <button 
        type="button"
        onClick={() => onSelect?.(cell)}
        className="border-b border-l border-slate-200 p-2 min-h-18
         bg-white flex flex-col gap-1 text-left w-full hover:bg-slate-50
         focus:outline-none focus:ring-2 focus:ring-blue-400
         focus:ring-inset transition-colors">
            {cell.assignments.map((assignment) => (
                <AssignmentChip key={assignment.id} assignment={assignment}/>
            ))}
        </button>
    );
}