import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteStation } from "@/hooks/stations/useDeleteStation";
import type { Station } from "@/types/station";
import { useState } from "react";

type Props = {
    station: Station | null;
    onClose: () => void;
};

export function DeleteStationDialog({station, onClose}:Props) {
    const open = station !== null;
    const [error, setError] = useState<string |null>(null);
    const deleteMutation = useDeleteStation();

    const handleConfirm = async () => {
        if (!station) return;
        setError(null);

        try {
            await deleteMutation.mutateAsync(station.id);
            onClose();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler beim löschen.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => {if (!o) onClose();}}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Station löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Möchten Sie <strong>{station?.name}</strong> wirklich 
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
                        onClick={(s) => {
                            s.preventDefault();
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