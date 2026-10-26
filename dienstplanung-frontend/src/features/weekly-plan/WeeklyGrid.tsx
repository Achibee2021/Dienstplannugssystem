import { useState } from "react";
import { GridHeader } from "./GridHeader";
import { GridRow } from "./buildStationGrid/StationGridRow";
import type { StationGridModel, GridCell } from "./types"
import { AssignmentDetailSheet } from "./AssignmentDetailSheet";
import { DAY_LABEL, SHIFT_EMOJI, SHIFT_LABEL } from "./labels";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { assignmentApi } from "@/api/assignmentApi";
import type { Assignment } from "@/types/assignment";
import { DragConfirmModal } from "./DragConfirmModal";

type Props = {
    model: StationGridModel;
};

export function WeeklyGrid ({model}: Props) {
    const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
    const queryClient = useQueryClient();

    const [pendingDrop, setPendingDrop] = useState<{
        sourceAssignment: Assignment,
        targetAssignment: Assignment,
    } | null>(null);


    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over) return;

        const sourceAssignment = active.data.current?.assignment as Assignment;
        const targetCell = over.data.current?.cell as GridCell;

        if (!sourceAssignment || !targetCell) return;

        if (targetCell.assignments.length === 0 || !targetCell.assignments) {

            alert("Ziehen auf leere Zellen wird in einem späteren Update implementiert.")
            return;
        }

        const targetAssignment = targetCell.assignments[0];
        if (sourceAssignment.id !== targetAssignment.id) {
            setPendingDrop({sourceAssignment, targetAssignment});
        }
    };

    const executeMove = async () => {
        if (!pendingDrop) return;

        try {
            await assignmentApi.updateAssignmentEmployee(pendingDrop.sourceAssignment.id, null);

            await assignmentApi.updateAssignmentEmployee(pendingDrop.targetAssignment.id, pendingDrop.sourceAssignment.employee!.id);

            await queryClient.invalidateQueries({queryKey: ["assignments"]});
        } catch (err) {
            console.error(err);
        } finally {
            setPendingDrop(null);
        }
    }

    if(model.rows.length === 0){
        return(
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Noch keine Zuweisungen vorhanden.
            </div>
        );
    }

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="min-w-max grid"
                        style={{gridTemplateColumns: `220px repeat(${model.days.length}, minmax(0, 1fr))`,}}
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
            </DndContext>
            <DragConfirmModal 
                open={!!pendingDrop}
                sourceName={pendingDrop?.sourceAssignment.employee?.name ?? ""}
                targetName={pendingDrop?.targetAssignment.employee?.name ?? ""}
                allowDuplicate={false}
                onMove={executeMove}
                onDuplicate={() => {}}
                onCancel={() => setPendingDrop(null)}
            />

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