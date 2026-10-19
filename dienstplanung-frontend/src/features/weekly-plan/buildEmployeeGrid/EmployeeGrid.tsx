import { useState } from "react";
import { GridHeader } from "../GridHeader"; 
import { AssignmentDetailSheet } from "../AssignmentDetailSheet"; 
import type { EmployeeGridModel, EmployeeGridCell } from "../types";
import { EmployeeGridRow } from "./EmployeeGridRow";
import { DAY_LABEL} from "../labels";

type Props = {
    model: EmployeeGridModel;
};

export function EmployeeGrid ({model}: Props) {

    const [selectedCell, setSelectedCell] = useState<EmployeeGridCell | null>(null);

    if(model.rows.length === 0){
        return(
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Noch keine Mitarbeiter mit Diensten.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 shadow-sm overflow-x-auto bg-white">
                <div
                    className="min-w-max grid"
                    style={{gridTemplateColumns: `200px repeat(${model.days.length}, minmax(0, 1fr))`,}}
                >
                    <GridHeader days={model.days}/>
                    {model.rows.flatMap((row) => (
                        <EmployeeGridRow key={`${row.employee.id}-${row}`}
                        row={row}
                        onCellClick={setSelectedCell}
                        />
                    ))}
                </div>
                       
            </div>

            <AssignmentDetailSheet 
                assignments={selectedCell?.assignments ?? null}
                headerTitle={selectedCell?.employee.name ?? ""}
                headerSubtitle={
                    selectedCell
                    ? `${DAY_LABEL[selectedCell.day]} . ${selectedCell.assignments.length}
                    Dienst ${selectedCell.assignments.length === 1 ? "" : "e"}`
                    : ""
                }
                onClose={() => setSelectedCell(null)}/>
        </>
    );
}