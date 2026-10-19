import { useState } from "react";
import { GridHeader } from "./GridHeader";
import { GridRow } from "./buildStationGrid/StationGridRow";
import type { StationGridModel, GridCell } from "./types"
import { AssignmentDetailSheet } from "./AssignmentDetailSheet";
import { DAY_LABEL, SHIFT_EMOJI, SHIFT_LABEL } from "./labels";

type Props = {
    model: StationGridModel;
};

export function WeeklyGrid ({model}: Props) {

    const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);

    if(model.rows.length === 0){
        return(
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Noch keine Zuweisungen vorhanden.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
                <div 
                    className="min-w-max grid"
                    style={{gridTemplateColumns: `200px repeat(${model.days.length}, minmax(0, 1fr))`,}}
                >
                    <GridHeader days={model.days}/>
                    {model.rows.flatMap((row) => (
                        <GridRow key={`${row.shiftType}-${row.station.id}`}
                        row={row}
                        onCellClick={setSelectedCell}
                        />
                    ))}
                </div>

                     
            </div>

            <AssignmentDetailSheet 
                assignments={selectedCell?.assignments ?? null}
                headerTitle={selectedCell?.station.name ?? ""}
                headerSubtitle={
                    selectedCell?.timeslot
                    ? `${DAY_LABEL[selectedCell.day]} . ${SHIFT_EMOJI[selectedCell.timeslot.type]}
                    ${SHIFT_LABEL[selectedCell.timeslot.type]} . ${selectedCell.timeslot.startTime.slice(0,5)}-
                    ${selectedCell.timeslot.endTime.slice(0,5)}`
                    : DAY_LABEL[selectedCell?.day ?? "MONDAY"]
                }
                onClose={() => setSelectedCell(null)}/>
        </>
    );
}