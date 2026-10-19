import type { ShiftType } from "@/types/employee";
import type { GridRow as GridRowModel, GridCell as GridCellModel} from "../types"
import { GridCell } from "./StationGridCell";


type Props = {
    row: GridRowModel;
    onCellClick: (cell: GridCellModel) => void;
};

const SHIFT_LABEL: Record<ShiftType, string> = {
    FRUESCHICHT: "Früh",
    SPAETSCHICHT: "Spät",
    NACHTSCHICHT: "Nacht",
    TAGESSCHICHT: "Tag",
};

export function GridRow({row, onCellClick}: Props) {
    return [
        
        <div key="__row-header" className="border-b border-slate-200 bg-slate-50 px-3 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {SHIFT_LABEL[row.shiftType]}
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">
                {row.station.name}
            </div>
        </div>,

        ...row.cells.map((cell) => (
            <GridCell key={cell.day} cell={cell} onSelect={onCellClick}/>
        )),
    ];
}