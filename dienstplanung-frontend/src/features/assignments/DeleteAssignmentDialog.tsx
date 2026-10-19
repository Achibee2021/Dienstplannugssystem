import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteAssignment } from "@/hooks/assignments/useDeleteAssignments";
import type { Assignment } from "@/types/assignment";
import { useState } from "react";

type Props = {
    assignment: Assignment | null;
    onClose: () => void;
};

export function DeleteAssignmentDialog({assignment, onClose}:Props) {
    const open = assignment !== null;
    const [error, setError] = useState<string |null>(null);
    const deleteMutation = useDeleteAssignment();

    const handleConfirm = async () => {
        if (!assignment) return;
        setError(null);

        try {
            await deleteMutation.mutateAsync(assignment.id);
            onClose();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler beim löschen.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => {if (!o) onClose();}}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Assignment löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Möchten Sie Assignment mit id <strong>{assignment?.id}</strong> wirklich 
                        löschen? Diese Aktion kann nicht rückgängig gemacht werden auch Klassen, die dabei verbunden.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50
                    px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? "Löschen..." : "Löschen"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}