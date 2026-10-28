import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateStation } from "@/hooks/stations/useCreateStation";
import { useUpdateStation } from "@/hooks/stations/useUpdateStation";
import type { Station } from "@/types/station";
import { useState } from "react";


type Props = Readonly<{
    open: boolean;
    station: Station | null;
    onClose: () => void;
    onSaved: () => void;
}>;

export function StationFormDialog({open, station, onClose, onSaved}: Props){
    const isEdit = station !==null;

    const [id, setID] = useState(() => station?.id ?? `st-${Date.now()}`);
    const [name, setName] = useState(() => station?.name ?? "");
    const [qualification, setQualification] = useState(() => station?.benoetigtQualification ?? "");
    const [benoetigtMitarbeiter, setBenoetigtMitarbeiter] = useState(() => station?.benoetigteAnzahlMitarbeiter ?? 1);
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateStation();
    const updateMutation = useUpdateStation();

    const handleSubmit = async (s: React.SubmitEvent) => {
        s.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Name ist erforderlich.");
            return;
        }

        const payload: Station = {
            id: id.trim() || `st-${Date.now()}`,
            name: name.trim(),
            benoetigtQualification: qualification.trim(),
            benoetigteAnzahlMitarbeiter: benoetigtMitarbeiter,
            
        };

        setSubmitting(true);
            try {
                if (isEdit && station) {
                    await updateMutation.mutateAsync({id: station.id, station: payload});
                } else {
                    await createMutation.mutateAsync(payload);
                }
                onSaved();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Fehler beim Speichern.")
            } finally {
                setSubmitting(false)
            }
    };

    

    return (
        <Dialog open={open} onOpenChange={(o) => {if (!o) onClose(); }}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Station bearbeiten" :"Neue Station"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">ID</label>
                        <Input 
                            value={id}
                            onChange={(s) => setID(s.target.value)}
                            disabled={isEdit}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input 
                            value={name}
                            onChange={(s) => setName(s.target.value)}
                            placeholder="Ihre Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Qualifikation</label>
                        <Input 
                            value={qualification}
                            onChange={(s) => setQualification(s.target.value)}
                            placeholder="pfleger"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Anzahl der Mitarbeiter</label>
                            <Input
                                type="number" 
                                value={benoetigtMitarbeiter}
                                onChange={(s) => setBenoetigtMitarbeiter(Number(s.target.value))}
                                placeholder="anzahl benötigte Mitarbeiter: 1,2..."
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <DialogFooter>
                        <div className="flex justify-end gap-2 pt-4">
                            <button 
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                            >Abbrechen</button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {submitting ? "Speichern...": "Speichern"}</button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}