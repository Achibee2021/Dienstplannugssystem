import type { EmployeeGridCell as EmployeeGridCellModel, EmployeeGridRow as EmployeeGridRowModel } from "../types"
import { EmployeeGridCell } from "./EmployeeGridCell";
//import { EmployeeGridCell } from "./EmployeeGridCell";

type Props = {
    row: EmployeeGridRowModel,
    onCellClick: (cell: EmployeeGridCellModel) => void;
}

function initials(name:string): string {
    return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0,2)
    .join("")
    .toUpperCase();
}

export function EmployeeGridRow({row, onCellClick}: Props) {

    const {employee, cells} = row
    return [
        <div 
            key="__row-header"
            className="border-b border-slate-200 bg-slate-50 px-3
            py-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center
            rounded-full bg-slate-200 text-xs font-medium
            text-slate-700">
                {initials(employee.name)}
            </div>
            <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">
                    {row.employee.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                    {row.employee.qualification}
                </div>
            </div>
        </div>,

        cells.map((cell) => (
            <EmployeeGridCell 
                key={cell.day}
                cell={cell}
                onSelect={onCellClick}
            />
        )),
    ];
}