import { useDroppable } from "@dnd-kit/core";
import type { EmployeeGridCell as EmployeeGridCellModel} from "../types"
import { EmployeeAssignmentChip } from "./EmployeeAssignmentChip";

type Props = {
    cell: EmployeeGridCellModel;
    onSelect?: (cell: EmployeeGridCellModel) => void;
};

export function EmployeeGridCell({cell, onSelect}: Props) {
    const isEmpty = cell.assignments.length === 0;

    const {isOver, setNodeRef} = useDroppable({
            id: `emp-cell-${cell.day}-${cell.employee.id}`,
            data: {cell},
        });

    if (isEmpty) {
        return (
            <div 
                ref={setNodeRef}
                className={`border-b border-l border-slate-200 p-2 min-h-18 flex items-center
                justify-center text-slate-300 text-lg select-none transition-colors ${
                    isOver ? "bg-blue-50 ring-2 ring-inset ring-blue-400" : "bg-white"
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
                onClick={() => onSelect?.(cell)}
                className=" p-2 flex flex-col gap-1 w-full cursor-pointer hover:bg-slate-50 transition-colors">
                {cell.assignments.map((a)  => (
                    <EmployeeAssignmentChip key={a.id} assignment={a}/>
                ))}
            </div>
        </div>
    )

}