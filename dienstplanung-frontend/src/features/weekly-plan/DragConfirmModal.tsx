import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = Readonly<{
    open: boolean;
    sourceName: string;
    targetName: string;
    onMove: () => void;
    onDuplicate: () => void;
    onCancel: () => void;
    allowDuplicate: boolean;
}>;

export function DragConfirmModal({open, sourceName, targetName, onMove, onDuplicate, onCancel, allowDuplicate}: Props) {
    
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Aktion bestätigen</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-sm text-slate-600">
                    Du ziehst <strong>{sourceName}</strong> auf einen Dienst, der bereits von <strong>{targetName}</strong>. besetzt ist. Was möchten Sie tun? 
                </div>
                <DialogFooter className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 border rounded-md">Abbrechen</button>

                    {allowDuplicate && (
                        <button onClick={onDuplicate} className="px-4 py-2 bg-blue-600 text-white rounded-md">Duplizieren</button>
                    )}
                    <button onClick={onMove} className="px-4 py-2 bg-slate-900 text-white rounded-md">Verschieben</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
    
}