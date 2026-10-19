import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteEmployee } from "@/hooks/employees/useDeleteEmployee";
import type { Employee } from "@/types/employee"
import { useState } from "react";

type Props = {
    employee: Employee | null;
    onClose: () => void;
};

export function DeleteEmployeeDialog({employee, onClose}:Props) {
    const open = employee !== null;
    const [error, setError] = useState<string |null>(null);
    const deleteMutation = useDeleteEmployee();

    const handleConfirm = async () => {
        if (!employee) return;
        setError(null);

        try {
            await deleteMutation.mutateAsync(employee.id);
            onClose();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Fehler beim löschen.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => {if (!o) onClose();}}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Mitarbeiter löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Möchten Sie <strong>{employee?.name}</strong> wirklich 
                        löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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