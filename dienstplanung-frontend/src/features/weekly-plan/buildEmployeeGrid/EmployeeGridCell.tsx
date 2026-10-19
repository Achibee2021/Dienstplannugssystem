import type { EmployeeGridCell as EmployeeGridCellModel} from "../types"
import { EmployeeAssignmentChip } from "./EmployeeAssignmentChip";

type Props = {
    cell: EmployeeGridCellModel;
    onSelect?: (cell: EmployeeGridCellModel) => void;
};

export function EmployeeGridCell({cell, onSelect}: Props) {
    const isEmpty = cell.assignments.length === 0;

    if (isEmpty) {
        return (
            <div className="border-b border-l border-slate-200
            p-2 min-h-[72px] bg-white flex items-center
            justify-center text-slate-300 text-lg select-none">-</div>
        );
    }

    return (
        <button 
            onClick={() => onSelect?.(cell)}
            className="border-b border-l border-slate-200 p-2 min-h-[72px]
                bg-white flex flex-col gap-1 text-left w-full hover:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-blue-400
                focus:ring-inset transition-colors"
        >
            {cell.assignments.map((a)  => (
                <EmployeeAssignmentChip key={a.id} assignment={a}/>
            ))}
        </button>
    )

}