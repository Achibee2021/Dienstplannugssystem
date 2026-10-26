import { useState } from "react";
import { GridHeader } from "../GridHeader"; 
import { AssignmentDetailSheet } from "../AssignmentDetailSheet"; 
import type { EmployeeGridModel, EmployeeGridCell } from "../types";
import { EmployeeGridRow } from "./EmployeeGridRow";
import { DAY_LABEL} from "../labels";
import type { Assignment } from "@/types/assignment";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { assignmentApi } from "@/api/assignmentApi";
import { useQueryClient } from "@tanstack/react-query";
import { DragConfirmModal } from "../DragConfirmModal";

type Props = {
    model: EmployeeGridModel;
};

export function EmployeeGrid ({model}: Props) {
    const queryClient = useQueryClient();

    const [pendingDrop, setPendingDrop] = useState<{
            sourceAssignment: Assignment,
            targetAssignment: Assignment,
        } | null>(null)

        const handleDragEnd = (event: DragEndEvent) => {
                const {active, over} = event;
        
                if (!over) return;
        
                const sourceAssignment = active.data.current?.assignment as Assignment;
                const targetCell = over.data.current?.cell as any;
        
                if (!sourceAssignment || !targetCell) return;

                if(sourceAssignment.employee?.id === targetCell.employee.id){return;}
        
                if (targetCell.assignments.length === 0 || !targetCell.assignments) {
        
                    setPendingDrop({
                        sourceAssignment,
                        targetAssignment: {
                            id: sourceAssignment.id,
                            employee: targetCell.employee,
                            station: sourceAssignment.station,
                            timeslot: sourceAssignment.timeslot
                        } as Assignment
                    });
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

                    if (pendingDrop.sourceAssignment.id === pendingDrop.targetAssignment.id) {
                        await assignmentApi.updateAssignmentEmployee(
                            pendingDrop.sourceAssignment.id,
                            pendingDrop.targetAssignment.employee!.id
                        );
                    } else {
                        await assignmentApi.updateAssignmentEmployee(pendingDrop.sourceAssignment.id, null);
        
                        await assignmentApi.updateAssignmentEmployee(pendingDrop.targetAssignment.id, pendingDrop.sourceAssignment.employee!.id);
                    }
                    
                    await queryClient.invalidateQueries({queryKey: ["assignments"]});
                    
                } catch (err) {
                    console.error(err);
                } finally {
                    setPendingDrop(null);
                }
            }

    const executeDuplicate = async () => {
        if (!pendingDrop) return;

        try {
            await assignmentApi.updateAssignmentEmployee(pendingDrop.sourceAssignment.id, null);

            await assignmentApi.duplicateAssignment(pendingDrop.targetAssignment.id, pendingDrop.sourceAssignment.employee!.id);
            await queryClient.invalidateQueries({queryKey: ["assignments"]});
        } catch (err) {
            console.error(err)
        }finally {setPendingDrop(null);}
    }
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
            <DndContext onDragEnd={handleDragEnd}>
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
            </DndContext>
            <DragConfirmModal 
                open={!!pendingDrop}
                sourceName={pendingDrop?.sourceAssignment.employee?.name ?? ""}
                targetName={pendingDrop?.targetAssignment.employee?.name ?? ""}
                onMove={executeMove}
                onDuplicate={executeDuplicate}
                onCancel={() => setPendingDrop(null)}
                allowDuplicate={true}
            />

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