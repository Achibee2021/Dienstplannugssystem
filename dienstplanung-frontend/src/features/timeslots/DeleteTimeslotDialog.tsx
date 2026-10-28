import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteTimeslot } from "@/hooks/timslots/useDeleteTimeslot";
import type { Timeslot } from "@/types/timeslots";
import { useState } from "react";

type Props = Readonly<{
    timeslot: Timeslot | null;
    onClose: () => void;
}>;

export function DeleteTimeslotDialog({timeslot, onClose}:Props) {
    const open = timeslot !== null;
    const [error, setError] = useState<string |null>(null);
    const deleteMutation = useDeleteTimeslot();

    const handleConfirm = async () => {
        if (!timeslot) return;
        setError(null);

        try {
            await deleteMutation.mutateAsync(timeslot.id);
            onClose();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler beim löschen.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => {if (!o) onClose();}}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Timeslot löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Möchten Sie Timeslot mit id <strong>{timeslot?.id}</strong> wirklich 
                        löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="text-sm text-red-600 mb-4">
                        {error}
                    </div>
                )}
                <div className="text-amber-700 border border-amber-200 p-3 rounded-md text-sm mt-2">
                    <strong>Achtung</strong> Diese Aktion wird auch alle zugehörigen Dienste (Zuweisungen) löschen.
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(t) => {
                            t.preventDefault();
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